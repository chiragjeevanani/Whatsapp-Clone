// Client-side Socket.io wrapper helper class
// Will load the Socket.io-client library dynamically or directly when npm package is installed.

class SocketHelper {
  constructor() {
    this.socket = null;
  }

  connect(url, options = {}) {
    console.log("Connecting to WebSocket gateway at:", url);
    // placeholder: this.socket = io(url, options);
  }

  disconnect() {
    if (this.socket) {
      // this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export const socketClient = new SocketHelper();
