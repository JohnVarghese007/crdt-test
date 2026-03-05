import { WebSocketServer } from "ws";

export const initSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
      // broadcast CRDT updates to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(msg);
        }
      });
    });
  });
};
