# Library Management System

A robust, modern RESTful Library Management API built with NestJS, Prisma ORM and PostgreSQL.

This project provides complete management of books and genres, user authentication, role-based access control (RBAC) distinguishing library patrons from librarians, and a book review system.

---

## Technologies Used

- **NestJS** – Enterprise-grade backend framework for scalable Node.js applications
- **Prisma ORM** – Type-safe database client, schema modelling and automated migrations
- **PostgreSQL** – Relational database management system
- **Neon** – Serverless cloud-hosted PostgreSQL database
- **TypeScript** – Strongly typed programming language
- **Passport & JWT** (`@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`) – Stateless token-based authentication and route protection
- **bcrypt** – Cryptographic password hashing
- **class-validator & class-transformer** – Request payload validation and transformation

---

## Database Schema

The database is defined in `api/prisma/schema.prisma` and contains four core models and a role enumeration:

### Roles Enum (`Role`)
Defines the two user privilege levels:
- `PATRON` – Standard library user (default for registered accounts).
- `LIBRARIAN` – Privileged administrative user with access to create, update and delete books.

---

### Models and Fields

#### 1. `User`
Stores library users, their credentials and authorization roles.
- `id` (`Int`, Primary Key): Auto-incrementing identifier.
- `name` (`String`): Full name of the user.
- `email` (`String`, Unique): User's unique email address used for login.
- `password` (`String`): Securely hashed password (bcrypt).
- `role` (`Role`, Default: `PATRON`): User's access role.
- `createdAt` (`DateTime`, Default: `now()`): Account registration timestamp.
- `reviews` (`Review[]`): One-to-many relationship with user reviews.

#### 2. `Genre`
Stores categories used to classify books.
- `id` (`Int`, Primary Key): Auto-incrementing identifier.
- `name` (`String`, Unique): Unique name of the genre (e.g. Fiction, Business, Technology, History).
- `books` (`Book[]`): One-to-many relationship with books in this genre.
- `createdAt` (`DateTime`, Default: `now()`): Creation timestamp.

#### 3. `Book`
Stores book records, inventory levels and genre associations.
- `id` (`Int`, Primary Key): Auto-incrementing identifier.
- `title` (`String`): Title of the book.
- `author` (`String`): Author of the book.
- `description` (`String?`, Optional): Summary or description of the book.
- `published` (`Boolean`, Default: `true`): Publication status indicator.
- `isbn` (`String?`, Unique): Unique International Standard Book Number.
- `totalCopies` (`Int`, Default: `5`): Total number of physical copies owned by the library.
- `genreId` (`Int`, Foreign Key): References the associated `Genre.id`.
- `genre` (`Genre`): Relation connecting the book to its genre.
- `reviews` (`Review[]`): One-to-many relationship with book reviews.
- `createdAt` (`DateTime`, Default: `now()`): Record creation timestamp.

#### 4. `Review`
Stores reader reviews and ratings for books.
- `id` (`Int`, Primary Key): Auto-incrementing identifier.
- `bookId` (`Int`, Foreign Key): References the reviewed `Book.id`.
- `userId` (`Int`, Foreign Key): References the authoring `User.id`.
- `rating` (`Int`): Rating given to the book.
- `comment` (`String`): Written review feedback.
- `createdAt` (`DateTime`, Default: `now()`): Review creation timestamp.
- `book` (`Book`): Relation connecting the review to the reviewed book.
- `user` (`User`): Relation connecting the review to the reviewing user.

---

### Model Relationships

- **Genre $\rightarrow$ Book (One-to-Many):** One genre can have many books. Each book references exactly one genre via `genreId`.
- **Book $\rightarrow$ Review (One-to-Many):** One book can receive many reviews. Each review belongs to a single book via `bookId`.
- **User $\rightarrow$ Review (One-to-Many):** One user can write multiple reviews. Each review is linked to a single user via `userId`.

---

### Schema Decisions

1. **Normalized Genre Storage:** The `Book` model references the `Genre` table via `genreId` rather than embedding genre names as plain strings. This eliminates redundant data, enforces relational integrity, and ensures that renaming a genre propagates across all linked books automatically.
2. **Dedicated Review Entity:** Reviews use foreign keys (`bookId` and `userId`) to connect feedback directly to both the book and the reviewing user, guaranteeing referential consistency and preventing orphaned review records.
3. **Password Security:** The `User` model stores a hashed password string generated using `bcrypt` with salt rounds, ensuring raw credentials are never persisted in plaintext.

---

## Setup Instructions

Follow these step-by-step instructions to set up, migrate, seed and run the application locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Enter the API Directory
```bash
cd api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Local Environment Configuration
Create a local `.env` file by copying the provided example template:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

### 5. Configure Environment Variables
Open `api/.env` in your text editor and set values for the three required variables:

- `DATABASE_URL`: Your PostgreSQL connection string (such as one from [Neon](https://neon.tech)):
  ```env
  DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
  ```
- `JWT_SECRET`: A secure random secret key used to sign and verify JSON Web Tokens:
  ```env
  JWT_SECRET="your-secure-jwt-secret-key"
  ```
- `LIBRARIAN_PASSWORD`: A secure initial password for the seeded librarian account:
  ```env
  LIBRARIAN_PASSWORD="your-strong-librarian-password"
  ```

### 6. Run Database Migrations
Apply the Prisma migration files to create the tables, relations and enums in your database:
```bash
npx prisma migrate dev
```

### 7. Seed the Database
Populate your database with initial sample data and the librarian administrator account:
```bash
npx prisma db seed
```

The seed script (`api/prisma/seed.ts`) automatically creates:
- **4 Genres:** Fiction, Business, Technology, and History.
- **1 Librarian Account:** `librarian@library.com` with the password specified by `LIBRARIAN_PASSWORD` in your `.env`.
- **16 Sample Books:** Complete with authors, descriptions, unique ISBNs, and initial inventory copies distributed across all four genres.

### 8. Start the Development Server
```bash
npm run start:dev
```
The application will launch with hot-reload enabled at:
`http://localhost:3000`

---

## API Endpoints

All endpoints accept and return JSON payloads. Protected endpoints require a Bearer token in the `Authorization` header (`Bearer <access_token>`).

### 1. Authentication (`/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a new user account (assigned role `PATRON` by default). |
| `POST` | `/auth/login` | Public | Authenticate with email and password; returns an `access_token` (JWT). |

---

### 2. Genres (`/genres`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/genres` | Public | Retrieve a list of all genres. |
| `GET` | `/genres/:id` | Public | Retrieve details of a single genre by ID. |
| `POST` | `/genres` | Public | Create a new genre (`{ "name": "..." }`). |
| `PATCH` | `/genres/:id` | Public | Update an existing genre name. |
| `DELETE` | `/genres/:id` | Public | Delete a genre by ID. |

---

### 3. Books (`/books`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Public | Retrieve books with optional query filtering (`?search=`, `?genreId=`, `?page=`, `?limit=`). |
| `GET` | `/books/:id` | Public | Retrieve details of a single book by ID. |
| `POST` | `/books` | **Librarian Only** | Add a new book. Requires valid JWT with `Role.LIBRARIAN`. |
| `PATCH` | `/books/:id` | **Librarian Only** | Update an existing book's details or copy counts. |
| `DELETE` | `/books/:id` | **Librarian Only** | Delete a book record by ID. |

#### Book Query Parameters Example:
- **Search by title or author:** `GET /books?search=Clean`
- **Filter by genre:** `GET /books?genreId=3`
- **Pagination:** `GET /books?page=1&limit=5`
- **Combined:** `GET /books?genreId=1&search=Achebe&page=1&limit=5`

---

## Postman Testing

A pre-configured Postman collection is available under `api/docs/postman_collection.json`. It includes:
- Automated token capture on successful login for both `patronToken` and `librarianToken`.
- Dynamic ISBN generation for book creation tests.
- Chained CRUD tests that automatically capture and reuse `testGenreId` and `testBookId`.
- Role-based authorization tests (verifying that librarians succeed and patrons receive `403 Forbidden` on protected book management endpoints).

---

## Prisma ORM vs Document Databases

Prisma ORM provides a structured way to work with relational databases such as PostgreSQL. It supports strongly-typed models, relations, foreign keys, automated schema migrations and type-safe database queries.

A document database stores data in flexible document structures (e.g. JSON/BSON), which can be useful when records have varying fields or deeply nested, self-contained data.

When modelling in Prisma compared to a document database, relationships are defined explicitly using foreign keys and relational constraints. In Prisma, we explicitly define how books connect to genres and how reviews connect to both books and users. In a document database, related data might instead be duplicated or nested directly inside a single document.

For this library management system, PostgreSQL with Prisma ORM is particularly well-suited because users, books, genres and reviews have clear, structured relationships that benefit heavily from ACID compliance, referential integrity and data consistency.
