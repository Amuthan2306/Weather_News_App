import {createSlice} from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {unit: 'metric', forecast: null, current: null},
  reducers: {
    setWeather: (state, action) => {
      state.current = action.payload.current;
      state.forecast = action.payload.forecast;
    },
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
  },
});

export const {setWeather, setUnit} = weatherSlice.actions;
export default weatherSlice.reducer;
