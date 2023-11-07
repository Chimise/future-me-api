import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class EmailService {
    private config = {
        sender: {
            name: process.env?.APP_NAME || 'Future Me',
            email: 'noreply@futureme.com',
        }
    }


    async send(email: string, subject: string, content: string) {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            ...this.config,
            to: [{ email, name: 'Test User' }],
            subject,
            htmlContent: content,
            textContent: content
        }, {
            headers: {
                'api-key': process.env.SIB_API_KEY,
                Accept: 'application/json',
            }
        })

        if (!response.data || (response.data && response.data?.event === 'delivered')) {
            console.log(response.data);
            throw new InternalServerErrorException('Message was sent but was not delivered successfully');
        }

        return response.data;

    }
}