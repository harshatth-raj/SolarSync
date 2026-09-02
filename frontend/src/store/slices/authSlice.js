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


/* =========================================================
   LOGIN
========================================================= */

export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {

        try {

            return await authService.login(
                userData
            );

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );

        }

    }
);


/* =========================================================
   REGISTER
========================================================= */

export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {

        try {

            return await authService.register(
                userData
            );

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Registration failed"
            );

        }

    }
);


/* =========================================================
   LOGOUT
========================================================= */

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {

        authService.logout();

    }
);


/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            /* =========================
               LOGIN
            ========================= */

            .addCase(
                login.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                login.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.user = action.payload;
                    state.error = null;

                }
            )

            .addCase(
                login.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;

                }
            )


            /* =========================
               REGISTER
            ========================= */

            .addCase(
                register.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                register.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;

                }
            )

            .addCase(
                register.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;

                }
            )


            /* =========================
               LOGOUT
            ========================= */

            .addCase(
                logout.fulfilled,
                (state) => {

                    state.user = null;
                    state.error = null;

                }
            );

    }

});


export default authSlice.reducer;