const express = require('express');
const app = express();
const df = require('dialogflow-fulfillment');
const {google} = require('googleapis');

const calendarId = 'c_4a79102c4b81aeac13e14d83ab92b333ee64918b22400dde9fd6f3fe7e5c1904@group.calendar.google.com'
const serviceAccount ={
    "client_id":"811991291325-7kgq5tps1uv6v9ik6t1t656sb30bqfve.apps.googleusercontent.com",
    "project_id":"single-shadow-293214",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"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"
}

const serviceAccountAuth = new google.auth.JWT({
    scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');

const timeZone = 'America/Bogota';
const timeZoneOffset = '-05:00';