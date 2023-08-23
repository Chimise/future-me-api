import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";
import { ConfigService, ConfigModule } from "@nestjs/config";




@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return {
                transport: {
                    host: configService.get('mail.host'),
                    port: 587,
                    ignoreTLS: true,
                    secure: false,
                    auth: {
                        user: configService.get('mail.user'),
                        pass: configService.get('mail.pass')
                    }
                },
                defaults: {
                    from: configService.get('mail.from')
                }
            }
        }
    })],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }

