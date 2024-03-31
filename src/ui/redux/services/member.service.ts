import apiConfig from '@api/utils/config/api_config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Define a service using a base URL and expected endpoints
type MemberUpdatePayload = Partial<Member> & Pick<Member, 'id'>;
export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getMembers: builder.query<Member[], void>({
      query: () => `members/`
    }),
    getMemberByID: builder.query<Member, number>({
      query: (memberId) => `members/${memberId}`
    }),
    createMember: builder.mutation<Member, Omit<Member, 'id'>>({
      query: (member) => ({
        url: `members`,
        method: 'POST',
        body: member
      })
    }),
    updateMember: builder.mutation<Member, MemberUpdatePayload>({
      query: ({ id: memberId, ...patch }) => ({
        url: `members/${memberId}`,
        method: 'PUT',
        body: patch
      })
    }),
    deleteMember: builder.query<Member, number>({
      query: (memberId) => ({
        url: `members/${memberId}`,
        method: 'DELETE'
      })
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMembersQuery,
  useCreateMemberMutation,
  useDeleteMemberQuery,
  useGetMemberByIDQuery,
  useUpdateMemberMutation,
  useLazyDeleteMemberQuery,
  useLazyGetMemberByIDQuery,
  useLazyGetMembersQuery,
  usePrefetch
} = membersApi;

export default membersApi;
