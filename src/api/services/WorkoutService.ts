import DBClient from '@api/db/dbClient';
import { IWorkoutService, WorkoutPayload } from '@api/interfaces/IWorkout';
import { logger } from '@api/utils/logger';
import { Workout, Prisma, PrismaClient } from '@prisma/client';

class WorkoutService implements IWorkoutService<Workout> {
  _prisma: PrismaClient;
  model: Prisma.WorkoutDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
    this.model = this._prisma.workout;
  }

  async getAll(): Promise<Workout[]> {
    const plans = await this.model.findMany().catch((err) => {
      logger.error(err);
      return err;
    });
    return plans;
  }

  async getById(id: number): Promise<Workout> {
    const plan = await this.model
      .findUnique({
        where: {
          id
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return plan;
  }

  async remove(id: number): Promise<void> {
    await this.model
      .delete({
        where: {
          id
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((res) => {
        logger.info('Workout', id, 'Is Deleted', res);
      });
  }

  async create(data: WorkoutPayload): Promise<Workout> {
    const createdWorkout = await this.model
      .create({
        data
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return createdWorkout;
  }

  async update(id: number, plan: WorkoutPayload): Promise<Workout> {
    return await this.model
      .update({
        where: {
          id: id
        },
        data: {
          ...plan
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((res) => res);
  }
}

export default WorkoutService;
