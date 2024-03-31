import NotFoundException from '@api/exceptions/NotFoundException';
import { IController } from '@api/interfaces/IController';
import { TransactionPayload } from '@api/interfaces/ITransaction';

import { loginRequiredMiddleware } from '@api/middlewares';
import TransactionService from '@api/services/TransactionService';
import { logger } from '@api/utils/logger';
import TransactionValidators from '@api/validators/transaction.validator';
import { Transaction } from '@prisma/client';
import * as express from 'express';
import expressAsyncHandler from 'express-async-handler';

class TransactionController implements IController<Transaction> {
  public path = '/transactions';
  public router = express.Router();
  public dbService: TransactionService = new TransactionService();
  public validator: TransactionValidators = new TransactionValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(
      this.path,
      loginRequiredMiddleware(),
      this.getAllTransactions
    );

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createTransaction
    );

    this.router.put(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updateTransaction
    );

    this.router.delete(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.deleteTransaction
    );

    this.router.get(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.getTransactionByID
    );
  }

  getAllTransactions = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createTransaction = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: TransactionPayload = request.body;
      logger.debug('createTransaction payload:', payload);
      const user = await this.dbService.create({
        ...payload,
        userId: request.user.id
      });
      logger.debug('createTransaction user:', user);
      response.json(user);
    }
  );

  updateTransaction = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: TransactionPayload = request.body;
      const id: number = Number(request.params?.id);
      logger.info('updateTransaction payload:', payload);
      const object = await this.dbService.update(id, {
        ...payload,
        userId: request.user.id
      });
      if (!object) {
        throw new NotFoundException();
      }
      logger.debug('updateTransaction object:', object);
      response.json(object);
    }
  );

  getTransactionByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('getTransactionByID param:', id);
      const object = await this.dbService.getById(id);
      logger.debug('getTransactionByID object:', object);
      if (!object) {
        throw new NotFoundException();
      }
      response.json(object);
    }
  );

  deleteTransaction = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('deleteTransactionByID param:', id);
      const res = await this.dbService.remove(id).catch(() => {
        throw new NotFoundException();
      });
      logger.debug('deleteTransactionByID res:', res);
      response.json(res);
    }
  );
}

export default TransactionController;
