import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import panelService from "../../services/panelService";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export const fetchPanelsBySite = createAsyncThunk(
    "panels/fetchBySite",
    async (siteId, thunkAPI) => {
        try {
            const response =
                await panelService.getBySite(siteId);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch panels"
            );
        }
    }
);

export const createPanel = createAsyncThunk(
    "panels/create",
    async (panelData, thunkAPI) => {
        try {
            const response =
                await panelService.createPanel(panelData);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create panel"
            );
        }
    }
);

export const updatePanel = createAsyncThunk(
    "panels/update",
    async ({ id, panelData }, thunkAPI) => {
        try {
            const response =
                await panelService.updatePanel(
                    id,
                    panelData
                );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update panel"
            );
        }
    }
);

export const deletePanel = createAsyncThunk(
    "panels/delete",
    async (id, thunkAPI) => {
        try {
            await panelService.deletePanel(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete panel"
            );
        }
    }
);

const panelSlice = createSlice({
    name: "panels",
    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(fetchPanelsBySite.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchPanelsBySite.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchPanelsBySite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createPanel.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(updatePanel.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    panel => panel.id === action.payload.id
                );

                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

            .addCase(deletePanel.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    panel => panel.id !== action.payload
                );
            });
    }
});

export default panelSlice.reducer;