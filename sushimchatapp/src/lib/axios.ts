import axios from "axios";

export const baseURL = "/api";
// export const socketBaseURL = "http://localhost:4000";
export const axiosInstance = axios.create({
  baseURL,

  withCredentials: true,
});
