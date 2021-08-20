import express from "express";
import {sendMediaMessage, sendTxt} from "../whatsapp/sendMessage.js";

export const messageController = express()
export const mediaMessageController = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})

mediaMessageController.post('/', (req, res) => {
    console.log(req.body)
    sendMediaMessage(req.body)
    res.sendStatus(200)
    //res.send(req.body)
})

/* APARENTEMENTE STATUS
2 entregue no servidor whats
3 entregue no dispositivo
4 lido

 */
