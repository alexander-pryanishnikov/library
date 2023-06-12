import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from './book.service';
import { Book } from './book.entity';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const book1 = {
        id: 1,
        title: 'Test Book 1',
        author: 'Test Author 1',
        description: 'Test Description 1',
      } as Book;
      const book2 = {
        id: 2,
        title: 'Test Book 2',
        author: 'Test Author 2',
        description: 'Test Description 2',
      } as Book;
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([book1, book2]);

      const result = await bookService.findAll();

      expect(result).toEqual([book1, book2]);
      expect(bookRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
      } as Book;
      const newBook = { id: 1, ...bookData } as Book;
      jest.spyOn(bookRepository, 'create').mockReturnValueOnce(newBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(newBook);

      const result = await bookService.create(bookData);

      expect(result).toEqual(newBook);
      expect(bookRepository.create).toHaveBeenCalledWith(bookData);
    });
  });

  describe('countByAuthor', () => {
    it('should return zero if no books with the author', async () => {
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([]);

      const count = await bookService.getBookCountByAuthor('Unknown Author');

      expect(count).toEqual(0);
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { author: "Unknown Author" } });
    });

    it('should return the number of books with the author', async () => {
      const book1 = {
        id: 1,
        title: 'Test Book 1',
        author: 'Test Author',
        description: 'Test Description 1',
      } as Book;
      const book2 = {
        id: 2,
        title: 'Test Book 2',
        author: 'Test Author',
        description: 'Test Description 2',
      } as Book;
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce([book1, book2]);

      const count = await bookService.getBookCountByAuthor('Test Author');

      expect(count).toEqual(2);
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { author: "Test Author" } });

      // cleanup
      jest.restoreAllMocks();
    });
  });
});
