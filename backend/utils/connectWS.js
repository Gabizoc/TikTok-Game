const { WebSocketServer } = require("ws");

let wss;

function createWSS(server) {
  wss = new WebSocketServer({ server });
  return wss;
}

function getWss() {
  return wss;
}

module.exports = { createWSS, getWss };
