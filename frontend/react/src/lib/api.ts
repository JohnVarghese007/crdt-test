export const API_BASE = "http://localhost:4000";
export const WS_BASE = API_BASE.replace("http", "ws");

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  return res.json();
}
