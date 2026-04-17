# Win11 Ubuntu Web Desktop

Projeto fullstack com backend em Node.js + SQLite e frontend em React + TypeScript + Tailwind CSS.

## Requisitos

- Node.js 18+
- npm

## Backend

1. Entre na raiz do projeto.
2. Rode:

```bash
npm run server
```

Ou use:

```powershell
./scripts/start-backend.ps1
```

O backend usa `server/index.js`, expõe a API em `/api/*` e cria automaticamente `storage/app.sqlite`.

## Frontend

1. Instale as dependencias:

```bash
npm install
```

2. Copie `.env.example` para `.env` se quiser ajustar a URL da API.
   Deixe o frontend usando `/api` por padrao quando estiver rodando com Vite, para evitar problemas de sessao entre `localhost` e `127.0.0.1`.
3. Rode:

```bash
npm run dev
```

Ou use:

```powershell
./scripts/start-frontend.ps1
```

## Login inicial

- Usuario: `demo`
- Senha: `demo123`

Esse usuario seed e criado automaticamente na primeira inicializacao do backend.
