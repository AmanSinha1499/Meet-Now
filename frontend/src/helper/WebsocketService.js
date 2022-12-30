class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.fallback = null;
    this.forcedClose = false;
  }

  connect(chatroom_url, fallback = () => {}) {
    this.forcedClose = false;
    this.fallback = fallback;
    this.socketRef = new WebSocket(chatroom_url);

    this.socketRef.onopen = () => {
      console.log("websocket open");
    };

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = (e) => {
      console.debug(e);
    };

    this.socketRef.onclose = (e) => {
      console.log(e);
      if (e.code === 4000) {
        this.fallback(e);
      } else if (this.forcedClose) {
        console.log("websocket closed");
      } else {
        console.log("websockets closed lets reopen");
        setTimeout(() => {
          this.connect(chatroom_url, fallback(e));
        }, 5000);
      }
    };
  }

  close(code, reason) {
    // Default CLOSE_NORMAL code
    if (typeof code == "undefined") {
      code = 1000;
    }
    this.forcedClose = true;
    if (this.socketRef) {
      this.socketRef.close(code, reason);
    }
  }
  on(command, func) {
    this.callbacks[command] = func;
  }
  del(command) {
    if (this.callbacks[command]) {
      delete this.callbacks[command];
    }
  }

  socketNewMessage(received_data) {
    const parsedData = JSON.parse(received_data);
    const { command, data } = parsedData;
    console.log(parsedData);
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (this.callbacks[command]) {
      this.callbacks[command](data);
    }
  }

  sendMessage(type, data) {
    try {
      console.log(type, data);
      this.waitForConnection(
        function () {
          this.socketRef.send(JSON.stringify({ type, data }));
        }.bind(this),
        1000
      );
    } catch (err) {
      console.log(err.message);
    }
  }
  refresh() {
    if (this.socketRef) {
      this.socketRef.close();
    }
  }

  state() {
    return this.socketRef.readyState;
  }
  waitForConnection(callback, interval) {
    if (this.state() === 1) {
      callback();
    } else {
      var that = this;
      // optional: implement backoff for interval here
      setTimeout(function () {
        that.waitForConnection(callback, interval);
      }, interval);
    }
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
