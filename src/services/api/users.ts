import { apiFetch } from "@/services/api/client";
import { listCategories } from "@/services/api/categories";
import { listCompanies } from "@/services/api/companies";
import { toAuthUser, toOwnedGame, toUser, type ApiOwnedGame, type ApiUser } from "@/services/api/mappers";
import type { AuthUser, OwnedGame, User } from "@/types/domain";

export type UpdateUserBody = {
	nome: string;
	dataNascimento?: string;
	fkPerfil?: number;
};

async function createLookups(token: string) {
	const [categories, companies] = await Promise.all([listCategories(token), listCompanies(token)]);
	return {
		categoriesById: new Map(categories.map((category) => [category.id, category.nome])),
		companiesById: new Map(companies.map((company) => [company.id, company.nome])),
	};
}

export async function getUserById(id: number, token: string): Promise<User | null> {
	const raw = await apiFetch<ApiUser | undefined>(`/api/v1/usuarios/${id}`, {
		method: "GET",
		token,
	});
	return raw ? toUser(raw) : null;
}

export async function getCurrentUser(
	id: number,
	token: string,
	perfil: string,
): Promise<AuthUser | null> {
	const raw = await apiFetch<ApiUser | undefined>(`/api/v1/usuarios/${id}`, {
		method: "GET",
		token,
	});
	return raw ? toAuthUser(raw, perfil) : null;
}

export async function listUsers(token: string): Promise<User[]> {
	const raw = await apiFetch<ApiUser[]>("/api/v1/usuarios", {
		method: "GET",
		token,
	});
	return raw.map(toUser);
}

export async function updateUser(id: number, body: UpdateUserBody, token: string): Promise<{
	message: string;
}> {
	return apiFetch<{ message: string }>(`/api/v1/usuarios/${id}`, {
		method: "PUT",
		token,
		body,
	});
}

export async function listOwnedGames(token: string): Promise<OwnedGame[]> {
	const [raw, lookups] = await Promise.all([
		apiFetch<ApiOwnedGame[] | undefined>("/api/v1/usuarios/my/games", {
			method: "GET",
			token,
		}),
		createLookups(token),
	]);
	return (raw ?? []).map((game) => toOwnedGame(game, lookups));
}
