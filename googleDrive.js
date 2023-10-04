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

fileName = 'RedBull.jpg'
const filePath = path.join(__dirname, fileName)

async function uploadFile(fileName, filePath){
    try{
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
            }
        })

        console.log(response.data)
    }catch(error){
        console.log(error.message);
    }
}

//uploadFile(fileName, filePath)
module.exports = {
    uploadFile
};

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