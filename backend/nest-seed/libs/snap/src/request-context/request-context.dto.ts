export class RequestContext {
  actor: string;
  email: string;
  originalUrl: string;
  method: string;
  userAgent: string;
  host: string;
  clientIp: string;
  requestId: string;
  userId: number;
  name: string;
  sessionId: string;
  roles: string[];
  startTime: number;
}
