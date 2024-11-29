import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedServices: [],
};

const selectedServicesSlice = createSlice({
  name: 'selectedServices',
  initialState,
  reducers: {
    setSelectedServices(state, action) {
      state.selectedServices = action.payload;
    },
    clearSelectedServices(state) {
      state.selectedServices = [];
    },
  },
});

export const { setSelectedServices, clearSelectedServices } = selectedServicesSlice.actions;

export default selectedServicesSlice.reducer;