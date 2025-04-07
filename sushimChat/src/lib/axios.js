import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://sushim-chat.onrender.com/api" || "http://localhost:4000/api",
  withCredentials: true,
});
