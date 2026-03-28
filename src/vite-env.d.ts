/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
	/** Quando `"true"`, login/cadastro usam dados mockados sem API. */
	readonly VITE_USE_AUTH_MOCK?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
