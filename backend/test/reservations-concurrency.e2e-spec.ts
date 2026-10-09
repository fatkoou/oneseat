import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { Event } from '../src/events/event.entity';
import { Reservation } from '../src/reservations/reservation.entity';
import { Seat } from '../src/seats/seat.entity';
import { User } from '../src/users/user.entity';

const CONCURRENT_USERS = 50;
const TEST_DATABASE = 'oneseat_test';

describe('Reservations: concurrent requests for the same seat', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let seatId: string;
  let tokens: string[];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.listen(0);

    dataSource = app.get(DataSource);
    assertTestDatabase(dataSource);
    await dataSource.query(
      'TRUNCATE TABLE reservations, seats, events, users CASCADE',
    );

    const event = await dataSource.getRepository(Event).save({
      title: 'Concurrency test',
      description: null,
      startsAt: new Date(),
      location: 'Test',
    });

    const seat = await dataSource.getRepository(Seat).save({
      eventId: event.id,
      section: 'TEST',
      rowLabel: 'A',
      number: 1,
    });
    seatId = seat.id;

    const users = await dataSource.getRepository(User).save(
      Array.from({ length: CONCURRENT_USERS }, (_, index) => ({
        email: `user${index}@test.local`,
        passwordHash: 'not-a-real-hash',
        role: 'user' as const,
      })),
    );

    const jwtService = app.get(JwtService);
    tokens = await Promise.all(
      users.map((user) =>
        jwtService.signAsync({ sub: user.id, role: user.role }),
      ),
    );
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  it('confirms exactly one reservation and rejects all the others', async () => {
    const responses = await Promise.all(
      tokens.map((token) =>
        request(app.getHttpServer())
          .post('/reservations')
          .set('Authorization', `Bearer ${token}`)
          .send({ seatId }),
      ),
    );

    const statuses = responses.map((response) => response.status);

    expect(statuses.filter((status) => status === 201)).toHaveLength(1);
    expect(statuses.filter((status) => status === 409)).toHaveLength(
      CONCURRENT_USERS - 1,
    );

    const confirmedInDatabase = await dataSource
      .getRepository(Reservation)
      .count({ where: { seatId, status: 'confirmed' } });

    expect(confirmedInDatabase).toBe(1);
  });
});

function assertTestDatabase(dataSource: DataSource): void {
  const { database } = dataSource.options as { database?: string };

  if (database !== TEST_DATABASE) {
    throw new Error(`Refusing to run against database "${database}"`);
  }
}
