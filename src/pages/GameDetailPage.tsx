import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatBRL } from "@/lib/currency";
import { formatDisplayDateTime } from "@/lib/date";
import { getFormErrorMessage } from "@/lib/formErrors";
import { getGameById } from "@/services/api/games";
import {
	createReview,
	getReviewAverage,
	getUserReviewByGame,
	updateReview,
} from "@/services/api/reviews";
import type { GameDetail, Review, ReviewAverage } from "@/types/domain";

export function GameDetailPage() {
	const { id } = useParams();
	const numericId = Number(id);
	const { token } = useAuth();
	const { addToCart } = useCart();
	const { hasWishlist, toggleWishlist } = useWishlist();
	const { isOwned } = useLibrary();
	const [game, setGame] = useState<GameDetail | null>(null);
	const [reviewAverage, setReviewAverage] = useState<ReviewAverage | null>(null);
	const [userReview, setUserReview] = useState<Review | null>(null);
	const [loading, setLoading] = useState(true);
	const [rating, setRating] = useState(5);
	const [hoveredStar, setHoveredStar] = useState<number | null>(null);
	const [comment, setComment] = useState("");
	const [savingReview, setSavingReview] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const displayRating = hoveredStar ?? rating;

	useEffect(() => {
		if (!Number.isInteger(numericId) || !token) return;
		const authToken = token;
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const [nextGame, nextAverage, nextUserReview] = await Promise.all([
					getGameById(numericId, authToken),
					getReviewAverage(numericId, authToken),
					getUserReviewByGame(numericId, authToken),
				]);

				if (!cancelled) {
					setGame(nextGame);
					setReviewAverage(nextAverage);
					setUserReview(nextUserReview);
					setRating(nextUserReview?.nota ?? 5);
					setComment(nextUserReview?.comentario ?? "");
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar o jogo."));
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
	}, [numericId, token]);

	if (!Number.isInteger(numericId)) {
		return <Navigate to="/jogos" replace />;
	}

	if (!loading && !game) {
		return <Navigate to="/jogos" replace />;
	}

	async function handleReview(event: FormEvent) {
		event.preventDefault();
		if (!token || !game) return;
		const authToken = token;
		setSavingReview(true);
		setError(null);
		try {
			const payload = {
				jogoId: game.id,
				nota: rating,
				comentario: comment.trim() || undefined,
			};
			if (userReview) {
				await updateReview(payload, authToken);
				toast.success("Avaliacao atualizada com sucesso.");
			} else {
				await createReview(payload, authToken);
				toast.success("Avaliacao enviada! Obrigado pelo feedback.");
			}

			const [nextAverage, nextUserReview] = await Promise.all([
				getReviewAverage(game.id, authToken),
				getUserReviewByGame(game.id, authToken),
			]);
			setReviewAverage(nextAverage);
			setUserReview(nextUserReview);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel salvar sua avaliacao."));
		} finally {
			setSavingReview(false);
		}
	}

	async function handleAddToCart() {
		if (!game) return;
		try {
			await addToCart(game.id);
		} catch (nextError) {
			toast.error(getFormErrorMessage(nextError, "Nao foi possivel adicionar o jogo ao carrinho."));
		}
	}

	async function handleToggleWishlist() {
		if (!game) return;
		try {
			await toggleWishlist(game.id);
		} catch (nextError) {
			toast.error(getFormErrorMessage(nextError, "Nao foi possivel atualizar a lista de desejos."));
		}
	}

	if (loading || !game) {
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

	const inWishlist = hasWishlist(game.id);
	const alreadyOwned = isOwned(game.id);

	return (
		<div>
			<Link
				to="/jogos"
				className="mb-5 inline-flex items-center gap-1 text-[13px] font-medium text-neutral-400 transition hover:text-neutral-200"
			>
				<ArrowLeft className="h-4 w-4" strokeWidth={2} />
				Voltar
			</Link>

			{error ? <p className="mb-4 text-[14px] text-amber-300">{error}</p> : null}

			<div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
				<motion.img
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", stiffness: 260, damping: 26 }}
					src={game.imageUrl}
					alt={`Arte do jogo ${game.nome}`}
					className="w-full max-w-lg rounded-2xl object-cover shadow-[0_6px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.08] lg:mx-0"
				/>
				<div>
					<p className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-gs-accent)]">
						{game.categoriaNome}
					</p>
					<h1 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
						{game.nome}
					</h1>
					<p className="mt-2 text-[14px] text-neutral-400">
						{game.empresaNome} • {game.ano}
					</p>
					{alreadyOwned ? (
						<p className="mt-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-200">
							Este jogo ja esta na sua biblioteca
						</p>
					) : null}
					<p className="mt-4 text-[15px] leading-relaxed text-neutral-400">{game.descricao}</p>
					<div className="mt-6 flex items-center gap-3">
						<p className="text-2xl font-bold text-neutral-100">{formatBRL(game.precoFinal)}</p>
						{game.desconto > 0 ? (
							<p className="text-[14px] text-neutral-500 line-through">{formatBRL(game.preco)}</p>
						) : null}
					</div>
					<div className="mt-3 rounded-2xl border border-white/10 bg-gs-surface p-4">
						<p className="text-[13px] font-semibold text-neutral-200">
							Media da comunidade: {reviewAverage ? `${reviewAverage.media.toFixed(1)} / 5` : "Sem notas ainda"}
						</p>
						<p className="mt-1 text-[13px] text-neutral-400">
							{reviewAverage ? `${reviewAverage.totalAvaliacoes} avaliacoes registradas` : "Seja o primeiro a avaliar este jogo."}
						</p>
					</div>
					<div className="mt-6 flex flex-wrap gap-2.5">
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => {
								void handleAddToCart();
							}}
							className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
						>
							<ShoppingCart className="h-4 w-4" strokeWidth={2} />
							Adicionar ao carrinho
						</motion.button>
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => {
								void handleToggleWishlist();
							}}
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

			<section className="mt-12 grid gap-8 border-t border-white/10 pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:mt-14 md:pt-10">
				<div className="max-w-xl">
					<h2 className="text-lg font-bold text-neutral-100">
						{userReview ? "Atualize sua avaliacao" : "Deixe sua avaliacao"}
					</h2>
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
									{[1, 2, 3, 4, 5].map((currentValue) => (
										<button
											key={currentValue}
											type="button"
											onClick={() => setRating(currentValue)}
											onMouseEnter={() => setHoveredStar(currentValue)}
											aria-label={`Definir nota como ${currentValue} de 5 estrelas`}
											className="rounded-md p-1 text-neutral-600 transition hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gs-accent)]/35"
										>
											<Star
												className={`h-7 w-7 transition ${
													currentValue <= displayRating
														? "fill-[var(--color-gs-accent)] text-[var(--color-gs-accent)]"
														: "fill-transparent"
												}`}
												strokeWidth={currentValue <= displayRating ? 0 : 1.5}
											/>
										</button>
									))}
								</div>
							</fieldset>
						</div>
						<textarea
							value={comment}
							onChange={(event) => setComment(event.target.value)}
							rows={4}
							placeholder="Escreva seu comentario..."
							className="w-full resize-none rounded-xl border border-white/10 bg-gs-raised px-3.5 py-2.5 text-[14px] text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-[var(--color-gs-accent)]/40 focus:bg-gs-surface focus:ring-2 focus:ring-[var(--color-gs-accent)]/15"
						/>
						<button
							type="submit"
							disabled={savingReview}
							className="rounded-full bg-[var(--color-gs-accent)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[var(--color-gs-accent-hover)] disabled:pointer-events-none disabled:opacity-60"
						>
							{savingReview ? "Salvando..." : userReview ? "Atualizar avaliacao" : "Enviar avaliacao"}
						</button>
					</form>
				</div>

				<div>
					<h2 className="text-lg font-bold text-neutral-100">Ultimas avaliacoes</h2>
					<div className="mt-5 space-y-3">
						{reviewAverage?.avaliacoes.length ? (
							reviewAverage.avaliacoes.map((review) => (
								<div
									key={review.id}
									className="rounded-2xl border border-white/10 bg-gs-surface p-4"
								>
									<div className="flex items-center justify-between gap-3">
										<p className="text-[13px] font-semibold text-[var(--color-gs-accent)]">
											Nota {review.nota}/5
										</p>
										<p className="text-[12px] text-neutral-500">{formatDisplayDateTime(review.data)}</p>
									</div>
									<p className="mt-2 text-[14px] leading-relaxed text-neutral-300">
										{review.comentario || "Sem comentario informado."}
									</p>
								</div>
							))
						) : (
							<p className="rounded-2xl border border-white/10 bg-gs-surface p-4 text-[14px] text-neutral-400">
								A comunidade ainda nao avaliou este jogo.
							</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
