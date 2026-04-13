import { apiFetch } from "@/services/api/client";
import { listCategories } from "@/services/api/categories";
import { listCompanies } from "@/services/api/companies";
import { toGameSummary, type ApiGame } from "@/services/api/mappers";
import type { WishlistGame } from "@/types/domain";

async function createLookups(token: string) {
	const [categories, companies] = await Promise.all([listCategories(token), listCompanies(token)]);
	return {
		categoriesById: new Map(categories.map((category) => [category.id, category.nome])),
		companiesById: new Map(companies.map((company) => [company.id, company.nome])),
	};
}

export async function listWishlist(token: string): Promise<WishlistGame[]> {
	const [raw, lookups] = await Promise.all([
		apiFetch<ApiGame[] | undefined>("/api/v1/lista-desejo", {
			method: "GET",
			token,
		}),
		createLookups(token),
	]);
	return (raw ?? []).map((game) => toGameSummary(game, lookups));
}

export async function addWishlistGame(jogoId: number, token: string): Promise<void> {
	await apiFetch("/api/v1/lista-desejo", {
		method: "POST",
		token,
		body: { jogoId },
	});
}

export async function removeWishlistGame(jogoId: number, token: string): Promise<void> {
	await apiFetch("/api/v1/lista-desejo", {
		method: "DELETE",
		token,
		body: { jogoId },
	});
}
