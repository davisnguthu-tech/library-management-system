import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Create a book
  async create(data: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: data.genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return this.prisma.book.create({
      data,
      include: { genre: true },
    });
  }

  // Get all books with filtering and pagination
  async findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where: any = {};

    if (genreId) {
      where.genreId = genreId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          genre: true,
          reviews: true,
        },
        orderBy: { id: 'asc' },
      }),

      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get one book
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  // Update a book
  async update(id: number, data: UpdateBookDto) {
    await this.findOne(id);

    if (data.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: data.genreId },
      });

      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: { genre: true },
    });
  }

  // Delete a book
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}