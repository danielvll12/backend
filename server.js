const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' })); // <- mayor límite

const carsFile = './data/cars.json';

// Crear carpeta y archivo si no existen
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(carsFile)) fs.writeFileSync(carsFile, '[]');

// GET todos los carros
app.get('/api/cars', (req, res) => {
  fs.readFile(carsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error leyendo datos' });
    try {
      const cars = JSON.parse(data);
      res.json(cars);
    } catch {
      res.status(500).json({ error: 'JSON inválido' });
    }
  });
});

// POST nuevo carro
app.post('/api/cars', (req, res) => {
  const newCar = req.body;
  fs.readFile(carsFile, 'utf8', (err, data) => {
    let cars = [];
    if (!err && data) {
      try { cars = JSON.parse(data); } catch {}
    }
    cars.push(newCar);
    fs.writeFile(carsFile, JSON.stringify(cars, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar' });
      res.status(201).json(newCar);
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
