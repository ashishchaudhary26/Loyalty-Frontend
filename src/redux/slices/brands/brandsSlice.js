// src/store/slices/brands/brandsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axiosConfig";


export const loadBrands = createAsyncThunk(
  "brands/loadBrands",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/v1/products/brands");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default brandsSlice.reducer;
