import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUniqueViolation } from '../common/database-errors';
import { EventsService } from '../events/events.service';
import { Reservation } from '../reservations/reservation.entity';
import { GenerateSeatsDto } from './dto/generate-seats.dto';
import { expandLayout } from './seat-layout';
import { Seat } from './seat.entity';

export type SeatWithAvailability = Seat & { reserved: boolean };

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly eventsService: EventsService,
  ) {}

  async generate(eventId: string, dto: GenerateSeatsDto) {
    await this.eventsService.findOne(eventId);
    const seats = expandLayout(eventId, dto);

    try {
      await this.seatRepository.insert(seats);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Some of these seats already exist for this event',
        );
      }
      throw error;
    }

    return { created: seats.length };
  }

  async findByEvent(eventId: string): Promise<SeatWithAvailability[]> {
    await this.eventsService.findOne(eventId);

    const seats = await this.seatRepository.find({
      where: { eventId },
      order: { section: 'ASC', rowLabel: 'ASC', number: 'ASC' },
    });
    const reservedSeatIds = await this.findReservedSeatIds(eventId);

    return seats.map((seat) => ({
      ...seat,
      reserved: reservedSeatIds.has(seat.id),
    }));
  }

  private async findReservedSeatIds(eventId: string): Promise<Set<string>> {
    const reservations = await this.reservationRepository.find({
      select: { seatId: true },
      where: { status: 'confirmed', seat: { eventId } },
    });

    return new Set(reservations.map((reservation) => reservation.seatId));
  }
}
