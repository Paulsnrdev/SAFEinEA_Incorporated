import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './coursesSlice';
import uiReducer      from './uiSlice';
import cartReducer    from './cartSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    ui:      uiReducer,
    cart:    cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
