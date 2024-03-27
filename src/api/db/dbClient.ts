import { PrismaClient } from "@prisma/client";

class DBClient {
  public prisma: PrismaClient;
  private static client: DBClient;
  private constructor() {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  public static getInstance() {
    if (!DBClient.client) {
      DBClient.client = new DBClient();
    }
    return DBClient.client;
  }
}

export default DBClient;
