# Game Store — sistema-a3

Frontend da loja de jogos digitais em **React 19**, **Vite 6**, **Tailwind CSS 4** e **TypeScript**. Inclui catálogo (dados mock), carrinho, lista de desejos, biblioteca, perfil e fluxos de autenticação com opção de **modo mock** (sem backend).

## Pré-requisitos

- [Bun](https://bun.sh) **1.2 ou superior** (o projeto declara `packageManager: bun@1.3.11`).

## Instalação

```bash
git clone <url-do-repositório>
cd sistema-a3
bun install
```

## Variáveis de ambiente

Copie o exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API REST (sem barra no final). Ex.: `http://localhost:3000`. Se vazia, as requisições usam caminhos relativos (útil atrás do mesmo host/proxy). |
| `VITE_USE_AUTH_MOCK` | Defina como `true` para simular login/cadastro **sem** chamar a API. Qualquer outro valor ou ausência usa a API real (com token JWT). |

## Rodar em desenvolvimento

```bash
bun run dev
```

O Vite exibirá o endereço local (por padrão `http://localhost:5173`).

## Build de produção

```bash
bun run build
```

Saída em `dist/`. Para testar o build localmente:

```bash
bun run preview
```

## Qualidade de código

```bash
bun run lint    # Biome — lint
bun run format  # Biome — formatar
bun run check   # Biome — lint + format (com correções)
```

## Estrutura (resumo)

- `src/app/` — rotas e composição da aplicação  
- `src/pages/` — telas (jogos, carrinho, auth, etc.)  
- `src/components/` — UI reutilizável e layout  
- `src/contexts/` — estado global (auth, carrinho, biblioteca, wishlist)  
- `src/services/api/` — cliente HTTP e autenticação  

## API backend

Para usar login e rotas reais, é necessário um backend compatível (por exemplo a API Nest em outro repositório). Configure `VITE_API_URL` apontando para esse servidor e mantenha `VITE_USE_AUTH_MOCK` **diferente** de `true`.
