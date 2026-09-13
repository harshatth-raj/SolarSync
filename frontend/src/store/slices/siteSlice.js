import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSites = createAsyncThunk(
  'sites/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/sites');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch sites');
    }
  }
);

const siteSlice = createSlice({
  name: 'sites',
  initialState: { items: [], loading: false, error: null, searchQuery: '' },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload; },
    setItems(state, action) { state.items = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchSites.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setSearchQuery, setItems, setLoading } = siteSlice.actions;
export default siteSlice.reducer;