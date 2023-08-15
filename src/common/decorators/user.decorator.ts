import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const UserInfo = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
})