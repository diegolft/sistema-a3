import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL } from "@/lib/currency";
import { formatDisplayDateTime } from "@/lib/date";
import { getFormErrorMessage } from "@/lib/formErrors";
import { listSales } from "@/services/api/sales";
import type { Sale } from "@/types/domain";

export function SalesHistoryPage() {
	const { token } = useAuth();
	const [sales, setSales] = useState<Sale[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		const authToken = token;
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const nextSales = await listSales(authToken);
				if (!cancelled) {
					setSales(
						nextSales.sort(
							(a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
						),
					);
				}
			} catch (err) {
				if (!cancelled) {
					setError(getFormErrorMessage(err, "Não foi possível carregar o histórico."));
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
	}, [token]);

	if (loading) {
		return (
			<div className="space-y-3">
				<Skeleton className="mb-6 h-8 w-64" />
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-20 w-full rounded-2xl" />
				))}
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-neutral-100 md:text-3xl">
				Histórico de Compras
			</h1>
			<p className="mt-1 text-[14px] text-neutral-400">
				Todas as suas compras realizadas na loja.
			</p>

			{error ? <p className="mt-4 text-[14px] text-amber-300">{error}</p> : null}

			{sales.length === 0 && !error ? (
				<div className="mt-12 flex flex-col items-center justify-center text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gs-raised text-neutral-500">
						<ShoppingBag className="h-11 w-11" strokeWidth={1.25} aria-hidden />
					</div>
					<p className="text-[14px] text-neutral-400">
						Você ainda não realizou nenhuma compra.
					</p>
					<Link
						to="/jogos"
						className="mt-6 rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
					>
						Explorar Jogos
					</Link>
				</div>
			) : (
				<div className="mt-6 space-y-3">
					{sales.map((sale) => (
						<div
							key={sale.id}
							className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gs-surface p-4 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
						>
							<div>
								<p className="text-[13px] text-neutral-400">
									{formatDisplayDateTime(sale.data)}
								</p>
								<p className="mt-0.5 text-[14px] font-semibold text-neutral-100">
									{sale.quantidade}{" "}
									{sale.quantidade === 1 ? "jogo comprado" : "jogos comprados"}
								</p>
							</div>
							<p className="text-lg font-bold text-[var(--color-gs-accent)]">
								{formatBRL(sale.valorTotal)}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
