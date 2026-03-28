/** URL base da API (ex.: https://api.exemplo.com), sem barra final. */
export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
