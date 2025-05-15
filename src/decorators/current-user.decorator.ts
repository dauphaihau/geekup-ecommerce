import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // request['user'] is set by the AuthGuard
    const user = request['user'];

    return data ? user?.[data] : user;
  },
);
