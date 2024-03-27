import NotFoundException from "@api/exceptions/NotFoundException";
import { IController } from "@api/interfaces/IController";
import {
  UserLoginPayload,
  UserRegisterPayload,
} from "@api/interfaces/IUserService";
import { loginRequiredMiddleware } from "@api/middlewares";
import UserService from "@api/services/UserService";
import { exclude } from "@api/utils/helpers";
import { logger } from "@api/utils/logger";
import UserValidators from "@api/validators/user.validator";
import { User } from "@prisma/client";
import * as express from "express";
import expressAsyncHandler from "express-async-handler";

class UserController implements IController<User> {
  public path = "/users";
  public router = express.Router();
  public dbService: UserService = new UserService();
  public validator: UserValidators = new UserValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(
      this.path,
      loginRequiredMiddleware("ADMIN"),
      this.getAllUsers
    );

    this.router.post(
      this.path,
      loginRequiredMiddleware("ADMIN"),
      this.validator.registerValidator(),
      this.createUser
    );

    this.router.post(
      `${this.path}/login`,
      this.validator.loginValidator(),
      this.login
    );

    this.router.put(
      `${this.path}/:userId`,
      loginRequiredMiddleware("ADMIN"),
      this.validator.updateValidator(),
      this.updateUser
    );

    this.router.put(
      `${this.path}/:userId/changepassword`,
      loginRequiredMiddleware(),
      this.validator.changePasswordValidator(),
      this.changePassword
    );

    this.router.delete(
      `${this.path}/:userId`,
      loginRequiredMiddleware("ADMIN"),
      this.validator.userIdParamValidator(),
      this.deleteUser
    );

    this.router.get(
      `${this.path}/:userId`,
      loginRequiredMiddleware(),
      this.validator.userIdParamValidator(),
      this.getUserByID
    );
  }

  login = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: UserLoginPayload = request.body;
      const user = await this.dbService.login(
        payload.username,
        payload.password
      );
      response.json(user);
    }
  );

  getAllUsers = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createUser = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: UserRegisterPayload = request.body;
      logger.debug("createUser payload:", payload);
      const user = await this.dbService.register(payload);
      logger.debug("createUser user:", user);
      response.json(user);
    }
  );

  updateUser = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: UserRegisterPayload = request.body;
      const userId: number = Number(request.params?.userId);
      logger.info("updateUser payload:", payload);
      const user = exclude(await this.dbService.update(userId, payload), [
        "password",
      ]);
      if (!user) {
        throw new NotFoundException();
      }
      logger.debug("updateUser user:", user);
      response.json(user);
    }
  );

  changePassword = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: { oldPassword: string; newPassword: string } =
        request.body;
      const userId: number = Number(request.params?.userId);
      // allow admin to change user password but must have the old password
      // if(request.user.id !== userId && request.user.role !== "ADMIN"){
      //   throw new ForbiddenException("FORBIDDEN!: User can change his own password!")
      // }

      const user = await this.dbService.getById(userId);
      if (!user) {
        throw new NotFoundException();
      }
      await this.dbService
        .changePassword(user, payload.oldPassword, payload.newPassword)
        .then(() => {
          response.json({ message: "Password has changed!" });
        });
    }
  );

  getUserByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const userId: number = Number(request.params.userId);
      logger.debug("getUserByID param:", userId);
      const user = await this.dbService.getById(userId);
      logger.debug("getUserByID user:", user);
      if (!user) {
        throw new NotFoundException();
      }
      response.json(user);
    }
  );

  deleteUser = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const userId: number = Number(request.params.userId);
      logger.debug("deleteUserByID param:", userId);
      const res = await this.dbService.remove(userId).catch(() => {
        throw new NotFoundException();
      });
      logger.debug("deleteUserByID res:", res);
      response.json(res);
    }
  );
}

export default UserController;
