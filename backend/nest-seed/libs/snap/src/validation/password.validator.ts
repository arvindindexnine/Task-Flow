import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
const upperCase = /[A-Z]/;
const lowerCase = /[a-z]/;
const special = /[!@#$%^&*]/;
const numbers = /\d/;

@ValidatorConstraint({ async: false })
export class PasswordValidation implements ValidatorConstraintInterface {
  validate(password: string) {
    return !(!upperCase.test(password) || !lowerCase.test(password) || !special.test(password) || !numbers.test(password));
  }

  defaultMessage() {
    return 'Password must contain at least one uppercase, one lowercase, one special and one number character';
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordValidation,
    });
  };
}
