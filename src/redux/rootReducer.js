import { combineReducers } from 'redux';
import authReducer from './slices/auth/authSlice';
import cartReducer from './slices/cart/cartSlice';
import productReducer from './slices/products/productsSlice';
import orderReducer from './slices/orders/orderSlice';
import addressReducer from './slices/address/addressSlice';
import wishlistReducer from './slices/wishlist/wishlistSlice'; // ✅ add this

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  orders: orderReducer,
  address: addressReducer,
  wishlist: wishlistReducer,       // ✅ register wishlist slice
  // ui: uiReducer,
});

export default rootReducer;
