import { safeGetItem, safeSetItem, safeSetJson } from "@/lib/storage";

/** Token simbólico quando `VITE_USE_AUTH_MOCK=true`. */
export const MOCK_AUTH_TOKEN = "mock-auth-token";

const PROFILE_KEY = "sistema-a3-mock-profile";

export type MockUserProfile = {
	name: string;
	email: string;
};

export const USE_AUTH_MOCK = import.meta.env.VITE_USE_AUTH_MOCK === "true";

function delay(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

export async function mockDelay() {
	await delay(450);
}

export function readMockProfile(): MockUserProfile | null {
	try {
		const raw = safeGetItem(PROFILE_KEY);
		if (!raw) return null;
		const o = JSON.parse(raw) as unknown;
		if (typeof o !== "object" || o === null) return null;
		const r = o as Record<string, unknown>;
		const name = r.name;
		const email = r.email;
		return typeof name === "string" && typeof email === "string" ? { name, email } : null;
	} catch {
		return null;
	}
}

export function writeMockProfile(profile: MockUserProfile) {
	safeSetJson(PROFILE_KEY, profile);
}

export function clearMockProfile() {
	safeSetItem(PROFILE_KEY, null);
}

export function isMockToken(token: string | null): boolean {
	return token === MOCK_AUTH_TOKEN;
}
