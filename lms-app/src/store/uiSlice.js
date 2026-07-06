import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: typeof window !== 'undefined' && window.innerWidth >= 768,
    searchQuery: '',
  },
  reducers: {
    toggleSidebar:    (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen:   (s, a) => { s.sidebarOpen = a.payload; },
    setSearchQuery:   (s, a) => { s.searchQuery = a.payload; },
  },
});

export const { toggleSidebar, setSidebarOpen, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
