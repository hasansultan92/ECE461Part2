/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the ServiceController.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the ServiceController, and where response is handled.
 */

import {log} from '../../utils/misc';
const UserSchema = require('../../database/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const createAuthToken = async (user: any) => {
  // Create token
  const token: string = jwt.sign(
    {username: user.first_name},
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
    const {username, password} = req.body;
    // @TODO Validate User input
    // create a auth token based on the is admin parameter

    console.log(username, password);
    // Check the password witth the database
    if (!(username && password)) {
      res.status(400).send('No valid input was sent');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserSchema.findOne({first_name: username});

    if (oldUser) {
      res.status(400).send('User Already Exist. Please Login');
      return;
    }

    //Encrypt user password
    const encryptedUserPassword = await bcrypt.hash(
      password,
      process.env.SERVERKEY
    );

    // Create user in our database
    const user = await UserSchema.create({
      first_name: username,
      password: encryptedUserPassword,
    });

    // save user token
    user.token = await createAuthToken(user);

    // return new user
    res.contentType('application/json');
    res.status(200).json(user);
  } catch (e: any) {
    log(
      'Something went wrong while creating a new user in the CreateUser Function ',
      e.stack,
      parseInt(process.env.LOG_LEVEL!)
    );
    res.status(400).json('bad Req');
  }
};

export const authenticate = async (req: any, res: any) => {
  try {
    const {User, Secret} = req.body;
    console.log(User, Secret, typeof User.isAdmin);

    // Check the password with the database
    const existingUser = await UserSchema.findOne({first_name: User.name});
    console.log(existingUser);

    if (!existingUser) {
      // If user not found
      res.status(400).json('bad Req');
      return;
    }

    // If user was found
    const userPass: string = existingUser.password;

    const match: boolean = await bcrypt.compare(Secret.password, userPass);
    if (!match) {
      res.status(400).json('Wrong Password');
      return;
    }

    const token: string = await createAuthToken(existingUser);
    // check this line
    existingUser.token = token;

    // create a auth token based on the is admin parameter
    res.contentType('application/json');
    res.json(token);
  } catch (e: any) {
    log(
      'Something went wrong while creating a new token for the user in the Authentication function',
      e.stack,
      parseInt(process.env.LOG_LEVEL!)
    );
    res.status(400).json('bad Req');
  }
};
/*
const packageByNameDelete = async (request: any, response: any) => {

};

const packageByNameGet = async (request: any, response: any) => {

};

const packageByRegExGet = async (request: any, response: any) => {

};

const packageCreate = async (request: any, response: any) => {

};

const packageDelete = async (request: any, response: any) => {

};

const packageRate = async (request: any, response: any) => {

};

const packageRetrieve = async (request: any, response: any) => {

};

const packageUpdate = async (request: any, response: any) => {

};

const packagesList = async (request: any, response: any) => {

};

const registryReset = async (request: any, response: any) => {

};

*/
