import DBClient from '@api/db/dbClient';
import { IPlanService, PlanPayload } from '@api/interfaces/IPlan';
import { logger } from '@api/utils/logger';
import { Plan, Prisma, PrismaClient, Workout } from '@prisma/client';

class PlanService implements IPlanService<Plan> {
  _prisma: PrismaClient;
  model: Prisma.PlanDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
    this.model = this._prisma.plan;
  }

  async getAll(): Promise<Plan[]> {
    const plans = await this.model.findMany().catch((err) => {
      logger.error(err);
      return err;
    });
    return plans;
  }

  async getById(id: number): Promise<Plan & { workouts?: Workout[] }> {
    const plan = await this.model
      .findUnique({
        where: {
          id
        },
        include: {
          workouts: true
        }
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });
    return plan;
  }

  async addWorkoutToPlan(
    id: number,
    workoutId: number
  ): Promise<Plan & { workouts?: Workout[] }> {
    console.log('id', id);
    console.log('workoutId', workoutId);
    const plan = await this.model
      .update({
        data: {
          workouts: {
            connect: {
              id: workoutId
            }
          }
        },
        where: {
          id
        },
        include: {
          workouts: true
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
        console.log(err);
        return err;
      })
      .then((res) => {
        logger.info('Plan', id, 'Is Deleted', res);
      });
  }

  async create(data: PlanPayload): Promise<Plan> {
    const createdPlan = await this.model
      .create({
        data
      })
      .catch((err) => {
        console.log(err);
        return err;
      })
      .then((res) => res);
    return createdPlan;
  }

  async update(id: number, plan: PlanPayload): Promise<Plan> {
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
        console.log(err);
        return err;
      })
      .then((res) => res);
  }
}

export default PlanService;
