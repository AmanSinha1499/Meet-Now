import { apiDispatch } from "../../helper/helperFunctions";
import { CHANGE_THEME } from "./themeActionTypes";

export const changeTheme = (theme = "light") => {
  return (dispatch) => {
    dispatch(apiDispatch(CHANGE_THEME, theme));
    localStorage.setItem("theme", theme);
  };
};
