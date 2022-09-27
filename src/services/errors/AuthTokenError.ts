export class AuthTokenError extends Error{
    constructor (){
        super('Erro de falha de autenticação.')
    }
}