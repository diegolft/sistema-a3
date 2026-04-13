import { listCategories } from "@/services/api/categories";
import { listCompanies } from "@/services/api/companies";
import { apiFetch } from "@/services/api/client";
import {
	toExhibitionGame,
	toGameSummary,
	type ApiExhibitionGame,
	type ApiGame,
} from "@/services/api/mappers";
import type { ExhibitionGame, GameDetail, GameSummary } from "@/types/domain";

export type UpsertGameBody = {
	nome: string;
	descricao?: string;
	preco: number;
	ano: number;
	fkCategoria: number;
	fkEmpresa: number;
	desconto?: number;
};

async function createLookups(token: string) {
	const [categories, companies] = await Promise.all([listCategories(token), listCompanies(token)]);
	return {
		categoriesById: new Map(categories.map((category) => [category.id, category.nome])),
		companiesById: new Map(companies.map((company) => [company.id, company.nome])),
	};
}

export async function listPublicGames(): Promise<ExhibitionGame[]> {
	const raw = await apiFetch<ApiExhibitionGame[] | undefined>("/api/v1/public/jogos", {
		method: "GET",
	});
	return (raw ?? []).map(toExhibitionGame);
}

export async function listGames(token: string, categoria?: string): Promise<GameSummary[]> {
	const [raw, lookups] = await Promise.all([
		apiFetch<ApiGame[] | undefined>("/api/v1/jogos", {
			method: "GET",
			token,
			query: { categoria },
		}),
		createLookups(token),
	]);
	return (raw ?? []).map((game) => toGameSummary(game, lookups));
}

export async function getGameById(id: number, token: string): Promise<GameDetail | null> {
	const [raw, lookups] = await Promise.all([
		apiFetch<ApiGame | undefined>(`/api/v1/jogos/${id}`, {
			method: "GET",
			token,
		}),
		createLookups(token),
	]);
	return raw ? toGameSummary(raw, lookups) : null;
}

export async function createGame(body: UpsertGameBody, token: string): Promise<GameSummary> {
	const [raw, lookups] = await Promise.all([
		apiFetch<ApiGame>("/api/v1/jogos", {
			method: "POST",
			token,
			body,
		}),
		createLookups(token),
	]);
	return toGameSummary(raw, lookups);
}

export async function updateGame(
	id: number,
	body: UpsertGameBody,
	token: string,
): Promise<{ changes: number }> {
	return apiFetch<{ changes: number }>(`/api/v1/jogos/${id}`, {
		method: "PUT",
		token,
		body,
	});
}

export async function deleteGame(id: number, token: string): Promise<void> {
	await apiFetch<string>(`/api/v1/jogos/${id}`, {
		method: "DELETE",
		token,
	});
}
