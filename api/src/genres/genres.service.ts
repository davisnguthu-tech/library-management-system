import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // Create a new genre
  async create(data: CreateGenreDto) {
    return this.prisma.genre.create({
      data,
    });
  }

  // Retrieve all genres
  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  // Retrieve one genre by ID
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // Update a genre
  async update(id: number, data: UpdateGenreDto) {
    await this.findOne(id);

    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  // Delete a genre
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}