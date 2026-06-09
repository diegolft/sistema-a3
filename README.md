# Game Store - sistema-a3

Frontend da loja de jogos digitais em **React 19**, **Vite 6**, **Tailwind CSS 4** e **TypeScript**, integrado à API `api-vendas-jogos-digitais`.

---

## Pré-requisitos

- [Bun](https://bun.sh) 1.2 ou superior
- [PostgreSQL](https://www.postgresql.org/download/windows) 14 ou superior

---

## 1. Configurar o banco de dados

Instale o PostgreSQL e anote a senha que você definir para o usuário `postgres`.

Abra o **SQL Shell (psql)**, aperte Enter em todas as perguntas, digite sua senha quando solicitado e execute:

```sql
CREATE DATABASE avjd;
```

---

## 2. Rodar a API

```bash
git clone https://github.com/diegolft/api-vendas-jogos-digitais.git
cd api-vendas-jogos-digitais

cp .env.example .env
```

Abra o `.env` e ajuste `DB_PASSWORD` com a senha do seu PostgreSQL:

```env
DB_PASSWORD=sua_senha_aqui
```

Depois instale as dependências, aplique as migrations e inicie:

```bash
bun install
bun run db:migrate
bun run db:seed
bun run start:dev
```

A API ficará disponível em `http://localhost:3000`.

---

## 3. Rodar o frontend

Em outro terminal, na pasta deste projeto:

```bash
cp .env.example .env
bun install
bun run dev
```

Acesse **http://localhost:5173** no navegador.

---

## Credenciais padrão (criadas pelo seed)

| Perfil        | E-mail                 | Senha       |
|---------------|------------------------|-------------|
| Administrador | admin@avjd.com         | admin123    |
| Cliente       | cliente@avjd.com       | cliente123  |

---

## Estrutura do projeto

```
src/
  app/          # composição da aplicação e rotas
  contexts/     # sessão, carrinho, biblioteca, wishlist e vendas
  services/api/ # cliente HTTP, mapeadores e endpoints
  pages/        # telas públicas, autenticadas e administrativas
  components/   # componentes reutilizáveis
```

---

## Scripts disponíveis

| Comando          | Descrição                        |
|------------------|----------------------------------|
| `bun run dev`    | Inicia o servidor de desenvolvimento |
| `bun run build`  | Gera o build de produção         |
| `bun run lint`   | Verifica o código com Biome      |
| `bun run check`  | Corrige automaticamente com Biome |
