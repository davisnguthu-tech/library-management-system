import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create or verify the four genres
  const genres = ['Fiction', 'Business', 'Technology', 'History'];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create the librarian account
  const librarianPassword = process.env.LIBRARIAN_PASSWORD;

  if (!librarianPassword) {
    throw new Error('LIBRARIAN_PASSWORD is missing from .env');
  }

  const hashedPassword = await bcrypt.hash(librarianPassword, 10);

  await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {
      name: 'Library Librarian',
      password: hashedPassword,
      role: Role.LIBRARIAN,
    },
    create: {
      name: 'Library Librarian',
      email: 'librarian@library.com',
      password: hashedPassword,
      role: Role.LIBRARIAN,
    },
  });

  // Sample books distributed across the four genres
  const books = [
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      genre: 'Fiction',
      description: 'A novel exploring colonialism and Igbo society.',
      isbn: '9780000000019',
      totalCopies: 5,
    },
    {
      title: 'The River Between',
      author: 'Ngugi wa Thiong’o',
      genre: 'Fiction',
      description: 'A story about tradition, culture and change.',
      isbn: '9780000000026',
      totalCopies: 5,
    },
    {
      title: 'Americanah',
      author: 'Chimamanda Ngozi Adichie',
      genre: 'Fiction',
      description: 'A novel exploring identity, migration and race.',
      isbn: '9780000000033',
      totalCopies: 5,
    },
    {
      title: 'Half of a Yellow Sun',
      author: 'Chimamanda Ngozi Adichie',
      genre: 'Fiction',
      description: 'A novel set during the Nigerian Civil War.',
      isbn: '9780000000040',
      totalCopies: 5,
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      genre: 'Business',
      description: 'A guide to building businesses through experimentation.',
      isbn: '9780000000057',
      totalCopies: 5,
    },
    {
      title: 'Good to Great',
      author: 'Jim Collins',
      genre: 'Business',
      description: 'Explores how companies achieve lasting success.',
      isbn: '9780000000064',
      totalCopies: 5,
    },
    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      genre: 'Business',
      description: 'Introduces personal finance and investment concepts.',
      isbn: '9780000000071',
      totalCopies: 5,
    },
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
      genre: 'Business',
      description: 'A guide to personal and professional effectiveness.',
      isbn: '9780000000088',
      totalCopies: 5,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Technology',
      description: 'A practical guide to writing maintainable software.',
      isbn: '9780000000095',
      totalCopies: 5,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas and Andrew Hunt',
      genre: 'Technology',
      description: 'Practical techniques for effective software development.',
      isbn: '9780000000101',
      totalCopies: 5,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen et al.',
      genre: 'Technology',
      description: 'A comprehensive textbook on computer algorithms.',
      isbn: '9780000000118',
      totalCopies: 5,
    },
    {
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell and Peter Norvig',
      genre: 'Technology',
      description: 'An introduction to artificial intelligence.',
      isbn: '9780000000125',
      totalCopies: 5,
    },
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      genre: 'History',
      description: 'Explores the history and nature of the universe.',
      isbn: '9780000000132',
      totalCopies: 5,
    },
    {
      title: 'The Silk Roads',
      author: 'Peter Frankopan',
      genre: 'History',
      description: 'Examines the historical importance of trade routes.',
      isbn: '9780000000149',
      totalCopies: 5,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      description: 'Explores the history of humankind.',
      isbn: '9780000000156',
      totalCopies: 5,
    },
    {
      title: 'Long Walk to Freedom',
      author: 'Nelson Mandela',
      genre: 'History',
      description: 'The autobiography of Nelson Mandela.',
      isbn: '9780000000163',
      totalCopies: 5,
    },
  ];

  // Insert or update books without creating duplicates
  for (const book of books) {
    const genre = await prisma.genre.findUnique({
      where: { name: book.genre },
    });

    if (!genre) {
      throw new Error(`Genre not found: ${book.genre}`);
    }

    const existingBook = await prisma.book.findFirst({
      where: {
        title: book.title,
        author: book.author,
      },
    });

    const { genre: genreName, ...bookData } = book;

    if (existingBook) {
      await prisma.book.update({
        where: { id: existingBook.id },
        data: {
          ...bookData,
          genreId: genre.id,
        },
      });
    } else {
      await prisma.book.create({
        data: {
          ...bookData,
          genreId: genre.id,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Genres created or verified: ${genres.length}`);
  console.log(`Books created or updated: ${books.length}`);
  console.log('Librarian account created or updated: librarian@library.com');
}

main()
  .catch((error) => {
    console.error('Error while seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });