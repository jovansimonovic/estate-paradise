import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

// redux-persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// creates a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// creates a redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);