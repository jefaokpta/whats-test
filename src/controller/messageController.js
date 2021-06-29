import express from "express";
import {sendTxt} from "../whatsapp/sendMessage.js";
import {conn} from "../whatsapp/connectWhats.js";

export const messageController = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})

messageController.get('/picture', (req, res) => {
    console.log(req.body.jid)
    conn.getProfilePicture (req.body.jid)
        .then(data => console.log(data))
        .catch(error => console.log(error.message))
    //console.log("download profile picture from: " + ppUrl)
    res.sendStatus(200)
})

/* ATUALIZOU IMG PERFIL
* {
  jid: '5511938065778@s.whatsapp.net',
  imgUrl: 'https://pps.whatsapp.net/v/t61.24694-24/164218307_888531028679638_3901917165324685636_n.jpg?ccb=11-4&oh=dc34c7bbccd8ce7b6b180b15eed4ebae&oe=60DEC2D3'
}

*/

/* APARENTEMENTE STATUS
2 entregue no servidor whats
3 entregue no dispositivo
4 lido

 */
