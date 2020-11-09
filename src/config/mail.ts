interface IMailConfig {
    driver: 'ethereal' | 'ses'

    defaults: {
        from: {
            email: string,
            name: string
        }
    }
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'rafaeladm@rafaelborges.dev.br',
            name: 'Rafael Borges'
        }
    }

} as IMailConfig
