import { IControllerValidator } from "@api/interfaces/IControllerValidator";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

class PlanValidators implements IControllerValidator {
  createValidator() {
    return validateRequest({
      body: z.object({
        title: z.string(),
        describtion: z.string(),
        price: z.number(),
        duration: z.number(),
        intervalType: z.enum([
          $Enums.IntervalType.DAILY,
          $Enums.IntervalType.MONTHLY,
          $Enums.IntervalType.YEARLY,
        ]),
        planWorkouts: z.array(z.number()),
      }),
    });
  }
  updateValidator() {
    return validateRequest({
      params: z.object({
        id: z.string(),
      }),
      body: z
        .object({
          title: z.string(),
          describtion: z.string(),
          price: z.number(),
          duration: z.number(),
          intervalType: z.enum([
            $Enums.IntervalType.DAILY,
            $Enums.IntervalType.MONTHLY,
            $Enums.IntervalType.YEARLY,
          ]),
          planWorkouts: z.array(z.number()),
        })
        .partial(),
    });
  }

  idParamValidator() {
    return validateRequest({
      params: z.object({
        id: z.string(),
      }),
    });
  }

  addWorkoutToPlanValidator() {
    return validateRequest({
      params: z.object({
        id: z.string()
      }),
      body: z.object({
        workoutsIdList: z.array(z.number())
      })
    });
  }

  searchValidator() {
    return validateRequest({
      query: z.object({
        search: z.string().optional(),
        from_date: z.date().optional(),
        to_date: z.date().optional(),
      }),
    });
  }
}

export default PlanValidators;
