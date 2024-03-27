import ForbiddenException from "@api/exceptions/ForbiddenException";
import UnAuthorizedException from "@api/exceptions/UnAuthorizedException";
import apiConfig from "@api/utils/config/api_config";
import { $Enums, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

export function loginRequiredMiddleware(role: $Enums.Role = $Enums.Role.USER) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) next(new UnAuthorizedException());

    jwt.verify(
      token,
      apiConfig.TOKEN_SECRET as string,
      (err: unknown, user: User) => {
        console.error({ err });

        if (err) next(new ForbiddenException());
        if (user.role != "ADMIN") {
          if (user.role != role) {
            next(new ForbiddenException());
          }
        }
        req.user = user;
        next();
      }
    );
  };
}

export function wsAuthenticationMiddleware(io: Server) {
  return io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (token == null) next(new UnAuthorizedException());

      jwt.verify(token, apiConfig.TOKEN_SECRET as string, (err: unknown) => {
        if (err) next(new ForbiddenException());
        next();
      });
    } catch (e) {
      next(new Error("unauthorized"));
    }
  });
}
