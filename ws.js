const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');
const app = express();
// const sqlv8 = require("msnodesqlv8");
const fs = require('fs')

app.get('/', (req, res) => {
    fs.readFile('./ws.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

const ws = new WebSocket.Server({ port: 8080 });
let activeWindow = 0;

ws.on('connection', (socket) => {
    console.log('İstemci Bağlandı!');
    activeWindow++;
    
    socket.on('close', () => {
        console.log('İstemci Bağlantısı Kesildi');
        activeWindow--;
        setTimeout(() => {
            if (!activeWindow) {
                console.log("Aktif pencere bulunamadı sunucu kapatılıyor");
                process.exit(0);
            }
        }, 1000)
    });
});

app.listen(3000, () => {
    console.log(`Sunucu çalışıyor! http://localhost:${3000}`);
    exec('start chrome --app=http://localhost:3000 --disable-http-cache', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
});
