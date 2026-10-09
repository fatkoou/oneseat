import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createPgError } from '../common/testing/pg-error';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    repository.create.mockImplementation((data: unknown) => data);
    repository.save.mockImplementation(async (user: unknown) => user);

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe('create', () => {
    it('saves the email trimmed and in lowercase', async () => {
      await service.create('  Test@Example.COM ', 'hash');

      expect(repository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'hash',
      });
    });

    it('turns a unique violation into a ConflictException', async () => {
      repository.save.mockRejectedValue(createPgError('23505'));

      await expect(service.create('a@b.com', 'hash')).rejects.toThrow(
        ConflictException,
      );
    });

    it('rethrows errors it does not know', async () => {
      const error = new Error('connection lost');
      repository.save.mockRejectedValue(error);

      await expect(service.create('a@b.com', 'hash')).rejects.toBe(error);
    });
  });

  describe('findByEmail', () => {
    it('looks the user up by the normalized email', async () => {
      await service.findByEmail(' Test@Example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });
});
