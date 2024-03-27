import DBClient from "@api/db/dbClient";
import { IMemberService, MemberPayload } from "@api/interfaces/IMember";
import { SubscriptionWithTransactions } from "@api/interfaces/ISubscription";
import { logger } from "@api/utils/logger";
import { Member, Prisma, PrismaClient } from "@prisma/client";

class MemberService implements IMemberService<Member> {
  _prisma: PrismaClient;
  model: Prisma.MemberDelegate;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;

    this._prisma.$use(async (params, next) => {
      // Manipulate params here
      console.log("params", JSON.stringify(params, undefined, 4));

      const result = await next(params);
      // See results here
      return result;
    });
    this.model = this._prisma.member;
  }

  async getAll(): Promise<Member[]> {
    return await this.model
      .findMany()
      .then((members) => members)
      .catch((err) => {
        logger.error(err);
        return err;
      });
  }

  async getById(id: number): Promise<Member> {
    return await this.model
      .findUnique({
        where: {
          id,
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((data) => data);
  }

  async getMemberTransactions(
    id: number,
    take: number
  ): Promise<SubscriptionWithTransactions[]> {
    console.log("take", take);
    return await this._prisma.subscription
      .findMany({
        where: {
          memberId: id,
        },
        select: {
          transactions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((data) => data);
  }

  async getMemberSubscriptions(
    id: number
  ): Promise<SubscriptionWithTransactions[]> {
    return await this._prisma.subscription
      .findMany({
        where: {
          memberId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((data) => data);
  }

  async payMemberSubscription(
    id: number,
    value: number
  ): Promise<SubscriptionWithTransactions[]> {
    return await this._prisma.subscription
      .update({
        where: {
          id,
        },
        data: {
          paid: {
            increment: value,
          },
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then(async (data) => {
        // if (Number(data.value) === Number(data.paid)) {
        //   return await this._prisma.subscription
        //     .update({
        //       where: { id },
        //       data: { paymentStatus: "PAID" },
        //     })
        //     .then((data) => {
        //       console.log(data);
        //       return data;
        //     })
        //     .catch((err) => err);
        // }
        return data;
      });
  }

  async getMembersByName(memberName: string): Promise<Member[]> {
    return await this.model
      .findMany({
        where: {
          fullName: { search: memberName.trim().replaceAll(" ", " | ") },
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((data) => data);
  }

  async remove(id: number): Promise<void> {
    await this.model
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((res) => {
        logger.info("Member", id, "Is Deleted", res);
      });
  }

  async create(data: MemberPayload): Promise<Member> {
    console.log("data", data);
    return await this.model
      .create({
        data,
      })
      .then((newMember) => {
        return newMember;
      })
      .catch((err) => {
        return err;
      });
  }

  async update(id: number, member: MemberPayload): Promise<Member> {
    return await this.model
      .update({
        where: {
          id: id,
        },
        data: {
          ...member,
        },
      })
      .catch((err) => {
        logger.error(err);
        return err;
      })
      .then((res) => res);
  }
}

export default MemberService;
