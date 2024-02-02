import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'NewsCategory',
  initialState: {
    category: { type: 'ALL', value: 'All'},
  },
  reducers: {
    changeCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});
export const {changeCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
