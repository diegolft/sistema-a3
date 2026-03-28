import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GameCard } from "@/components/games/GameCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { GAME_CATEGORIES, MOCK_GAMES } from "@/data/mockGames";

function GameCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]">
			<Skeleton className="aspect-[16/10] w-full rounded-none" />
			<div className="space-y-2.5 p-3.5">
				<Skeleton className="h-4 w-[75%]" />
				<Skeleton className="h-3 w-14" />
				<div className="flex items-center justify-between pt-0.5">
					<Skeleton className="h-6 w-24" />
					<div className="flex gap-1.5">
						<Skeleton className="h-9 w-9 rounded-lg" />
						<Skeleton className="h-9 w-9 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function GamesPage() {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<string>("Todos");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const t = window.setTimeout(() => setLoading(false), 900);
		return () => window.clearTimeout(t);
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return MOCK_GAMES.filter((g) => {
			const catOk = category === "Todos" || g.category === category;
			const qOk = !q || g.title.toLowerCase().includes(q);
			return catOk && qOk;
		});
	}, [query, category]);

	return (
		<div>
			<header className="mb-6 md:mb-7">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">Jogos</h1>
				<p className="mt-1.5 text-[14px] text-neutral-400">Explore nosso catálogo completo.</p>
			</header>

			<div className="mb-7 md:mb-8">
				<div className="relative">
					<Search
						className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
						strokeWidth={1.75}
					/>
					<input
						type="search"
						placeholder="Buscar jogos..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full rounded-full border border-white/10 bg-gs-raised py-3 pl-11 pr-5 text-[14px] text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-[var(--color-gs-accent)]/30 focus:bg-gs-surface focus:ring-2 focus:ring-[var(--color-gs-accent)]/20"
					/>
				</div>
				<div className="mt-4 flex flex-wrap gap-2">
					{GAME_CATEGORIES.map((c) => (
						<button
							key={c}
							type="button"
							onClick={() => setCategory(c)}
							className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
								category === c
									? "bg-[var(--color-gs-accent)] text-white shadow-[0_4px_16px_rgba(255,140,51,0.35)]"
									: "bg-gs-raised text-neutral-200 hover:bg-neutral-700/80"
							}`}
						>
							{c}
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const).map((key) => (
						<GameCardSkeleton key={key} />
					))}
				</div>
			) : filtered.length === 0 ? (
				<p className="py-12 text-center text-[14px] text-neutral-400">Nenhum jogo encontrado.</p>
			) : (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filtered.map((game) => (
						<GameCard key={game.id} game={game} />
					))}
				</div>
			)}
		</div>
	);
}
