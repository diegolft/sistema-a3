import { apiFetch } from "@/services/api/client";
import { toProfile, type ApiProfile } from "@/services/api/mappers";
import type { Profile } from "@/types/domain";

export type CreateProfileBody = {
	nome: string;
};

export async function listProfiles(token: string): Promise<Profile[]> {
	const raw = await apiFetch<ApiProfile[]>("/api/v1/profiles", {
		method: "GET",
		token,
	});
	return raw.map(toProfile);
}

export async function createProfile(body: CreateProfileBody, token: string): Promise<{
	message: string;
	profileId: number;
}> {
	return apiFetch<{ message: string; profileId: number }>("/api/v1/profiles", {
		method: "POST",
		token,
		body,
	});
}
