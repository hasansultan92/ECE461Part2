import {Request, Response} from 'express';
import {
  CreateUser,
  createAuthToken,
  authenticate,
  isAuthValid,
  isAdmin,
  userData,
} from '../controllers/API/authenticate/AuthenticateFunctions';
import {
  createPackage,
} from '../controllers/API/package/packageController';
import {deletePackage, findByIdAndDelete, resetReg} from '../controllers/API/reset/delete';
import {
  fileTobase64,
  findById,
  findByName,
} from '../controllers/API/package/retrievePackage';

module.exports = function (express: any) {
  const router = express.Router();

  // Simple function for testing the router middleware
  router.post('/testFunction', async (req: Request, res: Response) => {
    console.log(req.method, 'Request made to Test a function');
    const authToken: any = req.headers['x-authorization'];
    const variable: string = fileTobase64('./backend/packages/Archive.zip');
    res.json({msg: variable});
  });

  router.put('/authenticate', async (req: Request, res: Response) => {
    console.log(req.method, 'Request made to authenticate');
    await authenticate(req, res);
    console.log('Request completed');
  });

  router.post('/register', async (req: Request, res: Response, next: any) => {
    await CreateUser(req, res);
  });

  router.delete(
    '/package/byName/:name',
    async (req: Request, res: Response, next: any) => {
      console.log(
        req.method,
        'Request made to delete the package',
        req.params.name
      );
      await deletePackage(req, res);
      console.log('Request completed');
    }
  );

  router.delete(
    '/package/:id',
    async (req: Request, res: Response, next: any) => {
      await findByIdAndDelete(req, res);
    }
  );

  router.get('/package/:id', async (req: any, res: any) => {
    await findById(req, res);
  });

  router.delete('/reset', async (req: any, res: any, next: any) => {
    // Reset the system
    await resetReg(req, res);
  });

  // TODO
  router.post('/package', async (req: Request, res: Response, next: any) => {
    console.log(req.method, 'Request made to create a package from ', req.ip);
    await createPackage(req, res);
    console.log('Request completed');
  });

  router.get('/package/byName/:name', async (req: any, res: any) => {
    console.log(req.method, 'GET Request made to fetch', req.params.name);
    await findByName(req, res);
    console.log('Request completed');
  });
  return router;
};
