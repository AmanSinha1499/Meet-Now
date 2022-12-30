/* user */
export const googleLogin = "user/rest-auth/google/";
export const facebookLogin = "user/rest-auth/facebook/";
export const get_user = "user/rest-auth/user/";
export const logout = "user/rest-auth/logout/";

//  Room
export const create_room = "room/";
export const get_room = "room/";
export const getInvites = "room/invitations/"
export const invite = (id) => `room/${id}/invite/`;
export const isUserCreator = (id) => `room/${id}/isUserCreator/`;
export const removeInvite = (id) => `room/${id}/removeInvite/`;