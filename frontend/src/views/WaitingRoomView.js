import React, { useEffect, useState } from "react";
import WebSocketInstance from "../helper/WebsocketService";
import { useHistory, useParams } from "react-router";
import Room from "./RoomView";
import {
  getPermissionListener,
  joinMessageListener,
  userBlockedListener,
  userKickedListener,
} from "../helper/socketListeners";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/styles";
import { Paper } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.default,
    height: "100%",
    width: "100%",
    position: "relative",
  },
  color: { color: theme.palette.text.primary },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "75vw",
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
    top: "3rem",
  },
}));

const WaitingRoomView = () => {
  const { roomID } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const myID = useSelector((state) => state.userReducer.user.pk);
  const [acceptStatus, setAcceptStatus] = useState("pending");
  const [serverMessage, setServerMessage] = useState("");
  useEffect(() => {
    WebSocketInstance.refresh();
    let protocol = window.location.protocol === "http:" ? "ws" : "wss";
    let host = window.location.hostname.includes("localhost")
      ? "localhost:7000"
      : window.location.hostname;
    WebSocketInstance.connect(
      `${protocol}://${host}/ws/room/${roomID}/`,
      (e) => {
        history.replace("/", {
          message: "the url entered is incorrect.",
          type: "error",
        });
      }
    );
    WebSocketInstance.on(
      "get permission",
      getPermissionListener(myID, setAcceptStatus)
    );
    WebSocketInstance.on(
      "join message",
      joinMessageListener(setAcceptStatus, setServerMessage)
    );
    WebSocketInstance.on("user kicked", userKickedListener(myID, history));
    WebSocketInstance.on("user blocked", userBlockedListener(myID, history));
    return () => {
      WebSocketInstance.close();
    };
  }, []);

  useEffect(() => {
    if (acceptStatus === "reject") {
      history.replace("/", {
        message: "The creator rejected the join request",
        type: "error",
      });
    }
  }, [acceptStatus]);

  return (
    <>
      {acceptStatus === "pending" ? (
        <div className={classes.container}>
          <Paper elevation={3} variant="outlined" className={classes.paper}>
            <Typography
              variant="h2"
              className={classes.color}
              style={{ width: "max-content" }}
            >
              Joining the room
            </Typography>
            <CircularProgress
              className={classes.color}
              style={{ marginLeft: "1rem" }}
            />
          </Paper>
        </div>
      ) : acceptStatus === "accept" ? (
        <Room />
      ) : acceptStatus === "message" ? (
        <div className={classes.container}>
          <Paper elevation={3} variant="outlined" className={classes.paper}>
            <Typography
              variant="h2"
              className={classes.color}
              style={{ width: "max-content" }}
              align="center"
            >
              {serverMessage}
            </Typography>
          </Paper>
        </div>
      ) : null}
    </>
  );
};

export default WaitingRoomView;
