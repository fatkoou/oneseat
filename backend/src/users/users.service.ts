import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: this.normalizeEmail(email) },
    });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user = this.userRepository.create({
      email: this.normalizeEmail(email),
      passwordHash,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
  );
}
