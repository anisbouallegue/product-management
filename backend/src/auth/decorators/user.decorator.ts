import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { userId: number; email: string; role: string } => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);