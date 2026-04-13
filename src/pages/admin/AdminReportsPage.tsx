import { useEffect, useState } from "react";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import { listCompanies } from "@/services/api/companies";
import { getMostSoldGamesReport } from "@/services/api/reports";
import type { Company, MostSoldGameReportItem } from "@/types/domain";

export function AdminReportsPage() {
	const { token } = useAuth();
	const [companies, setCompanies] = useState<Company[]>([]);
	const [top, setTop] = useState("10");
	const [empresa, setEmpresa] = useState("");
	const [results, setResults] = useState<MostSoldGameReportItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [running, setRunning] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		const authToken = token;
		let cancelled = false;

		async function loadInitial() {
			setLoading(true);
			setError(null);
			try {
				const [nextCompanies, nextResults] = await Promise.all([
					listCompanies(authToken),
					getMostSoldGamesReport(authToken, { top: 10 }),
				]);
				if (!cancelled) {
					setCompanies(nextCompanies);
					setResults(nextResults);
				}
			} catch (nextError) {
				if (!cancelled) {
					setError(getFormErrorMessage(nextError, "Nao foi possivel carregar os relatorios."));
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void loadInitial();
		return () => {
			cancelled = true;
		};
	}, [token]);

	async function runReport() {
		if (!token) return;
		setRunning(true);
		setError(null);
		try {
			const report = await getMostSoldGamesReport(token, {
				top: Number(top),
				empresa: empresa ? Number(empresa) : undefined,
			});
			setResults(report);
		} catch (nextError) {
			setError(getFormErrorMessage(nextError, "Nao foi possivel executar o relatorio."));
		} finally {
			setRunning(false);
		}
	}

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
			<AdminSection title="Filtros" description="Consome /relatorios/jogos-mais-vendidos?top=&empresa=.">
				<div className="space-y-4">
					<label className="block text-[13px] font-semibold text-neutral-200">
						Top
						<input
							type="number"
							min="1"
							className={`${adminInputClass} mt-2`}
							value={top}
							onChange={(event) => setTop(event.target.value)}
						/>
					</label>
					<label className="block text-[13px] font-semibold text-neutral-200">
						Empresa (opcional)
						<select
							className={`${adminInputClass} mt-2`}
							value={empresa}
							onChange={(event) => setEmpresa(event.target.value)}
						>
							<option value="">Todas as empresas</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.nome}
								</option>
							))}
						</select>
					</label>
					<button
						type="button"
						className={adminButtonClass}
						onClick={() => {
							void runReport();
						}}
						disabled={running}
					>
						{running ? "Consultando..." : "Executar relatorio"}
					</button>
				</div>
			</AdminSection>

			<AdminSection title="Jogos mais vendidos" description="Resultado consolidado pelo backend.">
				{error ? <p className="mb-4 text-[13px] text-amber-300">{error}</p> : null}
				{loading ? (
					<p className="text-[14px] text-neutral-400">Carregando relatorio...</p>
				) : results.length === 0 ? (
					<p className="text-[14px] text-neutral-400">Nenhum resultado para os filtros atuais.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-[14px]">
							<thead className="text-[12px] uppercase tracking-wide text-neutral-500">
								<tr>
									<th className="pb-3 pr-4">Posicao</th>
									<th className="pb-3 pr-4">Jogo</th>
									<th className="pb-3 pr-4">Empresa</th>
									<th className="pb-3">Total</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/10">
								{results.map((item, index) => (
									<tr key={`${item.nome}-${index}`}>
										<td className="py-3 pr-4 text-neutral-400">#{index + 1}</td>
										<td className="py-3 pr-4 text-neutral-100">{item.nome}</td>
										<td className="py-3 pr-4 text-neutral-400">{item.empresa}</td>
										<td className="py-3 font-semibold text-[var(--color-gs-accent)]">{item.total}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</AdminSection>
		</div>
	);
}
