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
  deletePackage,
  findById,
} from '../controllers/API/package/packageController';
import {findByIdAndDelete, resetReg} from '../controllers/API/reset/delete';
import {findByName} from '../controllers/API/package/retrievePackage';

module.exports = function (express: any) {
  const router = express.Router();

  // Simple function for testing the router middleware
  router.post('/testFunction', async (req: Request, res: Response) => {
    console.log('hello');
    const authToken: any = req.headers['x-authorization'];
    console.log(authToken);
    const returnv: object = userData(authToken);
    res.json({msg: returnv});
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
    await createPackage(req, res);
  });

  router.get('/package/byName/:name', async (req: any, res: any) => {
    await findByName(req, res);
  });
  return router;
};
