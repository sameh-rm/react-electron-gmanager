import type { Member } from '@prisma/client';
import { IPrismaService } from './IPrismaService';

export interface IMemberService<Member> extends IPrismaService<Member> {}

export type MemberPayload = Omit<Member, 'createdAt' | 'updatedAt' | 'id'>;
