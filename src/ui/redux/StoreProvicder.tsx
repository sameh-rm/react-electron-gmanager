import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store';

// Custom provider component
export function StoreProvicder({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>{children}</PersistGate>
    </Provider>
  );
}
