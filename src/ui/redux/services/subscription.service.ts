import apiConfig from '@api/utils/config/api_config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Define a service using a base URL and expected endpoints
export const subscriptionsApi = createApi({
  reducerPath: 'subscriptionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => `subscriptions/`
    }),
    getSubscriptionByID: builder.query<Subscription, number>({
      query: (subscriptionId) => `subscriptions/${subscriptionId}`
    }),
    createSubscription: builder.mutation<
      Subscription,
      Omit<Subscription, 'id'>
    >({
      query: (subscription) => ({
        url: `subscriptions`,
        method: 'POST',
        body: subscription
      })
    }),
    updateSubscription: builder.mutation<
      Subscription,
      Partial<Subscription> & Pick<Subscription, 'id'>
    >({
      query: ({ id: subscriptionId, ...patch }) => ({
        url: `subscriptions/${subscriptionId}`,
        method: 'PUT',
        body: patch
      })
    }),
    deleteSubscription: builder.query<Subscription, number>({
      query: (subscriptionId) => ({
        url: `subscriptions/${subscriptionId}`,
        method: 'DELETE'
      })
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useDeleteSubscriptionQuery,
  useGetSubscriptionByIDQuery,
  useUpdateSubscriptionMutation,
  useLazyDeleteSubscriptionQuery,
  useLazyGetSubscriptionByIDQuery,
  useLazyGetSubscriptionsQuery,
  usePrefetch
} = subscriptionsApi;

export default subscriptionsApi;
