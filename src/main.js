import {connectToWhatsApp} from "./whatsapp/connectWhats.js";
import express from "express";
import {messageController} from "./controller/messageController.js";
import {profilePicture} from "./controller/profilePictureController.js";

const router = express()
router.use(express.json())
const port = process.env.PORT || 3001

// run in main file
connectToWhatsApp ()
    .catch (err => console.log("unexpected error: " + err) ) // catch any errors


router.use('/whats/messages', messageController)
router.use('/whats/profile/picture', profilePicture)

router.listen(port, () =>  console.log(`Express up in port: ${port}`))
