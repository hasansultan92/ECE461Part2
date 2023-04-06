/* eslint-disable no-unused-vars */
const ServiceClass = require('./Service');
const UserModel = require('../db/user-model');
/**
 * Create an access token.
 *
 * authenticationRequest AuthenticationRequest
 * returns String
 * */
export const createAuthToken = (authenticationRequest: any) => {
  console.log(authenticationRequest);
};
/*  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          authenticationRequest,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  }); */
/**
 * Delete all versions of this package.
 *
 * name String
 * xAuthorization String  (optional)
 * no response value expected for this operation
 * */
export const packageByNameDelete = (name: string, xAuthorization: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          name,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Return the history of this package (all versions).
 *
 * name String
 * xAuthorization String  (optional)
 * returns List
 * */
export const packageByNameGet = (name: string, xAuthorization: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          name,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Get any packages fitting the regular expression.
 * Search for a package using regular expression over package names and READMEs. This is similar to search by name.
 *
 * regex String
 * body String
 * xAuthorization String  (optional)
 * returns List
 * */
export const packageByRegExGet = (
  regex: string,
  body: string,
  xAuthorization: any
) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          regex,
          body,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 *
 * xAuthorization String
 * packageData PackageData
 * returns Package
 * */
export const packageCreate = (xAuthorization: string, packageData: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          xAuthorization,
          packageData,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Delete this version of the package.
 *
 * id String Package ID
 * xAuthorization String  (optional)
 * no response value expected for this operation
 * */
export const packageDelete = (id: string, xAuthorization: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          id,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 *
 * id String
 * xAuthorization String  (optional)
 * returns PackageRating
 * */
export const packageRate = (id: string, xAuthorization: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          id,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Interact with the package with this ID
 * Return this package.
 *
 * id String ID of package to fetch
 * xAuthorization String  (optional)
 * returns Package
 * */
export const packageRetrieve = (id: string, xAuthorization: any) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          id,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Update this content of the package.
 * The name, version, and ID must match.  The package contents (from PackageData) will replace the previous contents.
 *
 * id String
 * package Package
 * xAuthorization String  (optional)
 * no response value expected for this operation
 * */
export const packageUpdate = (
  id: string,
  packageInfo: any,
  xAuthorization: any
) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          id,
          packageInfo,
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Get the packages from the registry.
 * Get any packages fitting the query. Search for packages satisfying the indicated query.  If you want to enumerate all packages, provide an array with a single PackageQuery whose name is \"*\".  The response is paginated; the response header includes the offset to use in the next query.
 *
 * packageQuery List
 * xAuthorization String  (optional)
 * offset String Provide this for pagination. If not provided, returns the first page of results. (optional)
 * returns List
 * */
export const packagesList = (
  packageQuery: object,
  xAuthorization: string,
  offset: string
) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          packageQuery,
          xAuthorization,
          offset,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
/**
 * Reset the registry
 * Reset the registry to a system default state.
 *
 * xAuthorization String  (optional)
 * no response value expected for this operation
 * */
export const registryReset = (xAuthorization: string) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        ServiceClass.successResponse({
          xAuthorization,
        })
      );
    } catch (e: any) {
      reject(
        ServiceClass.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405
        )
      );
    }
  });
