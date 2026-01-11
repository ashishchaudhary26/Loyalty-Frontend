// src/store/slices/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productsAPI from "./productsAPI";

export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async (filters = {}, thunkAPI) => {
    try {
      const apiCall = filters.keyword
        ? productsAPI.searchProducts
        : productsAPI.fetchProducts;

      const data = await apiCall(filters);

      const content = Array.isArray(data) ? data : data.content || [];

      const items = content.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.productName,
        price: p.price,
        is_available: p.available,
        images: p.images || [],
      }));

      return {
        items,
        totalPages: data.totalPages || 1,
        totalItems: data.totalElements || items.length,
      };
    } catch (err) {
      const backend = err.response?.data;
      let message = "Failed to load products";

      if (backend) {
        if (typeof backend === "string") {
          message = backend;
        } else if (backend.message) {
          message = backend.message;
        } else if (backend.error) {
   
          message = backend.error;
        } else if (backend.status) {
          message = `Error ${backend.status}`;
        }
      } else if (err.message) {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);


const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    totalPages: 0,
    totalItems: 0,
    loading: false,
    error: null,
    filters: {
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      keyword: null,
      page: 0,
      limit: 20,
      sortBy: null,
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilters, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
