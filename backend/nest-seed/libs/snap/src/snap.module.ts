import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../../../config';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { HealthModule } from './health';
import { SnapService } from './snap.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      /*
      Load environment variables, prioritizing environment-specific file
      If same variable exists in both files, Then the value present in .env.${process.env.NODE_ENV} will override the value the value present in .env
      */
      envFilePath: [`./.env.${process.env.NODE_ENV}`, `./.env`],
      load: [config],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (request) => request.headers['x-request-id'] ?? uuidv4(),
      },
    }),
    HealthModule,
    /* ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static-web'),
    }), */
  ],
  providers: [SnapService],
  exports: [SnapService],
})
export class SnapModule {}
