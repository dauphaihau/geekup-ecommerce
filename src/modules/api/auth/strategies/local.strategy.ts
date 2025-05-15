import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier',
    });
  }

  async validate(
    identifier: string,
    password: string,
  ): Promise<FullUserResponseDto> {
    return this.authService.getAuthenticatedUser(identifier, password);
  }
}
