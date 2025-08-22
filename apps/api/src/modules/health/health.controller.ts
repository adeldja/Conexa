import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Vérification de la base de données
      () => this.prismaHealth.pingCheck('database', this.prisma),
      
      // Vérification de la mémoire (max 1GB)
      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
      
      // Vérification de l'espace disque (min 1GB libre)
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.9,
      }),
    ]);
  }

  @Get('live')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      // Simple check pour Kubernetes liveness probe
      () => Promise.resolve({ live: { status: 'up' } }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      // Vérification que l'API est prête à recevoir du trafic
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
