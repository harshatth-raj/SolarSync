
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import siteReducer from './slices/siteSlice';
import ticketReducer from './slices/ticketSlice';
import panelReducer from './slices/panelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sites: siteReducer,
    tickets: ticketReducer,
    panels: panelReducer,
  },
});
export default store;