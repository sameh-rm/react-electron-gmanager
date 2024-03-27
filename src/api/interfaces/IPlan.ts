import type { Plan } from "@prisma/client";
import { IPrismaService } from "./IPrismaService";

export interface IPlanService<Plan> extends IPrismaService<Plan> {}

export type PlanPayload = Omit<Plan, "createdAt" | "updatedAt" | "id">;
