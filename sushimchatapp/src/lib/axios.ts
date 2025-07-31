import axios from "axios";

export const baseURL = "/api";
export const socketBaseURL = "https://sushim-chat-kc00.onrender.com";
export const axiosInstance = axios.create({
  baseURL,

  withCredentials: true,
});
