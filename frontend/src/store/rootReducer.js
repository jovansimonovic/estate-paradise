import { combineReducers } from "redux";
import userReducer from "../features/user/userSlice.js";

// combines all reducers into one
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
