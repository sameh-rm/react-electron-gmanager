import DBClient from '@api/db/dbClient';
import {
  ITransactionService,
  TransactionPayload
} from '@api/interfaces/ITransaction';
import { logger } from '@api/utils/logger';
import { Transaction, Prisma, PrismaClient } from '@prisma/client';

class TransactionService implements ITransactionService<Transaction> {
  _prisma: PrismaClient;
  model: Prisma.TransactionDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
    this.model = this._prisma.transaction;
  }

  async getAll(): Promise<Transaction[]> {
    const objects = await this.model.findMany().catch((err) => {
      logger.error(err);
      return err;
    });
    return objects;
  }

  async getById(id: number): Promise<Transaction> {
    const object = await this.model
      .findUnique({
        where: {
          id
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return object;
  }

  async remove(id: number): Promise<void> {
    await this.model
      .delete({
        where: {
          id
        }
      })
      .then((res) => {
        logger.info('Transaction', id, 'Is Deleted', res);
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
  }

  async create(data: TransactionPayload): Promise<Transaction> {
    const createdObject = await this.model
      .create({
        data
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return createdObject;
  }

  async update(id: number, data: TransactionPayload): Promise<Transaction> {
    const updatedObject = await this.model
      .update({
        where: {
          id: id
        },
        data: {
          ...data
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return updatedObject;
  }
}

export default TransactionService;
