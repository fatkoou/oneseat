import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUniqueViolation } from '../common/database-errors';
import { EventsService } from '../events/events.service';
import { GenerateSeatsDto } from './dto/generate-seats.dto';
import { expandLayout } from './seat-layout';
import { Seat } from './seat.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
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

  async findByEvent(eventId: string): Promise<Seat[]> {
    await this.eventsService.findOne(eventId);

    return this.seatRepository.find({
      where: { eventId },
      order: { section: 'ASC', rowLabel: 'ASC', number: 'ASC' },
    });
  }
}
