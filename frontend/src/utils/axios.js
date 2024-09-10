import axios from "axios";

export const Axios = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AxiosAuth = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
