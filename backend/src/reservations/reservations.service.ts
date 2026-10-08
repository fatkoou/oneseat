import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  isForeignKeyViolation,
  isUniqueViolation,
} from '../common/database-errors';
import { Reservation } from './reservation.entity';
import { toDetails, toSummary } from './reservation-views';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async reserve(userId: string, seatId: string) {
    const reservation = this.reservationRepository.create({
      userId,
      seatId,
      status: 'confirmed',
    });

    try {
      return toSummary(await this.reservationRepository.save(reservation));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Seat is already reserved');
      }
      if (isForeignKeyViolation(error)) {
        throw new NotFoundException('Seat not found');
      }
      throw error;
    }
  }

  async findMine(userId: string) {
    const reservations = await this.reservationRepository.find({
      where: { userId },
      relations: { seat: { event: true } },
      order: { createdAt: 'DESC' },
    });

    return reservations.map(toDetails);
  }

  async cancel(userId: string, id: string) {
    const result = await this.reservationRepository.update(
      { id, userId, status: 'confirmed' },
      { status: 'cancelled' },
    );

    if (!result.affected) {
      throw new NotFoundException('Reservation not found');
    }

    return { id, status: 'cancelled' };
  }
}
