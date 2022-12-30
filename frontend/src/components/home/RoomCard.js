import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Assignment } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { getUrlFromCode } from "../../helper/helperFunctions";

const RoomCard = ({ room, onDelete }) => {
  const history = useHistory();
  const url = getUrlFromCode(room.id);
  return (
    <Card style={{ borderTop: "1px solid #ccc" }}>
      <CardHeader
        title={room.room_name}
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.push(`/room/${room.id}/`);
        }}
        action={
          <IconButton
            onClick={(e) => {
              onDelete(room.id);
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="p">{url.href}</Typography>
        <CopyToClipboard
          text={url}
          onCopy={() => {
            toast.success("copied to clipboard");
          }}
        >
          <IconButton style={{ float: "right" }}>
            <Assignment />
          </IconButton>
        </CopyToClipboard>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
