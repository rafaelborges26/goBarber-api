import IMailProvider from '../models/IMailProvider'

interface IMessage {
    to: string
    body: string
}

export default class FakeMailProvider implements IMailProvider {

    private messages: IMessage[] = []

    public async sendMail(to: string, body: string): Promise<void> {
        this.messages.push({
            to: 'rafael.borges2698@gmail.com',
            body: 'Hey friend, how are you?'
        })
    }
}
