import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';

export const UserInfo = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
})


export const SetRoles = (...args: string[]) => SetMetadata('role', args);

export const AllowSession = (allowSession: boolean = true) => SetMetadata('session', allowSession);