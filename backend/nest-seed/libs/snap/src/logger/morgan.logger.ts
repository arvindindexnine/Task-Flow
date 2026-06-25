import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';

const accessLogStream = rfs.createStream(`access.log`, {
  interval: '1d',
  size: '1M',
  path: `logs/access-logs`,
  compress: 'gzip',
  maxFiles: 150,
});
export const morganMiddleware = (token: string): any => morgan(token, { stream: accessLogStream });
