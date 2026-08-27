import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const user = JSON.parse(
    localStorage.getItem("user")
);

const initialState = {
    user: user || null,
    loading: false,
    error: null
};

export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout();
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export default authSlice.reducer;