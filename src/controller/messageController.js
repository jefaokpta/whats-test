import express from "express";
import {sendTxt} from "../whatsapp/sendMessage.js";

export const messageController = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})