const express = require('express');
const cors = require('cors');
const axios = require('axios');
const WebSocket = require('ws');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

app.get('/', (req, res) => res.send("Backend running"));

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  console.log('WebSocket client connected');
  setInterval(() => {
    ws.send(JSON.stringify({ symbol: 'NIFTY', ltp: (Math.random() * 100).toFixed(2) }));
  }, 2000);
});
