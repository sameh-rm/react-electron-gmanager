import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type StateType = {
  messages: NotificationMessageType[];
  id: number;
};
// Define the initial state for the slice
const initialState: StateType = {
  messages: [],
  id: 1
};

export const notificationsReducer = createSlice({
  // Name of the slice
  name: 'notifications',
  initialState,
  // Functions that update the initialState are written inside the reducers object
  reducers: {
    // This function updates the board name when called
    addMessage: (
      state,
      action: PayloadAction<Omit<NotificationMessageType, 'id'>>
    ) => {
      state.messages.push({ id: state.id, ...action.payload });
      state.id += 1;
    },
    removeMessage: (state, action: PayloadAction<NotificationMessageType>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload.id);
    }
  }
});

// Export the functions defined inside the reducers here
export const { addMessage, removeMessage } = notificationsReducer.actions;

// Selector function to retrieve the current board name from the state
export const getMessagesSelector = (state: RootState) => state.notifications.messages;

// Export the reducer for use in the Redux store
export default notificationsReducer.reducer;
