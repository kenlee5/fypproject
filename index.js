<<<<<<< HEAD
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
        spreadsheetId:'13TIxnaqF3q5FzpQ77Ks_Mp9L8xbCam_QvKEh4qBsN_E',//'1kVpjtgEH46WgNM2IgVCbdcQHdd_b--UZFN5b0xixeig',
        range: 'Form Responses 1!B2:F'
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

=======
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
        spreadsheetId:'13TIxnaqF3q5FzpQ77Ks_Mp9L8xbCam_QvKEh4qBsN_E',//'1kVpjtgEH46WgNM2IgVCbdcQHdd_b--UZFN5b0xixeig',
        range: 'Form Responses 1!B2:F'
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

>>>>>>> 6882e13447418b2e1e69f921a07b4ae31c9cde50
http.listen(3000, () => console.log('Listening on port 3000!'))