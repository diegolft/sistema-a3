# Game Store - sistema-a3

Frontend da loja de jogos digitais em **React 19**, **Vite 6**, **Tailwind CSS 4** e
**TypeScript**, agora integrado a `api-vendas-jogos-digitais`.

## O que a aplicacao consome

- autenticacao real com JWT
- vitrine publica em `GET /api/v1/public/jogos`
- catalogo autenticado, detalhe, reviews, carrinho, wishlist, biblioteca e vendas
- painel administrativo para usuarios, empresas, perfis, jogos, categorias e relatorios

## Pre-requisitos

- [Bun](https://bun.sh) 1.2 ou superior

## Instalacao

```bash
git clone <url-do-repositorio>
cd sistema-a3
bun install
```

## Variaveis de ambiente

Copie o exemplo e ajuste a URL da API:

```bash
cp .env.example .env
```

| Variavel | Descricao |
| --- | --- |
| `VITE_API_URL` | URL base da API REST, sem barra final. Ex.: `http://localhost:3000` |

## Rodar em desenvolvimento

```bash
bun run dev
```

## Build

```bash
bun run build
```

## Estrutura

- `src/app/` - composicao da aplicacao e rotas
- `src/contexts/` - sessao, carrinho, biblioteca, wishlist e historico de vendas
- `src/services/api/` - cliente HTTP, mapeadores e consumo dos endpoints
- `src/pages/` - telas publicas, autenticadas e administrativas

## Credenciais de seed da API

- administrador: `admin@avjd.com` / `admin123`
- cliente: `cliente@avjd.com` / `cliente123`
