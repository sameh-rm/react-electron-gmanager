import NotFoundException from "@api/exceptions/NotFoundException";
import { IController } from "@api/interfaces/IController";
import { PlanPayload } from "@api/interfaces/IPlan";

import { loginRequiredMiddleware } from "@api/middlewares";
import PlanService from "@api/services/PlanService";
import { logger } from "@api/utils/logger";
import PlanValidators from "@api/validators/plan.validator";
import { Plan } from "@prisma/client";
import * as express from "express";
import expressAsyncHandler from "express-async-handler";

class PlanController implements IController<Plan> {
  public path = "/plans";
  public router = express.Router();
  public dbService: PlanService = new PlanService();
  public validator: PlanValidators = new PlanValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, loginRequiredMiddleware(), this.getAllPlans);

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createPlan
    );

    this.router.put(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updatePlan
    );

    this.router.delete(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.deletePlan
    );

    this.router.get(
      `${this.path}/:id`,
      loginRequiredMiddleware(),
      this.validator.idParamValidator(),
      this.getPlanByID
    );

    this.router.patch(
      `${this.path}/:id/workout`,
      loginRequiredMiddleware(),
      this.validator.addWorkoutToPlanValidator(),
      this.addWorkoutsToPlan
    );
  }

  getAllPlans = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createPlan = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: PlanPayload = request.body;
      logger.debug("createPlan payload:", payload);
      const user = await this.dbService.create({
        ...payload,
        userId: request.user.id,
      });
      logger.debug("createPlan user:", user);
      response.json(user);
    }
  );

  updatePlan = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: PlanPayload = request.body;
      const id: number = Number(request.params?.id);
      logger.info("updatePlan payload:", payload);
      const object = await this.dbService.update(id, {
        ...payload,
        userId: request.user.id,
      });
      if (!object) {
        throw new NotFoundException();
      }
      logger.debug("updatePlan object:", object);
      response.json(object);
    }
  );

  addWorkoutsToPlan = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const { workoutsIdList }: { workoutsIdList: number[] } = request.body;
      console.log({ workoutsIdList });
      const { id } = request.params;
      logger.info("updatePlan workoutsIdList:", workoutsIdList);
      const list = workoutsIdList.map(
        async (workoutId) =>
          await this.dbService.addWorkoutToPlan(Number(id), workoutId)
      );
      this.dbService._prisma.$transaction(async () => {
        return await Promise.all(list);
      });

      const plan = await this.dbService.getById(Number(id));
      response.json(plan);
    }
  );

  getPlanByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug("getPlanByID param:", id);
      const object = await this.dbService.getById(id);
      logger.debug("getPlanByID object:", object);
      if (!object) {
        throw new NotFoundException();
      }
      response.json(object);
    }
  );

  deletePlan = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const id: number = Number(request.params.id);
      logger.debug("deletePlanByID param:", id);
      const res = await this.dbService.remove(id).catch(() => {
        throw new NotFoundException();
      });
      logger.debug("deletePlanByID res:", res);
      response.json(res);
    }
  );
}

export default PlanController;
