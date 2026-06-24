import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: handle 401/403 by attempting token refresh or logging out
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // On 401 (token expired), try refresh once
    if (
      status === 401 &&
      !original._retry &&
      !original.url.includes('/auth/')
    ) {
      original._retry = true;
      try {
        await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, {}, { withCredentials: true });
        return api(original);
      } catch {
        // Refresh failed — clear everything and redirect to appropriate login
        clearAndRedirect();
        return Promise.reject(error);
      }
    }

    // On 403 (wrong role / deactivated) — clear auth and redirect
    if (
      status === 403 &&
      !original.url.includes('/auth/')
    ) {
      clearAndRedirect();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

function clearAndRedirect() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  localStorage.removeItem('phoenix_user');
  localStorage.removeItem('phoenix_admin');
  window.location.href = isAdmin ? '/admin/login' : '/';
}

export default api;
