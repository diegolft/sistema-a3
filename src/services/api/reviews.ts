import { apiFetch } from "@/services/api/client";
import { toReview, toReviewAverage, type ApiReview, type ApiReviewAverage } from "@/services/api/mappers";
import type { Review, ReviewAverage } from "@/types/domain";

export type UpsertReviewBody = {
	jogoId: number;
	nota: number;
	comentario?: string;
};

export async function getUserReviewByGame(jogoId: number, token: string): Promise<Review | null> {
	const raw = await apiFetch<ApiReview | undefined>("/api/v1/avaliacoes", {
		method: "GET",
		token,
		query: { jogoId },
	});
	return raw ? toReview(raw) : null;
}

export async function getReviewAverage(jogoId: number, token: string): Promise<ReviewAverage | null> {
	const raw = await apiFetch<ApiReviewAverage | undefined>(`/api/v1/avaliacoes/media/${jogoId}`, {
		method: "GET",
		token,
	});
	return raw ? toReviewAverage(raw) : null;
}

export async function createReview(body: UpsertReviewBody, token: string): Promise<void> {
	await apiFetch("/api/v1/avaliacoes", {
		method: "POST",
		token,
		body,
	});
}

export async function updateReview(body: UpsertReviewBody, token: string): Promise<void> {
	await apiFetch("/api/v1/avaliacoes", {
		method: "PUT",
		token,
		body,
	});
}
