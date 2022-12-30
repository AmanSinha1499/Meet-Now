import apiClient from "../../helper/apiclient";
import { toast } from "react-toastify";

import {
  CREATE_ROOM,
  GET_ROOM,
  GET_ROOMS,
  SET_MESSAGES,
  SET_USER_IS_CREATOR,
  TOGGLE_USER_AUDIO,
  TOGGLE_USER_VIDEO,
} from "./roomActionTypes";

import {
  create_room,
  get_room,
  invite,
  isUserCreator,
  removeInvite,
} from "../../config/backend_api";

import { apiDispatch, getUrlFromCode } from "../../helper/helperFunctions";
import { getInvitations } from "./userActions";

export const createNewRoom = (data) => {
  const url = create_room;
  return (dispatch) => {
    apiClient
      .post(url, data)
      .then((res) => {
        dispatch(apiDispatch(CREATE_ROOM, res.data));
        navigator.clipboard.writeText(getUrlFromCode(res.data.id));
        toast.success("copied to clipboard");
      })
      .catch((err) => {
        toast.error(`error occured in creating the room`);
      });
  };
};

export const getRooms = () => {
  const url = get_room;
  return (dispatch) => {
    apiClient
      .get(url)
      .then((res) => {
        dispatch(apiDispatch(GET_ROOMS, res.data));
      })
      .catch((err) => {
        toast.error(`error occured in fetching your rooms`, {});
      });
  };
};

export const deleteRoom = (roomID, fallback) => {
  const url = `${get_room}${roomID}/`;
  return (dispatch, getState) => {
    apiClient.delete(url).then((res) => {
      fallback(roomID);
    });
  };
};

export const getRoom = (roomID) => {
  const url = `${get_room}${roomID}/`;
  return (dispatch) => {
    apiClient.get(url).then((res) => {
      dispatch(apiDispatch(GET_ROOM, res.data));
    });
  };
};

export const toggleAudio = () => {
  return (dispatch) => {
    dispatch(apiDispatch(TOGGLE_USER_AUDIO));
  };
};
export const toggleVideo = () => {
  return (dispatch) => {
    dispatch(apiDispatch(TOGGLE_USER_VIDEO));
  };
};

export const inviteUser = (roomId, data) => {
  const url = invite(roomId);
  return (dispatch) => {
    apiClient
      .post(url, data)
      .then((res) => {
        dispatch(apiDispatch(GET_ROOM, res.data));
        toast.success("user invited");
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };
};

export const removeInviteUser = (roomID, data) => {
  const url = removeInvite(roomID);
  return (dispatch) => {
    apiClient
      .post(url, data)
      .then((res) => {
        dispatch(apiDispatch(GET_ROOM, res.data));
        dispatch(getInvitations());
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };
};

export const getIsUserCreator = (roomId) => {
  const url = isUserCreator(roomId);
  return (dispatch) => {
    apiClient.get(url).then((res) => {
      dispatch(apiDispatch(SET_USER_IS_CREATOR, res.data.isCreator));
    });
  };
};

export const setMessages = (data) => {
  return (dispatch) => {
    dispatch(apiDispatch(SET_MESSAGES, data));
  };
};

export const setNewMessage = (data) => {
  return (dispatch, getState) => {
    const messages = getState().roomReducer.roomMessages;
    dispatch(apiDispatch(SET_MESSAGES, [...messages, data]));
  };
};
