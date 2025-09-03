import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://byapar.bucksoftech.top/api/v1",
  withCredentials: true,
});

// https://byapar.bucksoftech.top
