import apiConfig from '@api/utils/config/api_config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Define a service using a base URL and expected endpoints
export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => `plans/`
    }),
    getPlanByID: builder.query<Plan, number>({
      query: (planId) => `plans/${planId}`
    }),
    createPlan: builder.mutation<Plan, Omit<Plan, 'id'>>({
      query: (plan) => ({
        url: `plans`,
        method: 'POST',
        body: plan
      })
    }),
    updatePlan: builder.mutation<Plan, Partial<Plan> & Pick<Plan, 'id'>>({
      query: ({ id: planId, ...patch }) => ({
        url: `plans/${planId}`,
        method: 'PUT',
        body: patch
      })
    }),
    deletePlan: builder.query<Plan, number>({
      query: (planId) => ({
        url: `plans/${planId}`,
        method: 'DELETE'
      })
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useDeletePlanQuery,
  useGetPlanByIDQuery,
  useUpdatePlanMutation,
  useLazyDeletePlanQuery,
  useLazyGetPlanByIDQuery,
  useLazyGetPlansQuery,
  usePrefetch
} = plansApi;

export default plansApi;
