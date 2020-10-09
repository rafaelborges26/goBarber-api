class AppError { //utilizado no fluxo de requisição e resposta
    public readonly message: string
    public readonly statusCode: number //401, 404

    constructor(message: string, statusCode = 400) {
        this.message = message
        this.statusCode = statusCode
    }
}

export default AppError
