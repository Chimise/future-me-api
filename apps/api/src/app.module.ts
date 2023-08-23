import { Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { MessageModule } from './messages/message.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate, loader} from './common/config';
import { AccountModule } from './account/account.module';
import { EmailModule } from './email/email.module';

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
  }), UserModule, MessageModule, AuthModule, AccountModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{ }
