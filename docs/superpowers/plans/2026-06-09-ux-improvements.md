# UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar 5 melhorias de UX ao Game Store — badge "Mais vendido", página de sucesso de compra, contador + ordenação de jogos, retry em erros e stepper de checkout.

**Architecture:** Todas as mudanças são puramente de frontend. A melhoria 1 faz um fetch extra paralelo no carregamento da GamesPage (silencia erros de permissão). As demais são estado local ou novas rotas. Nenhuma nova dependência.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, React Router DOM 7, Vite/Bun

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/components/games/GameCard.tsx` | Modificar | Aceitar prop `isTopSeller`, renderizar badge |
| `src/pages/GamesPage.tsx` | Modificar | Fetch top sellers, sort, contador, retry |
| `src/pages/GameDetailPage.tsx` | Modificar | Retry button |
| `src/pages/admin/AdminReportsPage.tsx` | Modificar | Retry button |
| `src/pages/PurchaseSuccessPage.tsx` | Criar | Página de conclusão de compra |
| `src/app/App.tsx` | Modificar | Adicionar rota `/compra-concluida` |
| `src/pages/CartPage.tsx` | Modificar | Navegar para success page + stepper |

---

## Task 1: GameCard — prop `isTopSeller` + badge "Mais vendido"

**Files:**
- Modify: `src/components/games/GameCard.tsx`

- [ ] **Step 1: Adicionar `isTopSeller` ao tipo Props e renderizar badge**

Substituir o bloco do tipo `Props` e a assinatura da função:

```tsx
// Antes:
type Props = {
  game: ExhibitionGame | GameSummary;
  mode: "public" | "private";
};

export function GameCard({ game, mode }: Props) {
```

```tsx
// Depois:
type Props = {
  game: ExhibitionGame | GameSummary;
  mode: "public" | "private";
  isTopSeller?: boolean;
};

export function GameCard({ game, mode, isTopSeller }: Props) {
```

- [ ] **Step 2: Adicionar badge dentro do bloco de imagem e borda laranja no card**

No `GameCard`, dentro do `<div className="relative aspect-[16/10]...">`, após a `<span>` do `categoriaNome`, adicionar o badge (bottom-left — categoria já ocupa o top-left):

```tsx
{isTopSeller ? (
  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#e05a00] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
    Mais vendido
  </span>
) : null}
```

No `motion.article` raiz do GameCard, trocar o `ring-1 ring-white/[0.06]` por borda condicional:

```tsx
// Antes:
className="group overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.06]"

// Depois:
className={`group overflow-hidden rounded-xl bg-gs-surface shadow-[0_3px_18px_rgba(0,0,0,0.4)] ring-1 ${isTopSeller ? "ring-[var(--color-gs-accent)]/35" : "ring-white/[0.06]"}`}
```

- [ ] **Step 3: Verificar compilação**

```bash
bun run build
```

Esperado: build sem erros de TypeScript.

- [ ] **Step 4: Commit**

```bash
git add src/components/games/GameCard.tsx
git commit -m "feat: add isTopSeller prop and badge to GameCard (Von Restorff Effect)"
```

---

## Task 2: GamesPage — top sellers, sort, contador, retry

**Files:**
- Modify: `src/pages/GamesPage.tsx`

Esta task toca GamesPage de uma vez para evitar múltiplos commits no mesmo arquivo.

- [ ] **Step 1: Adicionar imports necessários**

Adicionar ao bloco de imports existente:

```tsx
import { getMostSoldGamesReport } from "@/services/api/reports";
```

- [ ] **Step 2: Adicionar estados novos**

Após os estados já existentes (`query`, `category`, etc.), adicionar:

```tsx
const [topSellerNames, setTopSellerNames] = useState<Set<string>>(new Set());
const [sort, setSort] = useState<"relevancia" | "preco-asc" | "preco-desc" | "nome-az">("relevancia");
const [retryCount, setRetryCount] = useState(0);
```

- [ ] **Step 3: Adicionar `retryCount` como dependência do useEffect e buscar top sellers**

Localizar o `useEffect` que faz o fetch. Adicionar `retryCount` ao array de dependências e, na branch autenticada, buscar top sellers em paralelo:

```tsx
// Substituir apenas a branch autenticada dentro do try:
if (isAuthenticated && token) {
  const [nextGames, nextCategories, nextTopSales] = await Promise.all([
    listGames(token),
    listCategories(token),
    getMostSoldGamesReport(token, { top: 3 }).catch(() => []),
  ]);

  if (!cancelled) {
    setGames(nextGames);
    setCategories(["Todos", ...nextCategories.map((item) => item.nome)]);
    setTopSellerNames(new Set(nextTopSales.slice(0, 3).map((s) => s.nome)));
  }
  return;
}
// (a branch pública permanece igual)
```

Atualizar o array de dependências do useEffect:

```tsx
}, [isAuthenticated, token, retryCount]);
```

- [ ] **Step 4: Derivar array `sorted` a partir de `filtered`**

Após o `useMemo` do `filtered`, adicionar:

```tsx
const sorted = useMemo(() => {
  const arr = [...filtered];
  if (sort === "preco-asc") arr.sort((a, b) => a.precoFinal - b.precoFinal);
  else if (sort === "preco-desc") arr.sort((a, b) => b.precoFinal - a.precoFinal);
  else if (sort === "nome-az") arr.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  return arr;
}, [filtered, sort]);
```

- [ ] **Step 5: Adicionar UI de contador + ordenação**

Logo após `{error ? ... : null}` e antes da grid/loading, adicionar:

```tsx
{!loading && sorted.length > 0 ? (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <p className="text-[13px] text-neutral-400">
      <span className="font-semibold text-neutral-100">{sorted.length}</span>{" "}
      {sorted.length === 1 ? "jogo encontrado" : "jogos encontrados"}
    </p>
    <div className="flex items-center gap-2">
      <label htmlFor="games-sort" className="text-[12px] text-neutral-500">
        Ordenar:
      </label>
      <select
        id="games-sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as typeof sort)}
        className="rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[12px] text-neutral-100 outline-none focus:border-[var(--color-gs-accent)]/30"
      >
        <option value="relevancia">Relevância</option>
        <option value="preco-asc">Menor preço</option>
        <option value="preco-desc">Maior preço</option>
        <option value="nome-az">A–Z</option>
      </select>
    </div>
  </div>
) : null}
```

- [ ] **Step 6: Adicionar retry button no estado de erro**

Localizar `{error ? <p ...>{error}</p> : null}` e substituir por:

```tsx
{error ? (
  <div className="mb-5 flex flex-wrap items-center gap-3">
    <p className="text-[14px] text-amber-300">{error}</p>
    <button
      type="button"
      onClick={() => setRetryCount((c) => c + 1)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[13px] font-medium text-neutral-300 transition hover:bg-neutral-700/60"
    >
      ↺ Tentar novamente
    </button>
  </div>
) : null}
```

- [ ] **Step 7: Trocar `filtered` por `sorted` na renderização e passar `isTopSeller`**

Localizar os dois blocos de grid (loading skeleton e grid real). No grid real, trocar `filtered.map` por `sorted.map` e adicionar a prop `isTopSeller`:

```tsx
// Substituir:
<ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {filtered.map((game) => (
    <li key={"id" in game ? game.id : `${game.nome}-${game.empresaNome}`}>
      <GameCard
        game={game}
        mode={isAuthenticated ? "private" : "public"}
      />
    </li>
  ))}
</ul>

// Por:
<ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {sorted.map((game) => (
    <li key={"id" in game ? game.id : `${game.nome}-${game.empresaNome}`}>
      <GameCard
        game={game}
        mode={isAuthenticated ? "private" : "public"}
        isTopSeller={topSellerNames.has(game.nome)}
      />
    </li>
  ))}
</ul>
```

- [ ] **Step 8: Verificar compilação**

```bash
bun run build
```

Esperado: sem erros.

- [ ] **Step 9: Commit**

```bash
git add src/pages/GamesPage.tsx
git commit -m "feat: add top seller badge fetch, sort, counter and retry to GamesPage (H7 + Von Restorff)"
```

---

## Task 3: GameDetailPage — retry button

**Files:**
- Modify: `src/pages/GameDetailPage.tsx`

- [ ] **Step 1: Adicionar estado `retryCount`**

Após os estados existentes, adicionar:

```tsx
const [retryCount, setRetryCount] = useState(0);
```

- [ ] **Step 2: Adicionar `retryCount` como dependência do useEffect**

Localizar o `useEffect` principal e adicionar `retryCount` ao array:

```tsx
}, [numericId, token, retryCount]);
```

- [ ] **Step 3: Substituir exibição de erro por erro + retry**

Localizar `{error ? <p className="mb-4 text-[14px] text-amber-300">{error}</p> : null}` (logo antes da grid de imagem+detalhes) e substituir por:

```tsx
{error ? (
  <div className="mb-4 flex flex-wrap items-center gap-3">
    <p className="text-[14px] text-amber-300">{error}</p>
    <button
      type="button"
      onClick={() => setRetryCount((c) => c + 1)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[13px] font-medium text-neutral-300 transition hover:bg-neutral-700/60"
    >
      ↺ Tentar novamente
    </button>
  </div>
) : null}
```

- [ ] **Step 4: Verificar compilação e commit**

```bash
bun run build
git add src/pages/GameDetailPage.tsx
git commit -m "feat: add retry button on error in GameDetailPage (H9)"
```

---

## Task 4: AdminReportsPage — retry button

**Files:**
- Modify: `src/pages/admin/AdminReportsPage.tsx`

- [ ] **Step 1: Adicionar estado `retryCount`**

Após os estados existentes, adicionar:

```tsx
const [retryCount, setRetryCount] = useState(0);
```

- [ ] **Step 2: Adicionar `retryCount` como dependência do useEffect**

Localizar o `useEffect` e atualizar o array de dependências:

```tsx
}, [token, retryCount]);
```

- [ ] **Step 3: Substituir exibição de erro por erro + retry**

Localizar `{error ? <p className="text-[14px] text-amber-300">{error}</p> : null}` e substituir por:

```tsx
{error ? (
  <div className="flex flex-wrap items-center gap-3">
    <p className="text-[14px] text-amber-300">{error}</p>
    <button
      type="button"
      onClick={() => setRetryCount((c) => c + 1)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-gs-raised px-3 py-1.5 text-[13px] font-medium text-neutral-300 transition hover:bg-neutral-700/60"
    >
      ↺ Tentar novamente
    </button>
  </div>
) : null}
```

- [ ] **Step 4: Verificar compilação e commit**

```bash
bun run build
git add src/pages/admin/AdminReportsPage.tsx
git commit -m "feat: add retry button on error in AdminReportsPage (H9)"
```

---

## Task 5: PurchaseSuccessPage — nova página

**Files:**
- Create: `src/pages/PurchaseSuccessPage.tsx`

- [ ] **Step 1: Criar o arquivo**

```tsx
import { motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";

type LocationState = { items: string[]; total: number } | null;

export function PurchaseSuccessPage() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state?.items?.length) return <Navigate to="/jogos" replace />;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-gs-accent)]/15 text-5xl"
        role="img"
        aria-label="Controle de jogo"
      >
        🎮
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 26 }}
        className="text-2xl font-bold tracking-tight text-neutral-100"
      >
        Compra concluída!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-[14px] text-neutral-400"
      >
        {state.items.length === 1
          ? "1 jogo adicionado"
          : `${state.items.length} jogos adicionados`}{" "}
        à sua biblioteca
      </motion.p>

      <motion.ul
        role="list"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-5 w-full rounded-xl border border-white/10 bg-gs-surface p-4 text-left"
      >
        {state.items.map((name) => (
          <li key={name} className="flex items-center gap-2 py-1 text-[13px] text-neutral-300">
            <span className="font-bold text-[var(--color-gs-accent)]">✓</span>
            {name}
          </li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-7 flex gap-3"
      >
        <Link
          to="/biblioteca"
          className="rounded-full bg-[var(--color-gs-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_18px_rgba(255,140,51,0.32)] transition hover:bg-[var(--color-gs-accent-hover)]"
        >
          Ir para Biblioteca
        </Link>
        <Link
          to="/jogos"
          className="rounded-full border border-white/15 bg-gs-surface px-5 py-3 text-[14px] font-semibold text-neutral-200 transition hover:bg-gs-raised"
        >
          Ver Jogos
        </Link>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
bun run build
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PurchaseSuccessPage.tsx
git commit -m "feat: add PurchaseSuccessPage (Peak-End Rule)"
```

---

## Task 6: App.tsx + CartPage — rota e navegação para success

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/pages/CartPage.tsx`

- [ ] **Step 1: Registrar rota em App.tsx**

Adicionar import:

```tsx
import { PurchaseSuccessPage } from "@/pages/PurchaseSuccessPage";
```

Dentro do bloco `<Route element={<RequireAuth />}>`, adicionar a nova rota:

```tsx
<Route path="compra-concluida" element={<PurchaseSuccessPage />} />
```

- [ ] **Step 2: Adicionar `useNavigate` e capturar itens antes de finalizar em CartPage**

Adicionar `useNavigate` ao import do React Router:

```tsx
import { Link, useNavigate } from "react-router-dom";
```

Adicionar `navigate` dentro do componente `CartPage`:

```tsx
const navigate = useNavigate();
```

- [ ] **Step 3: Substituir `handleConfirmPurchase` para navegar após sucesso**

```tsx
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
```

- [ ] **Step 4: Verificar compilação**

```bash
bun run build
```

Esperado: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/app/App.tsx src/pages/CartPage.tsx
git commit -m "feat: navigate to PurchaseSuccessPage after checkout (Peak-End Rule)"
```

---

## Task 7: CartPage — checkout stepper (Goal Gradient Effect)

**Files:**
- Modify: `src/pages/CartPage.tsx`

- [ ] **Step 1: Adicionar componente `CheckoutStepper` no topo do arquivo (antes de `CartPage`)**

```tsx
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
```

- [ ] **Step 2: Renderizar `<CheckoutStepper>` no topo da view com itens**

No JSX do `CartPage`, na branch `items.length > 0`, logo após o título `<h1>Carrinho</h1>` e antes do grid `<div className="mx-auto mt-7 grid...">`, adicionar:

```tsx
<CheckoutStepper step={confirmOpen ? 3 : 2} />
```

- [ ] **Step 3: Verificar compilação**

```bash
bun run build
```

Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/pages/CartPage.tsx
git commit -m "feat: add CheckoutStepper to CartPage (Goal Gradient Effect)"
```

---

## Verificação Final Manual

Após todos os commits, rodar `bun dev` e verificar no browser:

- [ ] **Badge:** Logar como admin → `/jogos` → confirmar badge "Mais vendido" nos top 3 do relatório
- [ ] **Ordenação:** Selecionar "Menor preço" → jogos reordenam sem reload. Contador exibe número correto
- [ ] **Retry:** Desligar o backend → abrir `/jogos` → aparece mensagem + botão "↺ Tentar novamente"
- [ ] **Success page:** Adicionar jogo ao carrinho → finalizar compra → tela de sucesso aparece com animação e lista de jogos
- [ ] **Stepper:** `/carrinho` com itens → stepper mostra etapa 2 ativa → clicar "Finalizar Compra" → modal abre → stepper avança para etapa 3
