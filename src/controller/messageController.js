import express from "express";
import {sendTxt} from "../whatsapp/sendMessage.js";

export const messageController = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})
/* APARENTEMENTE STATUS
2 entregue no servidor whats
3 entregue no dispositivo
4 lido

 */