import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'; // добавлен импорт TypeOrmModule
import { BookModule } from './book.module';
import { Repository } from 'typeorm';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          entities: [Book], // добавлено здесь
          synchronize: true,
        }), // добавлено здесь
        BookModule,
      ],
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result: Book[] = [
        {
          id: 1,
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          description: 'test',
        },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll()).toBe(result);
    });
  });
  describe('create', () => {
    it('should create a new book', async () => {
      const bookData: Book = {
        id: 1,
        title: '1984',
        author: 'George Orwell',
        description: 'test',
      };
      const savedBook: Book = {
        id: 1,
        title: '1984',
        author: 'George Orwell',
        description: 'test',
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(savedBook));

      expect(await controller.create(bookData)).toBe(savedBook);
    });
  });

  describe('getBookCountByAuthor', () => {
    it('should return the number of books by author', async () => {
      const author = 'J.R.R. Tolkien';
      const count = 3;

      jest
        .spyOn(service, 'getBookCountByAuthor')
        .mockImplementation(() => Promise.resolve(count));

      expect(await controller.getBookCountByAuthor(author)).toBe(count);
    });
  });
});
