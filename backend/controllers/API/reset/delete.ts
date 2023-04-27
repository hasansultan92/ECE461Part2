import {errorHandler, successHandler} from '../../utils/responseHandler';
import {deleteUsers, isAuthValid} from '../authenticate/AuthenticateFunctions';
import {deletePackages} from '../package/packageController';

export const resetReg = async (req: any, res: any) => {
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

  await deletePackages();
  await deleteUsers();
  successHandler(200, {msg: 'done'}, req, res);
  return;
};
