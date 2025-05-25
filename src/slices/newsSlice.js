import {createSlice} from '@reduxjs/toolkit';

const newsSlice = createSlice({
  name: 'news',
  initialState: {headlines: [], category: 'general'},
  reducers: {
    setHeadlines: (state, action) => {
      state.headlines = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const {setHeadlines, setCategory} = newsSlice.actions;
export default newsSlice.reducer;
