import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

/* -------------------------------------------------------
   Rehydrate user from localStorage on every app boot.
   This prevents the "no user → redirect to login" bug
   that happens whenever Redux state is reset (e.g. after
   a modal closes and triggers a re-render).
------------------------------------------------------- */
const persistedUser = (() => {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authService.login(credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.register(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: persistedUser,   // ← rehydrated from localStorage
    error: null,
    loading: false,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');  // ← clear persisted user
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // persist token
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }

        // persist full user object so it survives re-renders
        try {
          localStorage.setItem('authUser', JSON.stringify(action.payload));
        } catch {
          // ignore quota errors
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
