import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Shield, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/games/GameCard";
import { LandingBackgroundCarousel } from "@/components/landing/LandingBackgroundCarousel";
import { buildGameImage } from "@/lib/gameMedia";
import { listPublicGames } from "@/services/api/games";
import type { ExhibitionGame } from "@/types/domain";

const FEATURES = [
	{
		icon: Gamepad2,
		title: "Catalogo conectado",
		desc: "A vitrine publica agora vem direto da API oficial da loja.",
	},
	{
		icon: Shield,
		title: "Compra segura",
		desc: "Checkout, pagamento e biblioteca sincronizados com o backend.",
	},
	{
		icon: Star,
		title: "Avaliacoes reais",
		desc: "Entre para liberar detalhes, reviews e sua area pessoal.",
	},
] as const;

const FALLBACK_IMAGES = [
	buildGameImage("Game Store", "Catalogo digital"),
	buildGameImage("Aventura", "Descubra novos jogos"),
	buildGameImage("Biblioteca", "Tudo sincronizado"),
];

export function LandingPage() {
	const [games, setGames] = useState<ExhibitionGame[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const nextGames = await listPublicGames();
				if (!cancelled) {
					setGames(nextGames);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(nextError instanceof Error ? nextError.message : "Nao foi possivel carregar a vitrine publica.");
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
	}, []);

	const featuredGames = games.slice(0, 4);
	const backgroundImages = useMemo(
		() => (games.length > 0 ? games.map((game) => game.imageUrl) : FALLBACK_IMAGES),
		[games],
	);

	return (
		<div className="relative -mx-5 -mt-5 w-[calc(100%+2.5rem)] max-w-[100vw] md:-mx-6 md:-mt-7 md:w-[calc(100%+3rem)]">
			<div className="relative min-h-[calc(100dvh-60px)] w-full overflow-hidden bg-gs-cream px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
				<LandingBackgroundCarousel images={backgroundImages} />
				<section className="relative z-10 flex min-h-[calc(100dvh-60px)] w-full flex-col items-center justify-center py-12 text-center md:py-16 lg:py-20">
					<div className="mx-auto w-full max-w-3xl px-4 sm:max-w-4xl md:px-5 lg:max-w-5xl">
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 28 }}
							className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-[var(--color-gs-accent)]"
						>
							<Sparkles className="h-4 w-4" strokeWidth={2} />
							Loja integrada com a API oficial
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
							className="text-balance text-pretty text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl xl:leading-[1.1]"
						>
							Sua proxima aventura <span className="text-[var(--color-gs-accent)]">comeca aqui.</span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.12, duration: 0.4 }}
							className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-neutral-400 sm:max-w-2xl"
						>
							Descubra o catalogo da loja, crie sua conta e desbloqueie detalhes, carrinho,
							pagamento e biblioteca sincronizados em tempo real.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 24 }}
							className="mt-9 flex justify-center"
						>
							<Link
								to="/jogos"
								className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gs-accent)] px-7 py-3 text-[14px] font-semibold text-white shadow-[0_6px_24px_rgba(255,122,0,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
							>
								Explorar Jogos
								<ArrowRight className="h-5 w-5" strokeWidth={2} />
							</Link>
						</motion.div>
					</div>
				</section>
			</div>

			<div className="w-full border-t border-white/10 bg-gs-surface px-5 pb-16 pt-16 sm:px-8 md:px-12 md:pt-24 lg:px-16 lg:pt-28 xl:px-20">
				<section className="relative z-10 w-full pb-14">
					<div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
						{FEATURES.map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-40px" }}
								transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 28 }}
								className="flex flex-col items-center text-center"
							>
								<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-gs-accent)] text-white shadow-[0_6px_22px_rgba(255,122,0,0.22)]">
									<item.icon className="h-7 w-7" strokeWidth={1.75} />
								</div>
								<h3 className="text-base font-bold text-white">{item.title}</h3>
								<p className="mt-2 max-w-[260px] text-[14px] leading-relaxed text-neutral-400">
									{item.desc}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				<section className="relative z-10 w-full pb-0">
					<div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-xl font-bold tracking-tight text-white md:text-[22px]">
								Vitrine Publica
							</h2>
							<p className="mt-0.5 text-[14px] text-neutral-400">
								{loading
									? "Carregando jogos em destaque..."
									: "Entre na sua conta para ver detalhes, reviews e concluir compras."}
							</p>
						</div>
						<Link
							to="/jogos"
							className="inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-[var(--color-gs-accent)] transition hover:text-[var(--color-gs-accent-hover)] sm:self-auto"
						>
							Ver catalogo
							<ArrowRight className="h-4 w-4" strokeWidth={2.5} />
						</Link>
					</div>

					{error ? <p className="mb-5 text-[14px] text-amber-300">{error}</p> : null}

					{featuredGames.length === 0 && !loading ? (
						<p className="rounded-2xl border border-white/10 bg-gs-raised p-6 text-[14px] text-neutral-300">
							Nenhum jogo publico foi retornado pela API neste momento.
						</p>
					) : (
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{featuredGames.map((game, index) => (
								<motion.div
									key={`${game.nome}-${index}`}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-20px" }}
									transition={{ delay: index * 0.06, type: "spring", stiffness: 320, damping: 26 }}
								>
									<GameCard game={game} mode="public" />
								</motion.div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
