import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUser } from 'src/helper/get-user';

export const UserRoleId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const user = getUser(ctx);
    return user.roles[0].name;
  },
);
