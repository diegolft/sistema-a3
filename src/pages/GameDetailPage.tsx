import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatBRL, getGameById } from "@/data/mockGames";

export function GameDetailPage() {
	const { id } = useParams();
	const game = id ? getGameById(id) : undefined;
	const { addToCart } = useCart();
	const { hasWishlist, toggleWishlist } = useWishlist();
	const [loading, setLoading] = useState(true);
	const [rating, setRating] = useState(4);
	const [hoveredStar, setHoveredStar] = useState<number | null>(null);
	const displayRating = hoveredStar ?? rating;
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		const t = window.setTimeout(() => setLoading(false), 700);
		return () => window.clearTimeout(t);
	}, [id]);

	if (!game) {
		return <Navigate to="/jogos" replace />;
	}

	const inWishlist = hasWishlist(game.id);

	function handleReview(e: FormEvent) {
		e.preventDefault();
		toast.success("Avaliação enviada! Obrigado pelo feedback.");
		setComment("");
	}

	if (loading) {
		return (
			<div>
				<Skeleton className="mb-5 h-4 w-28" />
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
					<Skeleton className="aspect-square w-full max-w-lg rounded-2xl lg:mx-0" />
					<div className="space-y-4">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full max-w-md" />
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-8 w-40" />
						<Skeleton className="h-12 w-full max-w-xs" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Link
				to="/jogos"
				className="mb-5 inline-flex items-center gap-1 text-[13px] font-medium text-neutral-400 transition hover:text-neutral-200"
			>
				<ArrowLeft className="h-4 w-4" strokeWidth={2} />
				Voltar
			</Link>

			<div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
				<motion.img
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", stiffness: 260, damping: 26 }}
					src={game.image}
					alt={`Capa do jogo ${game.title}`}
					className="w-full max-w-lg rounded-2xl object-cover shadow-[0_6px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.08] lg:mx-0"
				/>
				<div>
					<p className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-gs-accent)]">
						{game.category}
					</p>
					<h1 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
						{game.title}
					</h1>
					<p className="mt-4 text-[15px] leading-relaxed text-neutral-400">{game.description}</p>
					<p className="mt-6 text-2xl font-bold text-neutral-100">{formatBRL(game.price)}</p>
					<div className="mt-6 flex flex-wrap gap-2.5">
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => addToCart(game.id)}
							className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
						>
							<ShoppingCart className="h-4 w-4" strokeWidth={2} />
							Adicionar ao carrinho
						</motion.button>
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => toggleWishlist(game.id)}
							className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-gs-surface px-5 py-3 text-[14px] font-semibold transition hover:bg-gs-raised ${
								inWishlist ? "text-[var(--color-gs-accent)]" : "text-neutral-200"
							}`}
						>
							<Heart
								className={`h-4 w-4 ${inWishlist ? "fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]" : ""}`}
								strokeWidth={1.75}
							/>
							Lista de desejos
						</motion.button>
					</div>
				</div>
			</div>

			<section className="mt-12 max-w-xl border-t border-white/10 pt-9 md:mt-14 md:pt-10">
				<h2 className="text-lg font-bold text-neutral-100">Deixe sua avaliação</h2>
				<form onSubmit={handleReview} className="mt-5 space-y-4">
					<div>
						<p className="mb-2 text-[13px] font-medium text-neutral-300">
							Nota: {rating} de 5 estrelas
						</p>
						<fieldset
							className="m-0 min-w-0 max-w-md border-0 p-0"
							onMouseLeave={() => setHoveredStar(null)}
						>
							<legend className="sr-only">Selecione de 1 a 5 estrelas</legend>
							<div className="flex gap-0.5">
								{[1, 2, 3, 4, 5].map((n) => (
									<button
										key={n}
										type="button"
										onClick={() => setRating(n)}
										onMouseEnter={() => setHoveredStar(n)}
										aria-label={`Definir nota como ${n} de 5 estrelas`}
										className="rounded-md p-1 text-neutral-600 transition hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gs-accent)]/35"
									>
										<Star
											className={`h-7 w-7 transition ${
												n <= displayRating
													? "fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]"
													: "fill-transparent"
											}`}
											strokeWidth={n <= displayRating ? 0 : 1.5}
										/>
									</button>
								))}
							</div>
						</fieldset>
					</div>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={3}
						placeholder="Escreva seu comentário..."
						className="w-full resize-none rounded-xl border border-white/10 bg-gs-raised px-3.5 py-2.5 text-[14px] text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-[var(--color-gs-accent)]/40 focus:bg-gs-surface focus:ring-2 focus:ring-[var(--color-gs-accent)]/15"
					/>
					<button
						type="submit"
						className="rounded-full bg-[var(--color-gs-accent)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Enviar Avaliação
					</button>
				</form>
			</section>
		</div>
	);
}
