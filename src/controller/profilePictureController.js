import express from "express";
import {conn} from "../whatsapp/connectWhats.js";


export const profilePicture = express()

profilePicture.get('/:remoteJid', (req, res) => {
    conn.getProfilePicture (req.params.remoteJid)
        .then(data => {
            //console.log(data)
            res.json({picture: data})
        })
        .catch(error => {
            console.log(error.message)
            res.status(404).json({
                errorMessage: error.message
            })
        })
})

/* ATUALIZOU IMG PERFIL
* {
  jid: '5511938065778@s.whatsapp.net',
  imgUrl: 'https://pps.whatsapp.net/v/t61.24694-24/164218307_888531028679638_3901917165324685636_n.jpg?ccb=11-4&oh=dc34c7bbccd8ce7b6b180b15eed4ebae&oe=60DEC2D3'
}

*/
