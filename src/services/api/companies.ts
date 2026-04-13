import { apiFetch } from "@/services/api/client";
import { toCompany, type ApiCompany } from "@/services/api/mappers";
import type { Company } from "@/types/domain";

export type ManageCompanyBody = {
	nome: string;
};

export async function listCompanies(token: string, nome?: string): Promise<Company[]> {
	const raw = await apiFetch<ApiCompany[] | undefined>("/api/v1/empresas", {
		method: "GET",
		token,
		query: { nome },
	});
	return (raw ?? []).map(toCompany);
}

export async function getCompanyById(id: number, token: string): Promise<Company | null> {
	const raw = await apiFetch<ApiCompany | undefined>(`/api/v1/empresas/${id}`, {
		method: "GET",
		token,
	});
	return raw ? toCompany(raw) : null;
}

export async function createCompany(body: ManageCompanyBody, token: string): Promise<Company> {
	const raw = await apiFetch<ApiCompany>("/api/v1/empresas", {
		method: "POST",
		token,
		body,
	});
	return toCompany(raw);
}

export async function updateCompany(
	id: number,
	body: ManageCompanyBody,
	token: string,
): Promise<Company> {
	const raw = await apiFetch<ApiCompany>(`/api/v1/empresas/${id}`, {
		method: "PUT",
		token,
		body,
	});
	return toCompany(raw);
}

export async function deleteCompany(id: number, token: string): Promise<void> {
	await apiFetch<string>(`/api/v1/empresas/${id}`, {
		method: "DELETE",
		token,
	});
}
