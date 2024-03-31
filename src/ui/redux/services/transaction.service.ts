import apiConfig from '@api/utils/config/api_config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Define a service using a base URL and expected endpoints
export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => `transactions/`
    }),
    getTransactionByID: builder.query<Transaction, number>({
      query: (transactionId) => `transactions/${transactionId}`
    }),
    createTransaction: builder.mutation<Transaction, Omit<Transaction, 'id'>>({
      query: (transaction) => ({
        url: `transactions`,
        method: 'POST',
        body: transaction
      })
    }),
    updateTransaction: builder.mutation<
      Transaction,
      Partial<Transaction> & Pick<Transaction, 'id'>
    >({
      query: ({ id: transactionId, ...patch }) => ({
        url: `transactions/${transactionId}`,
        method: 'PUT',
        body: patch
      })
    }),
    deleteTransaction: builder.query<Transaction, number>({
      query: (transactionId) => ({
        url: `transactions/${transactionId}`,
        method: 'DELETE'
      })
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionQuery,
  useGetTransactionByIDQuery,
  useUpdateTransactionMutation,
  useLazyDeleteTransactionQuery,
  useLazyGetTransactionByIDQuery,
  useLazyGetTransactionsQuery,
  usePrefetch
} = transactionsApi;

export default transactionsApi;
