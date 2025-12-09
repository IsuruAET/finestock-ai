import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Keep cookies for refresh-token workflows, but leave auth concerns to the
  // auth provider/hooks.
  withCredentials: true,
});

export default axiosInstance;
