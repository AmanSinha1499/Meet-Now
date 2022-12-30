import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeInviteUser } from "../../redux/actions/roomActions";
import RoomCard from "./RoomCard";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "calc(100% - 10rem)",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    minHeight: "7rem",
    borderRadius: "2rem",
    maxHeight: "35rem",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  },
  header: {
    background: theme.palette.background.paper,
    position: "sticky",
    top: 0,
    zIndex: 1,
    paddingBottom: "1rem",
  },
}));

const Invitations = () => {
  const rooms = useSelector((state) => state.userReducer.invitedRooms);
  const classes = useStyles();
  const dispatch = useDispatch();
  const myEmail = useSelector((state) => state.userReducer.user.email);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography
        variant={isMobile ? "h5" : "h2"}
        align="center"
        className={classes.header}
      >
        Your Invitations
      </Typography>
      {rooms.length > 0 &&
        rooms.map((el, idx) => (
          <RoomCard
            key={idx}
            room={el}
            onDelete={(roomID) => {
              dispatch(removeInviteUser(roomID, { invitee: myEmail }));
            }}
          />
        ))}
      {rooms.length === 0 && (
        <Typography className="my-5" align="center">
          No invititations
        </Typography>
      )}
    </Paper>
  );
};

export default Invitations;
