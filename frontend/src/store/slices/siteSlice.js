import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import siteService from "../../services/siteService";

const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    searchQuery: ""
};

export const fetchSites = createAsyncThunk(
    "sites/fetchSites",
    async (_, thunkAPI) => {
        try {
            const response = await siteService.getAll();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch sites"
            );
        }
    }
);

export const fetchSiteById = createAsyncThunk(
    "sites/fetchSiteById",
    async (id, thunkAPI) => {
        try {
            const response =
                await siteService.getById(id);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch site"
            );
        }
    }
);

export const createSite = createAsyncThunk(
    "sites/createSite",
    async (siteData, thunkAPI) => {
        try {
            const response =
                await siteService.createSite(siteData);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create site"
            );
        }
    }
);

export const deleteSite = createAsyncThunk(
    "sites/deleteSite",
    async (id, thunkAPI) => {
        try {
            await siteService.deleteSite(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete site"
            );
        }
    }
);

const siteSlice = createSlice({
    name: "sites",
    initialState,

    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    },

    extraReducers: (builder) => {

        builder

            .addCase(fetchSites.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchSites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchSites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchSiteById.fulfilled, (state, action) => {
                state.selectedItem = action.payload;
            })

            .addCase(createSite.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(deleteSite.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    site => site.id !== action.payload
                );
            });
    }
});

export const {
    setSearchQuery
} = siteSlice.actions;

export default siteSlice.reducer;