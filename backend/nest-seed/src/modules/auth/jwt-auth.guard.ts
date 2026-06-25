import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategies } from './auth.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategies.JWT_SECRET_STRATEGY) {}
