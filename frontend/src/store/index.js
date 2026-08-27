import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import siteReducer from "./slices/siteSlice";
import panelReducer from "./slices/panelSlice";
import metricReducer from "./slices/metricSlice";
import ticketReducer from "./slices/ticketSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sites: siteReducer,
        panels: panelReducer,
        metrics: metricReducer,
        tickets: ticketReducer
    }
});

export default store;