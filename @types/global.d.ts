declare global {
  interface Window {
    db: string; // Assuming db is of type any
  }
}

type User = import('@prisma/client').User;
type Workout = import('@prisma/client').Workout;
type Plan = import('@prisma/client').Plan;
type Subscription = import('@prisma/client').Subscription;
type Transaction = import('@prisma/client').Transaction;
type Member = import('@prisma/client').Member;
type Role = import('@prisma/client').Role;
type Gender = import('@prisma/client').Gender;
type PaymentStatus = import('@prisma/client').PaymentStatus;
type IntervalType = import('@prisma/client').IntervalType;
type TransactionType = import('@prisma/client').TransactionType;
type ChangePasswordPayload = {
  userId: number;
  oldPassword: string;
  newPassword: string;
};
type NotificationMessageType = {
  id:number;
  type: string;
  message: string;
  stack: string;
}


declare namespace Express {
  export interface Request {
    user?: User;
  }
}
