import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронный thunk для получения данных
export const fetchContacts = createAsyncThunk('contacts/fetch', async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts.json?t=${Date.now()}`);
  return response.data || {};
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    address: '',
    phoneNumber: '',
    mail: '',
    scheduleStart: null,
    scheduleEnd: null,
    everyday: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address || '';
        state.phoneNumber = action.payload.phoneNumber || '';
        state.mail = action.payload.mail || '';
        state.scheduleStart = action.payload.scheduleStart || null;
        state.scheduleEnd = action.payload.scheduleEnd || null;
        state.everyday = action.payload.everyday || false;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default contactsSlice.reducer;