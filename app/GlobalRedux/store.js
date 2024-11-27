// store.js
import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './Features/services/servicesSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
  },
});
