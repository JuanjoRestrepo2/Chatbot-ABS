const {google} = require('googleapis');
const path = require('path');
const fs = require('fs')

const CLIENT_ID = '811991291325-gm3vfj2qfdv1jfab6th2455n0jk7nr1n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04S13cernWI6DCgYIARAAGAQSNwF-L9IrTgWPnrTWp_4oiz4mZSAtlkOhbLWswI7V1XJkfbvrxgzw96F1rxLqSlVqh1ZxHkbC3so'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token : REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

async function uploadFile(fileName, filePath)
{
    try
    {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
            },
        });
        
        if (response.status == 200){
            return true
        }else{
            return false
        }

        //console.log(response.data)
    }catch(error){
        console.log(error.message);
    }
}

async function localFileExists(fileName)
{
    return new Promise((resolve, reject)=>{
        fs.stat(fileName, (err, stats) => {
            if(err){
                if (err.code === 'ENOENT'){
                    resolve(false);
                } else{
                    reject(err);
                }
            } else{
                resolve(true);
            }            
        });
    });
}
/*
async function deleteFile(fileName, filePath){
    try{
        const response = await drive.files.delete({
            fileId: 
        })
    }catch(error){
        console.log(error.message)
    }
}*/

async function generatePublicURL(fileName){
    try{
        const response = await drive.files.list({
            q: `name:='${fileName}'`,
        });
        if (response.data.files.length > 0){
            const publicLinks = [];

            for (const file of response.data.files){
                 const fileId = file.id;
                 
                 await drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone',
                    },
                 });
                 const result = await drive.files.get({
                    fileId: fileId,
                    fields: 'webViewLink, webContentLink',
                 });
                 publicLinks.push(result.data);
            }

            return publicLinks;
        }else{
            return `No se encontraron archivos con el nombre '${fileName}'.`;
        }
    } catch (error){
        console.error(error.message);
        return 'Ocurrió un error al generar los enlaces públicos.';
    }
}

module.exports = {
    uploadFile,
    localFileExists,
    generatePublicURL,
    path
};

