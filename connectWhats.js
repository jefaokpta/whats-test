import { WAConnection } from '@adiwajshing/baileys'
import * as fs from "fs";

export async function connectToWhatsApp () {
    const conn = new WAConnection()

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
    })

    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of contacts!
    conn.on('contacts-received', () => {
        console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
    });

    // conn.on ('credentials-updated', () => { // salva sessao
    //     // save credentials whenever updated
    //     console.log (`credentials updated!`)
    //     const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
    //     fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
    // });

    // if (fs.existsSync('./auth_info.json')) { // carrega json da sessao se existir
    //     console.log("PEGANDO CREDENCIAIS DO DISCO")
    //     conn.loadAuthInfo('./auth_info.json')
    // }
    (fs.existsSync('./auth_info.json') && conn.loadAuthInfo ('./auth_info.json'))
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
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
    }

    conn.on('chat-update', chatUpdate => {
        // `chatUpdate` is a partial object, containing the updated properties of the chat
        // received a new message
        if (chatUpdate.messages && chatUpdate.count) {
            const message = chatUpdate.messages.all()[0]
            console.log (message)
        } else console.log (chatUpdate) // see updates (can be archived, pinned etc.)
    })


}
