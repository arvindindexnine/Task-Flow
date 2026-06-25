import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthConfig } from './auth-config';

describe('AuthConfig', () => {
  let service: AuthConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [AuthConfig],
    }).compile();

    service = module.get<AuthConfig>(AuthConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
