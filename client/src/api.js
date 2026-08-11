const TOKEN_KEY = "crewcost_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const api = {
  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),
  getState: () => request("/state"),
  addEmployee: (name, rate) => request("/employees", { method: "POST", body: { name, rate } }),
  removeEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),
  addTask: (name, budget) => request("/tasks", { method: "POST", body: { name, budget } }),
  removeTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  assign: (taskId, employeeId) => request(`/tasks/${taskId}/assign`, { method: "POST", body: { employeeId } }),
  unassign: (taskId, employeeId) => request(`/tasks/${taskId}/assign/${employeeId}`, { method: "DELETE" }),
  clockIn: (employeeId, taskId) => request("/clock/in", { method: "POST", body: { employeeId, taskId } }),
  clockOut: (employeeId) => request("/clock/out", { method: "POST", body: { employeeId } }),
  togglePause: () => request("/system/pause", { method: "POST" }),
};

export { ApiError };
