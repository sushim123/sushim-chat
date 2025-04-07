import axios from "axios";

const baseURL = process.env.NODE_ENV === "production"
  ? "https://sushim-chat.onrender.com/api"
  : "http://localhost:4000/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
