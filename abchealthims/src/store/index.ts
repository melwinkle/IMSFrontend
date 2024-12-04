import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import billReducer from './slices/billingSlice';
import imageReducer from './slices/imageSlice';
import diagnosisReducer from './slices/diagnosisSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    billing: billReducer,
    image: imageReducer,
    diagnosis: diagnosisReducer,
    // Add other reducers as needed
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;