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
    console.log(req.headers);
    if (Content) {
      console.log('Content field is set');
    }
    if (URL) {
      console.log('URL field is set, URL is: ' + URL);
    }
    //console.log(req.headers['authorization'])
    if (!(URL || Content)) {
      console.log('The respective fields were not populated');
      console.log(req.body);
      errorHandler(400, 'The respective fields were not populated', req, res);
      return;
    }
    const authToken: string = req.headers['x-authorization'];
    console.log(
      'Found yo token in the x-auth field',
      authToken.split('bearer')[1].trim()
    );

    if (authToken == '') {
      // Send out error about the token not existing
      if (process.env.PRODUCTION == '1') {
        console.log('Authorization token not found');
        console.log('Printing Req.Headers');
        console.log(req.headers);
      }
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const valid: boolean = isAuthValid(authToken.split('bearer')[1].trim());

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
    if (URL != '' && URL != null) {
      // check validity of the URL (function call)
      console.log('Sending URL to metricCalculator');
      console.log('URL: ' + URL);
      const result: SCORE_OUT = await metricCalculatorProgram(URL);
      //console.log(result.Threshold)
      if (result.Status == 1) {
        // Send the package to the database, perform a git clone
        if (process.env.PRODUCTION == '1') console.log('Cloning using the URL');
        await child_process.execSync(
          `cd ../controllers/API/packages && git clone ${result.URL}`
        );

        ///  WORK FROM HERE!
        const packageJson = require('../controllers/API/package/package.json');
        // perform the save here
        const userInfo: TokenInformation = await userData(
          authToken.split('bearer')[1].trim()
        );
        const packageId = savePackageToDb(
          packageJson.name,
          packageJson.version,
          result.URL,
          result,
          userInfo
        );
        successHandler(
          200,
          {
            metadata: {
              Name: packageJson.name,
              Version: packageJson.version,
              ID: packageId,
            },
            data: {
              Content: Content,
              URL: URL,
              JSProgram: '',
            },
          },
          req,
          res
        );
        console.log('******** PACKAGE CREATION VIA LINK WORKING ********');
        return;
      } else if (result.Status == -2) {
        errorHandler(400, 'This package did not have a valid URL', req, res);
        console.log('This package did not have a valid URL');
        return;
      } else if (result.Status == -1) {
        errorHandler(400, 'This package does not meet our threshold', req, res);
        console.log('This package does not meet our threshold');
        return;
      }
      // Using the content field
    } else if (Content != '') {
      base64_decode(Content, '../controllers/API/packages/new.zip');
      // perform the unzip process
      var randnum = Math.random();
      console.log('Making archive with ID: ' + randnum);
      base64_decode(
        Content,
        '../controllers/API/packageArchive/archive' + randnum + '.zip'
      );
      child_process.execSync(
        `cd ../controllers/API/packages/ && unzip new.zip && mv new.zip .. && cd * && mv * .. && cd .. && mv ../new.zip .`
      );
      console.log('Current Directory is: ' + process.cwd());
      /* try
      {
      child_process.execSync('mv new.zip ..');
      child_process.execSync('cd *');
      child_process.execSync("mv * ..");
      child_process.execSync('cd .. && mv ../new.zip .');
      }
      catch(e: any)
      {
	      console.log(e);
	      console.log("Something weird happened ignore");
      }*/
      const packageJson = require('/home/robinchild01/persistentServer2/ECE461Part2/backend/controllers/API/packages/package.json');
      console.log(packageJson.repository);
      if (
        !packageJson.repository == undefined ||
        !packageJson.url == undefined
      ) {
        console.log('Could not find a link to the package');
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
          console.log('Found exisitng package');
          console.log(existingPackage.version, packageJson.version);
          if (existingPackage.version.indexOf(packageJson.version) != -1) {
            // This package already exists. Return as is
            successHandler(
              200,
              {
                metadata: {
                  Name: packageJson.name,
                  Version: packageJson.version,
                  ID: existingPackage._id + ':' + packageJson.version,
                },
                data: {
                  Content: Content,
                  URL: existingPackage.repository[0],
                  JSProgram: '',
                },
              },
              req,
              res
            );
            console.log('***** THE PACKAGE ALREADY EXISTED IN OUR DB *****');
            return;
          } else {
            // Update the previous entry
            console.log(
              'Updating previous entry with package URL: ' + packageURL
            );
            const result: SCORE_OUT = await metricCalculatorProgram(packageURL);
            const userInfo: TokenInformation = await userData(
              authToken.split('bearer')[1].trim()
            );
            //console.log(existingPackage);
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
              `../packages/${existingId}:${packageJson.version}.zip`
            );
            successHandler(
              200,
              {
                metadata: {
                  Name: packageJson.name,
                  Version: packageJson.version,
                  ID: existingPackage._id + ':' + packageJson.version,
                },
                data: {
                  Content: Content,
                  URL: result.URL,
                  JSProgram: '',
                },
              },
              req,
              res
            );
            console.log(
              '**************** CREATED A SPICY NEW PACKAGE ****************'
            );
            return;
          }
        } else {
          // Create a new entry for the package
          const result: SCORE_OUT = await metricCalculatorProgram(packageURL);
          const userInfo: TokenInformation = await userData(
            authToken.split('bearer')[1].trim()
          );

          const packageId = await savePackageToDb(
            packageJson.name,
            packageJson.version,
            packageURL,
            result,
            userInfo
          );
          base64_decode(
            Content,
            `../packages/${packageId}:${packageJson.version}.zip`
          );
          successHandler(
            200,
            {
              metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                ID: packageId._id + ':' + packageJson.version,
              },
              data: {
                Content: Content,
                URL: result.URL,
                JSProgram: '',
              },
            },
            req,
            res
          );
          console.log('Finished in the final else');
          return;
        }
      }
    }
  } catch (e: any) {
    errorHandler(400, 'Failed to ingest the package', req, res);
    console.log(e);
  } finally {
    // Empty everything that was created
    child_process.execSync(
      `rm -rf ../controllers/API/packages/ && mkdir ../controllers/API/packages`
    );
    return;
  }
};
