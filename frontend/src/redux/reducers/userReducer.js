import {
  GET_USER,
  LOGIN_PENDING,
  SET_TOKEN,
  LOGGEDINORNOT,
  GET_USER_PENDING,
  GET_INVITATION,
} from "../actions/userActionTypes";

const initialPendingState = {
  loginPending: false,
  getUserPending: false,
};

const initialState = {
  ...initialPendingState,
  user: {},
  invitedRooms: [],
  token: "",
  isLoggedIn: false,
};

export default function userReducer(
  state = initialState,
  { type, payload, error }
) {
  switch (type) {
    case SET_TOKEN:
      return { ...state, token: payload };
    case LOGGEDINORNOT:
      return { ...state, isLoggedIn: payload };
    case GET_USER:
      return { ...state, user: payload };
    case LOGIN_PENDING:
      return { ...state, loginPending: payload };
    case GET_USER_PENDING:
      return { ...state, getUserPending: payload };
    case GET_INVITATION:
      return { ...state, invitedRooms: payload };
    default:
      return state;
  }
}
