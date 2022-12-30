import { DEMO_CODE, DEMO_PATH, JOIN_ROOM_TYPE } from "../constants";

export const apiDispatch = (actionType = "", data) => {
  return {
    type: actionType,
    payload: data,
  };
};

export const apiError = (errType) => (error) => {
  return {
    type: errType,
    error,
  };
};

export const getUrlFromCode = (code) => {
  const baseUrl = window.location;
  const url = new URL(`/room/${code}/`, baseUrl);
  return url;
};

export const getUniqueArray = (array, key) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    if (!map.has(item[key])) {
      map.set(item[key], true); // set any value to Map
      result.push({ ...item });
    }
  }
  return result;
};

export const validateEmailAddress = (emailString) => {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    !!emailString &&
    typeof emailString === "string" &&
    emailString.match(emailRegex)
  );
};

export const checkUrl = (url) => {
  const result = {
    type: JOIN_ROOM_TYPE.URL,
    is_correct: true,
    error_message: "",
  };
  try {
    const new_url = new URL(url);
    if (new_url.hostname !== window.location.hostname) {
      result.is_correct = false;
      result.error_message = `host of url should be ${window.location.hostname}`;
      return result;
    }
    const path = new_url.pathname;
    const demo_url = new URL(DEMO_PATH);
    if (path.length < demo_url.pathname.length) {
      result.is_correct = false;
      result.error_message = "url path too short";
      return result;
    } else if (path.length > demo_url.pathname.length) {
      result.is_correct = false;
      result.error_message = "url path too long";
      return result;
    }
  } catch {
    result.type = JOIN_ROOM_TYPE.CODE;
    if (url.length < DEMO_CODE.length) {
      result.is_correct = false;
      result.error_message = "code is too short";
      return result;
    }
    if (url.length > DEMO_CODE.length) {
      result.is_correct = false;
      result.error_message = "code is too long";
      return result;
    }
  }
  return result;
};
