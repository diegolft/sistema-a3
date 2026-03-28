import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Game } from "@/data/mockGames";
import { formatBRL } from "@/data/mockGames";

type Props = {
	game: Game;
};

export function GameCard({ game }: Props) {
	const { addToCart } = useCart();
	const { hasWishlist, toggleWishlist } = useWishlist();
	const inWishlist = hasWishlist(game.id);

	return (
		<motion.article
			layout
			whileHover={{ scale: 1.02, y: -2 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className="group overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]"
		>
			<div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
				<Link to={`/jogos/${game.id}`} className="block h-full">
					<img
						src={game.image}
						alt={`Capa de ${game.title}`}
						className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
					/>
				</Link>
				<span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
					{game.category}
				</span>
			</div>
			<div className="p-3.5">
				<Link to={`/jogos/${game.id}`}>
					<h3 className="text-[15px] font-bold leading-snug tracking-tight text-white">{game.title}</h3>
				</Link>
				<div className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-gs-accent)]">
					<Star className="h-3 w-3 fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]" />
					<span>{game.rating.toFixed(1)}</span>
				</div>
				<div className="mt-3 flex items-center justify-between gap-2">
					<span className="text-[15px] font-bold text-white">{formatBRL(game.price)}</span>
					<div className="flex shrink-0 items-center gap-1.5">
						<button
							type="button"
							onClick={() => toggleWishlist(game.id)}
							className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
								inWishlist
									? "border-[var(--color-gs-accent)]/50 bg-[var(--color-gs-accent)]/10 text-[var(--color-gs-accent)]"
									: "border-white/15 bg-transparent text-neutral-400 hover:border-white/25 hover:text-neutral-200"
							}`}
							aria-label={inWishlist ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
						>
							<Heart
								className={`h-4 w-4 ${inWishlist ? "fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]" : ""}`}
								strokeWidth={1.75}
							/>
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								addToCart(game.id);
							}}
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gs-accent)] text-white shadow-[0_3px_12px_rgba(255,122,0,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
							aria-label="Adicionar ao carrinho"
						>
							<ShoppingCart className="h-4 w-4" strokeWidth={2} />
						</button>
					</div>
				</div>
			</div>
		</motion.article>
	);
}
