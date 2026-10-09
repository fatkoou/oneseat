import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

const DATABASE_TIMEOUT_MS = 500;

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'Liveness: is the process running?' })
  @HealthCheck()
  @Get('live')
  live() {
    return this.health.check([]);
  }

  @ApiOperation({ summary: 'Readiness: can the app reach its database?' })
  @ApiServiceUnavailableResponse({
    description: 'The database is not reachable',
  })
  @HealthCheck()
  @Get('ready')
  ready() {
    return this.health.check([
      () =>
        this.database.pingCheck('database', { timeout: DATABASE_TIMEOUT_MS }),
    ]);
  }
}
