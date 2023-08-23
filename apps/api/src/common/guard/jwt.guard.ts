import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { parse } from 'cookie';
import { Request } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { AuthService } from '../../auth/auth.service';


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private authService: AuthService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const allowSession = this.reflector.get<boolean>('session', context.getHandler());
        const cookies = parse(request.get('cookie') ?? '');
        const authToken = cookies['x-auth-token']

        if (!authToken && allowSession && request.session) {
            //@ts-ignore
            request.session.user = request.session.user || uuidV4();
            request.session.save();
            return true;
        }

        if (!roles) {
            return super.canActivate(context);
        }


        const userRole = this.authService.getRoleFromToken(authToken);
        if (!roles.includes(userRole)) {
            return false;
        }

        return super.canActivate(context);
    }
}