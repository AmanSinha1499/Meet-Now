import { IconButton } from "@material-ui/core";
import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/styles";
import WebSocketInstance from "../../helper/WebsocketService";

const useStyles = makeStyles((theme) => ({
  modal: {
    "&& .modal-content": {
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
  },
}));

const JoinModal = ({ waitingUsers, setWaitingUsers }) => {
  const classes = useStyles();
  const rejectUser = (user) => {
    WebSocketInstance.sendMessage("give join permission status", {
      userID: user.id,
      status: "reject",
    });
    setWaitingUsers((users) => users.filter((el) => el.id !== user.id));
  };
  const acceptUser = (user) => {
    WebSocketInstance.sendMessage("give join permission status", {
      userID: user.id,
      status: "accept",
    });
    setWaitingUsers((users) => users.filter((el) => el.id !== user.id));
  };
  return (
    <Modal
      show={Boolean(waitingUsers.length)}
      onHide={() => {}}
      backdrop="static"
      keyboard={false}
      className={classes.modal}
    >
      <Modal.Header>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {waitingUsers.map((user, idx) => (
          <Row key={idx} style={{ alignItems: "center" }}>
            <Col>{user.first_name} wants to join</Col>
            <IconButton
              onClick={() => {
                rejectUser(user);
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                acceptUser(user);
              }}
            >
              <CheckIcon />
            </IconButton>
          </Row>
        ))}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default JoinModal;
