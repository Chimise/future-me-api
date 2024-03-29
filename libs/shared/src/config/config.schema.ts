import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { Environment, Google, Mail } from './config.interface';




class EnvironmentVariables {
    @IsEnum(Environment)
    readonly NODE_ENV: Environment = Environment.Development;

    @IsInt()
    readonly PORT?: number;

    @IsNumber()
    DB_PORT: number

    @IsString()
    DB_HOST: string;

    @IsString()
    DB_USERNAME: string

    @IsString()
    DB_PASSWORD: string

    @IsString()
    DB_NAME: string

    @IsString()
    JWT_SECRET: string

    @IsString()
    SESSION_SECRET: string

    @IsString()
    GOOGLE_CLIENT_ID?: string

    @IsString()
    GOOGLE_CLIENT_SECRET?: string;

    @IsOptional()
    @IsString()
    SMTP_USERNAME?: string;

    @IsOptional()
    @IsString()
    SMTP_PASSWORD?: string;

    @IsOptional()
    @IsString()
    SMTP_HOST?: string;

    @IsOptional()
    @IsString()
    SMTP_FROM?: string;
}



export const validate = (config: Record<string, unknown>) => {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}


export const loader = () => {
    const google: Google = {} as Google;
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        google.clientId = process.env.GOOGLE_CLIENT_ID;
        google.secret = process.env.GOOGLE_CLIENT_SECRET
    }

    const mail: Mail = {} as Mail;
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD && process.env.SMTP_HOST) {
        mail.user = process.env.SMTP_USERNAME;
        mail.pass = process.env.SMTP_PASSWORD;
        mail.host = process.env.SMTP_HOST;
        mail.from = process.env.SMTP_FROM ?? '"No Reply" <noreply@future-me.com>';
    }


    return {
        isProd: process.env.NODE_ENV === 'production',
        port: process.env.PORT,
        env: process.env.NODE_ENV,
        db: {
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
        jwt: process.env.JWT_SECRET,
        sessionSecret: process.env.SESSION_SECRET,
        ...({ google, mail })
    }
}