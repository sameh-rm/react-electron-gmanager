import { PrismaClient } from "@prisma/client";

export interface IPrismaService<Entity> {
  _prisma: PrismaClient;

  getAll(): Promise<Entity[]>;

  getById(id: number): Promise<Entity>;

  remove(id: number): void;

  create(data: Entity): Promise<Entity>;

  update(id:number, data: Entity): Promise<Entity>;
}

export default IPrismaService