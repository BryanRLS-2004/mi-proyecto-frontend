import axios from "axios";

const API_URL = "https://mi-proyecto-backend-relaxtotal.onrender.com"; // URL base de tu backend

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;