import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Get()
  async findAll(): Promise<Book[]> {
    return await this.booksService.findAll();
  }

  @Post()
  async create(@Body() bookData: Book): Promise<Book> {
    return await this.booksService.create(bookData);
  }

  @Get(':author')
  async getBookCountByAuthor(@Param('author') author) {

    // console.log(author);
    // return author
    return await this.booksService.getBookCountByAuthor(author);
  }
}
