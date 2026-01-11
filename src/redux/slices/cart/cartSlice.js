// src/redux/slices/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../../api/cartApi";

// Helper to compute totals from backend items
const calcTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
    0
  );
  return { totalItems, totalAmount };
};

const initialState = {
  id: null,
  cartUuid: null,
  userId: null,
  items: [],          // [{ id, productId, quantity, unitPrice, ... }]
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

// 🔹 Load cart from backend (GET /api/v1/cart)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await cartApi.getCart();
      // If no cart exists, backend might return 404; handle in catch
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        // no cart yet → treat as empty cart
        return null;
      }
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Failed to load cart"
      );
    }
  }
);

// 🔹 Add product to cart (POST /api/v1/cart/items)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1 }, thunkAPI) => {
    try {
      const payload = {
        productId: product.id,
        quantity,
        unitPrice: product.price,
        // cartUuid: ... // for guest carts later if needed
      };

      const res = await cartApi.addItem(payload);
      // backend returns created CartItemDto, not whole cart
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Failed to add to cart"
      );
    }
  }
);

// 🔹 Update cart item quantity (PUT /api/v1/cart/items/{itemId})
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const payload = { quantity };
      const res = await cartApi.updateItem(itemId, payload);
      return res.data; // updated item
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Failed to update item"
      );
    }
  }
);

// 🔹 Remove item (DELETE /api/v1/cart/items/{itemId})
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, thunkAPI) => {
    try {
      await cartApi.removeItem(itemId);
      return itemId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Failed to remove item"
      );
    }
  }
);

// 🔹 Clear entire cart (DELETE /api/v1/cart)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await cartApi.clearCart();
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH CART
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload;
        if (!cart) {
          // no cart: keep empty state
          state.id = null;
          state.cartUuid = null;
          state.userId = null;
          state.items = [];
          state.totalItems = 0;
          state.totalAmount = 0;
        } else {
          state.id = cart.id;
          state.cartUuid = cart.cartUuid || null;
          state.userId = cart.userId || null;
          state.items = cart.items || [];
          const totals = calcTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to load cart";
      });

    // ADD TO CART
    builder
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload; // {id, productId, quantity, unitPrice, ...}

        const existing = state.items.find(
          (i) => i.productId === newItem.productId
        );

        if (existing) {
          // backend may already merge; but just in case:
          existing.quantity = newItem.quantity;
          existing.unitPrice = newItem.unitPrice;
        } else {
          state.items.push(newItem);
        }

        const totals = calcTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to add to cart";
      });

    // UPDATE CART ITEM
    builder
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = updated;
        }
        const totals = calcTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to update item";
      });

    // REMOVE CART ITEM
    builder
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.items = state.items.filter((i) => i.id !== itemId);
        const totals = calcTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to remove item";
      });

    // CLEAR CART
    builder
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to clear cart";
      });
  },
});

export default cartSlice.reducer;
