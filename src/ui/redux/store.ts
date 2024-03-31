import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import { usersApi } from './services/user.service';
import { membersApi } from './services/member.service';
import { subscriptionsApi } from './services/subscription.service';
import { transactionsApi } from './services/transaction.service';
import { plansApi } from './services/plan.service';
import { workoutsApi } from './services/workout.service';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { userReducer } from './slices/user.slice';
import { notificationsReducer } from './slices/notifications.slice';

const persistConfig = {
  key: 'root',
  storage,
  timeout: 1000
};

const rootReducer = combineReducers({
  user: userReducer.reducer,
  notifications: notificationsReducer.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [membersApi.reducerPath]: membersApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [transactionsApi.reducerPath]: transactionsApi.reducer,
  [plansApi.reducerPath]: plansApi.reducer,
  [workoutsApi.reducerPath]: workoutsApi.reducer
});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const setupStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat([
        usersApi.middleware,
        membersApi.middleware,
        subscriptionsApi.middleware,
        transactionsApi.middleware,
        plansApi.middleware,
        workoutsApi.middleware
      ])
  });

export const store = setupStore();
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
