import BadRequestException from '@api/exceptions/BadRequestException';
import NotFoundException from '@api/exceptions/NotFoundException';
import { IController } from '@api/interfaces/IController';
import { MemberPayload } from '@api/interfaces/IMember';

import { loginRequiredMiddleware } from '@api/middlewares';
import MemberService from '@api/services/MemberService';
import { logger } from '@api/utils/logger';
import MemberValidators from '@api/validators/member.validator';
import { Member, Transaction } from '@prisma/client';
import * as express from 'express';
import expressAsyncHandler from 'express-async-handler';

class MemberController implements IController<Member> {
  public path = '/members';
  public router = express.Router();
  public dbService: MemberService = new MemberService();
  public validator: MemberValidators = new MemberValidators();
  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, loginRequiredMiddleware(), this.getAllMembers);

    this.router.post(
      this.path,
      loginRequiredMiddleware(),
      this.validator.createValidator(),
      this.createMember
    );

    this.router.put(
      `${this.path}/:memberId`,
      loginRequiredMiddleware(),
      this.validator.updateValidator(),
      this.updateMember
    );

    this.router.delete(
      `${this.path}/:memberId`,
      loginRequiredMiddleware('ADMIN'),
      this.validator.memberIdParamValidator(),
      this.deleteMember
    );

    this.router.get(
      `${this.path}/:memberId`,
      loginRequiredMiddleware(),
      this.validator.memberIdParamValidator(),
      this.getMemberByID
    );
    this.router.get(
      `${this.path}/:memberId/transactions`,
      loginRequiredMiddleware(),
      this.validator.memberIdParamValidator(),
      this.getMemberTransactions
    );
    this.router.get(
      `${this.path}/:memberId/subscriptions`,
      loginRequiredMiddleware(),
      this.validator.memberIdParamValidator(),
      this.getMemberSubscriptions
    );
    this.router.patch(
      `${this.path}/subscriptions/:subscriptionId`,
      loginRequiredMiddleware(),
      this.validator.paySubscriptionValidator(),
      this.payMemberSubscription
    );
  }

  getAllMembers = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const users = await this.dbService.getAll();
      response.send(users);
    }
  );

  createMember = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: MemberPayload = request.body;
      console.log('request.user.id', request.user.id);
      logger.debug('createMember payload:', payload);
      const user = await this.dbService.create({
        ...payload,
        userId: request.user.id
      });
      logger.debug('createMember user:', user);
      response.json(user);
    }
  );

  updateMember = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const payload: MemberPayload = request.body;
      const memberId: number = Number(request.params?.memberId);
      logger.info('updateMember payload:', payload);
      const member = await this.dbService.update(memberId, {
        ...payload,
        userId: request.user.id
      });
      if (!member) {
        throw new NotFoundException();
      }
      logger.debug('updateMember member:', member);
      response.json(member);
    }
  );

  getMemberByID = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const memberId: number = Number(request.params.memberId);
      logger.debug('getMemberByID param:', memberId);
      const member = await this.dbService.getById(memberId);
      logger.debug('getMemberByID member:', member);
      if (!member) {
        throw new NotFoundException();
      }
      response.json(member);
    }
  );

  deleteMember = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const memberId: number = Number(request.params.memberId);
      logger.debug('deleteMemberByID param:', memberId);
      const res = await this.dbService.remove(memberId).catch(() => {
        throw new NotFoundException();
      });
      logger.debug('deleteMemberByID res:', res);
      response.json(res);
    }
  );

  getMemberTransactions = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const { memberId } = request.params;
      const { take } = request.query;

      logger.debug('getMemberTransactions param:', memberId);
      const transactions = (
        await this.dbService.getMemberTransactions(
          Number(memberId),
          take ? Number(take) : undefined
        )
      ).reduce((prev: Transaction[], current) => {
        return prev.concat(current.transactions);
      }, []);
      logger.debug('getMemberTransactions transactions:', transactions);
      if (!transactions) {
        throw new NotFoundException();
      }
      response.json(transactions);
    }
  );

  getMemberSubscriptions = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const memberId: number = Number(request.params.memberId);
      logger.debug('getMemberSubscriptions param:', memberId);
      const subscriptions =
        await this.dbService.getMemberSubscriptions(memberId);
      logger.debug('getMemberSubscriptions subscriptions:', subscriptions);
      if (!subscriptions) {
        throw new NotFoundException();
      }
      response.json(subscriptions);
    }
  );

  payMemberSubscription = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      const subscriptionId: number = Number(request.params.subscriptionId);
      const paidValue: number = request.body.paidValue;
      const subscription = await this.dbService._prisma.subscription.findUnique(
        {
          where: {
            id: subscriptionId
          }
        }
      );

      const remained = subscription.value - subscription.paid;
      const newVal = subscription.paid + paidValue;
      console.log('newVal', newVal);
      if (newVal > subscription.value) {
        throw new BadRequestException(
          `paidValue ${paidValue} cant be more than the remained value ${remained}`
        );
      }

      const payedSubscription = await this.dbService.payMemberSubscription(
        subscriptionId,
        paidValue
      );
      if (!payedSubscription) {
        throw new NotFoundException();
      }
      response.json(payedSubscription);
    }
  );
}

export default MemberController;
