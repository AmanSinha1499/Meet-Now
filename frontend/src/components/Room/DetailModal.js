import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const DetailModal = ({ open, setOpen }) => {
  const roomName = useSelector(
    (state) => state.roomReducer.currentRoom.room_name
  );
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen((o) => !o);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Meeting Details"}</DialogTitle>
      <DialogContent>
        <Typography variant="h5">{roomName}</Typography>
        <br></br>
        <Typography variant="p">{"Joining info"}</Typography>
        <DialogContentText id="alert-dialog-description">
          {window.location.href}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => {
            toast.success("copied to clipboard");
          }}
        >
          <Button>Copy link</Button>
        </CopyToClipboard>
      </DialogActions>
    </Dialog>
  );
};

export default DetailModal;
