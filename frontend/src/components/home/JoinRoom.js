import { Button, Paper, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import { JOIN_ROOM_TYPE } from "../../constants";
import { useHistory } from "react-router";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { checkUrl } from "../../helper/helperFunctions";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "calc(100% - 10rem)",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    minHeight: "7rem",
    borderRadius: "2rem",
    padding: "1rem",
    marginTop: "2rem",
  },
  button: {
    margin: theme.spacing(1),
    float: "right",
  },
  row: {
    display: "flex",
    marginTop: "1rem",
  },
}));

const JoinRoom = () => {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [isError, setIsError] = useState("");
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper elevation={3} className={classes.container}>
      <Typography variant={isMobile ? "h5" : "h2"} align="center">
        Join Room
      </Typography>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Enter code or link of the room"
          value={roomName}
          error={Boolean(isError)}
          helperText={isError}
          onChange={(value) => {
            const newName = value.target.value;
            setRoomName(newName);
            if (isError) setIsError("");
          }}
          style={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
          onClick={() => {
            const result = checkUrl(roomName);
            if (!result.is_correct) {
              setIsError(result.error_message);
            } else {
              let path = "";
              if (result.type === JOIN_ROOM_TYPE.URL) {
                const url = new URL(roomName);
                path = url.pathname;
              } else {
                path = `room/${roomName}`;
              }
              history.push(path);
            }
          }}
        >
          Join
        </Button>
      </div>
    </Paper>
  );
};

export default JoinRoom;
