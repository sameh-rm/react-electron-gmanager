import { IControllerValidator } from '@api/interfaces/IControllerValidator';
import { $Enums } from '@prisma/client';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';

class TransactionValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        value: z.number(),
        description: z.string(),
        subscriptionId: z.number(),
        type: z.enum([
          $Enums.TransactionType.EXPENSE,
          $Enums.TransactionType.INCOME
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
        value: z.number().optional(),
        description: z.string().optional(),
        type: z
          .enum([$Enums.TransactionType.EXPENSE, $Enums.TransactionType.INCOME])
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

  searchValidator() {
    return validateRequest({
      query: z.object({
        search: z.string().optional(),
        from_date: z.date().optional(),
        to_date: z.date().optional()
      })
    });
  }
}

export default TransactionValidators;
