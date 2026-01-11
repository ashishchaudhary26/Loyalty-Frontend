// src/redux/slices/address/addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAddresses,
  createAddress,
  deleteAddress,
} from "../../../api/addressApi";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAddresses();
      const data = Array.isArray(res.data) ? res.data : JSON.parse(res.data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createAddress(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddress(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load addresses";
      })

      // add
      .addCase(addAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload || "Failed to add address";
      })

      // delete
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
      })
      .addCase(deleteAddressThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete address";
      });
  },
});

export default addressSlice.reducer;
