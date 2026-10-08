import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { SeatsController } from './seats.controller';
import { Seat } from './seat.entity';
import { SeatsService } from './seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), EventsModule, AuthModule],
  controllers: [SeatsController],
  providers: [SeatsService],
})
export class SeatsModule {}
