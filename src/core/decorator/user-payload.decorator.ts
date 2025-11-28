import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';

export const UserPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PayloadDto | null => {
    const request = ctx.switchToHttp()?.getRequest();
    if (!request) return null;

    return request.user as PayloadDto;
  },
);
