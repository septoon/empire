import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services.json`);
      return response.data;
    } catch (error) {
      // Логирование ошибки для отладки
      console.error('Ошибка при выполнении запроса:', error);

      // Безопасное получение сообщения об ошибке
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Ошибка при загрузке данных';

      return rejectWithValue(message);
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Здесь можно добавить синхронные редьюсеры при необходимости
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка';
      });
  },
});

export default servicesSlice.reducer;