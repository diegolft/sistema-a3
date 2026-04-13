import { apiFetch } from "@/services/api/client";
import { toSale, type ApiSale } from "@/services/api/mappers";
import type { PaymentMethod, Sale } from "@/types/domain";

export async function listSales(token: string): Promise<Sale[]> {
	const raw = await apiFetch<ApiSale[]>("/api/v1/vendas", {
		method: "GET",
		token,
	});
	return raw.map(toSale);
}

export async function checkout(token: string): Promise<void> {
	await apiFetch("/api/v1/vendas/checkout", {
		method: "POST",
		token,
	});
}

export async function paySale(method: PaymentMethod, token: string): Promise<void> {
	await apiFetch("/api/v1/vendas/pay", {
		method: "POST",
		token,
		body: { metodo: method, dados: {} },
	});
}
