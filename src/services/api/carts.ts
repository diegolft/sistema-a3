import { apiFetch } from "@/services/api/client";
import { listGames } from "@/services/api/games";
import { toCart, type ApiCartShape } from "@/services/api/mappers";
import type { Cart } from "@/types/domain";

type ActiveCartResponse =
	| {
			message: string;
	  }
	| {
			carrinho: ApiCartShape;
	  };

export async function getActiveCart(token: string): Promise<Cart | null> {
	const response = await apiFetch<ActiveCartResponse | undefined>("/api/v1/carrinho/ativo", {
		method: "GET",
		token,
	});
	if (!response || !("carrinho" in response)) return null;

	const games = await listGames(token);
	return toCart(response.carrinho, games);
}

export async function addCartItem(jogoId: number, token: string): Promise<void> {
	await apiFetch("/api/v1/carrinho/add", {
		method: "POST",
		token,
		body: { jogoId },
	});
}

export async function removeCartItem(gameId: number, token: string): Promise<void> {
	await apiFetch(`/api/v1/carrinho/${gameId}`, {
		method: "DELETE",
		token,
	});
}
