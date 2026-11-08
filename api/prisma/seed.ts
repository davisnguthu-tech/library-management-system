import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the four genres
  const genres = ['Fiction', 'Business', 'Technology', 'History'];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Sample books distributed across the four genres
  const books = [
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      genre: 'Fiction',
      description: 'A novel exploring colonialism and Igbo society.',
    },
    {
      title: 'The River Between',
      author: 'Ngugi wa Thiong’o',
      genre: 'Fiction',
      description: 'A story about tradition, culture and change.',
    },
    {
      title: 'Americanah',
      author: 'Chimamanda Ngozi Adichie',
      genre: 'Fiction',
      description: 'A novel exploring identity, migration and race.',
    },
    {
      title: 'Half of a Yellow Sun',
      author: 'Chimamanda Ngozi Adichie',
      genre: 'Fiction',
      description: 'A novel set during the Nigerian Civil War.',
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      genre: 'Business',
      description: 'A guide to building businesses through experimentation.',
    },
    {
      title: 'Good to Great',
      author: 'Jim Collins',
      genre: 'Business',
      description: 'Explores how companies achieve lasting success.',
    },
    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      genre: 'Business',
      description: 'Introduces personal finance and investment concepts.',
    },
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
      genre: 'Business',
      description: 'A guide to personal and professional effectiveness.',
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Technology',
      description: 'A practical guide to writing maintainable software.',
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas and Andrew Hunt',
      genre: 'Technology',
      description: 'Practical techniques for effective software development.',
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen et al.',
      genre: 'Technology',
      description: 'A comprehensive textbook on computer algorithms.',
    },
    {
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell and Peter Norvig',
      genre: 'Technology',
      description: 'An introduction to artificial intelligence.',
    },
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      genre: 'History',
      description: 'Explores the history and nature of the universe.',
    },
    {
      title: 'The Silk Roads',
      author: 'Peter Frankopan',
      genre: 'History',
      description: 'Examines the historical importance of trade routes.',
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      description: 'Explores the history of humankind.',
    },
    {
      title: 'Long Walk to Freedom',
      author: 'Nelson Mandela',
      genre: 'History',
      description: 'The autobiography of Nelson Mandela.',
    },
  ];

  // Insert books, avoiding duplicates if the script runs again
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
  console.log(`Books created or verified: ${books.length}`);
}

main()
  .catch((error) => {
    console.error('Error while seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });