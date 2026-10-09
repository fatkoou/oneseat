import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createPgError } from '../common/testing/pg-error';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const SEAT_ID = '22222222-2222-4222-8222-222222222222';
const RESERVATION_ID = '33333333-3333-4333-8333-333333333333';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(ReservationsService);
  });

  describe('reserve', () => {
    it('creates a confirmed reservation for the user and returns a summary', async () => {
      const saved = {
        id: RESERVATION_ID,
        userId: USER_ID,
        seatId: SEAT_ID,
        status: 'confirmed',
        createdAt: new Date('2026-12-01T10:00:00Z'),
      };
      repository.create.mockReturnValue(saved);
      repository.save.mockResolvedValue(saved);

      const result = await service.reserve(USER_ID, SEAT_ID);

      expect(repository.create).toHaveBeenCalledWith({
        userId: USER_ID,
        seatId: SEAT_ID,
        status: 'confirmed',
      });
      expect(result).toEqual({
        id: RESERVATION_ID,
        seatId: SEAT_ID,
        status: 'confirmed',
        createdAt: saved.createdAt,
      });
    });

    it('turns a unique violation into a ConflictException (seat already reserved)', async () => {
      repository.save.mockRejectedValue(createPgError('23505'));

      await expect(service.reserve(USER_ID, SEAT_ID)).rejects.toThrow(
        ConflictException,
      );
    });

    it('turns a foreign key violation into a NotFoundException (unknown seat)', async () => {
      repository.save.mockRejectedValue(createPgError('23503'));

      await expect(service.reserve(USER_ID, SEAT_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rethrows errors it does not know', async () => {
      const error = new Error('connection lost');
      repository.save.mockRejectedValue(error);

      await expect(service.reserve(USER_ID, SEAT_ID)).rejects.toBe(error);
    });
  });

  describe('cancel', () => {
    it('cancels only a confirmed reservation that belongs to the user', async () => {
      repository.update.mockResolvedValue({ affected: 1 });

      const result = await service.cancel(USER_ID, RESERVATION_ID);

      expect(repository.update).toHaveBeenCalledWith(
        { id: RESERVATION_ID, userId: USER_ID, status: 'confirmed' },
        { status: 'cancelled' },
      );
      expect(result).toEqual({ id: RESERVATION_ID, status: 'cancelled' });
    });

    it('throws a NotFoundException when no reservation was updated', async () => {
      repository.update.mockResolvedValue({ affected: 0 });

      await expect(service.cancel(USER_ID, RESERVATION_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
