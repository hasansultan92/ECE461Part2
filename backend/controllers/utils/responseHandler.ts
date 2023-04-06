import {Request, Response, NextFunction} from 'express';

// Define a custom error interface
interface CustomError extends Error {
  status?: number;
  message: string;
}

// Handler function for handling errors
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default error status and message
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  console.error(err.stack);

  // Send error response
  res.status(status).json({error: message});
};

// Handler function for handling successful responses
export const successHandler = (
  data: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Send success response
  res.status(200).json(data);
};
