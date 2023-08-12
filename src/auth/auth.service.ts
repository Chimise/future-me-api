import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { Injectable, BadRequestException, UnauthorizedException} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
import { User } from "src/users/user.entity";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) { }

    public async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Email do not exist');
        }

        const isValid = await this.validatePassword(password, user.password);
        if(!isValid) {
            throw new UnauthorizedException('Email or password is incorrect');
        }

        return user;
    }

    public async signup(email: string, password: string) {
        let user = await this.userService.findByEmail(email);
        if (user) {
            throw new BadRequestException('An account with this email already exist');
        }
        const hashedPassword = await this.hashPassword(password)
        user = await this.userService.create({ email, password: hashedPassword });
        return user;
    }

    private hashPassword(password: string, saltLength: number = 16): Promise<string> {
        return new Promise((res, rej) => {
            const salt = randomBytes(saltLength).toString('hex');
            scrypt(password, salt, 64, (err, hash) => {
                if (err) return rej(err);
                res(`${salt}:${hash.toString('hex')}`);
            })
        })
    }

    private validatePassword(newPassword, hashedPassword): Promise<boolean> {
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
        const token = await this.jwtService.signAsync({id: user.id}, {
            expiresIn: '24h',
            ...options
        })

        return token;
    }

    public async verifyToken(token: string) {
        const data: Pick<User, 'id'> = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false
        })

        return data;
    }

}