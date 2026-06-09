# Design: Relatórios com Gráficos + Histórico de Compras

Data: 2026-06-08  
Projeto: sistema-a3 (Game Store)  
Stack: React 19, Vite 6, Tailwind 4, TypeScript, Bun

---

## Contexto

O trabalho exige relatórios visuais com gráficos e histórico de compras.
A API tem apenas um endpoint de relatório: `GET /api/v1/relatorios/jogos-mais-vendidos?top=&empresa=`.
Os demais relatórios (por empresa, ranking geral, por categoria) são derivados no frontend.

---

## Escopo

1. Instalar `recharts`
2. Reescrever `AdminReportsPage.tsx` com 4 gráficos
3. Criar `SalesHistoryPage.tsx`
4. Adicionar rota `/historico` em `App.tsx`
5. Adicionar link "Histórico" no `AppHeader.tsx`

---

## Dados e fluxo

`AdminReportsPage` faz 3 chamadas em paralelo na montagem:

```
Promise.all([
  getMostSoldGamesReport(token, { top: 50 }),  // { nome, empresa, total }[]
  listGames(token),                             // { id, nome, fkCategoria, ... }[]
  listCategories(token),                        // { id, nome }[]
])
```

Agregações client-side:
- **Por empresa**: agrupar salesData por campo `empresa`, somar `total`
- **Por categoria**: fazer join salesData.nome === gamesData.nome → obter fkCategoria → mapear para nome de categoria → agrupar e somar

---

## AdminReportsPage — 4 seções

Todos os gráficos ficam diretos na página, sem componentes extras.

| # | Título | Tipo | Dados |
|---|--------|------|-------|
| # | Título | Tipo | Dados | Diferencial |
|---|--------|------|-------|-------------|
| 1 | Top Jogos Mais Vendidos | BarChart vertical | salesData[0..N] | filtro Top N ajustável pelo usuário |
| 2 | Vendas por Empresa | PieChart | aggregate por empresa | mostra proporção entre publishers |
| 3 | Ranking Geral | BarChart horizontal | todos os 50 resultados | sem filtro, visão completa ordenada |
| 4 | Vendas por Categoria | BarChart vertical | aggregate por categoria | visão por gênero/tipo de jogo |

Controle Top N: afeta apenas o Chart 1. Charts 2, 3 e 4 sempre usam os 50 registros completos.

---

## SalesHistoryPage

- Rota: `/historico` (dentro de `RequireAuth`)
- Dados: `listSales(token)` → `Sale[]` (`id, fkUsuario, valorTotal, quantidade, data`)
- Layout: lista de cards — data, quantidade de jogos, valor total
- Estado vazio: mensagem "Você ainda não realizou nenhuma compra."

---

## Navegação

- `AppHeader`: adicionar NavLink "Histórico" para usuários autenticados (desktop e mobile)
- `App.tsx`: adicionar `<Route path="historico" element={<SalesHistoryPage />} />` dentro do bloco `<RequireAuth>`

---

## Restrições

- Nenhum endpoint da API é alterado
- Sem criar novos componentes genéricos — código direto nas páginas
- Recharts usado no modo básico (ResponsiveContainer + chart primitives)
