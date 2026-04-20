import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://172.17.208.51:8000/api/v1",
});