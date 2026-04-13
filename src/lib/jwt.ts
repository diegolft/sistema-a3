export type DecodedAuthToken = {
	id: number;
	nome: string;
	perfil: string;
	iat?: number;
	exp?: number;
};

function normalizeBase64Url(value: string): string {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	const padding = base64.length % 4;
	return padding === 0 ? base64 : `${base64}${"=".repeat(4 - padding)}`;
}

export function decodeAuthToken(token: string): DecodedAuthToken | null {
	try {
		const [, payload] = token.split(".");
		if (!payload) return null;
		const json = atob(normalizeBase64Url(payload));
		const parsed = JSON.parse(json) as Partial<DecodedAuthToken>;
		if (
			typeof parsed.id !== "number" ||
			typeof parsed.nome !== "string" ||
			typeof parsed.perfil !== "string"
		) {
			return null;
		}

		return {
			id: parsed.id,
			nome: parsed.nome,
			perfil: parsed.perfil,
			iat: typeof parsed.iat === "number" ? parsed.iat : undefined,
			exp: typeof parsed.exp === "number" ? parsed.exp : undefined,
		};
	} catch {
		return null;
	}
}

export function isTokenExpired(payload: DecodedAuthToken | null): boolean {
	if (!payload?.exp) return false;
	return payload.exp * 1000 <= Date.now();
}
