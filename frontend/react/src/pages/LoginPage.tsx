import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";


export default function LoginPage({ onLogin }: { onLogin: (data: any) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  if (data.token) {
    onLogin(data);          // sets session in App
    navigate("/dashboard"); // go to dashboard
  } else {
    alert("Invalid credentials");
  }
}


  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
