# Endpoints por Entidade

A aplicação pode ser executada via Docker Compose.

## Execução com Docker

- Requisitos: Docker e Docker Compose instalados.
- Subir os serviços (backend e frontend):

```bash
docker compose up -d
```

- Portas expostas por padrão:
  - Backend: http://localhost:8080
  - Frontend: http://localhost:3000

- Para parar os serviços:

```bash
docker compose down
```

Abaixo está a lista de endpoints organizados por entidade, conforme definidos nas rotas do servidor Fastify.

Prefixos registrados em `src/infrastructure/routes.ts`:

- /api/auth
- /api/categories
- /api/transactions
- /api/balance

## Árvore de Endpoints

```
/api
  auth (/api/auth)
    POST   /register
    POST   /login

  categories (/api/categories)
    POST   /
    GET    /
    PATCH  /:id
    DELETE /:id

  transactions (/api/transactions)
    POST   /
    GET    /
    PATCH  /:id
    DELETE /:id

  balance (/api/balance)
    GET    /
```

Notas:

- Os métodos e caminhos acima foram levantados a partir dos arquivos em `src/infrastructure/routes/*.route.ts`.
- Alguns endpoints aceitam corpo, parâmetros ou querystring conforme os DTOs Zod associados nas rotas.

---

# Detalhamento por Entidade (DTOs e Exemplos)

Observação geral:

- Endpoints fora de `auth` utilizam autenticação e acessam `request.user.id`. Envie `Authorization: Bearer <token>` obtido no login.

## Auth (/api/auth)

### POST /register
- Descrição: Criar novo usuário
- Body (RegisterUserDTOSchema):
  - `name`: string
  - `email`: email
  - `password`: string
- Response 200 (UserResponseSchema): objeto de usuário

Exemplo de request:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

Exemplo de response 200:

```json
{
  "id": "c7c1b9f4-9f1e-4a7e-9b6e-0c5f5ac7b111",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2025-02-01T12:34:56.000Z",
  "updatedAt": "2025-02-01T12:34:56.000Z"
}
```

### POST /login
- Descrição: Autenticar usuário
- Body (LoginDTOSchema):
  - `email`: email
  - `password`: string
- Response 200 (LoginResponseSchema):
  - `id`: uuid v4
  - `email`: string
  - `token`: string (JWT)

Exemplo de request:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Exemplo de response 200:

```json
{
  "id": "c7c1b9f4-9f1e-4a7e-9b6e-0c5f5ac7b111",
  "email": "alice@example.com",
  "token": "<JWT>"
}
```

## Categories (/api/categories)

Headers comuns:

- `Authorization: Bearer <token>`

### POST /
- Descrição: Criar nova categoria
- Body (CreateCategoryDTOSchema):
  - `name`: string
  - `description`: string
- Response 200 (CategoryResponseSchema):
  - `id`: uuid v4
  - `name`: string
  - `description`: string
  - `userId`: uuid v4
  - `createdAt`: date
  - `updatedAt`: date

Exemplo:

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alimentação",
  "description": "Gastos com comida"
}
```

### GET /
- Descrição: Listar categorias do usuário
- Query: —
- Response 200: `CategoryResponseSchema[]`

```http
GET /api/categories
Authorization: Bearer <token>
```

### PATCH /:id
- Descrição: Atualizar uma categoria
- Params:
  - `id`: string (uuid)
- Body (UpdateCategoryDTOSchema):
  - `name?`: string
  - `description?`: string
- Response 200: boolean

```http
PATCH /api/categories/3a2f7e10-76b4-4b8b-8601-6a3a6f2d9c55
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Gastos com refeições"
}
```

### DELETE /:id
- Descrição: Remover uma categoria
- Params:
  - `id`: string (uuid)
- Response 200: boolean

```http
DELETE /api/categories/3a2f7e10-76b4-4b8b-8601-6a3a6f2d9c55
Authorization: Bearer <token>
```

## Transactions (/api/transactions)

Headers comuns:

- `Authorization: Bearer <token>`

### POST /
- Descrição: Criar nova transação
- Body (CreateTransactionDTOSchema):
  - `description`: string
  - `amount`: number (positivo)
  - `type`: enum(`INCOME` | `EXPENSE` | ... conforme `TransactionTypeEnum`)
  - `categoryId`: string
  - `date`: date (aceita string convertida via `z.coerce.date`)
  - `isExtra`: boolean (default: false)
- Response 200 (TransactionResponseSchema)

Exemplo:

```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Salário",
  "amount": 5000,
  "type": "INCOME",
  "categoryId": "3a2f7e10-76b4-4b8b-8601-6a3a6f2d9c55",
  "date": "2025-02-01T00:00:00.000Z",
  "isExtra": false
}
```

### GET /
- Descrição: Listar transações paginadas
- Query (PaginationDTOSchema):
  - `perPage`: string -> number (default 10)
  - `page`: string -> number (default 0)
- Response 200 (PaginatedTransactionResponseDTOSchema):
  - `data`: TransactionResponseSchema[]
  - `meta`: { totalItems, totalPages, currentPage, itemsPerPage }

```http
GET /api/transactions?perPage=10&page=0
Authorization: Bearer <token>
```

### PATCH /:id
- Descrição: Atualizar uma transação
- Params:
  - `id`: string (uuid)
- Body (UpdateTransactionDTOSchema):
  - `name?`: string
  - `description?`: string
  - `amount?`: number
  - `type?`: enum(TransactionTypeEnum)
  - `categoryId?`: string
  - `date?`: date
  - `isExtra?`: boolean
- Response 200: boolean

```http
PATCH /api/transactions/0b7a1d17-7d5f-4f1c-8f3b-1b0b2c3d4e5f
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5200
}
```

### DELETE /:id
- Descrição: Remover uma transação
- Params:
  - `id`: string (uuid)
- Response 200: boolean

```http
DELETE /api/transactions/0b7a1d17-7d5f-4f1c-8f3b-1b0b2c3d4e5f
Authorization: Bearer <token>
```

## Balance (/api/balance)

Headers comuns:

- `Authorization: Bearer <token>`

### GET /
- Descrição: Obter agregados de saldo por intervalo de datas (até 30 dias)
- Query (GetBalanceReportDTOSchema):
  - `startDate`: string no formato `DD/MM/YYYY`
  - `endDate`: string no formato `DD/MM/YYYY`
- Response 200 (BalanceReportResponseSchema):
  - `balance`: number
  - `byCategory`: [{ `categoryId`: uuid v4, `count`: number, `amount`: number }]
  - `byType`: [{ `type`: string, `count`: number, `amount`: number }]

Exemplo:

```http
GET /api/balance?startDate=01/01/2025&endDate=31/01/2025
Authorization: Bearer <token>
```

