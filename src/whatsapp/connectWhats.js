import {authConfirmed, restoreAuth, sendQrCode, whatsToAPI} from "../client/receiveMessage.js";
import {WhatsConnection} from "./whatsConnection.js";


export const conn = WhatsConnection.connection

export async function connectToWhatsApp () {
    //const authFile = './auth_info.json'

    /** The version of WhatsApp Web we're telling the servers we are
      VERSAO DO WHATS WEB
     */
    conn.version = [2, 2140, 12];

    conn.connectOptions = {
        /** fails the connection if no data is received for X seconds */
        maxIdleTimeMs: 60_000,
        /** maximum attempts to connect */
        maxRetries: Infinity,
        /** max time for the phone to respond to a connectivity test */
        phoneResponseTime: 30_000,
        /** minimum time between new connections */
        connectCooldownMs: 10000,
        /** agent used for WS connections (could be a proxy agent) */
        agent: undefined,
        /** agent used for fetch requests -- uploading/downloading media */
        fetchAgent: undefined,
        /** always uses takeover for connecting */
        alwaysUseTakeover: true,
        /** log QR to terminal */
        logQR: true
    }

    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of chats!
    conn.on('chats-received', async ({ hasNewChats }) => {
        console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

        const unread = await conn.loadAllUnreadMessages ()
        console.log ("you have " + unread.length + " unread messages")
        let statusAPi = 500
        const remoteJidsMap = new Map()
        for (const message of unread) {
            remoteJidsMap.set(message.key.remoteJid, null)
            statusAPi = await messageToSendApi(message)
        }
        if(statusAPi === 200){
            for (const remoteJid of remoteJidsMap.keys()) {
            conn.chatRead(remoteJid)
                    .then(() => console.log(`CHAT BOOT ${remoteJid} MARCADO COMO LIDO`))
                    .catch(error => console.log(error.message))
            }
        }
    })

    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of contacts!
    // conn.on('contacts-received', () => {
    //     console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
    // });

    conn.on ('credentials-updated', () => { // salva sessao
        // save credentials whenever updated
        console.log (`CREDENCIAIS ATUALIZADAS? QUANDO ACONTECE ISSO!`)
        authConfirmed(conn.base64EncodedAuthInfo())
        //const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
        //fs.writeFileSync(authFile, JSON.stringify(authInfo, null, '\t')) // save this info to a file
    });

    conn.on('qr', qr => {
        // Now, use the 'qr' string to display in QR UI or send somewhere
        console.log('QR PARA MOSTRAR NA WEB')
        console.log(qr)
        sendQrCode(qr)
    });

    console.log('BUSCANDO AUTH NO BANCO')
    await restoreAuth().then(res => {
        const authInfo = res.data
        //console.log(authInfo)
        conn.loadAuthInfo(authInfo)
    }).catch(e => console.log(e.message))

    console.log('TENTANDO CONEXAO')

    async function connectWA() {
        await conn.connect()
            .then(() => {
                salvaSessao()
                console.log('CONECTOU COM SUCESSO')
            }).catch(error => console.log(error.message))
    }

    await connectWA();

    function salvaSessao() {
        console.log (`SALVANDO SESSAO`)
        //qrCodeConfirmed()
        authConfirmed(conn.base64EncodedAuthInfo())
        //const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
        //fs.writeFileSync(authFile, JSON.stringify(authInfo, null, '\t')) // save this info to a file
    }

    async function messageToSendApi(message) {
        console.log (message)
        try {
            return (await whatsToAPI(message)).status
        } catch (e) {
            console.log(e.message)
        }
    }

    conn.on('close', reason => {
        console.log(`DESCONECTADO ${reason.reason} RECONECTANDO? ${reason.isReconnecting}`)
        setTimeout(() => {
            connectWA()
        }, 180000)
    })

    // conn.on('ws-close', reason => {
    //     console.log(`WS DESCONECTADO ${reason.reason}`)
    // })

    conn.on('chat-update', async chatUpdate => {
        // `chatUpdate` is a partial object, containing the updated properties of the chat
        // received a new message
        if (chatUpdate.messages && chatUpdate.count) {
            const message = chatUpdate.messages.all()[0]
            const statusApi = await messageToSendApi(message)
            if(statusApi === 200){
                conn.chatRead(message.key.remoteJid)
                    .then(() => console.log(`CHAT UPDATE ${message.key.remoteJid} MARCADO COMO LIDO`))
                    .catch(error => console.log(error.message))
            }
            console.log(`CHAT UPDATE ${statusApi}`)
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
        else if(chatUpdate.imgUrl){
            console.log('APARENTEMENTE TROCA DE IMG DE PERFIL')
            console.log(chatUpdate)
        }
        else {
            console.log('EVENTOS NAO DEFINIDOS AINDA')
            console.log (chatUpdate)
        }


    })


}
