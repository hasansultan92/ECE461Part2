import {errorHandler, successHandler} from '../../utils/responseHandler';
import {deleteUsers, isAuthValid} from '../authenticate/AuthenticateFunctions';
import {deletePackages} from '../package/packageController';
const packageSchema = require('../../Database/package-model');
const child_process = require('child_process');

export const resetReg = async (req: any, res: any) => {
  try {
    const authToken: string = req.headers['x-authorization'];
    if (!authToken) {
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const tokenValid: boolean = isAuthValid(authToken);
    if (!tokenValid) {
      errorHandler(400, 'You are not a valid user', req, res);
      return;
    }
    console.log('****** REGISTRY BEING DELETED! *****');
    await deletePackages();
    // WE ARE NOT DELETING USERS ANYMORE

    try {
      child_process.execSync(
        `rm -rf ./backend/packages/ && rm -rf ./backend/controllers/API/packages/`
      );
    } catch (e: any) {
      console.log('********** failed in the resetReg Function *********');
      console.log(e);
    }
    //await deleteUsers();
    successHandler(200, {msg: 'done'}, req, res);
    return;
  } catch (e: any) {
    errorHandler(400, 'Something went wrong to reset the registry', req, res);
    return;
  }
};

export const findByIdAndDelete = async (req: any, res: any) => {
  try {
    const authToken: string = req.headers['x-authorization'];
    if (!authToken) {
      errorHandler(400, 'Authorization token was not found', req, res);
      return;
    }
    const tokenValid: boolean = isAuthValid(authToken);
    if (!tokenValid) {
      errorHandler(400, 'You are not a valid user', req, res);
      return;
    }

    // Split the receiving ID
    const packageId = req.params.id.split(':');
    const IndexIdDb = packageId[0];
    const VersionNumber = packageId[1];
    console.log(packageId);
    let existingPackage = await packageSchema.findById({_id: IndexIdDb});
    if (existingPackage) {
      const VersionIndex = existingPackage.version.indexOf(VersionNumber);
      if (VersionIndex != -1) {
        // set the specific field to null by capturing its position from client through 'VersionIndex' variable
        existingPackage.version[VersionIndex] = null;
        existingPackage.scores[VersionIndex] = null;
        existingPackage.id[VersionIndex] = null;
        existingPackage.repository[VersionIndex] = null;
        existingPackage.history[VersionIndex] = null;

        // update with new data
        await packageSchema.findByIdAndUpdate(IndexIdDb, existingPackage);

        // remove all null fields in the stated array
        await packageSchema.updateOne(
          {_id: IndexIdDb},
          {
            $pull: {
              version: null,
              scores: null,
              id: null,
              repository: null,
              history: null,
            },
          }
        );
        try {
          child_process.execSync(`rm -rf ./backend/packages/${packageId}`);
        } catch (e: any) {
          console.log(
            '********** failed in the findByIdAndDelete Function *********'
          );
          console.log(e);
        }
        successHandler(200, {}, req, res);
        return;
      } else if (VersionIndex == 0) {
        // Delete the whole document since the package will not exist anymore
        try {
          child_process.execSync(`rm -rf ./backend/packages/${packageId}`);
        } catch (e: any) {
          console.log(
            '********** failed in the findByIdAndDelete Function *********'
          );
          console.log(e);
        }
        existingPackage = await packageSchema.findByIdAndDelete(IndexIdDb);
        if (existingPackage) {
          successHandler(200, {}, req, res);
        } else {
          errorHandler(
            400,
            'Something went wrong when this was the only version of the package',
            req,
            res
          );
        }
      } else {
        errorHandler(400, 'This package version does not exist', req, res);
        return;
      }
    } else {
      errorHandler(400, 'This package does not exist', req, res);
      return;
    }
  } catch (e: any) {
    console.log(e);
    errorHandler(
      400,
      'Something went wrong trying to delete this package',
      req,
      res
    );
    return;
  }
};
