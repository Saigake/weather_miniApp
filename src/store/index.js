import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import themeReducer from './themeSlice';

export default configureStore({
  reducer: {
    weather: weatherReducer,
    theme: themeReducer,
  },
});
