import { apiFetch } from "@/services/api/client";
import type { MostSoldGameReportItem } from "@/types/domain";

export async function getMostSoldGamesReport(
	token: string,
	params: { top?: number; empresa?: number },
): Promise<MostSoldGameReportItem[]> {
	const raw = await apiFetch<MostSoldGameReportItem[] | undefined>(
		"/api/v1/relatorios/jogos-mais-vendidos",
		{
			method: "GET",
			token,
			query: params,
		},
	);
	return raw ?? [];
}
