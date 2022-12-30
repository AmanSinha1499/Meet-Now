import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebsocketService from "../helper/WebsocketService";
import { useParams } from "react-router";
import Video from "../components/common/Video";
import Controls from "../components/Room/Controls";
import { split } from "../helper/utilFunctions";
import Chat from "../components/Room/Chat";
import { makeStyles } from "@material-ui/core";
import {
  all_users_listener,
  user_joined_listener,
  user_left_listener,
  receive_returned_signal,
  videoMediaListener,
  audioMediaListener,
  getPermissionRequestListener,
  getMediaListener,
} from "../helper/socketListeners";
import JoinModal from "../components/Room/JoinModal";
import { shareScreen, switchCamera } from "../helper/streamFunctions";
import { getIsUserCreator, getRoom } from "../redux/actions/roomActions";

let videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    background: theme.palette.background.default,
  },
}));

const socketFunctions = (
  peersRef,
  myID,
  stream,
  setPeers,
  isUserAudioOn,
  isUserVideoOn,
  setWaitingUsers
) => {
  WebsocketService.on(
    "all users",
    all_users_listener(peersRef, myID, stream, setPeers)
  );
  WebsocketService.on(
    "user joined",
    user_joined_listener(
      myID,
      peersRef,
      stream,
      setPeers,
      isUserAudioOn,
      isUserVideoOn
    )
  );

  WebsocketService.on(
    "receiving returned signal",
    receive_returned_signal(myID, peersRef, isUserAudioOn, isUserVideoOn)
  );

  WebsocketService.on(
    "user left",
    user_left_listener(myID, peersRef, setPeers)
  );

  WebsocketService.on("videoMedia", videoMediaListener(peersRef, setPeers));

  WebsocketService.on("audioMedia", audioMediaListener(peersRef, setPeers));
  WebsocketService.on(
    "user want to join",
    getPermissionRequestListener(myID, setWaitingUsers)
  );
  WebsocketService.on("get media", getMediaListener(peersRef, setPeers));
};

const resetSocketFunctions = () => {
  WebsocketService.del("all users");
  WebsocketService.del("user joined");
  WebsocketService.del("receiving returned signal");
  WebsocketService.del("user left");
};

const Room = () => {
  const { roomID } = useParams();
  const [peers, setPeers] = useState({});
  const userVideo = useRef();
  const peersRef = useRef({});
  const myID = useSelector((state) => state.userReducer.user.pk);
  const [userStream, setUserStream] = useState();
  const currentCameraRef = useRef(0);
  let sizeMap = split(Object.keys(peers).length + 1);
  const [chatOpen, setChatOpen] = useState(false);
  const isUserAudioOn = useSelector(
    (state) => state.roomReducer.userVideo.audioOn
  );
  const isUserVideoOn = useSelector(
    (state) => state.roomReducer.userVideo.videoOn
  );
  const classes = useStyles();
  const me = useSelector((state) => state.userReducer.user);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const dispatch = useDispatch();
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [pinnedUser, setPinnedUser] = useState(-1);

  const [isJoinedRoom, setIsJoinedRoom] = useState(false);

  const setCameraStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setUserStream(stream);
    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  };

  const socketConnect = async () => {
    await setCameraStream();
    WebsocketService.sendMessage("get all messages", "");
  };

  useEffect(() => {
    dispatch(getIsUserCreator(roomID));
    dispatch(getRoom(roomID));
    socketConnect();
  }, []);

  useEffect(() => {
    if (isJoinedRoom) {
      socketFunctions(
        peersRef,
        myID,
        userStream,
        setPeers,
        isUserAudioOn,
        isUserVideoOn,
        setWaitingUsers
      );
    }
  }, [isJoinedRoom, userStream, isUserAudioOn, isUserVideoOn, myID]);

  useEffect(() => {
    let userStreamRef = userStream;
    return () => {
      if (userStreamRef) {
        userStreamRef.getVideoTracks().forEach((track) => {
          track.stop();
        });
        userStreamRef.getAudioTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [userStream]);

  useEffect(() => {
    if (userStream) {
      userStream.getAudioTracks()[0].enabled = isUserAudioOn;
      if (WebsocketService.state() === 1) {
        WebsocketService.sendMessage("audioMedia", {
          userID: myID,
          audioOn: isUserAudioOn,
        });
      }
    }
  }, [userStream, isUserAudioOn, myID]);

  useEffect(() => {
    if (isJoinedRoom) {
      WebsocketService.sendMessage("join room", roomID);
    } else {
      resetSocketFunctions();
      for (let key in peersRef.current) {
        peersRef.current[key].peer.destroy();
      }
      WebsocketService.sendMessage("user left","")
      peersRef.current = {};
      setPeers({});
    }
  }, [isJoinedRoom]);

  useEffect(() => {
    if (userStream) {
      userStream.getVideoTracks()[0].enabled = isUserVideoOn;
      if (WebsocketService.state() === 1) {
        WebsocketService.sendMessage("videoMedia", {
          userID: myID,
          videoOn: isUserVideoOn,
        });
      }
    }
  }, [userStream, isUserVideoOn, myID]);

  useEffect(() => {
    sizeMap = split(Object.keys(peers).length + 1);
  }, [peers]);

  const leaveMeet = () => {
    setIsJoinedRoom(false);
  };

  return (
    <div className={classes.container}>
      <div
        style={{
          display: "flex",
          width: "100%",
          maxHeight: "calc(100vh - 7rem)",
          margin: "auto",
          flexGrow: "1",
          flexWrap: "wrap",
        }}
      >
        <Video
          muted
          ref={userVideo}
          user={{ ...me, videoOn: isUserVideoOn, audioOn: isUserAudioOn }}
          autoPlay
          playsInline
          size={sizeMap[1]}
          rows={sizeMap["rows"]}
          isUserVideo
          isSharingScreen={isSharingScreen}
          pinnedUser={pinnedUser}
          setPinnedUser={setPinnedUser}
        />
        {Object.values(peers).map((item, index) => {
          return (
            <Video
              key={index}
              peer={item.peer}
              user={item.user}
              size={sizeMap[index + 2]}
              rows={sizeMap["rows"]}
              pinnedUser={pinnedUser}
              setPinnedUser={setPinnedUser}
            />
          );
        })}
      </div>
      <JoinModal
        waitingUsers={waitingUsers}
        setWaitingUsers={setWaitingUsers}
      />
      <Controls
        switchc={() => {
          switchCamera(
            peersRef,
            setPeers,
            userStream,
            videoConstraints
          )(currentCameraRef);
        }}
        shareScreen={() => {
          shareScreen(
            peersRef,
            setPeers,
            videoConstraints,
            userStream,
            setIsSharingScreen
          );
        }}
        toggleChat={() => {
          setChatOpen((open) => !open);
        }}
        isJoinedRoom={isJoinedRoom}
        setIsJoinedRoom={setIsJoinedRoom}
        leaveMeet={leaveMeet}
      />
      <Chat open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
};

export default Room;
