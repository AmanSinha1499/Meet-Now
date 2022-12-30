import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import CreateRoom from "../components/home/CreateRoom";
import Invitations from "../components/home/Invitations";
import JoinRoom from "../components/home/JoinRoom";
import RoomList from "../components/home/RoomsList";
import { getRooms } from "../redux/actions/roomActions";
import { getInvitations } from "../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  component: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    gap: "1rem",
  },
  leftComp: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    gap: "1rem",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
    overflowY: "auto",
    backgroundColor: theme.palette.background.default,
  },
}));

const HomeView = () => {
  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRooms());
    dispatch(getInvitations());
    if (location.state && location.state.message) {
      if (location.state.type === "error") {
        toast.error(location.state.message);
      }
      window.history.replaceState(null, "");
    }
  }, []);

  return (
    <Container maxWidth={false} className={classes.container}>
      <div className={[classes.leftComp]}>
        <CreateRoom />

        <Invitations />
      </div>
      <div className={classes.component}>
        <JoinRoom />
        <RoomList />
      </div>
    </Container>
  );
};
export default HomeView;
