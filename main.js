const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
const {google} = require('googleapis');
const {uploadFile, generatePublicURL, localFileExists, path, file} = require('./googleDrive.js');

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

    async function handleBring(agent){
        const fileName = agent.parameters.fileName;
        console.log("Bringing the file called:", fileName);

        const publicLinks = await generatePublicURL(fileName);

        if (typeof publicLinks === 'string'){
            agent.add(publicLinks);
        }else if (publicLinks.length > 0){
            agent.add(`Se encontraron archivos con el nombre '${fileName}'. Aquí están sus enlaces:`)
            publicLinks.forEach((link, index) => {
               agent.add(`- Enlace ${index + 1}:`);
               agent.add(`(Ver Archivo) ${link.webViewLink}`);
               agent.add(`(Descarga Directa) ${link.webContentLink}`); 
            });
        }else {
            agent.add('Ocurrió un error al generar los enlaces públicos.');
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
    else if (currentItent == 'bringFile'){
        //console.log("En Bring File");
        intentMap.set('bringFile', handleBring);
    }
    agent.handleRequest(intentMap);
});

console.log("=== RUNNING ===");