import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/common/constants';
import { IActiveUser } from 'src/common/interfaces/active-user/active-user.interface';

export const ActiveUser = createParamDecorator(
    (field: keyof IActiveUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: IActiveUser | undefined = request[REQUEST_USER_KEY];
        return field ? user?.[field] : user;
    },
);