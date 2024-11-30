import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  phone: '',
  dateTime: new Date().toISOString(),
  comment: '',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setDateTime(state, action) {
      state.dateTime = action.payload;
    },
    setComment(state, action) {
      state.comment = action.payload;
    },
    clearForm(state) {
      state.name = '';
      state.phone = '';
      state.dateTime = new Date().toISOString();
      state.comment = '';
    },
  },
});

export const { setName, setPhone, setDateTime, setComment, clearForm } = formSlice.actions;

export default formSlice.reducer;