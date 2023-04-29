const packageSchema = require('../../Database/package-model');
const child_process = require('child_process');
const fs = require('fs');
const mongoose = require('mongoose');

import {SCORE_OUT, metricCalculatorProgram} from '../../../../routes';
import {log} from '../../utils/misc';
import {
  successHandler,
  errorHandler,
  CustomError,
} from '../../utils/responseHandler';
import {
  TokenInformation,
  isAuthValid,
  userData,
} from '../authenticate/AuthenticateFunctions';

export const deletePackages = async (): Promise<void> => {
  await packageSchema.deleteMany();
  return;
};

export const base64_decode = (base64str: any, file: any) => {
  try {
    var buffer = Buffer.from(base64str, 'base64');
    fs.writeFileSync(file, buffer);
    console.log('******** Zip created from base64 encoded string ********');
  } catch (e: any) {
    console.log('In function to convert the base64', e);
  }
};

const savePackageToDb = async (
  name: string,
  version: string,
  url: string,
  score: SCORE_OUT,
  TokenInformation: TokenInformation
) => {
  var id = new mongoose.Types.ObjectId();
  console.log(id);
  const newPackage = await packageSchema.create({
    _id: id,
    name: name,
    version: Array(version),
    repository: Array(url),
    scores: Array(score),
    id: Array(id),
    history: {
      User: {
        name: TokenInformation.name,
        isAdmin: TokenInformation.isAdmin,
      },
      Date: Date.now(),
      PackageMetadata: {
        Name: name,
        Version: version,
        ID: id + ':' + version,
      },
      Action: 'CREATE',
    },
  });
  await newPackage.save();
  return id;
};

export const createPackage = async (req: any, res: any) => {
  try {
    const {Content, URL, JSProgram} = req.body;
    //console.log(req.headers['authorization'])
    if (!(URL || Content)) {
      errorHandler(400, 'The respective fields were not populated', req, res);
      return;
    }

    const authToken: string = req.headers['x-authorization'];
    if (!authToken) {
      // Send out error about the token not existing
      if (process.env.PRODUCTION == '1') {
        console.log('Authorization token not found');
      }
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const valid: boolean = isAuthValid(authToken);
    if (!valid) {
      if (process.env.PRODUCTION == '1') {
        console.log('Authorization token was invalid');
      }
      errorHandler(400, 'Authorization token in valid', req, res);
      return;
    }
    console.log('*********** PACKAGE IS BEING CREATED **********');
    // Create the package information
    // Get the field that is valid
    if (URL != '') {
      // check validity of the URL (function call)
      const result: SCORE_OUT = await metricCalculatorProgram(URL);
      //console.log(result.Threshold)
      if (result.Status == 1) {
        // Send the package to the database, perform a git clone
        if (process.env.PRODUCTION == '1') console.log('Cloning using the URL');
        await child_process.spawn(
          `cd ./backend/controllers/API/packages && git clone ${result.URL}`
        );

        ///  WORK FROM HERE!
        const packageJson = require('../packages/package.json');
        // perform the save here
        const userInfo: TokenInformation = await userData(authToken);
        savePackageToDb(
          packageJson.name,
          packageJson.version,
          result.URL,
          result,
          userInfo
        );
        successHandler(200, {}, req, res);
        return;
      } else if (result.Status == -2) {
        errorHandler(400, 'This package did not have a valid URL', req, res);
        return;
      } else if (result.Status == -1) {
        errorHandler(400, 'This package does not meet our threshold', req, res);
        return;
      }
      // Using the content field
    } else if (Content != '') {
      base64_decode(Content, './backend/controllers/API/packages/new.zip');
      // perform the unzip process
      child_process.execSync(
        `cd ./backend/controllers/API/packages/ && unzip new.zip`
      );
      const packageJson = require('../packages/package.json');
      console.log(packageJson.repository);
      if (
        !packageJson.repository == undefined ||
        !packageJson.url == undefined
      ) {
        errorHandler(400, 'Could not find a link to the package', req, res);
        return;
      } else {
        const packageURL: any = packageJson.repository.url || packageJson.url;
        let name: any =
          packageURL.match(
            '(https|git)(://|@)([^/:]+)[/:]([^/:]+)/(.+).git$'
          ) || [];

        // if result statement
        name = name[name.length - 1];
        console.log(name);
        let existingPackage = await packageSchema.findOne({name});
        if (existingPackage) {
          if (existingPackage.version.indexOf(packageJson.version) != -1) {
            // This package already exists. Return as is
            console.log('This package already exists');
            successHandler(200, {}, req, res);
            return;
          } else {
            // Update the previous entry
            const result: SCORE_OUT = await metricCalculatorProgram(packageURL);
            const userInfo: TokenInformation = await userData(authToken);
            console.log(existingPackage);
            const existingId = existingPackage._id;
            existingPackage = await packageSchema.findOneAndUpdate(
              {name},
              {
                $push: {
                  version: packageJson.version,
                  repository: packageURL,
                  scores: result,
                  id: existingId + ':' + packageJson.version,
                  history: {
                    User: {
                      name: userInfo.name,
                      isAdmin: userInfo.isAdmin,
                    },
                    Date: Date.now(),
                    PackageMetadata: {
                      Name: existingPackage.name,
                      Version: packageJson.version,
                      ID: existingId + ':' + packageJson.version,
                    },
                    Action: 'UPDATE',
                  },
                },
              }
            );
            base64_decode(
              Content,
              `./backend/packages/${existingId}:${packageJson.version}.zip`
            );
            console.log(
              '**************** CREATED A NEW PACKAGE ****************'
            );
            successHandler(200, {}, req, res);
            return;
          }
        } else {
          // Create a new entry for the package
          const result: SCORE_OUT = await metricCalculatorProgram(packageURL);
          const userInfo: TokenInformation = await userData(authToken);

          const packageId = await savePackageToDb(
            packageJson.name,
            packageJson.version,
            packageURL,
            result,
            userInfo
          );
          base64_decode(
            Content,
            `./backend/packages/${packageId}:${packageJson.version}.zip`
          );
          successHandler(200, {msg: 'Done'}, req, res);
          return;
        }
      }
    }
  } catch (e: any) {
    console.log(e);
    log(
      'Something went wrong when trying to create the package',
      e,
      parseInt(process.env.LOG_LEVEL!)
    );
    errorHandler(400, 'Failed to ingest the package', req, res);
  } finally {
    // Empty everything that was created
    child_process.execSync(
      `rm -rf ./backend/controllers/API/packages/ && mkdir ./backend/controllers/API/packages`
    );
    return;
  }
};



