import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionPassport = createParamDecorator(
  (data, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const username: string = request.session.passport.user;
    return username;
  },
);
