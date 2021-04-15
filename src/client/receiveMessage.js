import axios from "axios";

export function whatsToAPI(message) {
     return axios.post('http://localhost/whats/messages', {
         key: message.key,
         message: message.message,
         messageTimestamp: message.messageTimestamp,
         status: message.status
     })
        // .then(res => {
        //     console.log(`statusCode: ${res.status}`)
        // })
        // .catch(error => {
        //     console.error(error.config.data)
        // })
}