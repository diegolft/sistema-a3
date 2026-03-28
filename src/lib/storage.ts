/** Leitura/escrita em localStorage com try/catch — evita duplicação nos contextos. */

export function safeGetItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function safeSetItem(key: string, value: string | null) {
	try {
		value ? localStorage.setItem(key, value) : localStorage.removeItem(key);
	} catch {
		/* ignore */
	}
}

export function safeSetJson(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* ignore */
	}
}

export function readJsonArray<T>(key: string, guard: (x: unknown) => x is T): T[] {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? parsed.filter(guard) : [];
	} catch {
		return [];
	}
}
