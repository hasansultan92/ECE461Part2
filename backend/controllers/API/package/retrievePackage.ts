import {errorHandler, successHandler} from '../../utils/responseHandler';
import {isAuthValid} from '../authenticate/AuthenticateFunctions';
const packageSchema = require('../../Database/package-model');

const fs = require('fs');

export const fileTobase64 = (file: string) => {
  try {
    const data = fs.readFileSync(file);
    console.log('******** Zip decoded from file encoding to Base64 ********');
    return data.toString('base64');
  } catch (e: any) {
    console.log('In function to convert file to base64', e);
    return;
  }
};

export const findById = async (req: any, res: any) => {
  try {
    let packageId: any = req.params.id;
    if (!packageId) {
      errorHandler(400, 'The package id is not valid', req, res);
      return;
    }
    const authToken: string = req.headers['x-authorization'];
    if (!authToken) {
      // Send out error about the token not existing
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const valid: boolean = isAuthValid(authToken.split('bearer')[1].trim());
    if (!valid) {
      errorHandler(400, 'Authorization token in valid', req, res);
      return;
    }

    packageId = packageId.split(':');
    const IndexIdDb = packageId[0];
    const VersionNumber = packageId[1];
    const existingPackage = await packageSchema.findById(IndexIdDb);
    if (existingPackage) {
      // Package still exists in database
      const Content: string = fileTobase64(
        `./backend/packages/${req.params.id}.zip`
      );
      res.json({
        metadata: {
          Name: existingPackage.name,
          Version: VersionNumber,
          ID: req.params.id,
        },
        data: {
          Content: Content,
          URL: existingPackage.repository[0],
          JSProgram: '',
        },
      });
      console.log('******** SENT PACKAGE INFORMATION BACK ********');
      return;
    } else {
      errorHandler(400, 'This package does not exist anymore', req, res);
      console.log('***** REQUESTED PACKAGE DID NOT EXIST *****');
      return;
    }
  } catch (e: any) {
    errorHandler(
      400,
      'Something went wrong when trying to send the package information back',
      req,
      res
    );
    console.log('******** ERROR IN SENDING PACKAGE BACK ********');
    console.log(e);
  }
};

export const findByName = async (req: any, res: any) => {
  try {
    let packageName: any = req.params.name;
    if (!packageName) {
      errorHandler(400, 'The package name was not valid', req, res);
      console.log('****** BOGUS NAME GIVEN ******');
      return;
    }
    const authToken: string = req.headers['x-authorization'];
    if (!authToken) {
      // Send out error about the token not existing
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const valid: boolean = isAuthValid(authToken.split('bearer')[1].trim());
    if (!valid) {
      errorHandler(400, 'Authorization token in valid', req, res);
      return;
    }
    const packageFromDb = await packageSchema.findOne({name: packageName});
    if (packageFromDb) {
      successHandler(200, packageFromDb.history, req, res);
      console.log('REQUEST WAS COMPLETED');
      return;
    } else {
      errorHandler(
        400,
        'This package does not exist in our database',
        req,
        res
      );
      console.log(
        `*********** THE REQUESTED PACKAGE ${packageName} DID NOT EXIST IN OUR DATABASE ***********`
      );
      console.log('REQUEST WAS COMPLETED');
      return;
    }
  } catch (e: any) {
    errorHandler(
      400,
      'Something went wrong when looking for package by name',
      req,
      res
    );
    console.log(e);
    console.log('REQUEST WAS NOT COMPLETED');
    return;
  }
};

export const retrieveScores = async (req: any, res: any) => {
  try {
    const packageInfo = await packageSchema.findOne({name: req.params.name});
    if (packageInfo) {
      successHandler(200, packageInfo.scores[0], req, res);
      console.log(`***** ${packageInfo.name} was found *****`);
      console.log(`*****`);
      console.log(`${packageInfo.scores[0]}`);
      console.log(`*****`);
    } else {
      errorHandler(
        400,
        `${req.params.name} does not exist in our database`,
        req,
        res
      );
      console.log(`${req.params.name} did not exist in our database`);
    }
  } catch (e: any) {
    errorHandler(
      400,
      'Something went wrong trying to retrieve scores for this package',
      req,
      res
    );
    console.log(
      'Something went wrong trying to retrieve scores for this package'
    );
    return;
  } finally {
    console.log('*********** REQUEST COMPLETED ***********');
    return;
  }
};
