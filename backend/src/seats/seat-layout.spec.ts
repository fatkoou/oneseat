import { BadRequestException } from '@nestjs/common';
import {
  GenerateSeatsDto,
  MAX_SEATS_PER_REQUEST,
  MAX_SEATS_PER_ROW,
} from './dto/generate-seats.dto';
import { expandLayout } from './seat-layout';

const EVENT_ID = '11111111-1111-4111-8111-111111111111';

type RowInput = { label: string; seatCount: number; startNumber?: number };

function layoutWithRows(...rows: RowInput[]): GenerateSeatsDto {
  return { sections: [{ name: 'MAIN', rows }] };
}

function rowsWithTotal(total: number): RowInput[] {
  const rows: RowInput[] = [];

  for (let remaining = total, index = 0; remaining > 0; index++) {
    const seatCount = Math.min(remaining, MAX_SEATS_PER_ROW);
    rows.push({ label: `R${index}`, seatCount });
    remaining -= seatCount;
  }

  return rows;
}

describe('expandLayout', () => {
  it('numbers seats from 1 when startNumber is not given', () => {
    const seats = expandLayout(
      EVENT_ID,
      layoutWithRows({ label: 'A', seatCount: 3 }),
    );

    expect(seats).toEqual([
      { eventId: EVENT_ID, section: 'MAIN', rowLabel: 'A', number: 1 },
      { eventId: EVENT_ID, section: 'MAIN', rowLabel: 'A', number: 2 },
      { eventId: EVENT_ID, section: 'MAIN', rowLabel: 'A', number: 3 },
    ]);
  });

  it('starts numbering at startNumber', () => {
    const seats = expandLayout(
      EVENT_ID,
      layoutWithRows({ label: 'A', seatCount: 2, startNumber: 10 }),
    );

    expect(seats.map((seat) => seat.number)).toEqual([10, 11]);
  });

  it('creates seats for every row of every section', () => {
    const layout: GenerateSeatsDto = {
      sections: [
        {
          name: 'VIP',
          rows: [
            { label: 'A', seatCount: 2 },
            { label: 'B', seatCount: 2 },
          ],
        },
        { name: 'GENERAL', rows: [{ label: 'C', seatCount: 3 }] },
      ],
    };

    const seats = expandLayout(EVENT_ID, layout);

    expect(seats).toHaveLength(7);
    expect(seats.filter((seat) => seat.section === 'VIP')).toHaveLength(4);
    expect(seats.filter((seat) => seat.section === 'GENERAL')).toHaveLength(3);
  });

  it('accepts a layout with exactly the maximum number of seats', () => {
    const layout = layoutWithRows(...rowsWithTotal(MAX_SEATS_PER_REQUEST));

    expect(expandLayout(EVENT_ID, layout)).toHaveLength(MAX_SEATS_PER_REQUEST);
  });

  it('rejects a layout with more than the maximum number of seats', () => {
    const layout = layoutWithRows(...rowsWithTotal(MAX_SEATS_PER_REQUEST + 1));

    expect(() => expandLayout(EVENT_ID, layout)).toThrow(BadRequestException);
  });
   
  it('rejects the same row label twice in one section', () => {
    const layout = layoutWithRows(
      { label: 'A', seatCount: 2 },
      { label: 'A', seatCount: 2 },
    );

    expect(() => expandLayout(EVENT_ID, layout)).toThrow(BadRequestException);
  });

  it('allows the same row label in different sections', () => {
    const layout: GenerateSeatsDto = {
      sections: [
        { name: 'VIP', rows: [{ label: 'A', seatCount: 1 }] },
        { name: 'GENERAL', rows: [{ label: 'A', seatCount: 1 }] },
      ],
    };

    expect(expandLayout(EVENT_ID, layout)).toHaveLength(2);
  });

});
