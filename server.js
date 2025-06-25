// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const carDB = require('./car');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/api/cars', (req, res) => {
  res.json(carDB.getCars());
});

app.post('/api/cars', (req, res) => {
  const newCar = req.body;

  if (!newCar || !newCar.id || !newCar.brand) {
    return res.status(400).json({ message: 'Datos incompletos del vehículo' });
  }

  carDB.addCar(newCar);
  console.log(`✔️ Vehículo agregado: ${newCar.brand} ${newCar.model}`);
  res.status(201).json({ message: 'Vehículo guardado exitosamente' });
});

app.listen(PORT, () => {
  console.log(`🚗 Servidor backend corriendo en http://localhost:${PORT}`);
});
