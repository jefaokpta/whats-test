import * as fs from "fs";
import {sendTxt} from "./sendMessage.js";
import {whatsToAPI} from "../client/receiveMessage.js";
import {WhatsConnection} from "./whatsConnection.js";


export async function connectToWhatsApp () {
    const conn = WhatsConnection.connection
    const authFile = './auth_info.json'

    // conn.connectOptions = {
    //     waitOnlyForLastMessage: false,
    //     waitForChats: true,
    //     maxRetries: Infinity,
    //     phoneResponseTime: 10_000,
    //     alwaysUseTakeover: true,
    // }

    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of chats!
    conn.on('chats-received', async ({ hasNewChats }) => {
        console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

        const unread = await conn.loadAllUnreadMessages ()
        console.log ("you have " + unread.length + " unread messages")
        //unread.forEach(message => console.log(message))
    })

    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of contacts!
    conn.on('contacts-received', () => {
        console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
    });

    conn.on ('credentials-updated', () => { // salva sessao
        // save credentials whenever updated
        console.log (`credentials updated!`)
        const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
        fs.writeFileSync(authFile, JSON.stringify(authInfo, null, '\t')) // save this info to a file
    });

    conn.on('qr', qr => {
        // Now, use the 'qr' string to display in QR UI or send somewhere
        console.log('QR PARA MOSTRAR NA WEB')
        console.log(qr)
    });

    (fs.existsSync(authFile) && conn.loadAuthInfo (authFile))

    await conn.connect ()
        .then(() => console.log('CONECTOU COM SUCESSO'))
        .catch(error => {
            console.log('TENTANDO PEGAR QR CODE')
            //fs.rmSync('./auth_info.json')
            conn.clearAuthInfo()
            conn.connect()
                .then(() => {
                    console.log('SEGUNDA TENTATIVA SUCESSO')
                    salvaSessao()
                })
                .catch(error => console.log('SEGUNDA TENTATIVA FALHA'))
        })

    salvaSessao()
    function salvaSessao() {
        console.log (`SALVANDO SESSAO`)
        const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
        fs.writeFileSync(authFile, JSON.stringify(authInfo, null, '\t')) // save this info to a file
    }

    conn.on('chat-update', async chatUpdate => {
        // `chatUpdate` is a partial object, containing the updated properties of the chat
        // received a new message
        if (chatUpdate.messages && chatUpdate.count) {
            const message = chatUpdate.messages.all()[0]
            console.log (message)
            // if(message.message.conversation === 'Oi')
            //     sendTxt(conn, message.key.remoteJid)

            try {
                const resApi = await whatsToAPI(message)

                console.log('MENSAGEM RECEBIDA ACIMA '+ resApi.status)
            }catch (e) {
                console.log(e.message)
            }

            // TESTE VIDEO IMG AUDIO
        }
        else if(chatUpdate.presences){
            console.log(chatUpdate)
            console.log('PRESENCA ACIMA')
        }
        else if(chatUpdate.messages){
            const message = chatUpdate.messages.all()[0]
            console.log(message)
            try {
                const resApi = await whatsToAPI(message)

                console.log('POSSIVELMENTE MENSAGEM ENVIADA '+ resApi.status)
            }catch (e) {
                console.log(e.message)
            }

        }
        else console.log (chatUpdate) // see updates (can be archived, pinned etc.)
        //console.log(chatUpdate)


    })


}
