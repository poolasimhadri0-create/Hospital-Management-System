// Use the relative /api path for production, or the local address for development
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000");
export default BASE_URL;
