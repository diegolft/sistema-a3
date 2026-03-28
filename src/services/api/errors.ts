export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
		this.name = "ApiError";
	}
}

/** Mensagens genéricas do protocolo / framework em inglês — t */
const TECHNICAL_HTTP_MSG =
	/^(bad request|unauthorized|forbidden|not found|internal server error|service unavailable|gateway timeout|request timeout|conflict|not acceptable|length required|precondition failed)$/i;

const STATUS_EXACT_MSG: Partial<Record<number, string>> = {
	401: "Sessão expirada ou e-mail/senha incorretos. Entre novamente.",
	403: "Você não tem permissão para esta ação.",
	404: "Não encontramos o que você procura.",
	429: "Muitas tentativas em pouco tempo. Aguarde um instante e tente de novo.",
};

export async function parseApiError(res: Response): Promise<string> {
	try {
		const data: unknown = await res.json();
		if (typeof data !== "object" || data === null) {
			return res.statusText || `Erro HTTP ${res.status}`;
		}
		const o = data as Record<string, unknown>;
		const m = o.message;
		return typeof m === "string"
			? m
			: Array.isArray(m)
				? m.map(String).join(", ")
				: typeof o.error === "string"
					? o.error
					: res.statusText || `Erro HTTP ${res.status}`;
	} catch {
		return res.statusText || `Erro HTTP ${res.status}`;
	}
}

export function toFriendlyApiMessage(status: number, rawFromBodyOrStatus: string): string {
	const raw = rawFromBodyOrStatus.trim();
	const technical =
		raw.length === 0 ||
		TECHNICAL_HTTP_MSG.test(raw) ||
		/^erro http\s+\d+$/i.test(raw);

	const exact = STATUS_EXACT_MSG[status];
	if (exact) return exact;
	if (status >= 500) return "Nosso servidor está com um problema. Tente de novo em alguns minutos.";

	if (status === 422 && !technical) return raw;
	if ((status === 400 || status === 409) && !technical && raw.length >= 3) return raw;

	if (status === 400) return "Não foi possível concluir esta ação. Verifique os dados e tente de novo.";
	if (status === 409) return "Esta ação não pode ser feita no momento. Atualize a página e tente de novo.";
	if (status === 422) return "Alguns dados estão incorretos. Revise os campos e tente de novo.";

	if (!technical && raw.length > 0) return raw;
	return status > 0 ? `Algo deu errado (${status}). Tente de novo.` : "Algo deu errado. Tente de novo.";
}

const NETWORK_ERR = /fetch|network|load failed|failed to fetch/i;
const OFFLINE_MSG = "Não foi possível conectar. Verifique sua internet e tente de novo.";

export function friendlyNetworkMessage(err: unknown): string {
	return err instanceof TypeError && NETWORK_ERR.test(String(err.message))
		? OFFLINE_MSG
		: err instanceof DOMException && err.name === "AbortError"
			? "A conexão foi interrompida. Tente de novo."
			: OFFLINE_MSG;
}
