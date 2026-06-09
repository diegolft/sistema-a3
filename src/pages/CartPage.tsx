import { motion } from "framer-motion";
import { CreditCard, QrCode, ReceiptText, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/contexts/CartContext";
import { formatBRL } from "@/lib/currency";
import type { PaymentMethod } from "@/types/domain";

const PAYMENT_METHODS: Array<{
	value: PaymentMethod;
	label: string;
	description: string;
	Icon: typeof CreditCard;
}> = [
	{
		value: "pix",
		label: "Pix",
		description: "Pagamento instantaneo para liberar sua compra em seguida.",
		Icon: QrCode,
	},
	{
		value: "cartao",
		label: "Cartao",
		description: "Use o fluxo simplificado da API para cartao de credito.",
		Icon: CreditCard,
	},
	{
		value: "boleto",
		label: "Boleto",
		description: "Geracao simulada pelo backend da loja.",
		Icon: ReceiptText,
	},
];

function CheckoutStepper({ step }: { step: 1 | 2 | 3 }) {
	const steps = [
		{ n: 1 as const, label: "Carrinho" },
		{ n: 2 as const, label: "Pagamento" },
		{ n: 3 as const, label: "Confirmação" },
	];
	return (
		<div className="mb-7 flex items-start">
			{steps.map(({ n, label }, index) => {
				const done = n < step;
				const active = n === step;
				return (
					<div key={label} className="flex flex-1 items-center">
						<div className="flex shrink-0 flex-col items-center gap-1">
							<div
								className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition ${
									done || active
										? "bg-[var(--color-gs-accent)] text-white"
										: "border-2 border-white/10 bg-gs-raised text-neutral-500"
								} ${active ? "ring-2 ring-[var(--color-gs-accent)]/25 ring-offset-2 ring-offset-[#0a0a0a]" : ""}`}
							>
								{done ? "✓" : n}
							</div>
							<span
								className={`whitespace-nowrap text-[10px] font-medium ${
									done || active ? "text-[var(--color-gs-accent)]" : "text-neutral-500"
								}`}
							>
								{label}
							</span>
						</div>
						{index < 2 && (
							<div
								className={`mb-5 mx-2 h-[2px] flex-1 transition ${
									done ? "bg-[var(--color-gs-accent)]" : "bg-white/10"
								}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export function CartPage() {
	const { cart, items, addToCart, removeFromCart, finalizePurchase, isLoading } = useCart();
	const navigate = useNavigate();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [finalizing, setFinalizing] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
	const total = cart?.total ?? 0;

	async function handleConfirmPurchase() {
		const purchasedItems = items.map(({ jogo }) => jogo.nome);
		const purchasedTotal = total;
		setFinalizing(true);
		try {
			await finalizePurchase(paymentMethod);
			setConfirmOpen(false);
			navigate("/compra-concluida", {
				state: { items: purchasedItems, total: purchasedTotal },
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Nao foi possivel concluir a compra.");
		} finally {
			setFinalizing(false);
		}
	}

	async function handleRemoveFromCart(gameId: number, title: string) {
		try {
			await removeFromCart(gameId);
			toast.message(`${title} foi removido do carrinho.`, {
				action: {
					label: "Desfazer",
					onClick: () => {
						void addToCart(gameId).catch(() => {
							/* toast handled by context consumer */
						});
					},
				},
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Nao foi possivel remover o item.");
		}
	}

	if (isLoading) {
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
							{items.length} {items.length === 1 ? "jogo" : "jogos"}
						</strong>{" "}
						por <strong className="text-neutral-200">{formatBRL(total)}</strong> usando{" "}
						<strong className="text-neutral-200">
							{PAYMENT_METHODS.find((item) => item.value === paymentMethod)?.label}
						</strong>
						?
					</>
				}
				cancelLabel="Cancelar"
				confirmLabel="Confirmar compra"
				confirmLoading={finalizing}
				confirmLoadingLabel="Finalizando..."
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

			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gs-raised text-neutral-500">
						<ShoppingBag className="h-11 w-11" strokeWidth={1.25} aria-hidden />
					</div>
					<p className="text-[14px] text-neutral-400">Seu carrinho esta vazio.</p>
					<Link
						to="/jogos"
						className="mt-6 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Explorar Jogos
					</Link>
				</div>
			) : (
				<>
					<CheckoutStepper step={confirmOpen ? 3 : 2} />
					<div className="mx-auto mt-7 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
						<ul role="list" className="space-y-4">
							{items.map(({ jogo }) => (
								<motion.li
									key={jogo.id}
									layout
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-3 rounded-xl border border-white/10 bg-gs-surface p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
								>
									<img
										src={jogo.imageUrl}
										alt={jogo.nome}
										className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
									/>
									<div className="min-w-0 flex-1">
										<p className="text-[15px] font-semibold text-neutral-100">{jogo.nome}</p>
										<p className="mt-0.5 text-[13px] text-neutral-400">
											{jogo.empresaNome} • {jogo.categoriaNome}
										</p>
										<p className="mt-1 text-[14px] font-semibold text-[var(--color-gs-accent)]">
											{formatBRL(jogo.precoFinal)}
										</p>
									</div>
									<button
										type="button"
										onClick={() => {
											void handleRemoveFromCart(jogo.id, jogo.nome);
										}}
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-red-950/50 hover:text-red-400"
										aria-label={`Remover ${jogo.nome} do carrinho`}
									>
										<Trash2 className="h-5 w-5" strokeWidth={1.75} />
									</button>
								</motion.li>
							))}
						</ul>

						<div className="h-fit rounded-xl border border-white/10 bg-gs-surface p-5 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<span className="text-[14px] text-neutral-400">Total</span>
								<span className="text-xl font-bold text-neutral-100">{formatBRL(total)}</span>
							</div>
							<p className="mt-2 text-[12px] text-neutral-500">
								Os jogos comprados entram automaticamente na sua biblioteca apos o checkout.
							</p>

							<div role="radiogroup" aria-label="Metodo de pagamento" className="mt-5 space-y-3">
								<p className="text-[13px] font-semibold text-neutral-200">Metodo de pagamento</p>
								{PAYMENT_METHODS.map(({ value, label, description, Icon }) => {
									const selected = paymentMethod === value;
									return (
										<div
											key={value}
											role="radio"
											aria-checked={selected}
											tabIndex={0}
											onClick={() => setPaymentMethod(value)}
											onKeyDown={(e) => {
												if (e.key === " " || e.key === "Enter") setPaymentMethod(value);
											}}
											className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
												selected
													? "border-[var(--color-gs-accent)] bg-[var(--color-gs-accent)]/10"
													: "border-white/10 bg-gs-raised hover:border-white/20"
											}`}
										>
											<span
												className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
													selected ? "border-[var(--color-gs-accent)]" : "border-neutral-600"
												}`}
											>
												{selected && <span className="h-2 w-2 rounded-full bg-[var(--color-gs-accent)]" />}
											</span>
											<Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gs-accent)]" strokeWidth={1.8} />
											<span className="min-w-0">
												<span className="block text-[13px] font-semibold text-neutral-100">{label}</span>
												<span className="mt-0.5 block text-[12px] leading-relaxed text-neutral-400">
													{description}
												</span>
											</span>
										</div>
									);
								})}
							</div>

							<button
								type="button"
								onClick={() => setConfirmOpen(true)}
								disabled={finalizing}
								className="mt-5 w-full rounded-full bg-[var(--color-gs-accent)] py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)] disabled:pointer-events-none disabled:opacity-60"
							>
								Finalizar Compra
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
