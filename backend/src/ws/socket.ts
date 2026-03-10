import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import * as Y from "yjs";
import Board from "../models/Board";

type BoardState = {
  doc: Y.Doc;
  clients: Set<WebSocket>;
  persistTimer: NodeJS.Timeout | null;
};

const boards = new Map<string, BoardState>();

function getBoardId(req: IncomingMessage) {
  const url = new URL(req.url || "/", "http://localhost");
  return url.searchParams.get("boardId") || "default-board";
}

async function persistBoard(boardId: string, state: BoardState) {
  const update = Buffer.from(Y.encodeStateAsUpdate(state.doc));
  await Board.updateOne(
    { boardId },
    {
      $set: {
        snapshot: update.toString("base64"),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
}

function schedulePersist(boardId: string, state: BoardState) {
  if (state.persistTimer) {
    clearTimeout(state.persistTimer);
  }

  state.persistTimer = setTimeout(() => {
    persistBoard(boardId, state).catch((err) => {
      console.error("Failed to persist board", boardId, err);
    });
    state.persistTimer = null;
  }, 400);
}

async function getOrCreateBoardState(boardId: string) {
  const existing = boards.get(boardId);
  if (existing) {
    return existing;
  }

  const doc = new Y.Doc();
  const state: BoardState = {
    doc,
    clients: new Set(),
    persistTimer: null
  };

  const board = await Board.findOne({ boardId }).lean();
  if (board?.snapshot) {
    try {
      const snapshotBuffer = Buffer.from(board.snapshot, "base64");
      Y.applyUpdate(doc, new Uint8Array(snapshotBuffer));
    } catch (err) {
      console.error("Invalid snapshot for board", boardId, err);
    }
  }

  doc.on("update", () => {
    schedulePersist(boardId, state);
  });

  boards.set(boardId, state);
  return state;
}

export const initSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const boardId = getBoardId(req);
    const state = await getOrCreateBoardState(boardId);
    state.clients.add(ws);

    // Send current CRDT snapshot to new client.
    ws.send(Buffer.from(Y.encodeStateAsUpdate(state.doc)));

    ws.on("message", (msg, isBinary) => {
      if (!isBinary) {
        return;
      }

      const update = msg instanceof Buffer ? msg : Buffer.from(msg as ArrayBuffer);
      Y.applyUpdate(state.doc, new Uint8Array(update), "remote-client");

      state.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(update);
        }
      });
    });

    ws.on("close", () => {
      state.clients.delete(ws);
      if (state.clients.size === 0) {
        persistBoard(boardId, state).catch((err) => {
          console.error("Failed to persist board on close", boardId, err);
        });
      }
    });
  });
};
