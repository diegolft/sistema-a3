const rawApiUrl = import.meta.env.VITE_API_URL?.trim() ?? "";

/** URL base da API (ex.: http://localhost:3000), sem barra final. */
export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
