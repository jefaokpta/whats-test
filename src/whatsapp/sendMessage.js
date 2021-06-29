import { MessageType } from '@adiwajshing/baileys'
import {WhatsConnection} from "./whatsConnection.js";

const conn = WhatsConnection.connection

export function sendTxt(message) {
    conn.sendMessage (message.remoteJid, message.message, MessageType.text)
        .then(message => console.log(message.key))
        .catch(error => console.log(error))
}
// const id = 'abcd@s.whatsapp.net' // the WhatsApp ID
// // send a simple text!
// const sentMsg  = await conn.sendMessage (id, 'oh hello there', MessageType.text)
// // send a location!
// const sentMsg  = await conn.sendMessage(id, {degreesLatitude: 24.121231, degreesLongitude: 55.1121221}, MessageType.location)
// // send a contact!
// const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
//     + 'VERSION:3.0\n'
//     + 'FN:Jeff Singh\n' // full name
//     + 'ORG:Ashoka Uni;\n' // the organization of the contact
//     + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
//     + 'END:VCARD'
// const sentMsg  = await conn.sendMessage(id, {displayname: "Jeff", vcard: vcard}, MessageType.contact)
