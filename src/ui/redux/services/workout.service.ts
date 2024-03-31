import apiConfig from "@api/utils/config/api_config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Define a service using a base URL and expected endpoints
export const workoutsApi = createApi({
  reducerPath: "workoutsApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiConfig.API_URL }),
  endpoints: (builder) => ({
    getWorkouts: builder.query<Workout[], void>({
      query: () => `workouts/`,
    }),
    getWorkoutByID: builder.query<Workout, number>({
      query: (workoutId) => `workouts/${workoutId}`,
    }),
    createWorkout: builder.mutation<Workout, Omit<Workout, "id">>({
      query: (workout) => ({
        url: `workouts`,
        method: "POST",
        body: workout,
      }),
    }),
    updateWorkout: builder.mutation<Workout, Partial<Workout> & Pick<Workout, "id">>({
      query: ({ id: workoutId, ...patch }) => ({
        url: `workouts/${workoutId}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteWorkout: builder.query<Workout, number>({
      query: (workoutId) => ({
        url: `workouts/${workoutId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetWorkoutsQuery,
  useCreateWorkoutMutation,
  useDeleteWorkoutQuery,
  useGetWorkoutByIDQuery,
  useUpdateWorkoutMutation,
  useLazyDeleteWorkoutQuery,
  useLazyGetWorkoutByIDQuery,
  useLazyGetWorkoutsQuery,
  usePrefetch,
} = workoutsApi;

export default workoutsApi;
