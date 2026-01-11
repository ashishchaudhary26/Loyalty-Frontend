// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { injectStore } from "../api/axiosConfig";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Attach store reference to axios
injectStore(store);

export default store;
