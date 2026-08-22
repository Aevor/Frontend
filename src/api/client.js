// Thin fetch wrapper: base URL, auth handling, error normalization.
// Every other api/*.js file (repositories.js, skills.js, etc.) calls
// through this instead of using fetch directly.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Session/auth handoff isn't settled yet — could land as an httpOnly
// cookie (nothing to do here, credentials:'include' below covers it)
// or a frontend-held token (fill this in once that's confirmed).
function getAuthToken() {
  return null;
}

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError("Network error — check your connection or the API is down.", 0, null);
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && body.message) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  return body;
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export { ApiError };
