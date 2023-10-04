const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
const {google} = require('googleapis');

const PORT = process.env.PORT || 5500;


const serviceAccount ={
    "client_id":"811991291325-7kgq5tps1uv6v9ik6t1t656sb30bqfve.apps.googleusercontent.com",
    "project_id":"single-shadow-293214",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"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"
}


app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
});

app.post('/webhook', express.json(), (request, response)=>{
    const agent = new df.WebhookClient({
        request: request,
        response: response
    });


    var intentMap = new Map();
    const currentItent = agent.intent;
    console.log("\nCurrent Intent Status:", currentItent);
    if (currentItent == 'Reminder'){
        console.log("En Reminder");
    }
    else if (currentItent == 'uploadFile'){
        console.log("En Upload");
    }
    agent.handleRequest(intentMap);
});


console.log("Hola");