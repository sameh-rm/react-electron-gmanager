import type { Transaction } from "@prisma/client";
import { IPrismaService } from "./IPrismaService";



export interface ITransactionService<Transaction> extends IPrismaService<Transaction> {

}

export type TransactionPayload = Omit<Transaction, "createdAt"| "updatedAt" | "id">