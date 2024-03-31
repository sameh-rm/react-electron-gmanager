import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the initial state for the slice
type UserStateType = {
  userData: Partial<Omit<User, 'password'>> & Pick<User, 'id'>;
};
const initialState: UserStateType = {
  userData: {
    id: 0,
    fullName: undefined,
    username: undefined,
    address: undefined,
    phone: undefined,
    role: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }
};

export const userReducer = createSlice({
  // Name of the slice
  name: 'user',
  initialState,
  // Functions that update the initialState are written inside the reducers object
  reducers: {
    // This function updates the board name when called
    logout: (state) => {
      state.userData = { ...initialState.userData };
    },
    login: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    }
  }
});

// Export the functions defined inside the reducers here
export const { logout } = userReducer.actions;

// Selector function to retrieve the current board name from the state
export const getUserSelector = (state: RootState) => state.user;
export const getCurrentUserSelector = (state: RootState) => state.user.userData;

// Export the reducer for use in the Redux store
export default userReducer.reducer;
