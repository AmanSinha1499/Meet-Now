import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import { validateEmailAddress } from "../../helper/helperFunctions";
import { inviteUser, removeInviteUser } from "../../redux/actions/roomActions";
import { useParams } from "react-router";

const InviteModal = ({ open, setOpen }) => {
  const { roomID } = useParams();
  const invitedUsers = useSelector(
    (state) => state.roomReducer.currentRoom.invited_users || []
  );
  const [email, setEmail] = useState({
    str: "",
    err_message: "",
  });
  const dispatch = useDispatch();
  const invite = () => {
    const str = email.str;
    let err_message = "";
    if (str.length === 0) err_message = "email can't be empty";
    else if (!validateEmailAddress(str)) err_message = "email not valid";
    else {
      dispatch(
        inviteUser(roomID, {
          invitee: str,
        })
      );
      setEmail({ str: "", err_message: "" });
    }
    if (err_message.length) {
      setEmail({ str, err_message });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen((o) => !o);
      }}
    >
      <DialogTitle>{"Invite people"}</DialogTitle>
      <DialogContent>
        {invitedUsers.map((user, idx) => (
          <Row key={idx} style={{ alignItems: "center" }}>
            <Col>{user.email}</Col>
            <IconButton
              onClick={() => {
                dispatch(removeInviteUser(roomID, { invitee: user.email }));
              }}
            >
              <CloseIcon />
            </IconButton>
          </Row>
        ))}
        <TextField
          error={email.err_message.length > 0}
          value={email.str}
          onChange={(value) => {
            const email = value.target.value;
            setEmail({ str: email, err_message: "" });
          }}
          helperText={email.err_message}
        />
        <IconButton onClick={invite}>
          <SendIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
