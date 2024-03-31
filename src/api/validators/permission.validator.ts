import { IControllerValidator } from '@api/interfaces/IControllerValidator';
import { $Enums } from '@prisma/client';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
class PermissionValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        title: z.string(),
        describtion: z.string(),
        model: z.enum([
          $Enums.Models.Member,
          $Enums.Models.Permission,
          $Enums.Models.Plan,
          $Enums.Models.Subscription,
          $Enums.Models.Workout,
          $Enums.Models.User,
          $Enums.Models.Transaction
        ]),
        operation: z.enum([
          $Enums.PermissionOperation.CAN_APPROVE,
          $Enums.PermissionOperation.CAN_CREATE,
          $Enums.PermissionOperation.CAN_READ_ALL,
          $Enums.PermissionOperation.CAN_REMOVE,
          $Enums.PermissionOperation.CAN_UPDATE
        ])
      })
    });
  }

  updateValidator() {
    return validateRequest({
      params: z.object({
        id: z.string()
      }),
      body: z.object({
        title: z.string().optional(),
        describtion: z.string().optional(),
        model: z.string().optional(),
        operation: z
          .enum([
            $Enums.PermissionOperation.CAN_APPROVE,
            $Enums.PermissionOperation.CAN_CREATE,
            $Enums.PermissionOperation.CAN_READ_ALL,
            $Enums.PermissionOperation.CAN_REMOVE,
            $Enums.PermissionOperation.CAN_UPDATE
          ])
          .optional()
      })
    });
  }

  idParamValidator() {
    return validateRequest({
      params: z.object({
        id: z.string()
      })
    });
  }

  // searchValidator() {
  //   return validateRequest({
  //     query: z.object({
  //       search: z.string().optional(),
  //       from_date: z.date().optional(),
  //       to_date: z.date().optional(),
  //       confirmed: z.boolean().optional(),
  //       paymentStatus: z.enum([
  //         $Enums.PaymentStatus.PAID,
  //         $Enums.PaymentStatus.UNPAID,
  //       ]).optional(),
  //     }),
  //   });
  // }
}

export default PermissionValidators;
