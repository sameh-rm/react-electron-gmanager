import type { Subscription, Transaction } from '@prisma/client';
import { IPrismaService } from './IPrismaService';

export interface ISubscriptionService<Subscription>
  extends IPrismaService<Subscription> {}

export type SubscriptionPayload = Omit<
  Subscription,
  'createdAt' | 'updatedAt' | 'id'
>;
export type SubscriptionWithTransactions = Subscription & {
  transactions?: Transaction[];
};
