import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { WS_BASE } from "../lib/api";

console.log("DASHBOARD mounted");


export default function DashboardPage({ user }: { user: any }) {
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Connecting...");
  const isApplyingRemote = useRef(false);
  const yTextRef = useRef<Y.Text | null>(null);

  const boardId = useMemo(() => `board-${user._id}`, [user._id]);

  useEffect(() => {
    const doc = new Y.Doc();
    const yText = doc.getText("content");
    yTextRef.current = yText;

    const ws = new WebSocket(`${WS_BASE}/?boardId=${encodeURIComponent(boardId)}`);
    ws.binaryType = "arraybuffer";

    const applyTextFromDoc = () => {
      isApplyingRemote.current = true;
      setText(yText.toString());
      isApplyingRemote.current = false;
    };

    applyTextFromDoc();

    const handleDocUpdate = (update: Uint8Array, origin: unknown) => {
      applyTextFromDoc();

      if (origin === "remote" || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      ws.send(update);
      setStatusText("Synced");
    };

    doc.on("update", handleDocUpdate);

    ws.onopen = () => {
      setIsConnected(true);
      setStatusText("Connected");
    };

    ws.onmessage = (event) => {
      const update = new Uint8Array(event.data as ArrayBuffer);
      Y.applyUpdate(doc, update, "remote");
      setStatusText("Synced");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setStatusText("Disconnected");
    };

    ws.onerror = () => {
      setStatusText("Connection issue");
    };

    return () => {
      doc.off("update", handleDocUpdate);
      ws.close();
      doc.destroy();
      yTextRef.current = null;
    };
  }, [boardId]);

  function handleTextChange(nextValue: string) {
    setText(nextValue);
    const yText = yTextRef.current;
    if (!yText || isApplyingRemote.current) {
      return;
    }

    yText.doc?.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, nextValue);
    }, "local");
    setStatusText("Saving...");
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Workspace</p>
            <h1>Welcome, {user.username}</h1>
            <p className="dashboard-subtitle">Collaborative CRDT board powered by Y.js.</p>
          </div>
          <div className="dashboard-chip">
            {isConnected ? "Live" : "Offline"} - {statusText}
          </div>
        </header>

        <section className="editor-panel">
          <label htmlFor="boardText" className="editor-label">
            Board Content ({boardId})
          </label>
          <textarea
            id="boardText"
            className="editor-textarea"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Start writing your shared board notes..."
          />

          <div className="editor-actions">
            <p className="save-status">{statusText}</p>
          </div>
        </section>
      </section>
    </main>
  );
}
