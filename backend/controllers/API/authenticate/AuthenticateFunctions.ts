import {log} from '../../utils/misc';
const UserSchema = require('../../database/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


export interface TokenInformation {
  name: String,
  isAdmin: Boolean,
  iat: Number,
  exp: Number,
}
export const isAuthValid = (token: string): boolean => {
  // Return false if the token is expired or if the token was fake
  try {
    var decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return true;
  } catch (e: any) {
    return false;
  }
};

export const isAdmin = (token: string): boolean => {
  try {
    var decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return true;
  } catch (e: any) {
    return false;
  }
};

export const userData = (
  token: string
): TokenInformation => {
  try {
    var decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
  } catch (e: any) {
    console.log(e);
    return {name: 'invalid', isAdmin: false, iat: 0, exp: 0};
  }
};

export const deleteUsers = async (): Promise<void> => {
  await UserSchema.deleteMany();
  return;
};

export const createAuthToken = async (user: any, isAdmin: boolean) => {
  // Create token
  const token: string = jwt.sign(
    {name: user.name, isAdmin: isAdmin},
    process.env.TOKEN_KEY,
    {
      expiresIn: '90h',
    }
  );
  return token;
};

/* Function to create a User in the database and store their Token
Token is valid for 90 Hours as of yet */
export const CreateUser = async (req: any, res: any) => {
  try {
    const {username, password, isAdmin} = req.body;
    // @TODO Validate User input
    // create a auth token based on the is admin parameter

    //console.log(username, password);
    // Check the password witth the database
    if (!(username && password)) {
      res.status(400).send('No valid input was sent');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserSchema.findOne({name: username});
    console.log(oldUser);
    if (oldUser) {
      res.status(400).send('User Already Exist. Please Authenticate');
      return;
    }

    //Encrypt user password
    const encryptedUserPassword = await bcrypt.hashSync(
      password,
      parseInt(process.env.SERVERKEY!)
    );
    //console.log(encryptedUserPassword)
    // Create user in our database
    const user = await UserSchema.create({
      name: username,
      password: encryptedUserPassword,
    });

    // save user token
    user.token = await createAuthToken(user, isAdmin);
    console.log(user.token);
    await user.save();
    // return new user
    res.contentType('application/json');
    res.status(200).json(user);
  } catch (e: any) {
    console.log(e);
    log(
      'Something went wrong while creating a new user in the CreateUser Function ',
      e.stack,
      parseInt(process.env.LOG_LEVEL!)
    );
    res
      .status(400)
      .json('Something went wrong with the creation of a new user');
  }
};

export const authenticate = async (req: any, res: any) => {
  try {
    const {User, Secret} = req.body;
    console.log(User, Secret, typeof User.isAdmin);

    // Check the password with the database
    const existingUser = await UserSchema.findOne({name: User.name});
    console.log(existingUser);

    if (!existingUser) {
      // If user not found
      res.status(400).json('User not found');
      return;
    }

    // If user was found
    const userPass: string = existingUser.password;

    const match: boolean = await bcrypt.compare(Secret.password, userPass);
    if (!match) {
      res.status(400).json('Wrong Password');
      return;
    }

    const token: string = await createAuthToken(existingUser, User.isAdmin);
    // check this line
    existingUser.token = token;
    await existingUser.save();
    // create a auth token based on the is admin parameter
    res.contentType('application/json');
    res.json(token);
  } catch (e: any) {
    console.log(e);
    log(
      'Something went wrong while creating a new token for the user in the Authentication function',
      e.stack,
      parseInt(process.env.LOG_LEVEL!)
    );
    res
      .status(400)
      .json('Something went wrong while creating a new token for the user');
  }
};
