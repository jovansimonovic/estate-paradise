import { combineReducers } from "redux";
import userReducer from "../features/user/userSlice.js";
import listingReducer from "../features/listing/listingSlice.js";

// combines all reducers into one
const rootReducer = combineReducers({
  user: userReducer,
  listing: listingReducer,
});

export default rootReducer;
