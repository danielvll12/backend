const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const Car = require('./models/Car'); // <- modelo MongoDB

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' })); // para imágenes base64

// Conexión a MongoDB Atlas
mongoose.connect(
  'mongodb+srv://danielvallec98:Liam0408%40@clusterdv.suqozna.mongodb.net/vehiculos?retryWrites=true&w=majority'
).then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err);
});

// Archivo local como respaldo
const carsFile = './data/cars.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(carsFile)) fs.writeFileSync(carsFile, '[]');

// GET: leer desde MongoDB
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find(); // <- desde MongoDB
    res.json(cars);
  } catch (error) {
    console.error('❌ Error leyendo desde MongoDB:', error);
    res.status(500).json({ error: 'No se pudieron cargar los vehículos' });
  }
});

// POST: guardar en archivo y luego en MongoDB si no existe duplicado
app.post('/api/cars', async (req, res) => {
  const newCar = req.body;

  // Validar duplicado en MongoDB antes de guardar en archivo
  try {
    const existingCar = await Car.findOne({ id: newCar.id });

    if (existingCar) {
      console.warn('⚠️ Vehículo duplicado por ID:', newCar.id);
      return res.status(409).json({ error: 'Ya existe un vehículo con este ID' });
    }

    // Guardar en archivo local como respaldo
    fs.readFile(carsFile, 'utf8', (err, data) => {
      let cars = [];
      if (!err && data) {
        try {
          cars = JSON.parse(data);
        } catch (e) {
          console.warn('⚠️ Error al parsear archivo JSON, se usará arreglo vacío');
        }
      }

      cars.push(newCar);
      fs.writeFile(carsFile, JSON.stringify(cars, null, 2), async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al guardar en archivo' });
        }

        // Guardar en MongoDB
        try {
          const mongoCar = new Car(newCar);
          await mongoCar.save();
          console.log('✅ Vehículo guardado en MongoDB');
          res.status(201).json(newCar);
        } catch (err) {
          console.error('❌ Error guardando en MongoDB:', err);
          res.status(500).json({ error: 'Error al guardar en MongoDB' });
        }
      });
    });

  } catch (err) {
    console.error('❌ Error verificando duplicado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});
