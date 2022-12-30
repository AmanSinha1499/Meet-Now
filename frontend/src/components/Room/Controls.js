import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { red } from "@material-ui/core/colors";
import MicIcon from "@material-ui/icons/Mic";
import CallEndIcon from "@material-ui/icons/CallEnd";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import VideocamOffOutlinedIcon from "@material-ui/icons/VideocamOffOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleAudio, toggleVideo } from "../../redux/actions/roomActions";
import { useHistory } from "react-router";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DetailModal from "./DetailModal";
import InviteModal from "./InviteModal";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ScreenShareOutlinedIcon from "@material-ui/icons/ScreenShareOutlined";
import FlipCameraAndroidIcon from "@material-ui/icons/FlipCameraAndroid";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "3rem",
    flexGrow: 0,
    background: theme.palette.background.default,
  },
  blue: { background: "blue" },
  orange: {
    color: red[500],
  },
  right: { marginRight: "1rem" },
  join: {
    color: theme.palette.background.default,
    background: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.text.primary,
      background: theme.palette.background.default,
    },
  },
}));

const Controls = ({
  switchc,
  shareScreen,
  toggleChat,
  isJoinedRoom,
  setIsJoinedRoom,
  leaveMeet,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAudioOn = useSelector((state) => state.roomReducer.userVideo.audioOn);
  const isVideoOn = useSelector((state) => state.roomReducer.userVideo.videoOn);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const roomName = useSelector(
    (state) => state.roomReducer.currentRoom.room_name
  );
  const isUserCreator = useSelector((state) => state.roomReducer.isUserCreator);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  return (
    <Paper elevation={3} className={classes.container}>
      <Grid
        justify="space-between"
        container
        alignItems="center"
        style={{ height: "100%" }}
      >
        <div>
          <Typography variant="h5" style={{ marginLeft: "1rem" }}>
            {roomName}
          </Typography>
        </div>
        <div>
          <Tooltip title={isAudioOn ? "Mic On" : "Mic off"}>
            <IconButton
              color="inherit"
              onClick={() => {
                dispatch(toggleAudio());
              }}
            >
              {isAudioOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>
          {isJoinedRoom ? (
            <Tooltip title="end call">
              <IconButton color="inherit" onClick={leaveMeet}>
                <CallEndIcon className={classes.orange} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Join the meeting">
              <Button
                onClick={() => {
                  setIsJoinedRoom(true);
                }}
                className={classes.join}
              >
                Join Room
              </Button>
            </Tooltip>
          )}
          <Tooltip title={isVideoOn ? "video on" : "video off"}>
            <IconButton
              color="inherit"
              onClick={() => {
                dispatch(toggleVideo());
              }}
            >
              {isVideoOn ? (
                <VideocamOutlinedIcon />
              ) : (
                <VideocamOffOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>

          {isJoinedRoom && (
            <Tooltip title="share screen">
              <IconButton
                color="inherit"
                onClick={() => {
                  shareScreen();
                }}
              >
                <ScreenShareOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
        {!isMobile && (
          <div className={classes.right}>
            <Tooltip title="switch camera">
              <IconButton
                color="inherit"
                onClick={() => {
                  switchc();
                }}
              >
                <FlipCameraAndroidIcon />
              </IconButton>
            </Tooltip>
            {isUserCreator && isJoinedRoom && (
              <Tooltip title="invite users">
                <IconButton
                  onClick={() => {
                    setInviteModalOpen((o) => !o);
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Meeting Details">
              <IconButton
                onClick={() => {
                  setDetailModalOpen((o) => !o);
                }}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat">
              <IconButton onClick={toggleChat}>
                <MessageOutlinedIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {isMobile && (
          <div className={classes.right}>
            <IconButton
              aria-controls="simple-theme-menu"
              aria-haspopup="true"
              color="inherit"
              className="header-title-button"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id={"controls-menu"}
              keepMounted
              open={isMenuOpen}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem
                onClick={() => {
                  switchc();
                }}
              >
                Switch Camera
              </MenuItem>
              {isUserCreator && isJoinedRoom && (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setInviteModalOpen((o) => !o);
                  }}
                >
                  Invite User
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setDetailModalOpen((o) => !o);
                }}
              >
                Meeting Details
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  toggleChat();
                }}
              >
                Chat
              </MenuItem>
            </Menu>
          </div>
        )}
        {isUserCreator && isJoinedRoom && (
          <InviteModal open={inviteModalOpen} setOpen={setInviteModalOpen} />
        )}
        <DetailModal open={detailModalOpen} setOpen={setDetailModalOpen} />
      </Grid>
    </Paper>
  );
};

export default Controls;
