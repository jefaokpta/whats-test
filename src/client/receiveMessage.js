import axios from "axios";
import {conn} from "../whatsapp/connectWhats.js";
import * as fs from "fs";

const urlBase = 'http://127.0.0.1:8080'
const mediaFolder = 'whatsMedia'
// const urlBase = 'http://128.0.0.1:8080'
// const mediaFolder = '/whatsMedia'




export async function whatsToAPI(message) {
     let messageData = {
         key: message.key,
         message: null,
         messageTimestamp: message.messageTimestamp,
         status: message.status,
         company: process.env.COMPANY || 12,
         instanceId: process.env.API_PORT || 3001,
         mediaMessage: false
     }
     if(message.message.audioMessage){
         messageData.mediaMessage = true
         messageData['mediaType'] = 'AUDIO'
         messageData['mediaUrl'] = await downloadAndSaveMedia(message, 'audio')
     }
     else if(message.message.documentMessage){
         messageData.mediaMessage = true
         messageData['mediaType'] = 'DOCUMENT'
         const buffer = await conn.downloadMediaMessage(message)
         const fileTitle = message.message.documentMessage.title
         const fileExtension = fileTitle.substring(fileTitle.lastIndexOf('.'))
         const fileName = `document-${message.messageTimestamp}-${message.key.id}${fileExtension}`
         messageData['mediaUrl'] = fileName
         messageData['mediaFileLength'] = message.message.documentMessage.fileLength
         messageData['mediaPageCount'] = message.message.documentMessage.pageCount
         messageData['mediaFileTitle'] = fileTitle
         fs.writeFile(`${mediaFolder}/${fileName}`, buffer, error => {
             if(error){ console.log(error) } else console.log('DOCUMENTO SALVO COM SUCESSO!')
         })
     }
     else if(message.message.videoMessage){
         messageData.mediaMessage = true
         messageData['mediaType'] = 'VIDEO'
         messageData['mediaUrl'] = await downloadAndSaveMedia(message, 'video')
         if(message.message.videoMessage.caption){
             messageData['mediaCaption'] = message.message.videoMessage.caption
         }
     }
     else if(message.message.imageMessage){
         messageData.mediaMessage = true
         messageData['mediaType'] = 'IMAGE'
         messageData['mediaUrl'] = await downloadAndSaveMedia(message, 'image')
         if(message.message.imageMessage.caption){
             messageData['mediaCaption'] = message.message.imageMessage.caption
         }
     }
     else{
         messageData.message = message.message
     }
     return axios.post(`${urlBase}/api/messages`, messageData)
}

function downloadAndSaveMedia(message, mediaTitle) {
    const fileName = `${mediaTitle}-${message.messageTimestamp}-${message.key.id}`
    return conn.downloadAndSaveMediaMessage (message, `${mediaFolder}/${fileName}`) // to decrypt & save to file
    //console.log(message.key.remoteJid + " MEDIA SALVA EM: " + savedFilename)
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
