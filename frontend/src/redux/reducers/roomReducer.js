import {
  CREATE_ROOM,
  GET_ROOM,
  GET_ROOMS,
  SET_MESSAGES,
  SET_USER_IS_CREATOR,
  TOGGLE_USER_AUDIO,
  TOGGLE_USER_VIDEO,
} from "../actions/roomActionTypes";

const initialPendingState = {
  createRoomPending: false,
  getRoomsPending: false,
};

const initialState = {
  ...initialPendingState,
  rooms: [],
  currentRoom: {},
  roomMessages: [],
  userVideo: {
    audioOn: true,
    videoOn: true,
  },
  isUserCreator: false,
};

export default function roomReducer(
  state = initialState,
  { type, payload, error }
) {
  switch (type) {
    case CREATE_ROOM:
      return {
        ...state,
        currentRoom: payload,
        rooms: [payload, ...state.rooms],
      };
    case GET_ROOMS:
      return { ...state, rooms: payload };
    case TOGGLE_USER_AUDIO:
      return {
        ...state,
        userVideo: { ...state.userVideo, audioOn: !state.userVideo.audioOn },
      };
    case TOGGLE_USER_VIDEO:
      return {
        ...state,
        userVideo: { ...state.userVideo, videoOn: !state.userVideo.videoOn },
      };
    case GET_ROOM:
      return { ...state, currentRoom: payload };
    case SET_USER_IS_CREATOR:
      return { ...state, isUserCreator: payload };
    case SET_MESSAGES:
      return { ...state, roomMessages: payload };
    default:
      return state;
  }
}
