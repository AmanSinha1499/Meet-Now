import { combineReducers } from "redux";
import roomReducer from "./reducers/roomReducer";
import themeReducer from "./reducers/themeReducer";
import userReducer from "./reducers/userReducer";

const appReducer = combineReducers({ userReducer, themeReducer, roomReducer });

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
