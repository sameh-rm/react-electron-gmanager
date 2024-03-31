import NotFoundException from '@api/exceptions/NotFoundException';
import { IController } from '@api/interfaces/IController';
import { WorkoutPayload } from '@api/interfaces/IWorkout';

import { loginRequiredMiddleware } from '@api/middlewares';
import WorkoutService from '@api/services/WorkoutService';
import { logger } from '@api/utils/logger';
import WorkoutValidators from '@api/validators/workout.validator';
import { Workout } from '@prisma/client';
import * as express from 'express';
import expressAsyncHandler from 'express-async-handler';

class WorkoutController implements IController<Workout> {
  public path = '/workouts';
  public router = express.Router();
  public dbService: WorkoutService = new WorkoutService();
  public validator: WorkoutValidators = new WorkoutValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, loginRequiredMiddleware(), this.getAllWorkouts);

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createWorkout
    );

    this.router.put(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updateWorkout
    );

    this.router.delete(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.deleteWorkout
    );

    this.router.get(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.getWorkoutByID
    );
  }

  getAllWorkouts = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createWorkout = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: WorkoutPayload = request.body;
      logger.debug('createWorkout payload:', payload);
      const user = await this.dbService.create({
        ...payload,
        userId: request.user.id
      });
      logger.debug('createWorkout user:', user);
      response.json(user);
    }
  );

  updateWorkout = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: WorkoutPayload = request.body;
      const id: number = Number(request.params?.id);
      logger.info('updateWorkout payload:', payload);
      const object = await this.dbService.update(id, {
        ...payload,
        userId: request.user.id
      });
      if (!object) {
        throw new NotFoundException();
      }
      logger.debug('updateWorkout object:', object);
      response.json(object);
    }
  );

  getWorkoutByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('getWorkoutByID param:', id);
      const object = await this.dbService.getById(id);
      logger.debug('getWorkoutByID object:', object);
      if (!object) {
        throw new NotFoundException();
      }
      response.json(object);
    }
  );

  deleteWorkout = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug('deleteWorkoutByID param:', id);
      const res = await this.dbService.remove(id).catch(() => {
        throw new NotFoundException();
      });
      logger.debug('deleteWorkoutByID res:', res);
      response.json(res);
    }
  );
}

export default WorkoutController;
