import React, { useCallback, useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import WebSocketService from "../../helper/WebsocketService";
import TextField from "@material-ui/core/TextField";
import { Send } from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispatch, useSelector } from "react-redux";
import "./chat.css";
import { setMessages, setNewMessage } from "../../redux/actions/roomActions";
const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: "calc(100vh - 9rem)",
    borderRadius: "1rem",
    top: "5rem",
    right: "12px",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  chatInputContainer: {
    marginTop: "auto",
  },
  chatInput: {
    marginBottom: "2rem",
    "& .MuiFilledInput-root": {
      borderRadius: "50px",
      borderBottom: 0,
      paddingTop: "15px",
      paddingBottom: "15px",
      "&::before": { borderBottom: 0 },
    },
  },
  messageBoxRight: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  messageBoxLeft: {
    background: "#4870df",
    color: theme.palette.background.default,
  },
  messageSender: {
    color: theme.palette.text.primary,
    fontSize: "10px",
  },
}));

const MessageItem = (props) => {
  const owner = useSelector((state) => state.userReducer.user);
  const classes = useStyles();
  let messagePosition =
    owner.pk === props.sender.id
      ? `chatApp__convMessageItem--right`
      : `chatApp__convMessageItem--left`;
  let messageBackground =
    owner.pk === props.sender.id
      ? classes.messageBoxRight
      : classes.messageBoxLeft;
  return (
    <div
      className={"chatApp__convMessageItem " + messagePosition + " clearfix"}
    >
      <div className={`chatApp__convMessageValue ${messageBackground}`}>
        {owner.pk !== props.sender.id && (
          <div className={classes.messageSender}>{props.sender.first_name}</div>
        )}
        <div>{props.message}</div>
      </div>
    </div>
  );
};

const MessageList = React.memo((props) => {
  return (
    <div className={"chatApp__convTimeline"}>
      {props.messages
        .slice(0)
        .reverse()
        .map((messageItem, idx) => (
          <MessageItem
            key={idx}
            sender={messageItem.user}
            message={messageItem.message}
          />
        ))}
    </div>
  );
});

const Chat = ({ open, setOpen }) => {
  const messages = useSelector((state) => state.roomReducer.roomMessages);
  const [currMessage, setCurrMessage] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    WebSocketService.on("receive new message", (data) => {
      dispatch(setNewMessage(data));
    });
    WebSocketService.on("get all messages", (data) => {
      dispatch(setMessages(data.messages));
    });
  }, []);
  const sendMessage = () => {
    WebSocketService.sendMessage("send new message", currMessage);
    setCurrMessage("");
  };

  const onCurrMessageChanged = useCallback((e) => {
    const val = e.target.value;
    setCurrMessage(val);
  }, []);
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton
          onClick={() => {
            setOpen(false);
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <MessageList messages={messages} />
      <div className={classes.chatInputContainer}>
        <TextField
          placeholder="send a message to everyone"
          size="small"
          variant="filled"
          fullWidth
          multiline
          rowsMax={4}
          className={classes.chatInput}
          value={currMessage}
          onChange={onCurrMessageChanged}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {currMessage.length > 0 && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={sendMessage}
                  >
                    <Send />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </div>
    </Drawer>
  );
};

export default Chat;
