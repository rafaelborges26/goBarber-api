import { isConstructorToken } from 'tsyringe/dist/typings/providers/injection-token'
import nodemailer, {Transporter} from 'nodemailer'
import IMailProvider from '../models/IMailProvider'


export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then(account => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: account.user,
                pass: account.pass
            }
        })

        this.client = transporter

        })

    }



    public async sendMail(to: string, body: string): Promise<void> {
        const message = await this.client.sendMail({
            from: 'Equipe Gobarber <equipe@gobarber.com>',
            to,
            subject: 'Recuperação de senha',
            text: body,
        })

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
