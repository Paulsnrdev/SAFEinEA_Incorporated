import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCourses, getCourseById } from '../firebase/courseService';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (filters) => {
  return await getCourses(filters);
});

export const fetchCourse = createAsyncThunk('courses/fetchOne', async (id) => {
  return await getCourseById(id);
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    list:     [],
    current:  null,
    loading:  false,
    error:    null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchCourses.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchCourses.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchCourse.pending,    (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchCourse.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchCourse.rejected,   (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});

export const { clearCurrent } = coursesSlice.actions;
export default coursesSlice.reducer;
