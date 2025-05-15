import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

@Injectable()
export class TokenService {
  constructor() {}

  public generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
