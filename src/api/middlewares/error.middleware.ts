import { NextFunction, Request, Response } from 'express';
import HttpException from '@api/exceptions/HttpException';
// import { logger } from '@api/utils/logger';
// import formatHTTPLoggerResponse from '@api/utils/logger/httpForamatter';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  // logger.error(formatHTTPLoggerResponse(request,response))
  if (response.headersSent) {
    return next(error);
  }
  response.status(status).send({
    status,
    message
  });
}

export default errorMiddleware;
