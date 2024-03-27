import DBClient from "@api/db/dbClient";
import {
  ISubscriptionService,
  SubscriptionPayload,
} from "@api/interfaces/ISubscription";
import { logger } from "@api/utils/logger";
import { Subscription, Prisma, PrismaClient } from "@prisma/client";

class SubscriptionService implements ISubscriptionService<Subscription> {
  _prisma: PrismaClient;
  model: Prisma.SubscriptionDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
    this.model = this._prisma.subscription;
  }

  async getAll(): Promise<Subscription[]> {
    const objects = await this.model.findMany().catch((err) => {
      logger.error(err);
      return err;
    });
    return objects;
  }

  async getById(id: number): Promise<Subscription> {
    const object = await this.model
      .findUnique({
        where: {
          id,
        },
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
          id,
        },
      })
      .then((res) => {
        logger.info("Subscription", id, "Is Deleted", res);
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
  }

  async create(data: SubscriptionPayload): Promise<Subscription> {
    const createdObject = await this.model
      .create({
        data,
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return createdObject;
  }

  async update(id: number, data: SubscriptionPayload): Promise<Subscription> {
    const updatedObject = await this.model
      .update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return updatedObject;
  }
}

export default SubscriptionService;
