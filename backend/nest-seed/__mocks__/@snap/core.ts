// Lightweight manual mock for @snap/core to avoid loading the entire snap library in tests
import { HttpException, HttpStatus } from '@nestjs/common';

export class SeedException extends HttpException {
    constructor(message: string, status: HttpStatus) {
        super(message, status);
    }
}

export const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// IsPassword is used as a property decorator factory: @IsPassword()
// Must be a function that returns a PropertyDecorator, NOT a class.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IsPassword = (): PropertyDecorator => (_target: object, _propertyKey: string | symbol) => undefined;

export const RequestContextMiddleware = jest.fn();
export const RequestLogger = jest.fn();
export const SnapModule = { forRoot: jest.fn() };
