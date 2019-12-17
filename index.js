const { google } = require('googleapis');
const keys = require('./keys.json');

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let numRow = 0;
let newRow = 0;
const refreshTime = 2000;
const debug = true;
var show = false;

app.get('/', (req, res) => res.sendFile(__dirname + '/map.html'))

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected to Sheet!');
    }

});

io.on('connection', (socket) => {
    //console.log('Connected to Client!')
    show = true;
    gsRunMain(client);
})

async function gsRunMain(cl) {
    const gsapi = google.sheets({ version: 'v4', auth: cl });
    //option variable
    const option = {
        spreadsheetId:'SPREADSHEET_ID',
        range: 'Form Responses 1!B2:F' //Spreadsheet range
    };

    let data = await gsapi.spreadsheets.values.get(option);

    rawData = data.data.values;
    newRow = data.data.values.length;

    //send to client
    if (numRow < newRow || show) {
        numRow = newRow;
        //console.log(numRow);
        io.emit('rawData', rawData);
        show = false;
    }
    //io.emit('rawData', rawData);
}
if (debug) {
    setInterval(() => {
        //console.log('restarted');
        gsRunMain(client);
    }, refreshTime);
}

http.listen(3000, () => console.log('Listening on port 3000!'))