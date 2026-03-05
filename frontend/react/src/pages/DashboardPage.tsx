import { useState } from "react";
import { api } from "../lib/api";

console.log("DASHBOARD mounted");


export default function DashboardPage({ user }: { user: any }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await api("/api/boards/save", {
      method: "POST",
      body: JSON.stringify({ text, userId: user._id })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.username}</h1>

      <textarea
        style={{ width: "100%", height: "200px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleSave} style={{ marginTop: 10 }}>
        Save
      </button>

      {saved && <p>Saved!</p>}
    </div>
  );
}
