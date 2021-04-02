import {connectToWhatsApp} from "./connectWhats.js";


// run in main file
connectToWhatsApp ()
    .catch (err => console.log("unexpected error: " + err) ) // catch any errors