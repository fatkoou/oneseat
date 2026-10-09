import { BadRequestException } from '@nestjs/common';
import {
  GenerateSeatsDto,
  MAX_SEATS_PER_REQUEST,
} from './dto/generate-seats.dto';
import { Seat } from './seat.entity';

type NewSeat = Pick<Seat, 'eventId' | 'section' | 'rowLabel' | 'number'>;

export function expandLayout(
  eventId: string,
  layout: GenerateSeatsDto,
): NewSeat[] {
  if (countSeats(layout) > MAX_SEATS_PER_REQUEST) {
    throw new BadRequestException(
      `A layout can create at most ${MAX_SEATS_PER_REQUEST} seats`,
    );
  }

  assertNoDuplicateRows(layout);

  const seats: NewSeat[] = [];

  for (const section of layout.sections) {
    for (const row of section.rows) {
      const firstNumber = row.startNumber ?? 1;

      for (let offset = 0; offset < row.seatCount; offset++) {
        seats.push({
          eventId,
          section: section.name,
          rowLabel: row.label,
          number: firstNumber + offset,
        });
      }
    }
  }

  return seats;
}

function countSeats(layout: GenerateSeatsDto): number {
  return layout.sections.reduce(
    (sectionSum, section) =>
      sectionSum +
      section.rows.reduce((rowSum, row) => rowSum + row.seatCount, 0),
    0,
  );
}

function assertNoDuplicateRows(layout: GenerateSeatsDto): void {
  const seen = new Set<string>();

  for (const section of layout.sections) {
    for (const row of section.rows) {
      const key = JSON.stringify([section.name, row.label]);

      if (seen.has(key)) {
        throw new BadRequestException(
          `Row "${row.label}" appears more than once in section "${section.name}"`,
        );
      }

      seen.add(key);
    }
  }
}

