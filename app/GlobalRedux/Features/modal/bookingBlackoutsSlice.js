import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeBlackoutDates(input) {
  if (!Array.isArray(input)) return [];

  const uniq = new Set();
  for (const item of input) {
    if (typeof item === 'string' && YMD_RE.test(item)) {
      uniq.add(item);
    }
  }

  return Array.from(uniq).sort();
}

export const fetchBookingBlackouts = createAsyncThunk(
  'bookingBlackouts/fetch',
  async (_, { rejectWithValue }) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/bookingBlackouts.json?t=${Date.now()}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      const rawDates = Array.isArray(data) ? data : Array.isArray(data?.dates) ? data.dates : [];
      return normalizeBlackoutDates(rawDates);
    } catch (err) {
      // 404 is not an error: treat as empty list.
      if (err?.response?.status === 404) return [];

      return rejectWithValue(err?.message || 'Failed to fetch booking blackouts');
    }
  }
);

const bookingBlackoutsSlice = createSlice({
  name: 'bookingBlackouts',
  initialState: {
    dates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingBlackouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingBlackouts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.dates = action.payload || [];
      })
      .addCase(fetchBookingBlackouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch booking blackouts';
      });
  },
});

export default bookingBlackoutsSlice.reducer;
