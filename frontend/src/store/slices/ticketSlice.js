import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import ticketService from "../../services/ticketService";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export const fetchTickets = createAsyncThunk(
    "tickets/fetch",
    async (_, thunkAPI) => {
        try {
            const response =
                await ticketService.getAll();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch tickets"
            );
        }
    }
);

export const createTicket = createAsyncThunk(
    "tickets/create",
    async (ticketData, thunkAPI) => {
        try {
            const response =
                await ticketService.createTicket(
                    ticketData
                );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create ticket"
            );
        }
    }
);

export const resolveTicket = createAsyncThunk(
    "tickets/resolve",
    async (id, thunkAPI) => {
        try {
            const response =
                await ticketService.resolveTicket(id);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to resolve ticket"
            );
        }
    }
);

const ticketSlice = createSlice({
    name: "tickets",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createTicket.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(resolveTicket.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    ticket => ticket.id === action.payload.id
                );

                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const {
    clearError
} = ticketSlice.actions;

export default ticketSlice.reducer;