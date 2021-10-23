import { Injectable, Scope } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from './../prisma.service';

@Injectable({ scope: Scope.TRANSIENT })
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    let isHealthy = false;

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      isHealthy = true;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new HealthCheckError(
          err.message,
          this.getStatus(key, isHealthy, {
            message: err.message,
          }),
        );
      }
    }

    if (isHealthy) {
      return this.getStatus(key, isHealthy);
    } else {
      throw new HealthCheckError(
        `${key} is not available`,
        this.getStatus(key, isHealthy),
      );
    }
  }
}
