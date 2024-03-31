import { Permission, User } from '@prisma/client';
import { IPrismaService } from './IPrismaService';

export interface IUserService<User> extends IPrismaService<User> {
  login(username: string, password: string): Promise<UserWithToken>;
  register(user: UserRegisterPayload): Promise<UserWithToken>;
  changePassword(
    user: User,
    password: string,
    newPassword: string
  ): Promise<User>;
}

export interface IAdminUserService<User> extends IUserService<User> {
  addPermission(user: User, permission: Permission): User;
  removePermission(user: User, permission: Permission): User;
}

export type UserLoginPayload = {
  username: string;
  password: string;
};
export type UserPayload = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;
export type UserRegisterPayload = Omit<
  User & { confirmPassword: string },
  'createdAt' | 'updatedAt' | 'id'
>;
export type UserWithToken = Omit<
  User & { token?: string },
  'password' | 'createdAt' | 'updatedAt'
>;
