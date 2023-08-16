import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Response } from "express";
import { CookieSerializeOptions, serialize } from 'cookie';
import { UserService } from "src/users/user.service";
import { User } from "src/users/user.entity";
import { Role } from "src/common/interfaces/auth.interface";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) { }

    public async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email do not exist');
        }

        const isValid = await this.validatePassword(password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Email or password is incorrect');
        }

        return user;
    }

    public async signup(email: string, password: string, role?: Role) {
        let user = await this.userService.findByEmail(email);
        if (user) {
            throw new BadRequestException('An account with this email already exist');
        }
        const hashedPassword = await this.hashPassword(password)
        user = await this.userService.create({ email, password: hashedPassword, role });
        return user;
    }

    public hashPassword(password: string, saltLength: number = 16): Promise<string> {
        return new Promise((res, rej) => {
            const salt = randomBytes(saltLength).toString('hex');
            scrypt(password, salt, 64, (err, hash) => {
                if (err) return rej(err);
                res(`${salt}:${hash.toString('hex')}`);
            })
        })
    }

    public validatePassword(newPassword, hashedPassword): Promise<boolean> {
        return new Promise((res, rej) => {
            const [salt, hash] = hashedPassword.split(':');
            scrypt(newPassword, salt, 64, (err, newHash) => {
                if (err) return rej(err);
                const previousHash = Buffer.from(hash, 'hex');
                res(timingSafeEqual(newHash, previousHash));
            })
        })
    }

    public async generateToken(user: User, options: JwtSignOptions = {}) {
        if (user.role === Role.Admin) {
            options.expiresIn = options.expiresIn ?? '7days'
            options.secret = process.env.ADMIN_JWT_TOKEN;
        } else {
            options.expiresIn = options.expiresIn ?? '24h';
        }

        const token = await this.jwtService.signAsync({ id: user.id, role: user.role }, {
            ...options
        })

        return token;
    }

    public getRoleFromToken(token: string) {
        const data = this.jwtService.decode(token);
        if (!data || typeof data !== 'object') {
            throw new InternalServerErrorException('Invalid token');
        }

        return data.role ?? Role.User;
    }

    public async verifyToken(token: string) {
        let options: any = {}
        const role = this.getRoleFromToken(token);
        if (role === Role.Admin) {
            options.secret = process.env.ADMIN_JWT_TOKEN;
        }

        const data: Pick<User, 'id' | 'role'> = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false,
            ...options
        })

        return data;
    }

    public setJwtCookie(res: Response, value: string, options: CookieSerializeOptions = {}) {
        // Cookie should last for 7 days
        res.setHeader('Set-Cookie', serialize('x-auth-token', value, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            path: '/',
            ...options
        }))
    }

}