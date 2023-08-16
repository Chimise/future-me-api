import { ExecutionContext, Injectable } from '@nestjs/common';
import {Reflector} from '@nestjs/core'
import {AuthGuard} from '@nestjs/passport'
import { Observable } from 'rxjs'
import {parse} from 'cookie';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private authService: AuthService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if(!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<Request>();
        const cookies = parse(request.get('cookie') ?? '');
        const userRole = this.authService.getRoleFromToken(cookies['x-auth-token']);
        if(!roles.includes(userRole)) {
            return false;
        }

        return super.canActivate(context);
    }
}