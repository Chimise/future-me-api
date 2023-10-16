import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { validate, loader } from '../config/config.schema';

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: `.env.${process.env.NODE_ENV}`,
        validate,
        load: [loader]
    }), TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const isProduction = configService.get('env') === 'production';
            return {
                ssl: isProduction,
                type: 'postgres',
                autoLoadEntities: true,
                synchronize: true,
                host: configService.get('db.host'),
                port: configService.get('db.port'),
                username: configService.get('db.username'),
                password: configService.get('db.password'),
                database: configService.get('db.database')
            }
        }
    })]
})
export class DatabaseModule { }