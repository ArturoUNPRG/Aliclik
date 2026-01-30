import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bots-aliclikbackend-0leo4c-addca0-62-146-230-42.traefik.me',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es un error 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;