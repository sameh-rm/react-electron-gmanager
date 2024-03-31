import apiConfig from "@api/utils/config/api_config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => `users/`,
    }),
    getUserByID: builder.query<User, number>({
      query: (userId) => `users/${userId}`,
    }),
    createUser: builder.mutation<User, Omit<User, "id">>({
      query: (user) => ({
        url: `users`,
        method: "POST",
        body: user,
      }),
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id: userId, ...patch }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: patch,
      }),
    }),
    changeUserPassword: builder.mutation<User, ChangePasswordPayload>({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteUser: builder.query<User, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUsersQuery,
  useChangeUserPasswordMutation,
  useCreateUserMutation,
  useDeleteUserQuery,
  useGetUserByIDQuery,
  useUpdateUserMutation,
  useLazyDeleteUserQuery,
  useLazyGetUserByIDQuery,
  useLazyGetUsersQuery,
  usePrefetch,
} = usersApi;
