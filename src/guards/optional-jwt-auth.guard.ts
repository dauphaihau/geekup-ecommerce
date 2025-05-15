import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to allow unauthorized requests to proceed
  handleRequest(err: any, user: any, info: any) {
    // Don't throw an error if authentication fails
    // Just return the user (or null if not authenticated)
    return user;
  }
} 