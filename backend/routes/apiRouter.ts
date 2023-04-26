import {Request, Response} from 'express';
import {
  CreateUser,
  createAuthToken,
  authenticate,
} from '../controllers/API/authenticate/AuthenticateFunctions';
import {log} from '../controllers/utils/misc';
import {
  createPackage,
  findById,
  findByRegex,
  deletePackage,
} from '../controllers/API/package/packageController';
import {errorHandler} from '../controllers/utils/responseHandler';
import {metricCalculatorProgram} from '../../routes/index';

module.exports = function (express: any) {
  const router = express.Router();

  // Simple function for testing the router middleware
  router.post('/testFunction', (req: Request, res: Response) => {
    console.log('hello');
    res.json({msg: 'Hello World'});
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

  return router;
};
