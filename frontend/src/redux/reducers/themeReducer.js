import { CHANGE_THEME } from "../actions/themeActionTypes";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
};

const themeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_THEME:
      return { ...state, theme: payload };
    default:
      return state;
  }
};

export default themeReducer;
