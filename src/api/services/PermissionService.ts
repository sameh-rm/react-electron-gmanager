import DBClient from "@api/db/dbClient";
import {
  IPermissionService,
  PermissionPayload,
} from "@api/interfaces/IPermission";
import { logger } from "@api/utils/logger";
import { Permission, Prisma, PrismaClient } from "@prisma/client";

class PermissionService implements IPermissionService<Permission> {
  _prisma: PrismaClient;
  model: Prisma.PermissionDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
    this.model = this._prisma.permission;
  }

  async getAll(): Promise<Permission[]> {
    const objects = await this.model.findMany().catch(err=>{
      logger.error(err)
      return err  
    });
    return objects;
  }

  async getById(id: number): Promise<Permission> {
    const object = await this.model.findUnique({
      where: {
        id,
      },
    }).catch(err=>{
      logger.error(err)
      return err  
    });
    return object;
  }

  async remove(id: number): Promise<void> {
    await this.model
      .delete({
        where: {
          id,
        },
      }).catch(err=>{
        logger.error(err)
        return err  
      })
      .then((res) => {
        logger.info("Permission", id, "Is Deleted", res);
      });
  }

  async create(data: PermissionPayload): Promise<Permission> {
    const createdObject = await this.model.create({
      data,
    }).catch(err=>{
      logger.error(err)
      return err  
    });
    return createdObject;
  }

  async update(id: number, data: PermissionPayload): Promise<Permission> {
    const updatedObject = await this.model
    .update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    }).catch(err=>{
      logger.error(err)
      return err  
    })
    return updatedObject
      
  }
}

export default PermissionService;
