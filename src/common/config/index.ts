import { IsEnum, IsNumber, IsInt, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Environment, Google} from '../interfaces/config.interface';
export {Config, Google} from '../interfaces/config.interface'




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
    let google: Google = {} as Google;
    if(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        google.clientId = process.env.GOOGLE_CLIENT_ID;
        google.secret = process.env.GOOGLE_CLIENT_SECRET
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
        ...({google})
    }
}