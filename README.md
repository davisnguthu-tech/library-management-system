# Library Management System

A library management API built with NestJS, Prisma ORM and PostgreSQL.

## Technologies Used

- NestJS – Backend application framework
- Prisma ORM – Database modelling and management
- PostgreSQL – Relational database
- Neon – Hosted PostgreSQL database
- TypeScript – Programming language

## Database Schema

The database contains four main models:

- **User:** Stores library users and their roles.
- **Genre:** Stores book genres.
- **Book:** Stores book information and references its genre.
- **Review:** Stores reviews submitted by users about books.

The Role enum defines two user roles: PATRON and LIBRARIAN.

### Model Relationships

- One Genre can have many Books, while each Book belongs to one Genre.
- One Book can have many Reviews, while each Review belongs to one Book.
- One User can write many Reviews, while each Review belongs to one User.

The Review model contains the following fields:

- `bookId`: Foreign key referencing the reviewed book.
- `userId`: Foreign key referencing the user who submitted the review.
- `rating`: The rating given to the book.
- `comment`: Written feedback from the user.
- `createdAt`: Date and time the review was created.

## Schema Decisions

The Book model references the Genre model through a foreign key called `genreId` instead of embedding genre information directly inside each book record.

This design was chosen because one genre can be associated with many books, while each book belongs to a particular genre. Separating genres into their own table avoids repeating genre information in every book record.

The relationship also improves data consistency. For example, if a genre name changes, it only needs to be updated once in the Genre table. The foreign key relationship helps maintain referential integrity by ensuring that each book references an existing genre.

The Review model uses foreign keys (`bookId` and `userId`) to connect reviews to their respective books and users. This ensures that each review is associated with an existing book and an existing library user.

This relational design is suitable for a library system because books, genres, users and reviews have structured relationships and benefit from data consistency.

## Database Seeding

The seed script is located at `api/prisma/seed.ts`.

It creates or verifies:

- 4 genres: Fiction, Business, Technology and History.
- 16 sample books distributed across the four genres.

To seed the database, run:

```bash
cd api
npx prisma db seed
```

## Setup Instructions

1. Clone this repository.
2. Navigate into the `api` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file using `.env.example` as a template.
5. Add your PostgreSQL connection string to the `.env` file.
6. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

7. Seed the database:

   ```bash
   npx prisma db seed
   ```

8. Start the development server:

   ```bash
   npm run start:dev
   ```

## Prisma ORM vs Document Databases

Prisma ORM provides a structured way to work with relational databases such as PostgreSQL. It supports models, relationships, foreign keys and type-safe database queries.

A document database stores data in flexible document structures, which can be useful when records have varying fields or complex nested data.

One thing that felt different when modelling in Prisma compared to a document database was defining relationships explicitly using foreign keys. In Prisma, I had to define how books connect to genres and how reviews connect to books and users. In a document database, related information can instead be stored together inside a document.

For this library system, PostgreSQL with Prisma is appropriate because users, books, genres and reviews have structured relationships and benefit from data consistency.
