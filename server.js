const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const carsFile = './data/cars.json';

// GET: Devolver todos los carros
app.get('/api/cars', (req, res) => {
  fs.readFile(carsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer cars.json:', err);
      return res.status(500).json({ error: 'No se pudieron cargar los carros' });
    }

    try {
      const cars = JSON.parse(data);
      res.json(cars);
    } catch (parseError) {
      console.error('Error al parsear cars.json:', parseError);
      res.status(500).json({ error: 'Error al procesar los datos' });
    }
  });
});

// POST: Agregar nuevo carro
app.post('/api/cars', (req, res) => {
  const newCar = req.body;

  fs.readFile(carsFile, 'utf8', (err, data) => {
    let cars = [];
    if (!err && data) {
      try {
        cars = JSON.parse(data);
      } catch (e) {
        console.warn('No se pudo parsear JSON previo, iniciando nuevo array');
      }
    }

    cars.push(newCar);

    fs.writeFile(carsFile, JSON.stringify(cars, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar:', err);
        return res.status(500).json({ error: 'Error al guardar' });
      }

      res.status(201).json(newCar);
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
