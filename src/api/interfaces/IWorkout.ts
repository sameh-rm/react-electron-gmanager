import type { Workout } from "@prisma/client";
import { IPrismaService } from "./IPrismaService";



export interface IWorkoutService<Workout> extends IPrismaService<Workout> {

}

export type WorkoutPayload = Omit<Workout, "createdAt"| "updatedAt" | "id">