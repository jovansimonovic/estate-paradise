import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/user/userSlice";

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
  (error) => Promise.reject(error)
);

AxiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      store.dispatch(logout());
      localStorage.removeItem("token");
    }
  }
);
