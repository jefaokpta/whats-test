import axios from "axios";

// const urlBase = 'http://128.0.0.1:8080'
const urlBase = 'http://192.168.15.152:8080'

export function whatsToAPI(message) {
     return axios.post(`${urlBase}/api/messages`, {
         key: message.key,
         message: message.message,
         messageTimestamp: message.messageTimestamp,
         status: message.status,
         company: process.env.COMPANY || 12,
         instanceId: process.env.API_PORT || 3001
     })
}

export function sendQrCode(qrCode) {
     axios.post(`${urlBase}/api/register`, {
         code: qrCode,
         id: process.env.COMPANY || 12
     })
         .then(() => console.log('QRCODE ENVIADO!'))
         .catch(e => console.log(e.message))
}

export function authConfirmed(authInfo){
    authInfo['companyId'] = process.env.COMPANY || 12
    console.log(authInfo)
    axios.post(`${urlBase}/api/register/auth`, authInfo)
        .then(() => console.log('QRCODE SALVO NO BANCO!'))
        .catch(e => console.log(e.message))
}

export function restoreAuth(){
    return axios.get(`${urlBase}/api/register/auth/${process.env.COMPANY || 12}`)
}

export function qrCodeConfirmed() {
     axios.get(`${urlBase}/api/register/${process.env.COMPANY || 12}`)
         .then(() => console.log('QRCODE CONFIRMADO!'))
         .catch(e => console.log(e.message))
}
