import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReservations = createAsyncThunk('reservations/fetch', async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reservations.json?t=${Date.now()}`);
  return response.data || [];
});

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    reservedDates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservedDates = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reservationsSlice.reducer;