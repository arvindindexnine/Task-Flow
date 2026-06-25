import { CanActivate, Injectable } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ClsService } from 'nestjs-cls';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../logger';
import { RequestContext } from '../request-context/request-context.dto';

let rateLimiter: RateLimiterMemory;

export const initRateLimiterInstance = () => {
  const opts = {
    points: 5, //max no of requests in a defined duration
    duration: 60, //duration in seconds
  };

  const rateLimiter: RateLimiterMemory = new RateLimiterMemory(opts);
  if (rateLimiter) {
    logger.info('Rate limiter instance initialized');
  } else {
    logger.error('Failed to initialize Rate limiter instance');
  }
};

/*
 * RateLimitGuard is used to block the requests if the max API request limit is reached within the specified duration for a single IP
 * If you want to block the API request for all the IP's after the max API request limit is reached within the specified duration,
 * then you can use the @nestjs/throttler package, doc link - https://docs.nestjs.com/security/rate-limiting
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private key: string;

  constructor(
    private readonly cls: ClsService,
    key?: string,
  ) {
    this.key = key;
  }

  async canActivate() {
    if (!rateLimiter) {
      initRateLimiterInstance();
    }

    const requestContext: RequestContext = this.cls.get<RequestContext>('requestContext');

    if (!requestContext?.clientIp) {
      logger.error('Request context or client IP not found');
      throw new ThrottlerException('Too Many Requests');
    }

    try {
      // Use the value of this.key to set keyPrefix
      const keyPrefix = this.key || 'global';
      rateLimiter.keyPrefix = keyPrefix;

      // Consume a point for the client IP
      await rateLimiter.consume(requestContext.clientIp);
      return true;
    } catch (error) {
      // Use the local variable keyPrefix
      logger.error(`Too Many Requests, API endpoint : ${requestContext.method} ${requestContext.originalUrl}`);
      throw error;
    }
  }
}
