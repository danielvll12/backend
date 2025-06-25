const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const carsFile = './data/cars.json';
let cars = [];

// Cargar autos una vez al iniciar
try {
  const fileData = fs.readFileSync(carsFile, 'utf8');
  cars = JSON.parse(fileData);
  console.log(`✅ ${cars.length} autos cargados desde cars.json`);
} catch (err) {
  console.warn('⚠️ No se pudo cargar cars.json. Iniciando con lista vacía.');
  cars = [];
}

// GET: Enviar todos los autos
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// POST: Agregar un auto
app.post('/api/cars', (req, res) => {
  const newCar = req.body;

  if (!newCar || !newCar.id) {
    return res.status(400).json({ error: 'Faltan datos del vehículo' });
  }

  cars.push(newCar);

  // Guardar también en el archivo (aunque Render no lo mantendrá)
  fs.writeFile(carsFile, JSON.stringify(cars, null, 2), (err) => {
    if (err) {
      console.error('❌ Error al guardar en cars.json:', err);
    } else {
      console.log('✅ Auto guardado en cars.json');
    }
  });

  res.status(201).json(newCar);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
