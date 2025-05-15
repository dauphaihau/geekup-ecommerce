import { ConflictException } from '@nestjs/common';

class UserAlreadyExistsException extends ConflictException {
  constructor(text: string) {
    super(`User with ${text} already exists`);
  }
}

export default UserAlreadyExistsException;
