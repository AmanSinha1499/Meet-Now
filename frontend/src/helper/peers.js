import Peer from "simple-peer";
import WebsocketService from "./WebsocketService";

export function createPeer(userToSignal, callerID, stream) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });
  peer.on("signal", (signal) => {
    WebsocketService.sendMessage("sending signal", {
      userToSignal,
      callerID,
      signal,
    });
  });
  return peer;
}

export function addPeer(incomingSignal, callerID, stream) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });
  peer.on("signal", (signal) => {
    WebsocketService.sendMessage("returning signal", { signal, callerID });
  });
  peer.signal(incomingSignal);
  return peer;
}
