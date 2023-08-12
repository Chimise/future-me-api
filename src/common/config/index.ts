import { IsEnum, IsNumber, IsInt, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Environment} from '../interfaces/index.interface';
export {Config} from '../interfaces/index.interface'




class EnvironmentVariables {
    @IsEnum(Environment)
    readonly NODE_ENV: Environment = Environment.Development;

    @IsInt()
    readonly PORT: number = 5000;

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
    JWT_TOKEN: string
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
    return {
        port: process.env.PORT,
        env: process.env.NODE_ENV,
        db: {
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        },
        jwt: process.env.JWT_TOKEN
    }
}