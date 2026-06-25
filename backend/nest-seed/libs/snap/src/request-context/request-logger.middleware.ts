import { Global, Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from '@snap/src';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

export interface IRequestCustom extends Request {
  requestId: string;
  startTime: number;
}

@Injectable()
@Global()
export class RequestLogger implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  use(req: Request, res: Response, next: any) {
    const reqParams = req.query;
    const request = req as IRequestCustom;
    if ('requestId' in reqParams && reqParams.requestId) {
      request.requestId = String(reqParams.requestId);
    } else {
      request.requestId = uuidv4();
    }
    const requestContext = this.cls.get<RequestContext>('requestContext');
    request.startTime = requestContext.startTime;
    next();
  }
}
