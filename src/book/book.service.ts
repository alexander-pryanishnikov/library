import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async create(bookData: Book): Promise<Book> {
    const newBook = this.bookRepository.create(bookData);
    return await this.bookRepository.save(newBook);
  }

  async getBookCountByAuthor(author: string): Promise<number> {
    const books = await this.bookRepository.find({ where: { author } });
    return books.length;
  }
}
