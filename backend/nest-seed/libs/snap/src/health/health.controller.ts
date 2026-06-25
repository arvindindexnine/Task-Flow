import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Response } from 'express';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check(@Res() res: Response): Promise<any> {
    try {
      const response = await this.health.check([
        // Application status
        () => Promise.resolve({ application: { status: 'up' } }),
        //check database status
        () => this.db.pingCheck('database'),
        // The used disk storage should not exceed 80% of the full disk size percentage. 80 per = 0.80
        () =>
          this.disk.checkStorage('storage_space', {
            path: this.configService.get<string>('HC_STORAGE_PATH'),
            thresholdPercent: this.configService.get<number>('HC_STORAGE_THRESHOLD'),
          }),
        // The used heap memory should not exceed configured memory
        () => this.memory.checkHeap('memory_heap', this.configService.get<number>('HC_HEAP_MEM_THRESHOLD') * 1024 * 1024),
        // The used memory(RAM) should not exceed configured memory for that process
        () => this.memory.checkRSS('memory_rss_RAM', this.configService.get<number>('HC_PROCESS_RAM_MEM_THRESHOLD') * 1024 * 1024),
      ]);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json(error.getResponse());
    }
  }
}
