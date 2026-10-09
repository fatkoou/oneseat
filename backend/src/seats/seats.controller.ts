import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GenerateSeatsDto } from './dto/generate-seats.dto';
import { SeatsService } from './seats.service';

@ApiTags('seats')
@Controller('events/:eventId/seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @ApiOperation({ summary: 'List the seats of an event' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @Get()
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.seatsService.findByEvent(eventId);
  }

  @ApiOperation({ summary: 'Generate seats from a layout (admin only)' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Only admins can generate seats' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiConflictResponse({ description: 'Some of these seats already exist' })
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
