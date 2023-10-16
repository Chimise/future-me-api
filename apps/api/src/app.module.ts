import { Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { MessageModule } from './messages/message.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from 'app/shared';

@Module({
  imports: [DatabaseModule, UserModule, MessageModule, AuthModule, AccountModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{ }
