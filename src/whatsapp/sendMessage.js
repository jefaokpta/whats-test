import {MessageType, Mimetype} from '@adiwajshing/baileys'
import {WhatsConnection} from "./whatsConnection.js";

const conn = WhatsConnection.connection

export function sendTxt(message) {
    conn.sendMessage (message.remoteJid, message.message, MessageType.text)
        .then(message => console.log(message.key))
        .catch(error => console.log(error))
}

export function sendMediaMessage(fileUpload) {
    const messageDetail = messageDetails(fileUpload)
    const messageOptions = {
        caption: fileUpload.caption,
        mimetype: messageDetail.mimeType,
        ptt: fileUpload.ptt,
        filename: fileUpload.filePath
    }
    conn.sendMessage (fileUpload.remoteJid, { url: `whatsMedia/outbox/${fileUpload.filePath}` }, messageDetail.messageType, messageOptions)
        .then(message => console.log(message.key))
        .catch(error => console.log(error))
}

function messageDetails(fileUpload) {
    switch (fileUpload.fileType) {
        case 'IMAGE':
            return  imageMimeType(fileUpload.filePath)
        case 'DOCUMENT':
            return { messageType: MessageType.document, mimeType: Mimetype.pdf}
        case 'VIDEO':
            return { messageType: MessageType.video, mimeType: Mimetype.mp4}
        case 'AUDIO':
            return audioMimeType(fileUpload)
    }
}

function audioMimeType(fileUpload) {
    if(fileUpload.ptt){
        return {
            messageType: MessageType.audio,
            mimeType: Mimetype.ogg
        }
    }
    return {
        messageType: MessageType.audio,
        mimeType: Mimetype.mp4Audio
    }
}

function imageMimeType(name) {
    if(name.substring(name.lastIndexOf('.')) === '.png'){
        return {
            messageType: MessageType.image,
            mimeType: Mimetype.png
        }
    }
    return {
        messageType: MessageType.image,
        mimeType: Mimetype.jpeg
    }
}
