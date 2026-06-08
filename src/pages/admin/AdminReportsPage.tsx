import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { AdminSection } from "@/components/admin/AdminSection";
import { adminButtonClass, adminInputClass } from "@/components/admin/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getFormErrorMessage } from "@/lib/formErrors";
import { listGames } from "@/services/api/games";
import { getMostSoldGamesReport } from "@/services/api/reports";
import type { GameSummary, MostSoldGameReportItem } from "@/types/domain";

const COLORS = ["#ff7a00", "#ff9a3c", "#e05a00", "#ffa64d", "#cc4800", "#ffb366", "#b33d00", "#ffc280"];

const TOOLTIP_STYLE = {
	contentStyle: {
		backgroundColor: "#1a1a1a",
		border: "1px solid rgba(255,255,255,0.1)",
		borderRadius: "12px",
	},
	labelStyle: { color: "#f5f5f5" },
	itemStyle: { color: "#a3a3a3" },
};

function buildEmpresaData(sales: MostSoldGameReportItem[]) {
	const acc: Record<string, number> = {};
	for (const item of sales) {
		acc[item.empresa] = (acc[item.empresa] ?? 0) + item.total;
	}
	return Object.entries(acc)
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value);
}

function buildCategoriaData(sales: MostSoldGameReportItem[], games: GameSummary[]) {
	const catByName = new Map(games.map((g) => [g.nome, g.categoriaNome]));
	const acc: Record<string, number> = {};
	for (const item of sales) {
		const cat = catByName.get(item.nome) ?? "Outros";
		acc[cat] = (acc[cat] ?? 0) + item.total;
	}
	return Object.entries(acc)
		.map(([name, total]) => ({ name, total }))
		.sort((a, b) => b.total - a.total);
}

export function AdminReportsPage() {
	const { token } = useAuth();
	const [topN, setTopN] = useState(10);
	const [topInput, setTopInput] = useState("10");
	const [allSales, setAllSales] = useState<MostSoldGameReportItem[]>([]);
	const [gamesData, setGamesData] = useState<GameSummary[]>([]);
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
				const [nextSales, nextGames] = await Promise.all([
					getMostSoldGamesReport(authToken, { top: 50 }),
					listGames(authToken),
				]);
				if (!cancelled) {
					setAllSales(nextSales);
					setGamesData(nextGames);
				}
			} catch (err) {
				if (!cancelled) {
					setError(getFormErrorMessage(err, "Não foi possível carregar os relatórios."));
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

	const topSales = allSales.slice(0, topN);
	const empresaData = buildEmpresaData(allSales);
	const categoriaData = buildCategoriaData(allSales, gamesData);

	const axisProps = { tick: { fill: "#a3a3a3", fontSize: 12 } };
	const gridProps = { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.08)" };

	return (
		<div className="space-y-6">
			{error ? <p className="text-[14px] text-amber-300">{error}</p> : null}
			{loading ? (
				<p className="text-[14px] text-neutral-400">Carregando relatórios...</p>
			) : (
				<>
					<AdminSection
						title="Top Jogos Mais Vendidos"
						description="Os jogos com maior volume de vendas. Ajuste o Top N para filtrar."
					>
						<div className="mb-4 flex items-center gap-3">
							<label className="text-[13px] font-semibold text-neutral-200">
								Top
								<input
									type="number"
									min="1"
									max="50"
									className={`${adminInputClass} ml-2 w-20`}
									value={topInput}
									onChange={(e) => setTopInput(e.target.value)}
								/>
							</label>
							<button
								type="button"
								className={adminButtonClass}
								onClick={() => setTopN(Math.min(50, Math.max(1, Number(topInput))))}
							>
								Aplicar
							</button>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={topSales} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
								<CartesianGrid {...gridProps} />
								<XAxis dataKey="nome" {...axisProps} angle={-35} textAnchor="end" interval={0} />
								<YAxis {...axisProps} />
								<Tooltip {...TOOLTIP_STYLE} />
								<Bar dataKey="total" name="Vendas" fill="#ff7a00" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</AdminSection>

					<AdminSection
						title="Vendas por Empresa"
						description="Proporção de vendas entre as publishers cadastradas."
					>
						<ResponsiveContainer width="100%" height={320}>
							<PieChart>
								<Pie
									data={empresaData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={90}
								>
									{empresaData.map((_, index) => (
										<Cell key={index} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									{...TOOLTIP_STYLE}
									formatter={(value: number) => [value, "Vendas"]}
								/>
								<Legend
									formatter={(value) => (
										<span style={{ color: "#a3a3a3", fontSize: 13 }}>{value}</span>
									)}
								/>
							</PieChart>
						</ResponsiveContainer>
					</AdminSection>

					<AdminSection
						title="Ranking Geral"
						description="Todos os jogos ordenados por volume de vendas."
					>
						<div className="overflow-x-auto">
							<div style={{ minWidth: 480 }}>
								<ResponsiveContainer
									width="100%"
									height={Math.max(300, allSales.length * 36)}
								>
									<BarChart
										data={allSales}
										layout="vertical"
										margin={{ top: 10, right: 40, left: 120, bottom: 10 }}
									>
										<CartesianGrid {...gridProps} horizontal={false} />
										<XAxis type="number" {...axisProps} />
										<YAxis type="category" dataKey="nome" {...axisProps} width={120} />
										<Tooltip {...TOOLTIP_STYLE} />
										<Bar dataKey="total" name="Vendas" fill="#ff9a3c" radius={[0, 6, 6, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</AdminSection>

					<AdminSection
						title="Vendas por Categoria"
						description="Volume de vendas agrupado por gênero de jogo."
					>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart
								data={categoriaData}
								margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
							>
								<CartesianGrid {...gridProps} />
								<XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} />
								<YAxis {...axisProps} />
								<Tooltip {...TOOLTIP_STYLE} />
								<Bar dataKey="total" name="Vendas" fill="#e05a00" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</AdminSection>
				</>
			)}
		</div>
	);
}
