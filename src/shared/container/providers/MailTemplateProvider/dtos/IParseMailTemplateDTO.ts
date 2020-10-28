interface ITemplateVariables {
    [key: string]: string | number
}

export default interface IParseMailTemplateDTO {
    template: string
    variables: ITemplateVariables//quando for um objeto, mas n sabemos qual as propriedades nem quantas.
}
