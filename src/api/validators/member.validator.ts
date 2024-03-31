import { IControllerValidator } from '@api/interfaces/IControllerValidator';
import { $Enums } from '@prisma/client';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';

class MemberValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        fullName: z.string(),
        address: z.string(),
        phone: z.string(),
        weight: z.number(),
        height: z.number(),
        gender: z.enum([$Enums.Gender.MALE, $Enums.Gender.FEMALE])
      })
    });
  }
  updateValidator() {
    return validateRequest({
      params: z.object({
        memberId: z.string()
      }),
      body: z.object({
        fullName: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        gender: z.enum([$Enums.Gender.MALE, $Enums.Gender.FEMALE]).optional()
      })
    });
  }

  memberIdParamValidator() {
    return validateRequest({
      params: z.object({
        memberId: z.string()
      })
    });
  }

  paySubscriptionValidator() {
    return validateRequest({
      params: z.object({
        subscriptionId: z.string()
      }),
      body: z.object({
        paidValue: z.number()
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

export default MemberValidators;
