# Relatórios com Gráficos + Histórico de Compras — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar 4 gráficos interativos na página de relatórios do admin e criar a página de histórico de compras para clientes.

**Architecture:** A `AdminReportsPage` faz 2 chamadas paralelas (`getMostSoldGamesReport` + `listGames`) e agrega os dados client-side para gerar 4 visualizações distintas. A `SalesHistoryPage` reutiliza `listSales` que já existe. Nenhum endpoint da API é alterado.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, recharts (novo), lucide-react, react-router-dom v7

---

## Arquivos

| Ação | Arquivo |
|------|---------|
| Modificar | `package.json` |
| Reescrever | `src/pages/admin/AdminReportsPage.tsx` |
| Criar | `src/pages/SalesHistoryPage.tsx` |
| Modificar | `src/app/App.tsx` |
| Modificar | `src/components/layout/AppHeader.tsx` |

---

## Task 1: Instalar recharts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar o pacote**

```bash
cd "D:/Downloads/A3web"
bun add recharts
```

Expected output: algo como `+ recharts@2.x.x` sem erros.

- [ ] **Step 2: Verificar que apareceu no package.json**

Abrir `package.json` e confirmar que `"recharts"` aparece em `dependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add recharts for report charts"
```

---

## Task 2: Reescrever AdminReportsPage com 4 gráficos

**Files:**
- Modify: `src/pages/admin/AdminReportsPage.tsx`

Esta página faz 2 chamadas na montagem (via `Promise.all`) e deriva todas as agregações client-side. Os gráficos são renderizados diretamente na página, sem componentes genéricos novos.

- [ ] **Step 1: Substituir o conteúdo de `AdminReportsPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
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
									outerRadius={120}
									label={({ name, percent }: { name: string; percent: number }) =>
										`${name} ${(percent * 100).toFixed(0)}%`
									}
									labelLine={false}
								>
									{empresaData.map((_, index) => (
										<Cell key={index} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									{...TOOLTIP_STYLE}
									formatter={(value: number) => [value, "Vendas"]}
								/>
							</PieChart>
						</ResponsiveContainer>
					</AdminSection>

					<AdminSection
						title="Ranking Geral"
						description="Todos os jogos ordenados por volume de vendas."
					>
						<div className="overflow-x-auto">
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
```

- [ ] **Step 2: Verificar no navegador**

Subir o servidor (`bun run dev`), logar como admin (`admin@avjd.com` / `admin123`), acessar `/admin/relatorios`. Deve aparecer 4 seções com gráficos. Se a API não tiver dados de vendas ainda, os gráficos estarão vazios mas não devem quebrar.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminReportsPage.tsx
git commit -m "feat: rewrite AdminReportsPage with 4 recharts visualizations"
```

---

## Task 3: Criar SalesHistoryPage

**Files:**
- Create: `src/pages/SalesHistoryPage.tsx`

- [ ] **Step 1: Criar o arquivo `src/pages/SalesHistoryPage.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SalesHistoryPage.tsx
git commit -m "feat: add SalesHistoryPage with purchase history list"
```

---

## Task 4: Adicionar rota /historico e link no header

**Files:**
- Modify: `src/app/App.tsx` (linhas 17–66, bloco de imports e routes)
- Modify: `src/components/layout/AppHeader.tsx`

- [ ] **Step 1: Adicionar import e rota em `App.tsx`**

No topo do arquivo, adicionar o import da nova página logo após o import de `WishlistPage`:

```tsx
import { SalesHistoryPage } from "@/pages/SalesHistoryPage";
```

Dentro do bloco `<Route element={<RequireAuth />}>`, adicionar a nova rota após `perfil`:

```tsx
<Route path="historico" element={<SalesHistoryPage />} />
```

O bloco completo deve ficar assim:

```tsx
<Route element={<RequireAuth />}>
  <Route path="jogos/:id" element={<GameDetailPage />} />
  <Route path="carrinho" element={<CartPage />} />
  <Route path="lista-desejos" element={<WishlistPage />} />
  <Route path="biblioteca" element={<LibraryPage />} />
  <Route path="perfil" element={<ProfilePage />} />
  <Route path="historico" element={<SalesHistoryPage />} />
</Route>
```

- [ ] **Step 2: Adicionar link "Histórico" no desktop nav em `AppHeader.tsx`**

Localizar o bloco do nav desktop (dentro de `<nav className="absolute left-1/2...">`). Adicionar o NavLink de "Histórico" logo após o de "Biblioteca":

```tsx
{isAuthenticated ? (
  <NavLink
    to="/historico"
    className={({ isActive }) => `${navBase} ${isActive ? navActive : ""}`}
  >
    Histórico
  </NavLink>
) : null}
```

- [ ] **Step 3: Adicionar link "Histórico" no mobile nav em `AppHeader.tsx`**

Localizar o bloco do nav mobile (dentro de `<nav id="mobile-main-nav"...>`). Adicionar logo após o NavLink de "Biblioteca":

```tsx
{isAuthenticated ? (
  <NavLink
    to="/historico"
    onClick={closeMobileNav}
    className={({ isActive }) =>
      `rounded-lg px-3 py-2.5 ${navBase} ${isActive ? navActive : ""}`
    }
  >
    Histórico
  </NavLink>
) : null}
```

- [ ] **Step 4: Verificar no navegador**

Logar como cliente (`cliente@avjd.com` / `cliente123`). O header deve mostrar "Histórico" no nav. Clicar deve abrir a página de histórico. Se não houver compras, deve aparecer o estado vazio com link para jogos.

- [ ] **Step 5: Commit**

```bash
git add src/app/App.tsx src/components/layout/AppHeader.tsx
git commit -m "feat: add /historico route and nav link for authenticated users"
```

---

## Self-Review

**Spec coverage:**
- ✅ recharts instalado (Task 1)
- ✅ AdminReportsPage com 4 gráficos: top jogos (bar), por empresa (pie), ranking geral (bar horizontal), por categoria (bar) (Task 2)
- ✅ SalesHistoryPage com listagem de compras (Task 3)
- ✅ Rota `/historico` adicionada dentro de `RequireAuth` (Task 4)
- ✅ Link "Histórico" no header desktop e mobile (Task 4)
- ✅ Nenhum endpoint da API alterado

**Placeholder scan:** Nenhum TBD ou TODO no plano. Todo código está completo.

**Type consistency:**
- `MostSoldGameReportItem` usado em `AdminReportsPage` — definido em `src/types/domain.ts` ✅
- `GameSummary` usado em `buildCategoriaData` — definido em `src/types/domain.ts` ✅
- `Sale` usado em `SalesHistoryPage` — definido em `src/types/domain.ts` ✅
- `listGames`, `getMostSoldGamesReport`, `listSales` — todos existem nos respectivos arquivos de serviço ✅
- `formatBRL`, `formatDisplayDateTime`, `getFormErrorMessage` — todos existem ✅
- `AdminSection`, `adminButtonClass`, `adminInputClass`, `Skeleton` — todos existem ✅
