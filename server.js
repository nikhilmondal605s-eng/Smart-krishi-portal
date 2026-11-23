const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Live Raspberry Pi Sensor Data Storage
let latestSensorData = {
  connected: false,
  lastUpdated: null,
  soilMoisture: null,
  soilTemp: null,
  soilPh: null,
  mqGas: null
};

// Endpoint: Raspberry Pi yahan data bhejega
app.post('/api/sensor-data', (req, res) => {
  const { soilMoisture, soilTemp, soilPh, mqGas } = req.body;
  latestSensorData = {
    connected: true,
    lastUpdated: new Date().toISOString(),
    soilMoisture,
    soilTemp,
    soilPh,
    mqGas
  };
  res.json({ status: 'success', message: 'Sensor telemetry updated' });
});

// Endpoint: Website yahan se live data padhegi
app.get('/api/sensor-data', (req, res) => {
  if (!latestSensorData.lastUpdated) {
    return res.json({ connected: false, status: 'Device Offline' });
  }
  const diffSeconds = (Date.now() - new Date(latestSensorData.lastUpdated).getTime()) / 1000;
  if (diffSeconds > 20) {
    return res.json({ connected: false, status: 'Device Offline' });
  }
  res.json(latestSensorData);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
