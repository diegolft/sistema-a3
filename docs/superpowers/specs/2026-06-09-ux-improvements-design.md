# UX Improvements — Design Spec
**Data:** 2026-06-09
**Projeto:** Game Store (A3 — Usabilidade e Desenvolvimento Web)

## Contexto

O projeto já implementa as heurísticas H1–H6, H8 e H10 de Nielsen de forma sólida. Este spec cobre as 5 melhorias que completam a cobertura das 10 heurísticas e adicionam leis de UX demonstráveis durante a apresentação.

---

## Melhoria 1 — Badge "Mais vendido" (Von Restorff Effect)

**Lei aplicada:** Von Restorff Effect — itens visualmente distintos são notados e lembrados primeiro.

**Comportamento:**
- Ao carregar a `GamesPage` (autenticado), buscar o relatório de mais vendidos em paralelo com a listagem de jogos via `getMostSoldGamesReport`.
- Extrair os nomes (`nome`) dos 3 primeiros itens do relatório. O endpoint retorna `{ nome, empresa, total }` — sem `id` — portanto o cruzamento é feito por nome.
- Derivar um `Set<string>` de nomes top-3 e marcar cada jogo da lista com `isTopSeller = topNomes.has(jogo.nome)`.
- Passar `isTopSeller?: boolean` para o `GameCard`.
- Se `isTopSeller === true`, renderizar badge `"Mais vendido"` no canto superior esquerdo da imagem do card, com gradiente laranja (`from-[#ff7a00] to-[#e05a00]`), sobreposto à capa.
- Para usuários não autenticados (vitrine pública), o badge não aparece — o endpoint de relatório exige autenticação.
- O card top-seller recebe também uma borda sutil laranja (`border-[var(--color-gs-accent)]/35`) para reforçar o destaque.

**Arquivos afetados:**
- `src/pages/GamesPage.tsx` — fetch paralelo do relatório, derivar set de top-3 IDs, passar prop para GameCard
- `src/components/games/GameCard.tsx` — aceitar e renderizar `isTopSeller`
- `src/services/api/reports.ts` — já existe `getMostSoldGamesReport`, reutilizar

---

## Melhoria 2 — Página de Sucesso de Compra (Peak-End Rule)

**Lei aplicada:** Peak-End Rule — pessoas julgam uma experiência pelo momento mais marcante e pelo fim. O checkout é o fim; precisa ser memorável.

**Comportamento:**
- Nova rota `/compra-concluida` protegida por `RequireAuth`.
- `CartContext.finalizePurchase` passa a navegar para `/compra-concluida` após sucesso, enviando via `state` do React Router: `{ items: string[], total: number }` (nomes dos jogos comprados e valor total).
- A página `PurchaseSuccessPage` exibe:
  - Ícone de jogo animado (framer-motion: scale 0→1 com spring)
  - Título "Compra concluída!"
  - Subtítulo com quantidade de jogos
  - Lista com os nomes dos jogos comprados (do state)
  - Botão primário "Ir para Biblioteca" → `/biblioteca`
  - Botão secundário "Ver Jogos" → `/jogos`
- Se o usuário acessar `/compra-concluida` sem state (navegação direta), redirecionar para `/jogos`.

**Arquivos afetados:**
- `src/pages/PurchaseSuccessPage.tsx` — novo arquivo
- `src/app/App.tsx` — adicionar rota `/compra-concluida` dentro de `RequireAuth`
- `src/contexts/CartContext.tsx` — após `finalizePurchase`, navegar para `/compra-concluida` com state

---

## Melhoria 3 — Contador de Resultados + Ordenação (Heurística 7 — Eficiência)

**Heurística aplicada:** H7 — Flexibilidade e eficiência de uso. Usuários experientes precisam de atalhos e controles para trabalhar mais rápido.

**Comportamento:**
- Acima do grid de jogos na `GamesPage`, exibir: `"X jogos encontrados"` onde X é `filtered.length`.
- Ao lado, um `<select>` com as opções:
  - `relevancia` — ordem original da API (padrão)
  - `preco-asc` — menor preço primeiro
  - `preco-desc` — maior preço primeiro
  - `nome-az` — ordem alfabética A→Z
- A ordenação é aplicada sobre o array `filtered` já existente, sem nova chamada à API. Novo estado `sort` no componente.
- O contador atualiza reativamente junto com a busca e o filtro de categoria.

**Arquivos afetados:**
- `src/pages/GamesPage.tsx` — estado `sort`, lógica de ordenação sobre `filtered`, UI de contador e select

---

## Melhoria 4 — Botão "Tentar novamente" nos Erros (Heurística 9 — Recuperação)

**Heurística aplicada:** H9 — Ajudar usuários a reconhecer, diagnosticar e se recuperar de erros. A mensagem deve indicar o problema e oferecer solução.

**Comportamento:**
- Onde hoje há apenas `<p>{error}</p>`, adicionar um botão "↺ Tentar novamente" abaixo da mensagem de erro.
- O botão chama a mesma função `load()` que já existe em cada página (extraída do `useEffect` para ser reutilizável).
- Aplicar em:
  - `GamesPage` — erro ao carregar catálogo
  - `GameDetailPage` — erro ao carregar jogo
  - `AdminReportsPage` — erro ao carregar relatórios
- O botão tem estilo secundário consistente: `bg-gs-raised border border-white/10 text-neutral-300 rounded-lg`.

**Arquivos afetados:**
- `src/pages/GamesPage.tsx`
- `src/pages/GameDetailPage.tsx`
- `src/pages/admin/AdminReportsPage.tsx`

---

## Melhoria 5 — Indicador de Etapas no Carrinho (Goal Gradient Effect)

**Lei aplicada:** Goal Gradient Effect — pessoas se motivam mais quando percebem que estão próximas do objetivo. Mostrar que faltam apenas 1 ou 2 passos aumenta a taxa de conclusão.

**Comportamento:**
- No topo da `CartPage` (apenas quando `items.length > 0`), exibir um stepper horizontal com 3 etapas:
  1. **Carrinho** — itens no carrinho (etapa concluída quando chega à etapa 2)
  2. **Pagamento** — seleção do método de pagamento (etapa atual enquanto o usuário está na página)
  3. **Confirmação** — modal de confirmação (etapa atual ao abrir o modal)
- Estado das etapas controlado por `confirmOpen`: se `false` → etapa ativa é 2; se `true` → etapa ativa é 3.
- Etapas concluídas mostram ✓, etapa ativa tem anel laranja (`ring-2 ring-[var(--color-gs-accent)]/25`), etapas futuras em cinza.
- A linha conectora entre etapas usa a cor laranja para concluídas e branco/10 para pendentes.

**Arquivos afetados:**
- `src/pages/CartPage.tsx` — adicionar componente `CheckoutStepper` inline (não precisa de arquivo separado)

---

## Arquitetura Geral

- Nenhuma nova dependência necessária.
- Nenhuma mudança na API ou no backend.
- Todas as 5 melhorias são puramente de frontend.
- A melhoria 1 faz um fetch extra apenas uma vez (paralelo ao fetch de jogos), sem impacto perceptível de performance.
- A melhoria 2 reutiliza o `navigate` já presente no `CartContext`.

## Cobertura de Heurísticas após implementação

| Heurística / Lei           | Status antes | Status depois |
|----------------------------|-------------|---------------|
| H1 Visibilidade do status  | ✅ forte    | ✅ forte      |
| H2 Linguagem do usuário    | ✅ forte    | ✅ forte      |
| H3 Controle e liberdade    | ✅ forte    | ✅ forte      |
| H4 Consistência            | ✅ forte    | ✅ forte      |
| H5 Prevenção de erros      | ✅ forte    | ✅ forte      |
| H6 Reconhecimento          | ✅ forte    | ✅ forte      |
| H7 Eficiência              | ⚠️ fraco   | ✅ forte      |
| H8 Design minimalista      | ✅ forte    | ✅ forte      |
| H9 Recuperação de erros    | ⚠️ fraco   | ✅ forte      |
| H10 Ajuda e documentação   | ✅ forte    | ✅ forte      |
| Von Restorff Effect        | ❌ ausente  | ✅ presente   |
| Peak-End Rule              | ❌ ausente  | ✅ presente   |
| Goal Gradient Effect       | ❌ ausente  | ✅ presente   |
