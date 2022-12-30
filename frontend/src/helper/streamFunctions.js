export const updateStream = (peersRef, setPeers, userStream) => (track) => {
  for (let key in peersRef.current) {
    peersRef.current[key].peer.replaceTrack(
      userStream.getVideoTracks()[0],
      track,
      userStream
    );
  }
  setPeers({ ...peersRef.current });
  userStream.removeTrack(userStream.getVideoTracks()[0]);
  userStream.addTrack(track);
};

export const switchCamera =
  (peersRef, setPeers, userStream, videoConstraints) =>
  async (currentCameraRef) => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    currentCameraRef.current =
      (currentCameraRef.current + 1) % videoDevices.length;

    const updatedConstraints = {
      ...videoConstraints,
      deviceId: {
        exact: videoDevices[currentCameraRef.current].deviceId,
      },
    };
    videoConstraints = updatedConstraints;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: true,
    });
    updateStream(peersRef, setPeers, userStream)(stream.getVideoTracks()[0]);
  };

export const shareScreen = async (
  peersRef,
  setPeers,
  videoConstraints,
  userStream,
  setIsSharingScreen
) => {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    cursor: true,
  });
  let currTrack = userStream.getVideoTracks()[0];
  let screenTrack = screenStream.getVideoTracks()[0];
  updateStream(peersRef, setPeers, userStream)(screenTrack);
  setIsSharingScreen(true);

  screenTrack.onended = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: true,
    });
    updateStream(peersRef, setPeers, userStream)(currTrack);
    setIsSharingScreen(false);
  };
};
