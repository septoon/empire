// store.js
import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './Features/services/servicesSlice';
import modalReducer from './Features/modal/modalSlice';
import selectedServicesReducer from './Features/modal/selectedServicesSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    modal: modalReducer,
    selectedServices: selectedServicesReducer,
  },
});
