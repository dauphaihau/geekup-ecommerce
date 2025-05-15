import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '@modules/api/user/user.service';
import TokenPayload from '../token-payload.interface';
import { AllConfigType } from '@config/config.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth', { infer: true })
        .accessTokenSecret,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getFullUserById(payload.userId);
  }
}
