import { IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import MicOffIcon from "@material-ui/icons/MicOff";
import Avatar from "@material-ui/core/Avatar";
import Fade from "@material-ui/core/Fade";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import WebSocketInstance from "../../helper/WebsocketService";
import { useSelector } from "react-redux";
import BlockIcon from "@material-ui/icons/Block";
import { toast } from "react-toastify";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import FlashOffIcon from "@material-ui/icons/FlashOff";

const useStyles = makeStyles((theme) => ({
  responsive: () => ({
    float: "left",
    display: "flex",
    alignItems: "center",
    transition: "width 0.5s, height 0.5s",
  }),
  videoTop: {
    background: theme.palette.background.paper,
  },
  micOff: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  videoOff: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "min(50%, 10rem)",
    height: "min(50%, 10rem)",
    fontSize: "3rem",
  },
  hoverDiv: {
    position: "absolute",
    zIndex: 3,
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
  remove: {
    color: "white",
    "&:disabled": { color: "#444" },
  },
  name: {
    position: "absolute",
    bottom: "0.5rem",
    left: "1rem",
    color: "white",
  },
}));

const Video = React.forwardRef(
  (
    {
      peer,
      muted,
      size,
      rows,
      isUserVideo,
      user,
      isSharingScreen,
      pinnedUser,
      setPinnedUser,
    },
    ref
  ) => {
    const localRef = useRef(null);
    const currentRef = ref || localRef;
    const userId = user.pk || user.id;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const isCreator = useSelector((state) => state.roomReducer.isUserCreator);
    const invitedUsers = useSelector(
      (state) => state.roomReducer.currentRoom.invited_users
    );
    const mangoRef = useRef(null);
    const [videoWidth, setVideoWidth] = React.useState();
    const [videoHeight, setVideoHeight] = React.useState();

    const resizeObserver = new ResizeObserver((entries) => {
      let newWidth, newHeight;
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          newWidth =
            (entry.contentRect.width * 9) / 16 < entry.contentRect.height
              ? 0.95 * entry.contentRect.width
              : (0.95 * entry.contentRect.height * 16) / 9;
          newHeight =
            (entry.contentRect.width * 9) / 16 > entry.contentRect.height
              ? 0.95 * entry.contentRect.height
              : (0.95 * entry.contentRect.width * 9) / 16;
        }
      }
      setVideoWidth(newWidth);
      setVideoHeight(newHeight);
    });
    useEffect(() => {
      resizeObserver.observe(mangoRef.current);
    }, []);
    let initials =
      (user.first_name ? user.first_name[0].toUpperCase() : "") +
      (user.last_name ? user.last_name[0].toUpperCase() : "");
    let fullName = user.first_name + " " + user.last_name;
    fullName = fullName.trim();
    if (isUserVideo) fullName = "You";

    useEffect(() => {
      if (peer) {
        peer.on("stream", (stream) => {
          currentRef.current.srcObject = stream;
        });
      }
    }, []);
    const removeUser = (e) => {
      e.stopPropagation();
      if (!isCreator || isUserVideo || !open) return;
      WebSocketInstance.sendMessage("user kick", { userID: user.id });
    };
    const blockUser = (e) => {
      e.stopPropagation();
      if (!isCreator || isUserVideo || !open) return;
      if (invitedUsers.some((el) => el.id === user.id)) {
        toast.error("user is invited. first remove the invitation");
      } else {
        WebSocketInstance.sendMessage("user block", { userID: user.id });
      }
    };

    return (
      <div
        className={classes.responsive}
        ref={mangoRef}
        style={{
          width: `${
            pinnedUser === userId ? 100 : pinnedUser === -1 ? 100 / size - 2 : 0
          }%`,
          height: `${
            pinnedUser === userId ? 100 : pinnedUser === -1 ? 100 / rows - 2 : 0
          }%`,
        }}
      >
        <div
          className={classes.videoTop}
          style={{
            width: videoWidth,
            height: videoHeight,
            position: "relative",
            overflow: "hidden",
            margin: "auto",
            borderRadius: "1rem",
          }}
        >
          <video
            style={{
              objectFit: "contain",
              transform: isUserVideo && !isSharingScreen ? "scaleX(-1)" : 1,
              position: "absolute",
              top: "0",
              left: "0",
              display: user.videoOn ? "block" : "none",
            }}
            playsInline
            width="100%"
            height="100%"
            autoPlay
            muted={muted}
            ref={currentRef}
            onClick={() => {}}
            onMouseEnter={() => {
              setOpen(true);
            }}
            onTouchEnd={() => {
              setOpen((o) => !o);
            }}
          />
          {open && (
            <Fade in={open}>
              <div
                className={classes.hoverDiv}
                onMouseLeave={() => {
                  setOpen(false);
                }}
                onTouchEnd={() => {
                  setOpen((o) => !o);
                }}
              >
                <div
                  style={{
                    opacity: 0.6,
                    background: "black",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    title={
                      pinnedUser === userId ? "remove pin" : "pin the user"
                    }
                  >
                    <IconButton
                      className={classes.remove}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!open) return;
                        if (pinnedUser === userId) {
                          setPinnedUser(-1);
                        } else {
                          setPinnedUser(userId);
                        }
                      }}
                    >
                      {pinnedUser === userId ? (
                        <FlashOffIcon fontSize="large" />
                      ) : (
                        <FlashOnIcon fontSize="large" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="remove user">
                    <IconButton
                      className={classes.remove}
                      onClick={removeUser}
                      disabled={!isCreator || isUserVideo}
                    >
                      <RemoveCircleOutlineIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Block user">
                    <IconButton
                      className={classes.remove}
                      onClick={blockUser}
                      disabled={!isCreator || isUserVideo}
                    >
                      <BlockIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="p" className={classes.name}>
                    {fullName}
                  </Typography>
                </div>
              </div>
            </Fade>
          )}
          {!user.audioOn && (
            <IconButton className={classes.micOff}>
              <MicOffIcon />
            </IconButton>
          )}
          {!user.videoOn && (
            <div
              className={classes.videoOff}
              onMouseEnter={() => {
                setOpen(true);
              }}
              onTouchEnd={() => {
                setOpen((o) => !o);
              }}
            >
              <Avatar className={classes.avatar}>{initials}</Avatar>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Video;
