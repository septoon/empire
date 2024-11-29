// store.js
import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './Features/services/servicesSlice';
import modalReducer from './Features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    modal: modalReducer,
  },
});
