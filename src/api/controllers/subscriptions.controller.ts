import NotFoundException from '@api/exceptions/NotFoundException';
import UnAuthorizedException from '@api/exceptions/UnAuthorizedException';
import { IController } from '@api/interfaces/IController';
import { SubscriptionPayload } from '@api/interfaces/ISubscription';

import { loginRequiredMiddleware } from '@api/middlewares';
import SubscriptionService from '@api/services/SubscriptionService';
import { logger } from '@api/utils/logger';
import SubscriptionValidators from '@api/validators/subscription.validator';
import { Subscription } from '@prisma/client';
import * as express from 'express';
import expressAsyncHandler from 'express-async-handler';

class SubscriptionController implements IController<Subscription> {
  public path = '/subscriptions';
  public router = express.Router();
  public dbService: SubscriptionService = new SubscriptionService();
  public validator: SubscriptionValidators = new SubscriptionValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(
      this.path,
      loginRequiredMiddleware(),
      this.getAllSubscriptions
    );

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createSubscription
    );

    this.router.put(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updateSubscription
    );

    this.router.delete(
      `${this.path}/:id`,
      loginRequiredMiddleware('ADMIN'),
      this.validator.idParamValidator(),
      this.deleteSubscription
    );

    this.router.get(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.getSubscriptionByID
    );
  }

  getAllSubscriptions = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createSubscription = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: SubscriptionPayload = request.body;
      logger.debug('createSubscription payload:', payload);
      const user = await this.dbService.create({
        ...payload,
        userId: request.user.id
      });
      logger.debug('createSubscription user:', user);
      response.json(user);
    }
  );

  updateSubscription = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: SubscriptionPayload = request.body;
      if (payload.confirmed) {
        if (request.user.role != 'ADMIN') {
          throw new UnAuthorizedException(
            'Only admin can confirm a subscription'
          );
        }
      }
      const id: number = Number(request.params?.id);
      logger.info('updateSubscription payload:', payload);
      const object = await this.dbService.update(id, {
        ...payload,
        userId: request.user.id
      });
      if (!object) {
        throw new NotFoundException();
      }
      logger.debug('updateSubscription object:', object);
      response.json(object);
    }
  );

  getSubscriptionByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('getSubscriptionByID param:', id);
      const object = await this.dbService.getById(id);
      logger.debug('getSubscriptionByID object:', object);
      if (!object) {
        throw new NotFoundException();
      }
      response.json(object);
    }
  );

  deleteSubscription = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('deleteSubscriptionByID param:', id);
      const res = await this.dbService.remove(id).catch(() => {
        throw new NotFoundException();
      });
      logger.debug('deleteSubscriptionByID res:', res);
      response.json(res);
    }
  );
}

export default SubscriptionController;
