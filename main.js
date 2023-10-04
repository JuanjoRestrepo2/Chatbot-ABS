const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
const {google} = require('googleapis');
const {uploadFile, localFileExists, path, file} = require('./googleDrive.js');

const PORT = process.env.PORT || 5500;
 
app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
});

app.post('/webhook', express.json(), (request, response)=>{
    const agent = new df.WebhookClient({
        request: request,
        response: response
    });

    async function handleUpload(agent){
        const fileName = agent.parameters.fileName;
        const filePath = path.join(__dirname, fileName)

        if (await localFileExists(fileName))
        {
            console.log(`El archivo '${fileName}' fue encontrado`);
            const uploadStatus = await uploadFile(fileName, filePath);
            console.log("Upload Status: ", uploadStatus);
            if (uploadStatus)
            {
                agent.add(`El archivo '${fileName}' fue subido al Drive correctamente`);
                console.log(`El archivo '${fileName}' fue subido al Drive correctamente`);

            }else{
                agent.add(`No fue posible subir el archivo '${fileName}' al Drive`);
                console.log(`No fue posible subir el archivo '${fileName}' al Drive`);
            }
        }
        else
        {
            console.log(`No se encontró el archivo '${fileName}'.`);
        }
    }

    var intentMap = new Map();
    const currentItent = agent.intent;
    console.log("\nCurrent Intent Status:", currentItent);
    if (currentItent == 'Reminder'){
        console.log("En Reminder");
    }
    else if (currentItent == 'uploadFile'){
        //console.log("En Upload");
        intentMap.set('uploadFile', handleUpload);
    }
    agent.handleRequest(intentMap);
});

console.log()
console.log("Hola");