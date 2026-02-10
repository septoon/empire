import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './Features/services/servicesSlice';
import modalReducer from './Features/modal/modalSlice';
import selectedServicesReducer from './Features/modal/selectedServicesSlice';
import reservationsReducer from './Features/modal/reservationsSlice';
import availableTimesReducer from './Features/modal/availableTimesSlice';
import bookingBlackoutsReducer from './Features/modal/bookingBlackoutsSlice';
import formReducer from './Features/form/formSlice';
import contactsReducer from './Features/contacts/contactsSlice'

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    modal: modalReducer,
    selectedServices: selectedServicesReducer,
    form: formReducer,
    reservations: reservationsReducer,
    availableTimes: availableTimesReducer,
    bookingBlackouts: bookingBlackoutsReducer,
    contacts: contactsReducer
  },
});
