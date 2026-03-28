import { apiFetch } from "@/services/api/client";

export type RegisterBody = {
	email: string;
	password: string;
	name?: string;
};

export type LoginBody = {
	email: string;
	password: string;
};

export type ChangePasswordBody = {
	currentPassword: string;
	newPassword: string;
};

export type ForgotPasswordBody = {
	email: string;
};

function tokenFromRecord(o: Record<string, unknown>): string | null {
	return typeof o.accessToken === "string"
		? o.accessToken
		: typeof o.token === "string"
			? o.token
			: null;
}

function extractToken(data: unknown): string | null {
	if (typeof data !== "object" || data === null) return null;
	const o = data as Record<string, unknown>;
	return (
		tokenFromRecord(o) ??
		(typeof o.data === "object" && o.data !== null ? tokenFromRecord(o.data as Record<string, unknown>) : null)
	);
}

export async function registerUser(body: RegisterBody): Promise<unknown> {
	return apiFetch<unknown>("/api/v1/auth/register", {
		method: "POST",
		body,
	});
}

export async function loginUser(body: LoginBody): Promise<{ token: string | null; raw: unknown }> {
	const raw = await apiFetch<unknown>("/api/v1/auth/login", {
		method: "POST",
		body,
	});
	return { token: extractToken(raw), raw };
}

export async function changePassword(body: ChangePasswordBody, token: string): Promise<void> {
	await apiFetch<void>("/api/v1/auth/change-password", {
		method: "PUT",
		body,
		token,
	});
}

/** Recuperação de senha (e-mail com link ou token). Ajuste o path se a API usar outro. */
export async function requestPasswordReset(body: ForgotPasswordBody): Promise<void> {
	await apiFetch<void>("/api/v1/auth/forgot-password", {
		method: "POST",
		body,
	});
}
