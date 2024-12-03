import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAvailableTimes = createAsyncThunk('availableTimes/fetch', async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/availableTimes.json`);
  return response.data.availableTimes;
});

const availableTimesSlice = createSlice({
  name: 'availableTimes',
  initialState: {
    times: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.times = action.payload || []; 
      })
      .addCase(fetchAvailableTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default availableTimesSlice.reducer;