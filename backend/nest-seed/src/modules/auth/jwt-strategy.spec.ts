import { Test, TestingModule } from '@nestjs/testing';

import { AuthConfig } from './auth-config';
import { JwtStrategy } from './jwt-strategy';

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: AuthConfig, useValue: { Options: { jwtOptions: { secret: ['any-secret'] } } } }],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
