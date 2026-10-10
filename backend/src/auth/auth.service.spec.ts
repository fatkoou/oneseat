import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: {
    create: jest.Mock;
    findByEmail: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('hashes the password and returns safe user fields', async () => {
      (hash as jest.Mock).mockResolvedValue('hashed-password');
      usersService.create.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        passwordHash: 'hashed-password',
      });

      const result = await authService.register({
        email: 'user@example.com',
        password: 'PlainPass123!',
      });

      expect(hash).toHaveBeenCalledWith('PlainPass123!');
      expect(usersService.create).toHaveBeenCalledWith(
        'user@example.com',
        'hashed-password',
      );
      expect(result).toEqual({
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    it('returns a JWT when the credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        passwordHash: 'hashed-password',
      });
      (verify as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('test-jwt');

      const result = await authService.login({
        email: 'user@example.com',
        password: 'PlainPass123!',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(verify).toHaveBeenCalledWith(
        'hashed-password',
        'PlainPass123!',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-123',
        role: 'user',
      });
      expect(result).toEqual({ access_token: 'test-jwt' });
    });

    it('rejects an unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'missing@example.com',
          password: 'PlainPass123!',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(verify).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('rejects an incorrect password', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        passwordHash: 'hashed-password',
      });
      (verify as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'WrongPass123!',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
