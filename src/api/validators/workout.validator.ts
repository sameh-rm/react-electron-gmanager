import { IControllerValidator } from '@api/interfaces/IControllerValidator';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';

class WorkoutValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        title: z.string(),
        describtion: z.string()
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
        describtion: z.string().optional()
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

export default WorkoutValidators;
