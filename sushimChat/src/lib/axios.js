import axios from "axios";

export const baseURL ="https://sushim-chat.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
