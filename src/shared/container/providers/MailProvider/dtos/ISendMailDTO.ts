import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO'

interface IMailContent {
    name: string,
    email: string
}

export default class ISendMailDTO {
    to: IMailContent
    from?: IMailContent
    subject: string
    templateData: IParseMailTemplateDTO
}
