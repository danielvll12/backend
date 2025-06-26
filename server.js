const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const Car = require('./models/Car');

// Middleware para validar rol admin
function checkAdminRole(req, res, next) {
  const userRole = req.headers['x-user-role'];

  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Conexión a MongoDB
mongoose.connect(
  'mongodb+srv://danielvallec98:Liam0408%40@clusterdv.suqozna.mongodb.net/vehiculos?retryWrites=true&w=majority'
).then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err);
});

// Backup (opcional pero no prioritario)
const carsFile = './data/cars.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(carsFile)) fs.writeFileSync(carsFile, '[]');

// Importar rutas de autenticación (si las tienes)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// GET: obtener vehículos desde MongoDB
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error('❌ Error leyendo desde MongoDB:', error);
    res.status(500).json({ error: 'No se pudieron cargar los vehículos' });
  }
});

// POST: guardar nuevo vehículo
app.post('/api/cars', async (req, res) => {
  const newCar = req.body;

  try {
    const exists = await Car.findOne({ id: newCar.id });
    if (exists) {
      return res.status(409).json({ error: 'Vehículo duplicado por ID' });
    }

    const mongoCar = new Car(newCar);
    await mongoCar.save();

    // Guardar respaldo en archivo
    const backup = JSON.parse(fs.readFileSync(carsFile, 'utf8') || '[]');
    backup.push(newCar);
    fs.writeFileSync(carsFile, JSON.stringify(backup, null, 2));

    console.log('✅ Vehículo guardado en MongoDB');
    res.status(201).json(newCar);
  } catch (err) {
    console.error('❌ Error guardando en MongoDB:', err);
    res.status(500).json({ error: 'Error al guardar en MongoDB' });
  }
});

// DELETE: eliminar vehículo por ID (protegida con middleware admin)
app.delete('/api/cars/:id', checkAdminRole, async (req, res) => {
  try {
    const carId = req.params.id;

    const deleted = await Car.findOneAndDelete({ id: carId });
    if (!deleted) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    // También actualizar el archivo de respaldo
    const data = fs.readFileSync(carsFile, 'utf8') || '[]';
    const cars = JSON.parse(data).filter(car => car.id !== carId);
    fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));

    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error eliminando vehículo:', err);
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});
