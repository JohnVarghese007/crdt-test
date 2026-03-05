import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import type { Session } from "./types/session";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return <DashboardPage user={session.user} />;
}

export default App;
