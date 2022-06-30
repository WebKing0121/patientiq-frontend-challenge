import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./slices/movieSlice";
import accountReducer from "./slices/accountSlice";

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});
