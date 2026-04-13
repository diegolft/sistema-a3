import { apiFetch } from "@/services/api/client";
import { toCategory, type ApiCategory } from "@/services/api/mappers";
import type { Category } from "@/types/domain";

export async function listCategories(token: string): Promise<Category[]> {
	const raw = await apiFetch<ApiCategory[] | undefined>("/api/v1/categorias", {
		method: "GET",
		token,
	});
	return (raw ?? []).map(toCategory);
}

export async function getCategoryById(id: number, token: string): Promise<Category | null> {
	const raw = await apiFetch<ApiCategory | undefined>(`/api/v1/categorias/${id}`, {
		method: "GET",
		token,
	});
	return raw ? toCategory(raw) : null;
}
