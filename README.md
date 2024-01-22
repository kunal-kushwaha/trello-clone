# Trello 2.0: Next.js 14, Server Actions, React, Prisma, Tailwind, TiDB

Key Features:

- Auth
- List creation & List rename, delete, drag & drop reorder
- Card creation & List description, rename, delete, drag & drop reorder
- TiDB & Prisma ORM
- shadcnUI & TailwindCSS

## Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/chandraprakash-darji/trello-2.0
```

### Install packages

```shell
pnpm i
```

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=

NEXT_PUBLIC_APP_URL=
```

### Setup Prisma

Add MySQL Database (I used TiDB)

- Login to <https://tidbcloud.com>
- Create clustor at <https://tidbcloud.com/console/clusters>
- Click connect, generate Password and copy DB connection string

```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
pnpm run dev
```

## Update the DB Schema

- Prisma schema at [schema.prisma](./prisma/schema.prisma)

## View Data

- Download the [TablePlus]<https://tableplus.com/>
- Create connection with connection string
- Enjoy the DB
