import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";




@Module({
    imports: [ConfigModule],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }

// imports: [MailerModule.forRootAsync({
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: (configService: ConfigService) => {
//         return {
//             transport: {
//                 host: configService.get('mail.host'),
//                 port: 587,
//                 ignoreTLS: true,
//                 secure: configService.get('isProd'),
//                 auth: {
//                     user: configService.get('mail.user'),
//                     pass: configService.get('mail.pass')
//                 }
//             },
//             defaults: {
//                 from: configService.get('mail.from')
//             }
//         }
//     }
// })],

