import { createSlice } from '@reduxjs/toolkit';

const siteSlice = createSlice({
  name: 'sites',
  initialState: { items: [], loading: false, searchQuery: '' },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload; },
    setItems(state, action) { state.items = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setSearchQuery, setItems, setLoading } = siteSlice.actions;
export default siteSlice.reducer;