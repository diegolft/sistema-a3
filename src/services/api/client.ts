import { API_BASE_URL } from "@/lib/config";
import {
	ApiError,
	friendlyNetworkMessage,
	parseApiError,
	toFriendlyApiMessage,
} from "./errors";

export { ApiError, parseApiError, toFriendlyApiMessage, friendlyNetworkMessage } from "./errors";

function buildUrl(path: string): string {
	const p = path.startsWith("/") ? path : `/${path}`;
	if (!API_BASE_URL) return p;
	const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
	return `${base}${p}`;
}

type FetchOptions = Omit<RequestInit, "body"> & {
	body?: unknown;
	token?: string | null;
};

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
	const { body, token, headers: initHeaders, ...rest } = options;
	const headers = new Headers(initHeaders);
	body !== undefined &&
		!(body instanceof FormData) &&
		headers.set("Content-Type", "application/json");
	token && headers.set("Authorization", `Bearer ${token}`);

	let res: Response;
	try {
		res = await fetch(buildUrl(path), {
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

	const text = await res.text();
	return (text ? JSON.parse(text) : undefined) as T;
}
