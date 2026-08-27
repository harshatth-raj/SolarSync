import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import metricService from "../../services/metricService";

const initialState = {
    recent: [],
    analytics: null,
    loading: false,
    error: null
};

export const fetchRecentMetrics = createAsyncThunk(
    "metrics/recent",
    async (_, thunkAPI) => {
        try {
            const response =
                await metricService.getRecent();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch metrics"
            );
        }
    }
);

export const fetchAnalytics = createAsyncThunk(
    "metrics/analytics",
    async (_, thunkAPI) => {
        try {
            const response =
                await metricService.getAnalytics();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch analytics"
            );
        }
    }
);

export const ingestMetrics = createAsyncThunk(
    "metrics/ingest",
    async (batchData, thunkAPI) => {
        try {
            await metricService.ingestBatch(batchData);
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to ingest metrics"
            );
        }
    }
);

const metricSlice = createSlice({
    name: "metrics",
    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder
            .addCase(fetchRecentMetrics.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchRecentMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.recent = action.payload;
            })

            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload;
            })

            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default metricSlice.reducer;