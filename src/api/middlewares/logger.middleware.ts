import { logger } from "@api/utils/logger";
import { NextFunction, Request, Response } from "express";

// Usage:
export const loggingMiddleware = function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.headersSent) {
        logger.info(`${req.method} ${req.path}`);
    } else {
      res.on("finish", function () {
        logger.info(`${req.method} ${req.path}`);
      });
    }
    next();
  };
  