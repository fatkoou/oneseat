import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GenerateSeatsDto } from './dto/generate-seats.dto';
import { SeatsService } from './seats.service';

@Controller('events/:eventId/seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.seatsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('generate')
  generate(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() dto: GenerateSeatsDto,
  ) {
    return this.seatsService.generate(eventId, dto);
  }
}
