import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // wajib agar cookie httpOnly (sesi) & cookie CSRF ikut terkirim
  timeout: 10_000,
});

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Setiap request yang mengubah data otomatis menyertakan header X-CSRF-Token
// yang dibaca dari cookie kpu_csrf — sesuai skema double-submit di backend.
api.interceptors.request.use(async (config) => {
  const unsafe = ['post', 'put', 'patch', 'delete'];
  if (unsafe.includes((config.method || '').toLowerCase())) {
    let token = readCookie('kpu_csrf');
    if (!token) {
      await api.get('/auth/csrf-token');
      token = readCookie('kpu_csrf');
    }
    if (token) config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

export default api;
