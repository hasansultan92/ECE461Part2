import {Request, Response} from 'express';
import {
  CreateUser,
  createAuthToken,
  authenticate,
  deleteUsers,
} from '../controllers/API/authenticate/AuthenticateFunctions';
import {log} from '../controllers/utils/misc';
import {
  createPackage,
  findById,
  findByRegex,
  deletePackage,
  deletePackages,
} from '../controllers/API/package/packageController';
import {
  errorHandler,
  successHandler,
} from '../controllers/utils/responseHandler';
import {metricCalculatorProgram} from '../../routes/index';
import {isAuthValid} from '../controllers/API/authenticate/AuthenticateFunctions';

module.exports = function (express: any) {
  const router = express.Router();

  // Simple function for testing the router middleware
  router.post('/testFunction', async (req: Request, res: Response) => {
    console.log('hello');
    const returnVal = await metricCalculatorProgram(
      'https://github.com/lodash/lodash'
    );
    res.json({msg: returnVal});
  });

  router.put('/authenticate', async (req: Request, res: Response) => {
    await authenticate(req, res);
  });

  router.post('/register', async (req: Request, res: Response, next: any) => {
    await CreateUser(req, res);
  });

  router.delete(
    '/package/byName/:name',
    async (req: Request, res: Response, next: any) => {
      await deletePackage(req, res);
    }
  );

  // TODO
  router.post('/package', async (req: Request, res: Response, next: any) => {
    //USE metricCalculatorProgram and pass in a url for this!!
    await createPackage(req, res);
    /*     const score: number = await ranker();
    if (score > 0.8) {
      await createPackage(req, res);
    } else {
      errorHandler(400, 'Package is not good enough', req, res);
    } */
  });

  // What is an id for the package?
  router.delete(
    '/package/:id',
    async (req: Request, res: Response, next: any) => {
      await findById(req, res);
    }
  );

  router.post(
    '/package/byRegEx',
    async (req: Request, res: Response, next: any) => {
      await findByRegex(req, res);
    }
  );

  router.delete('/reset', async (req: any, res: any, next: any) => {
    // Reset the system
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
  });
  
  return router;
};
