import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
});

// https://byapar.bucksoftech.top --> BACKEND API BASE URL
