@echo off
set "ROOT=kotak-neo-trade-terminal"

echo Creating project folder structure...
mkdir %ROOT%\backend
mkdir %ROOT%\frontend\src

echo Creating backend files...
(
echo const express = require('express');
echo const cors = require('cors');
echo const axios = require('axios');
echo const WebSocket = require('ws');
echo const app = express();
echo app.use(cors()); app.use(express.json());
echo const PORT = 5000;
echo app.get('/', (req, res) => res.send("Backend working!"));
echo const server = app.listen(PORT, () => console.log(`Server running on port %PORT%`));
echo const wss = new WebSocket.Server({ server });
echo wss.on('connection', ws => {
echo.   console.log('WS client connected');
echo.   setInterval(() => {
echo.     ws.send(JSON.stringify({ symbol: 'NIFTY', ltp: (Math.random()*100).toFixed(2) }));
echo.   }, 2000);
echo });
) > %ROOT%\backend\index.js

echo Creating placeholder .env file...
echo KOTAK_CLIENT_ID=your_client_id> %ROOT%\backend\.env
echo KOTAK_SECRET=your_secret>> %ROOT%\backend\.env
echo KOTAK_ACCESS_TOKEN=your_access_token>> %ROOT%\backend\.env

echo Creating frontend React placeholder (App.jsx)...
(
echo import { useEffect, useState } from 'react';
echo function App() {
echo. const [data, setData] = useState([]);
echo. useEffect(() => {
echo.   const ws = new WebSocket('ws://localhost:5000');
echo.   ws.onmessage = e => setData(prev => [JSON.parse(e.data), ...prev.slice(0, 4)]);
echo.   return () => ws.close();
echo. }, []);
echo. return (^<div^> {data.map((x, i) => ^<p key={i}^>{x.symbol}: ₹{x.ltp}^</p^>)} ^</div^>);
echo }
echo export default App;
) > %ROOT%\frontend\src\App.jsx

echo Creating frontend package.json placeholder...
(
echo {
echo   "name": "frontend",
echo   "version": "1.0.0",
echo   "dependencies": {
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "react-scripts": "5.0.1"
echo   },
echo   "scripts": {
echo     "start": "react-scripts start"
echo   }
echo }
) > %ROOT%\frontend\package.json

echo Creating .gitignore...
(
echo # Ignore backend secrets
echo backend/.env
echo # Node modules
echo **/node_modules/
echo # Build folders
echo frontend/build/
echo *.log
) > %ROOT%\.gitignore

echo Creating README.md...
(
echo # Kotak Neo Trade Terminal
echo This project is a local React + Node.js trading terminal using Kotak Neo API.
) > %ROOT%\README.md

echo Creating optional Docker-related files...
(
echo version: '3.9'
echo services:
echo.  backend:
echo.    build: ./backend
echo.    ports:
echo.      - "5000:5000"
echo.    env_file:
echo.      - ./backend/.env
echo.  frontend:
echo.    build: ./frontend
echo.    ports:
echo.      - "3000:3000"
) > %ROOT%\docker-compose.yml

echo Creating backend Dockerfile...
(
echo FROM node:18
echo WORKDIR /app
echo COPY . .
echo RUN npm install
echo EXPOSE 5000
echo CMD ["node", "index.js"]
) > %ROOT%\backend\Dockerfile

echo Creating frontend Dockerfile...
(
echo FROM node:18
echo WORKDIR /app
echo COPY . .
echo RUN npm install
echo EXPOSE 3000
echo CMD ["npm", "start"]
) > %ROOT%\frontend\Dockerfile

echo Done!
echo All files and folders created under %ROOT%
