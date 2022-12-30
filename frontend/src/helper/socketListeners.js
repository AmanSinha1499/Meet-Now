import { toast } from "react-toastify";
import WebsocketService from "./WebsocketService";
import { getFullName } from "../helper/utilFunctions";
import { getUniqueArray } from "./helperFunctions";
import { addPeer, createPeer } from "./peers";

export const all_users_listener =
  (peersRef, myID, stream, setPeers) => (users) => {
    peersRef.current = {};
    const temp = {};
    users.forEach((user) => {
      if (myID !== user.id) {
        const peer = createPeer(user.id, myID, stream);

        peersRef.current[user.id] = { user, peer };
        temp[user.id] = {
          user: user,
          peer: peer,
        };
      }
    });
    setPeers(temp);
  };

export const user_joined_listener =
  (myID, peersRef, stream, setPeers, isUserAudioOn, isUserVideoOn) =>
  (payload) => {
    const user = payload.callerUser;
    if (payload.usable_id === myID) {
      const peer = addPeer(payload.signal, user.id, stream);
      peersRef.current[user.id] = { user, peer };
      setPeers((peers) => ({
        ...peers,
        [user.id]: {
          user: user,
          peer: peer,
        },
      }));
      toast.info(`${getFullName(user.first_name, user.last_name)} joined`);
    }
  };

export const receive_returned_signal =
  (myID, peersRef, isUserAudioOn, isUserVideoOn) => (payload) => {
    if (payload.usable_id === myID) {
      const { peer } = peersRef.current[payload.id];
      peer.signal(payload.signal);

      WebsocketService.sendMessage("audioMedia", {
        userID: myID,
        audioOn: isUserAudioOn,
      });
      WebsocketService.sendMessage("videoMedia", {
        userID: myID,
        videoOn: isUserVideoOn,
      });
      WebsocketService.sendMessage("get media", "");
    }
  };

export const user_left_listener = (myID, peersRef, setPeers) => (payload) => {
  const user = payload.user;
  if (peersRef.current[user.id]) {
    peersRef.current[user.id].peer.destroy();
  }
  delete peersRef.current[user.id];
  setPeers((peers) => {
    const { [payload.user.id]: remove, ...rest } = peers;
    return rest;
  });
};

export const videoMediaListener = (peersRef, setPeers) => (payload) => {
  const userID = payload.userID;
  if (peersRef.current[userID]) {
    peersRef.current[userID].user.videoOn = payload.videoOn;
    setPeers((peers) => {
      const { user, peer } = peers[userID];
      return {
        ...peers,
        [userID]: { peer, user: { ...user, videoOn: payload.videoOn } },
      };
    });
  }
};

export const audioMediaListener = (peersRef, setPeers) => (payload) => {
  const userID = payload.userID;
  if (peersRef.current[userID]) {
    peersRef.current[userID].user.audioOn = payload.audioOn;
    setPeers((peers) => {
      const { user, peer } = peers[userID];
      return {
        ...peers,
        [userID]: { peer, user: { ...user, audioOn: payload.audioOn } },
      };
    });
  }
};

export const getMediaListener = (peersRef, setPeers) => (payload) => {
  for (let key in peersRef.current) {
    if (payload.audio[key]) {
      peersRef.current[key].user.audioOn = payload.audio[key];
    }
    if (payload.video[key]) {
      peersRef.current[key].user.videoOn = payload.video[key];
    }
  }
  setPeers((peers) => {
    for (let key in peers) {
      if (payload.audio[key]) {
        peers[key].user.audioOn = payload.audio[key];
      }
      if (payload.video[key]) {
        peers[key].user.videoOn = payload.video[key];
      }
    }
    return { ...peers };
  });
};

export const getPermissionListener = (myID, setAcceptStatus) => (payload) => {
  if (payload.usable_id === myID) {
    setAcceptStatus(payload.status);
  }
};

export const getPermissionRequestListener =
  (myID, setWaitingUsers) => (payload) => {
    if (payload.usable_id === myID) {
      setWaitingUsers((users) => {
        users.push(payload.user);
        const newUsers = getUniqueArray(users, "id");
        return newUsers;
      });
    }
  };

export const userKickedListener = (myID, history) => (payload) => {
  if (payload.usable_id === myID) {
    history.replace("/", {
      message: "The Organisor removed you from room",
      type: "error",
    });
  }
};

export const userBlockedListener = (myID, history) => (payload) => {
  if (payload.usable_id === myID) {
    history.replace("/", {
      message: "The Organisor blocked you from room",
      type: "error",
    });
  }
};

export const joinMessageListener =
  (setAcceptStatus, setServerMessage) => (message) => {
    setAcceptStatus("message");
    if (message === "creator not available") {
      setServerMessage(
        "The Organisor has not joined the room yet. Please try joining after some time"
      );
    } else if (message === "user blocked") {
      setServerMessage("The Organisor has blocked you.");
    }
  };
