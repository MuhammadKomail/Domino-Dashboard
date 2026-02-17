// src/reducers/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducer/authSlice/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authStates"],
};

const appReducer = combineReducers({
  authStates: authReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET") {
    // Clear the persisted storage
    storage.removeItem("persist:root");
    // Reset the state to undefined, effectively clearing all slices
    state = undefined;
  }
  return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
