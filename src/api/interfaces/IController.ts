import type { Router } from 'express';
import { IPrismaService } from './IPrismaService';

export interface IController<Entity> {
  path: string;
  router: Router;
  dbService: IPrismaService<Entity>;
  intializeRoutes(): void;
}

export default IController;
