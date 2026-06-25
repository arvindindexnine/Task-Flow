import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { logger } from '../logger';
import { RequestContext } from '../request-context';

interface ResponseWithMessage {
  message: string;
}

const getCause = (response: string | ResponseWithMessage): string => {
  if (typeof response === 'string') {
    return response;
  } else if (response?.message) {
    return response.message;
  }
  return 'Internal Server Error!';
};

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly cls: ClsService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const requestContext = this.cls.get<RequestContext>('requestContext');
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string;
    if (exception instanceof HttpException) {
      message = getCause(exception.getResponse() as ResponseWithMessage);
    } else {
      //console logs are not recommended but as of now logger does not configured to print stack trace, so kept it until this setup come in place
      message = 'Internal Server Error!';
      logger.error(exception, requestContext);
    }
    response.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
      requestId: requestContext?.requestId,
      sessionId: requestContext?.sessionId,
    });
  }
}
