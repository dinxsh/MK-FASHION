import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }

  async getDependenciesHealth() {
    const [database, redis, elasticsearch, mlService] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkElasticsearch(),
      this.checkMlService(),
    ]);

    return {
      status: [database, redis, elasticsearch, mlService].every(
        (service) => service.status === 'ok',
      )
        ? 'ok'
        : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
        elasticsearch,
        mlService,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return this.formatFailure(error);
    }
  }

  private async checkRedis() {
    const url = this.configService.get<string>('redis.url');
    return this.checkTcpLikeDependency(url);
  }

  private async checkElasticsearch() {
    const url = this.configService.get<string>('elasticsearch.url');
    return this.checkHttpDependency(url);
  }

  private async checkMlService() {
    const baseUrl = this.configService.get<string>('mlService.url');
    return this.checkHttpDependency(baseUrl ? `${baseUrl}/health` : baseUrl);
  }

  private async checkHttpDependency(url?: string) {
    if (!url) {
      return { status: 'error', error: 'Missing URL configuration' };
    }

    try {
      const response = await this.httpService.axiosRef.get(url, {
        timeout: 2000,
      });
      return { status: 'ok', httpStatus: response.status };
    } catch (error) {
      return this.formatFailure(error);
    }
  }

  private async checkTcpLikeDependency(url?: string) {
    if (!url) {
      return { status: 'error', error: 'Missing URL configuration' };
    }

    return {
      status: 'unknown',
      detail: `Configured at ${url}; active ping check will be added when the Redis client is wired in.`,
    };
  }

  private formatFailure(error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      error: message,
    };
  }
}
