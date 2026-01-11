// src/store/slices/orders/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderApi from "../../../api/orderApi";

export const loadOrders = createAsyncThunk(
  "orders/loadOrders",
  async (_, thunkAPI) => {
    try {
      const res = await orderApi.listOrders();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default ordersSlice.reducer;
