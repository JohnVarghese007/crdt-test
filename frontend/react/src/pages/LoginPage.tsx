import { useState } from "react";
import { api } from "../lib/api";

export default function LoginPage({ onLogin }: { onLogin: (data: any) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }).catch(() => ({ token: null }));

    setIsSubmitting(false);

    if (data.token) {
      onLogin(data);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    const registerData = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }).catch(() => ({ error: "Registration failed" }));

    if (registerData.error) {
      setIsSubmitting(false);
      setError(registerData.error);
      return;
    }

    const loginData = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }).catch(() => ({ token: null }));

    setIsSubmitting(false);

    if (loginData.token) {
      onLogin(loginData);
      return;
    }

    setMode("login");
    setConfirmPassword("");
    setMessage("Account created. Please log in.");
  }

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setMessage("");
    setConfirmPassword("");
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-side-panel">
          <p className="auth-eyebrow">Realtime Workspace</p>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="auth-subtext">
            {mode === "login"
              ? "Continue where you left off. Your collaborative board is waiting."
              : "Get started in seconds and begin writing to your shared board."}
          </p>
          <ul className="auth-feature-list">
            <li>Secure session login</li>
            <li>Fast board autosave flow</li>
            <li>Simple, distraction-free editor</li>
          </ul>
        </aside>

        <section className="auth-card" aria-label="Authentication form">
          <div className="auth-mode-toggle" role="tablist" aria-label="Auth mode switch">
            <button
              type="button"
              className={`auth-mode-btn ${mode === "login" ? "is-active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`auth-mode-btn ${mode === "register" ? "is-active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
          <p className="auth-card-subtitle">
            {mode === "login"
              ? "Use your account to access your dashboard."
              : "Pick a username and password to get started."}
          </p>

          <label className="auth-field">
            <span>Username</span>
            <input
              placeholder="e.g. jane"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === "register" && (
            <label className="auth-field">
              <span>Confirm Password</span>
              <input
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button
            className="auth-submit-btn"
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>

          <p className="auth-helper-text">
            {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register here" : "Sign in here"}
            </button>
          </p>
        </section>
      </section>
    </main>
  );
}
