import { PrismaClient, User } from "@prisma/client";
import {
  IUserService,
  UserPayload,
  UserRegisterPayload,
  UserWithToken,
} from "@api/interfaces/IUserService";
import {
  generateAccessToken,
  hashPassword,
  verifyPassword,
} from "@api/utils/user-utils";
import { exclude } from "@api/utils/helpers";
import WrongCredentialsException from "@api/exceptions/WrongCredentialsException";
import ForbiddenException from "@api/exceptions/ForbiddenException";
import DBClient from "@api/db/dbClient";

class UserService implements IUserService<UserPayload> {
  _prisma: PrismaClient;

  constructor() {
    this._prisma = DBClient.getInstance().prisma;
  }

  async login(username: string, password: string): Promise<UserWithToken> {
    const user = await this.getByUsername(username);
    let token: string;
    if (await verifyPassword(user, password)) {
      token = generateAccessToken(user);
    } else {
      throw new WrongCredentialsException();
    }
    return { ...exclude(user, ["password"]), token };
  }

  async register(user: UserRegisterPayload): Promise<UserWithToken> {
    const {
      fullName,
      username,
      password,
      confirmPassword,
      role,
      phone,
      address,
    } = user;
    if (password !== confirmPassword) {
      throw new WrongCredentialsException("Passwords does not match!");
    }
    const createdUser = await this.create({
      fullName,
      username,
      password: user.password,
      phone,
      address,
      role: role,
    });
    return { ...createdUser, token: generateAccessToken(createdUser) };
  }

  async changePassword(
    user: User,
    password: string,
    newPassword: string
  ): Promise<User> {
    // newPassword = await hashPassword(newPassword);
    password = await hashPassword(password);

    if (password !== user.password)
      throw new ForbiddenException("Old Password is Incorrect!");

    return await this._prisma.user
      .update({
        where: {
          username: user.username,
        },
        data: {
          password: await hashPassword(newPassword),
        },
      })
      .then((updatedUser) => (user = updatedUser));
  }

  async getAll(): Promise<User[]> {
    return await this._prisma.user.findMany().then((users) => users);
  }

  async getById(id: number): Promise<User> {
    return await this._prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => data);
  }

  async getByUsername(username: string): Promise<User> {
    return await this._prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .then((data) => data);
  }

  async remove(id: number): Promise<void> {
    await this._prisma.user
      .delete({
        where: {
          id,
        },
      })
      .then((res) => {
        console.log("User", id, "Is Deleted", res);
      });
  }

  async create(data: UserPayload): Promise<User> {
    return await this._prisma.user
      .create({
        data,
      })
      .then((newUser) => {
        return newUser;
      })
      .catch((err) => {
        return err;
      });
  }

  async update(id: number, user: UserPayload): Promise<User> {
    console.log({user})
    return await this._prisma.user
      .update({
        where: {
          id: id,
        },
        data: {
          ...user,
        },
      })
      .then((res) => res);
  }

}

export default UserService;
