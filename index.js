import express from 'express';
import { createServer } from 'node:http';
const app = express();
import path from 'path';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { getGlobals } from 'common-es'
const { __dirname } = getGlobals(
    import.meta.url)

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

import { Server } from "socket.io";

const server = app.listen(3000, (error) => {
    if (error) throw error
    else console.log('Listening on port 3000')
})

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/app.html'));
});

let com;
let port;
let flag = false;

function conn() {
    port = new SerialPort({
        path: com,
        baudRate: 9600,
    })
    const p = new ReadlineParser({ delimiter: '\r\n' })
    const parser = port.pipe(p);
    port.open((err) => {
        if (err) {
            return console.log(err.message);
        }
    })
    parser.on('data', (data) => {
        if (flag) {
            io.emit('data', data)
            port.flush();
        }

    })
}
//send coms array to frontend
io.on("connection", (socket) => {
    socket.on('getcoms', () => {
        SerialPort.list().then((data) => {
            let arr = []
            data.forEach(element => {
                arr.push(element.path)
            });
            io.emit('coms', arr)
        })
    })

});

//connect
io.on("connection", (socket) => {
    socket.on('conn', (value) => {
        console.log(value)
        com = value;
        if (flag == false) {
            conn()
            flag = true
        }

    })
})

//disconnect
io.on("connection", (socket) => {
    socket.on('disconn', () => {
        if (flag == true) {
            port.close()
            flag = false
        }

    })
})