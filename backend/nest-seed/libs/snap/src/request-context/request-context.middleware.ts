import { Global, Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from '@snap/core';
import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
@Global()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const requestContext = this.getRequestContext(request);
    this.cls.set('requestContext', requestContext);
    next();
  }

  getRequestContext(request: Request): RequestContext {
    const ip = request.headers['X-Forwarded-For'] || request.socket.remoteAddress;
    const requestContext = new RequestContext();
    let token = this.extractJWTFromRequest(request);

    if (token?.startsWith('Bearer')) {
      token = token.replace('Bearer ', '');
      const decodedToken = jwt.decode(token) as RequestContext;

      requestContext.userId = decodedToken.userId;
      requestContext.email = decodedToken?.email || null;
      requestContext.name = (decodedToken as any).name || null;
      requestContext.roles = (decodedToken as any).roles || [];
    }
    requestContext.requestId = this.cls.getId() || uuidv4();
    requestContext.originalUrl = request.originalUrl;
    requestContext.method = request.method;
    requestContext.userAgent = request.headers['user-agent'];
    requestContext.host = request.headers['host'];
    requestContext.clientIp = String(ip);
    requestContext.startTime = Date.now();
    return requestContext;
  }

  extractJWTFromRequest(req: Request): string {
    let token: string;
    const h = req.headers;
    if (req && h) {
      token = req.headers.authorization;
    }
    return token;
  }
}
