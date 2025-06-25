const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const carsFilePath = path.join(__dirname, 'cars.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // para imagen en base64

// Cargar autos desde el archivo
let cars = [];
if (fs.existsSync(carsFilePath)) {
  const data = fs.readFileSync(carsFilePath, 'utf-8');
  cars = JSON.parse(data);
}

// Ruta GET - obtener autos
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// Ruta POST - registrar nuevo auto
app.post('/api/cars', (req, res) => {
  const newCar = req.body;
  cars.push(newCar);

  fs.writeFileSync(carsFilePath, JSON.stringify(cars, null, 2));
  res.status(201).json({ message: 'Vehículo registrado correctamente' });
});

// Servidor iniciado
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
