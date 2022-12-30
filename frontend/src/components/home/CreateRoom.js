import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewRoom } from "../../redux/actions/roomActions";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "calc(100% - 10rem)",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    minHeight: "7rem",
    borderRadius: "2rem",
    padding: "1rem",
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

function CreateRoom() {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper elevation={3} className={classes.container}>
      <Typography variant={isMobile ? "h5" : "h2"} align="center">
        Create New Room
      </Typography>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Room Name"
          value={roomName}
          error={isError}
          required
          onChange={(value) => {
            const newName = value.target.value;
            if (newName.length < 100) {
              setRoomName(newName);
            }
            if (isError) setIsError(false);
          }}
          style={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
          onClick={() => {
            if (roomName.length === 0) {
              setIsError(true);
            } else {
              dispatch(
                createNewRoom({
                  room_name: roomName,
                })
              );
              setRoomName("");
            }
          }}
        >
          Create
        </Button>
      </div>
    </Paper>
  );
}

export default CreateRoom;
