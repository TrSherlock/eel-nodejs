const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { exec } = require('child_process');
const app = express();
const sqlv8 = require("msnodesqlv8");
const fs = require('fs');
const port = 3000;

// app.use(express.json());

app.get('/', (req, res) => {
    fs.readFile('./ws.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

const server = http.createServer(app);
const ws = new WebSocket.Server({ noServer: true });

let activeWindow = 0;

ws.on('connection', (socket) => {
    console.log('Client connected');
    activeWindow++;

    socket.on('message', async (data) => {
        if(data == 'yevmiye') {
            const $server = ".\\ZRVSQL2014";
            const $database = "master";
            const $Uid = "zirvenet";
            const $Pwd = "zrvsql";
            const query = "SELECT * FROM sys.databases";
            const SqlConnString = `Server=${$server};Database=${$database};Uid=${$Uid};Pwd=${$Pwd};Trusted_Connection=No;Driver={SQL Server Native Client 11.0}`;
            const rows = await sqlv8.promises.query(SqlConnString, query);
            socket.send(JSON.stringify(rows));
        }
    });
    
    socket.on('close', () => {
        console.log('Client disconnected');
        activeWindow--;
        setTimeout(() => {
            if (!activeWindow) {
                console.log("Aktif pencere bulunamadı sunucu kapatılıyor");
                process.exit(0);
            }
        }, 1000)
    });
});

server.on('upgrade', (request, socket, head) => {
    console.log("upgrade");
    ws.handleUpgrade(request, socket, head, (socket) => {
      ws.emit('connection', socket, request);
    });
});

server.listen(port, () => {
    console.log(`Sunucu çalışıyor! http://localhost:${port}`);

    exec(`start chrome --app=http://localhost:${port} --disable-http-cache`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
});
