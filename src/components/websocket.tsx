import { createRoot } from "solid-js";

const createWS = () => {
  const websocket = new WebSocket("ws://192.168.64.3:8080/ws")
  return websocket
}

export default createRoot(createWS)
