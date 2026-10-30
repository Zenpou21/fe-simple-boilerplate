/**
 * Every API path is added to this, e.g. "products/list" -> http://localhost:8000/api/products/list.
 * The address comes from VITE_API_URL in .env.
 */
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Simple Boilerplate";

export default API_BASE_URL;
