# SuperAdmin Project Setup & Run Guide (oneclarity)

A brief description of what this project does and who it's for.

---

## Features

- Role-based access control (RBAC)
- JWT authentication
- Prisma ORM for database management
- Pre-seeded Super Admin with full permissions

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) or compatible database
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd <project-folder>
npm install


# Application
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# Database (PostgreSQL)
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<dbname>?schema=public"

# Example
# DATABASE_URL="postgresql://postgres:admin@localhost:5432/superadmin_db?schema=public"

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate


# seed the super admin
npm run seed

- this will crearte :

- Email: superadmin@oneclarity.com

- Password: SuperAdmin@123

```
