import apiClient from "../../helper/apiclient";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import {
  GET_USER_ERROR,
  GET_USER,
  SET_TOKEN,
  LOGGEDINORNOT,
  GET_USER_PENDING,
  GET_INVITATION,
} from "./userActionTypes";

import {
  googleLogin,
  facebookLogin,
  get_user,
  logout,
  getInvites,
} from "../../config/backend_api";
import { apiDispatch, apiError } from "../../helper/helperFunctions";

const userErrorDispatch = apiError(GET_USER_ERROR);

export const getUser = () => {
  let url = get_user;
  return (dispatch) => {
    dispatch(apiDispatch(GET_USER_PENDING, true));
    apiClient
      .get(url)
      .then((res) => {
        dispatch(apiDispatch(LOGGEDINORNOT, true));
        dispatch(apiDispatch(GET_USER, res.data));
        dispatch(apiDispatch(GET_USER_PENDING, false));
      })
      .catch((error) => {
        dispatch(apiDispatch(LOGGEDINORNOT, false));
        dispatch(apiDispatch(GET_USER_PENDING, false));

        dispatch(userErrorDispatch(error));
      });
  };
};

export const GoogleLoginFtn = (data) => {
  let url = googleLogin;
  return (dispatch) => {
    apiClient
      .post(url, data)
      .then((res) => {
        dispatch(apiDispatch(SET_TOKEN, res.data.key));
        dispatch(apiDispatch(LOGGEDINORNOT, true));
        dispatch(getUser());
        toast.success("Logged In Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        Cookies.set("token", res.data.key, { expires: 7 });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (
            error.response.data &&
            error.response.data.non_field_errors &&
            error.response.data.non_field_errors.length > 0 &&
            error.response.data.non_field_errors[0] ===
              "User is already registered with this e-mail address."
          ) {
            toast.error("user already registered with facebook.");
          }
        }
        dispatch(userErrorDispatch(error));
      });
  };
};

export const FacebookLoginFtn = (data) => {
  let url = facebookLogin;
  return (dispatch) => {
    apiClient
      .post(url, data)
      .then((res) => {
        dispatch(apiDispatch(SET_TOKEN, res.data.key));
        dispatch(apiDispatch(LOGGEDINORNOT, true));
        dispatch(getUser());
        toast.success("Logged In Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        Cookies.set("token", res.data.key, { expires: 7 });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (
            error.response.data &&
            error.response.data.non_field_errors &&
            error.response.data.non_field_errors.length > 0 &&
            error.response.data.non_field_errors[0] ===
              "User is already registered with this e-mail address."
          ) {
            toast.error("user already registered with google.");
          }
        }
        dispatch(userErrorDispatch(error));
      });
  };
};

export const LogOut = () => {
  return (dispatch) => {
    const url = logout;
    apiClient.post(url).then((res) => {
      dispatch(apiDispatch(LOGGEDINORNOT, false));
    });
  };
};

export const getInvitations = () => {
  const url = getInvites;
  return (dispatch) => {
    apiClient.get(url).then((res) => {
      dispatch(apiDispatch(GET_INVITATION, res.data));
    });
  };
};
