import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import type { Session } from "./types/session";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <Routes>
      {/* Root: redirect based on session */}
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login route */}
      <Route path="/login" element={<LoginPage onLogin={setSession} />} />

      {/* Protected dashboard route */}
      <Route
        path="/dashboard"
        element={
          session ? (
            <DashboardPage user={session.user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
