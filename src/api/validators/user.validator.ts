import { IControllerValidator } from "@api/interfaces/IControllerValidator";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

class UserValidators implements IControllerValidator {
  registerValidator() {
    return validateRequest({
      //   params: z.object({
      //     urlParameter: z.string(),
      //   }),
      body: z
        .object({
          username: z.string().min(3),
          password: z.string().min(3),
          confirmPassword: z.string().min(3),
          fullName: z.string().min(3),
          address: z.string().min(3),
          phone: z.string().min(10),
          role: z.enum([$Enums.Role.ADMIN, $Enums.Role.USER]).optional(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords Does not match!",
          path: ["password", "confirmPassword"],
        }),
      //   query: z.object({
      //     queryKey: z.string().length(64),
      //   }),
    });
  }
  updateValidator() {
    return validateRequest({
      params: z.object({
        userId: z.string(),
      }),
      body: z.object({
        username: z.string().min(3).optional(),
        fullName: z.string().min(3).optional(),
        address: z.string().min(3).optional(),
        phone: z.string().min(10).optional(),
        role: z.enum([$Enums.Role.ADMIN, $Enums.Role.USER]).optional(),
      }),
    });
  }
  changePasswordValidator() {
    return validateRequest({
      params: z.object({
        userId: z.string(),
      }),
      body: z.object({
        oldPassword: z.string().min(3),
        newPassword: z.string().min(3),
      }),
    });
  }
  loginValidator() {
    return validateRequest({
      body: z.object({
        username: z.string().min(3),
        password: z.string().min(3),
      }),
    });
  }
  userIdParamValidator() {
    return validateRequest({
      params: z.object({
        userId: z.string(),
      }),
    });
  }
}

export default UserValidators;
