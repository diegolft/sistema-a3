import { motion } from "framer-motion";
import { Heart, Lock, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatBRL } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { ExhibitionGame, GameSummary } from "@/types/domain";

type Props = {
	game: ExhibitionGame | GameSummary;
	mode: "public" | "private";
};

function hasId(game: ExhibitionGame | GameSummary): game is GameSummary {
	return "id" in game;
}

export function GameCard({ game, mode }: Props) {
	const { addToCart } = useCart();
	const { hasWishlist, toggleWishlist } = useWishlist();
	const isPrivate = mode === "private" && hasId(game);
	const inWishlist = isPrivate ? hasWishlist(game.id) : false;

	async function handleWishlist(gameId: number) {
		try {
			await toggleWishlist(gameId);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Nao foi possivel atualizar a lista de desejos.");
		}
	}

	async function handleAddToCart(gameId: number) {
		try {
			await addToCart(gameId);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Nao foi possivel adicionar ao carrinho.");
		}
	}

	return (
		<motion.article
			layout
			whileHover={{ scale: 1.02, y: -2 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className="group overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]"
		>
			<div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
				{isPrivate ? (
					<Link to={`/jogos/${game.id}`} className="block h-full">
						<img
							src={game.imageUrl}
							alt={`Capa de ${game.nome}`}
							className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
						/>
					</Link>
				) : (
					<img
						src={game.imageUrl}
						alt={`Arte do jogo ${game.nome}`}
						className="h-full w-full object-cover"
					/>
				)}
				<span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
					{game.categoriaNome}
				</span>
			</div>
			<div className="p-3.5">
				{isPrivate ? (
					<Link to={`/jogos/${game.id}`}>
						<h3 className="text-[15px] font-bold leading-snug tracking-tight text-white">{game.nome}</h3>
					</Link>
				) : (
					<h3 className="text-[15px] font-bold leading-snug tracking-tight text-white">{game.nome}</h3>
				)}
				<p className="mt-1.5 text-[13px] text-neutral-400">
					{game.empresaNome} • {game.ano}
				</p>
				<div className="mt-3 flex items-center justify-between gap-2">
					<div>
						<span className="text-[15px] font-bold text-white">{formatBRL(game.precoFinal)}</span>
						{game.desconto > 0 ? (
							<p className="text-[12px] text-neutral-500 line-through">{formatBRL(game.preco)}</p>
						) : null}
					</div>
					{isPrivate ? (
						<div className="flex shrink-0 items-center gap-1.5">
							<button
								type="button"
								onClick={() => {
									void handleWishlist(game.id);
								}}
								className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
									inWishlist
										? "border-[var(--color-gs-accent)]/50 bg-[var(--color-gs-accent)]/10 text-[var(--color-gs-accent)]"
										: "border-white/15 bg-transparent text-neutral-400 hover:border-white/25 hover:text-neutral-200"
								}`}
								aria-label={inWishlist ? "Remover da lista de desejos" : "Adicionar a lista de desejos"}
							>
								<Heart
									className={`h-4 w-4 ${inWishlist ? "fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]" : ""}`}
									strokeWidth={1.75}
								/>
							</button>
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									void handleAddToCart(game.id);
								}}
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gs-accent)] text-white shadow-[0_3px_12px_rgba(255,122,0,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
								aria-label="Adicionar ao carrinho"
							>
								<ShoppingCart className="h-4 w-4" strokeWidth={2} />
							</button>
						</div>
					) : (
						<Link
							to="/login"
							className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[12px] font-semibold text-neutral-200 transition hover:bg-white/5"
						>
							<Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
							Entrar
						</Link>
					)}
				</div>
			</div>
		</motion.article>
	);
}
