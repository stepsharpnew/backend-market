import { from } from "rxjs"

export class SendMailDTO{
    to : string
    from : string = 'step2002sharp@yaandex.ru'
    subject : string = 'Ваш новый пароль'
    text ?: string
    html ?: string
}