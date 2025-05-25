import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './src/slices/weatherSlice';
import newsReducer from './src/slices/newsSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
  },
});

export default store;