import { motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/contexts/CartContext";
import { formatBRL, getGameById, type MOCK_GAMES } from "@/data/mockGames";

export function CartPage() {
	const { items, removeFromCart, restoreCartItem, finalizePurchase } = useCart();
	const [loading, setLoading] = useState(true);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [finalizing, setFinalizing] = useState(false);

	useEffect(() => {
		const t = window.setTimeout(() => setLoading(false), 500);
		return () => window.clearTimeout(t);
	}, []);

	type Line = { gameId: string; game: (typeof MOCK_GAMES)[0] };
	const lines = useMemo(
		() =>
			items.flatMap((l) => {
				const g = getGameById(l.gameId);
				return g ? [{ ...l, game: g } satisfies Line] : [];
			}),
		[items],
	);

	const total = useMemo(() => lines.reduce((s, l) => s + l.game.price, 0), [lines]);

	function handleConfirmPurchase() {
		setFinalizing(true);
		window.setTimeout(() => {
			finalizePurchase();
			setFinalizing(false);
			setConfirmOpen(false);
		}, 450);
	}

	function handleRemoveFromCart(gameId: string, title: string) {
		removeFromCart(gameId);
		toast.message(`${title} foi removido do carrinho.`, {
			action: {
				label: "Desfazer",
				onClick: () => restoreCartItem(gameId),
			},
		});
	}

	if (loading) {
		return (
			<div>
				<Skeleton className="mb-6 h-4 w-48" />
				<Skeleton className="mb-4 h-10 w-40" />
				<Skeleton className="h-32 w-full max-w-2xl rounded-2xl" />
				<Skeleton className="mt-6 h-40 w-full max-w-2xl rounded-2xl" />
			</div>
		);
	}

	return (
		<div>
			<ConfirmDialog
				open={confirmOpen}
				title="Confirmar compra"
				description={
					<>
						Confirma a compra de{" "}
						<strong className="text-neutral-200">
							{lines.length} {lines.length === 1 ? "jogo" : "jogos"}
						</strong>{" "}
						por <strong className="text-neutral-200">{formatBRL(total)}</strong>? Os jogos serão
						adicionados à sua biblioteca.
					</>
				}
				cancelLabel="Cancelar"
				confirmLabel="Confirmar compra"
				confirmLoading={finalizing}
				confirmLoadingLabel="Finalizando…"
				onCancel={() => !finalizing && setConfirmOpen(false)}
				onConfirm={handleConfirmPurchase}
			/>
			<Link
				to="/jogos"
				className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-neutral-400 transition hover:text-neutral-200"
			>
				← Continuar comprando
			</Link>
			<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">Carrinho</h1>

			{lines.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gs-raised text-neutral-500">
						<ShoppingBag className="h-11 w-11" strokeWidth={1.25} aria-hidden />
					</div>
					<p className="text-[14px] text-neutral-400">Seu carrinho está vazio.</p>
					<Link
						to="/jogos"
						className="mt-6 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Explorar Jogos
					</Link>
				</div>
			) : (
				<div className="mx-auto mt-7 max-w-xl space-y-4">
					{lines.map(({ game }) => (
						<motion.div
							key={game.id}
							layout
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center gap-3 rounded-xl border border-white/10 bg-gs-surface p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
						>
							<img
								src={game.image}
								alt={game.title}
								className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
							/>
							<div className="min-w-0 flex-1">
								<p className="text-[15px] font-semibold text-neutral-100">{game.title}</p>
								<p className="mt-0.5 text-[14px] font-semibold text-[var(--color-gs-accent)]">
									{formatBRL(game.price)}
								</p>
							</div>
							<button
								type="button"
								onClick={() => handleRemoveFromCart(game.id, game.title)}
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-red-950/50 hover:text-red-400"
								aria-label={`Remover ${game.title} do carrinho`}
							>
								<Trash2 className="h-5 w-5" strokeWidth={1.75} />
							</button>
						</motion.div>
					))}

					<div className="rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<span className="text-[14px] text-neutral-400">Total</span>
							<span className="text-xl font-bold text-neutral-100">{formatBRL(total)}</span>
						</div>
						<p className="mt-2 text-[12px] text-neutral-500">
							<Link
								to="/faq"
								className="text-neutral-400 underline-offset-2 hover:text-neutral-200 hover:underline"
							>
								Dúvidas sobre compras ou chaves?
							</Link>
						</p>
						<button
							type="button"
							onClick={() => setConfirmOpen(true)}
							disabled={finalizing}
							className="mt-4 w-full rounded-full bg-[var(--color-gs-accent)] py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)] disabled:pointer-events-none disabled:opacity-60"
						>
							Finalizar Compra
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
