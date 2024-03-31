import NotFoundException from '@api/exceptions/NotFoundException';
import { IController } from '@api/interfaces/IController';
import { PermissionPayload } from '@api/interfaces/IPermission';

import { loginRequiredMiddleware } from '@api/middlewares';
import PermissionService from '@api/services/PermissionService';
import { logger } from '@api/utils/logger';
import PermissionValidators from '@api/validators/permission.validator';
import { Permission } from '@prisma/client';
import * as express from 'express';
import expressAsyncHandler from 'express-async-handler';

class PermissionController implements IController<Permission> {
  public path = '/permissions';
  public router = express.Router();
  public dbService: PermissionService = new PermissionService();
  public validator: PermissionValidators = new PermissionValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(
      this.path,
      loginRequiredMiddleware(),
      this.getAllPermissions
    );

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createPermission
    );

    this.router.put(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updatePermission
    );

    this.router.delete(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.deletePermission
    );

    this.router.get(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.getPermissionByID
    );
  }

  getAllPermissions = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createPermission = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: PermissionPayload = request.body;
      logger.debug('createPermission payload:', payload);
      const user = await this.dbService.create({
        ...payload
      });
      logger.debug('createPermission user:', user);
      response.json(user);
    }
  );

  updatePermission = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: PermissionPayload = request.body;
      const id: number = Number(request.params?.id);
      logger.info('updatePermission payload:', payload);
      const object = await this.dbService.update(id, {
        ...payload
      });
      if (!object) {
        throw new NotFoundException();
      }
      logger.debug('updatePermission object:', object);
      response.json(object);
    }
  );

  getPermissionByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('getPermissionByID param:', id);
      const object = await this.dbService.getById(id);
      logger.debug('getPermissionByID object:', object);
      if (!object) {
        throw new NotFoundException();
      }
      response.json(object);
    }
  );

  deletePermission = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('deletePermissionByID param:', id);
      const res = await this.dbService.remove(id).catch(() => {
        throw new NotFoundException();
      });
      logger.debug('deletePermissionByID res:', res);
      response.json(res);
    }
  );
}

export default PermissionController;
