import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

@ApiTags('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Reserve a seat' })
  @ApiConflictResponse({ description: 'Seat is already reserved' })
  @ApiNotFoundResponse({ description: 'Seat not found' })
  @Post()
  reserve(@CurrentUser() user: JwtPayload, @Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(user.sub, dto.seatId);
  }

  @ApiOperation({ summary: 'List my reservations' })
  @Get('me')
  findMine(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMine(user.sub);
  }

  @ApiOperation({ summary: 'Cancel one of my reservations' })
  @ApiNotFoundResponse({ description: 'Reservation not found' })
  @HttpCode(200)
  @Post(':id/cancel')
  cancel(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.reservationsService.cancel(user.sub, id);
  }
}
