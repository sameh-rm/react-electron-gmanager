// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default, import/no-named-as-default-member
import helmet from "helmet";
import express from "express";
import * as dotenv from "dotenv";
import validateEnv from "@api/utils/config/validateEnv";
import cors from "cors";
import bodyParser from "body-parser";
import { IController } from "@api/interfaces/IController";
import UserController from "@api/controllers/users.controller";
import errorMiddleware from "@api/middlewares/error.middleware";
import { loggingMiddleware } from "@api/middlewares/logger.middleware";
import MemberController from "@api/controllers/members.controller";
import PlanController from "@api/controllers/plans.controller";
import WorkoutController from "@api/controllers/workouts.controller";
import TransactionController from "@api/controllers/transactions.controller";
import SubscriptionController from "@api/controllers/subscriptions.controller";
import PermissionController from "@api/controllers/permissions.controller";

class App {
  private port: number;
  private app: express.Application;


  constructor(controllers: IController<unknown>[], port: number) {
    this.port = port;
    this.app = express();
    this.initMiddlewares();
    this.initControllers(controllers);
    this.initializeErrorHandling();
  }

  private initMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(loggingMiddleware);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initControllers(controllers: IController<unknown>[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }

}

dotenv.config();
validateEnv();

const port = Number(process.env.API_PORT);
const app = new App(
  [
    new UserController(),
    new MemberController(),
    new PlanController(),
    new WorkoutController(),
    new TransactionController(),
    new SubscriptionController(),
    new PermissionController(),
  ],
  port
);

app.listen();
