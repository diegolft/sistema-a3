import { API_BASE_URL } from "@/lib/config";
import {
	ApiError,
	friendlyNetworkMessage,
	parseApiError,
	toFriendlyApiMessage,
} from "./errors";

export { ApiError, parseApiError, toFriendlyApiMessage, friendlyNetworkMessage } from "./errors";

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
	const p = path.startsWith("/") ? path : `/${path}`;
	const url = API_BASE_URL ? new URL(`${API_BASE_URL}${p}`) : new URL(p, window.location.origin);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined || value === null || value === "") continue;
			url.searchParams.set(key, String(value));
		}
	}
	const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
	return API_BASE_URL ? `${base}${p}${url.search}` : `${p}${url.search}`;
}

type FetchOptions = Omit<RequestInit, "body"> & {
	body?: unknown;
	token?: string | null;
	query?: Record<string, QueryValue>;
};

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
	const { body, token, query, headers: initHeaders, ...rest } = options;
	const headers = new Headers(initHeaders);
	body !== undefined &&
		!(body instanceof FormData) &&
		headers.set("Content-Type", "application/json");
	token && headers.set("Authorization", `Bearer ${token}`);

	let res: Response;
	try {
		res = await fetch(buildUrl(path, query), {
			...rest,
			headers,
			body:
				body === undefined || body instanceof FormData
					? (body as BodyInit | undefined)
					: JSON.stringify(body),
		});
	} catch (err) {
		throw new ApiError(friendlyNetworkMessage(err), 0);
	}

	if (!res.ok) {
		const raw = await parseApiError(res);
		throw new ApiError(toFriendlyApiMessage(res.status, raw), res.status);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	const text = await res.text();
	if (!text) return undefined as T;

	try {
		return JSON.parse(text) as T;
	} catch {
		return text as T;
	}
}
