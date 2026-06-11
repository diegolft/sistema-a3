import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { GameCard } from "@/components/games/GameCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { listCategories } from "@/services/api/categories";
import { getMostSoldGamesReport } from "@/services/api/reports";
import { listGames, listPublicGames } from "@/services/api/games";
import type { ExhibitionGame, GameSummary } from "@/types/domain";

type CatalogEntry = ExhibitionGame | GameSummary;

function GameCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]">
			<Skeleton className="aspect-[16/10] w-full rounded-none" />
			<div className="space-y-2.5 p-3.5">
				<Skeleton className="h-4 w-[75%]" />
				<Skeleton className="h-3 w-28" />
				<div className="flex items-center justify-between pt-0.5">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-9 w-20 rounded-lg" />
				</div>
			</div>
		</div>
	);
}

export function GamesPage() {
	const { isAuthenticated, token } = useAuth();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<string>("Todos");
	const [categories, setCategories] = useState<string[]>(["Todos"]);
	const [games, setGames] = useState<CatalogEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [topSellerNames, setTopSellerNames] = useState<Set<string>>(new Set());
	const [sort, setSort] = useState<"relevancia" | "preco-asc" | "preco-desc" | "nome-az">("relevancia");
	const [retryCount, setRetryCount] = useState(0);
	const deferredQuery = useDeferredValue(query);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				if (isAuthenticated && token) {
					const [nextGames, nextCategories, nextTopSales] = await Promise.all([
						listGames(token),
						listCategories(token),
						getMostSoldGamesReport(token, { top: 3 }).catch(() => []),
					]);

					if (!cancelled) {
						setGames(nextGames);
						setCategories(["Todos", ...nextCategories.map((item) => item.nome)]);
						setTopSellerNames(new Set(nextTopSales.slice(0, 3).map((s) => s.nome)));
					}
					return;
				}

				const nextGames = await listPublicGames();
				if (!cancelled) {
					setGames(nextGames);
					setCategories(["Todos", ...new Set(nextGames.map((item) => item.categoriaNome))]);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(nextError instanceof Error ? nextError.message : "Não foi possível carregar o catálogo.");
					setGames([]);
					setCategories(["Todos"]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [isAuthenticated, token, retryCount]);

	useEffect(() => {
		if (!categories.includes(category)) {
			setCategory("Todos");
		}
	}, [categories, category]);

	const filtered = useMemo(() => {
		const normalizedQuery = deferredQuery.trim().toLowerCase();
		return games.filter((game) => {
			const categoryOk = category === "Todos" || game.categoriaNome === category;
			const queryOk =
				!normalizedQuery ||
				game.nome.toLowerCase().includes(normalizedQuery) ||
				game.empresaNome.toLowerCase().includes(normalizedQuery);
			return categoryOk && queryOk;
		});
	}, [category, deferredQuery, games]);

	const sorted = useMemo(() => {
		const arr = [...filtered];
		if (sort === "preco-asc") arr.sort((a, b) => a.precoFinal - b.precoFinal);
		else if (sort === "preco-desc") arr.sort((a, b) => b.precoFinal - a.precoFinal);
		else if (sort === "nome-az") arr.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
		return arr;
	}, [filtered, sort]);

	return (
		<div>
			<header className="mb-6 md:mb-7">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">Jogos</h1>
				<p className="mt-1.5 text-[14px] text-neutral-400">
					{isAuthenticated
						? "Explore o catalogo completo conectado a API."
						: "Para ter acesso aos detalhes, é necessário uma conta."}
				</p>
			</header>

			<div className="mb-7 md:mb-8">
				<div role="search" className="relative">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
						strokeWidth={1.75}
					/>
					<input
						type="search"
						placeholder="Buscar jogos..."
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						className="w-full rounded-full border border-white/10 bg-gs-raised py-3 pl-11 pr-5 text-[14px] text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-[var(--color-gs-accent)]/30 focus:bg-gs-surface focus:ring-2 focus:ring-[var(--color-gs-accent)]/20"
					/>
				</div>
				<div role="group" aria-label="Filtrar por categoria" className="mt-4 flex flex-wrap gap-2">
					{categories.map((currentCategory) => (
						<button
							key={currentCategory}
							type="button"
							onClick={() => setCategory(currentCategory)}
							className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
								category === currentCategory
									? "bg-[var(--color-gs-accent)] text-white shadow-[0_4px_16px_rgba(255,140,51,0.35)]"
									: "bg-gs-raised text-neutral-200 hover:bg-neutral-700/80"
							}`}
						>
							{currentCategory}
						</button>
					))}
				</div>
			</div>

			{error ? (
			<div className="mb-5 flex flex-wrap items-center gap-3">
				<p className="text-[14px] text-amber-300">{error}</p>
				<button
					type="button"
					onClick={() => setRetryCount((c) => c + 1)}
					className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[13px] font-medium text-neutral-300 transition hover:bg-neutral-700/60"
				>
					↺ Tentar novamente
				</button>
			</div>
		) : null}

		{!loading && sorted.length > 0 ? (
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p className="text-[13px] text-neutral-400">
					<span className="font-semibold text-neutral-100">{sorted.length}</span>{" "}
					{sorted.length === 1 ? "jogo encontrado" : "jogos encontrados"}
				</p>
				<div className="flex items-center gap-2">
					<label htmlFor="games-sort" className="text-[12px] text-neutral-500">
						Ordenar:
					</label>
					<select
						id="games-sort"
						value={sort}
						onChange={(e) => setSort(e.target.value as typeof sort)}
						className="rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[12px] text-neutral-100 outline-none focus:border-[var(--color-gs-accent)]/30"
					>
						<option value="relevancia">Relevância</option>
						<option value="preco-asc">Menor preço</option>
						<option value="preco-desc">Maior preço</option>
						<option value="nome-az">A–Z</option>
					</select>
				</div>
			</div>
		) : null}

			{loading ? (
				<ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const).map((key) => (
						<li key={key}><GameCardSkeleton /></li>
					))}
				</ul>
			) : filtered.length === 0 ? (
				<p className="py-12 text-center text-[14px] text-neutral-400">Nenhum jogo encontrado.</p>
			) : (
				<ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{sorted.map((game) => (
						<li key={"id" in game ? game.id : `${game.nome}-${game.empresaNome}`}>
							<GameCard
								game={game}
								mode={isAuthenticated ? "private" : "public"}
								isTopSeller={topSellerNames.has(game.nome)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
