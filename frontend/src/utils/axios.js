import axios from "axios";

const Axios = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Axios;
