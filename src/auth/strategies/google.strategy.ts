import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy } from 'passport-google-oidc';
import { Profile, } from "passport";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { parse } from 'cookie';
import { UserService } from "src/users/user.service";
import { User } from "src/users/user.entity";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) {
        super({
            clientID: configService.get('google.clientId'),
            clientSecret: configService.get('google.secret'),
            callbackURL: '/auth/redirect/google',
            scope: ['profile', 'openid', 'email'],
            passReqToCallback: true
        })
    }

    /**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - Sign in using that account
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

    async validate(req: Request, issuer: string, profile: Required<Profile>) {
        let user = await this.extractUserFromCookie(req);
        const existingGoogleUser = await this.userService.findOneBy({ google_id: profile.id });

        // If a google user already exist return it
        if(existingGoogleUser) return existingGoogleUser;

        if (user) {
            // The user signed in using email and password, add a google account to the user account
            const name = user.name || `${profile.name.givenName} ${profile.name.familyName}`;
            const profile_image = user.profile_image || profile.photos[0].value
            const email = user.email || profile.emails[0].value;

            // Will later save access-token if needed
            return this.userService.update(user, { email, google_id: profile.id, profile_image, name })
        }

        const userWithSimilarEmail = await this.userService.findByEmail(profile.emails[0].value);
        if (userWithSimilarEmail) {
            throw new UnauthorizedException("There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.")
        }

        const name = `${profile.name.givenName} ${profile.name.familyName}`;
        const profile_image = Array.isArray(profile?.photos) ? profile?.photos[0]?.value : undefined;
        const email = profile.emails[0].value;

        user = await this.userService.create({
            name,
            profile_image,
            email,
            is_email_verified: true,
            google_id: profile.id
        })


        return user;
    }

    private async extractUserFromCookie(req: Request): Promise<User | null> {
        const cookies = parse(req.get('cookie') as any);
        const token = cookies['x-auth-token'];
        if (!token) {
            return null;
        }
        const data = this.jwtService.decode(token);
        if (!data || typeof data !== 'object') {
            return null;
        }

        const user = await this.userService.findOne(data.id);
        return user;
    }
}
