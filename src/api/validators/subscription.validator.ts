import { IControllerValidator } from "@api/interfaces/IControllerValidator";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

class SubscriptionValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        planId: z.number(),
        value:z.number(),
        memberId: z.number(),
        paid: z.number(),
        paymentStatus: z.enum([
          $Enums.PaymentStatus.PAID,
          $Enums.PaymentStatus.UNPAID,
        ]),
        startsAt: z.string(),
        endsAt: z.string(),
      }),
    });
  }
  
  updateValidator() {
    return validateRequest({
      params: z.object({
        id: z.string(),
      }),
      body: z.object({
        planId: z.number().optional(),
        value:z.number().optional(),
        memberId: z.number().optional(),
        paid: z.number().optional(),
        paymentStatus: z.enum([
          $Enums.PaymentStatus.PAID,
          $Enums.PaymentStatus.UNPAID,
        ]).optional(),
        confirmed: z.boolean().optional(),
        startsAt: z.string().optional(),
        endsAt: z.string().optional(),
      }),
    });
  }

  idParamValidator() {
    return validateRequest({
      params: z.object({
        id: z.string(),
      }),
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

export default SubscriptionValidators;
