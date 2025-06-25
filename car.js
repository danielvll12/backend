// backend/car.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cars.json');

// Leer carros desde archivo
function readCars() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8'); // Crear archivo vacío si no existe
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo cars.json:', error);
    return [];
  }
}

// Guardar carros en archivo
function writeCars(cars) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(cars, null, 2), 'utf8');
  } catch (error) {
    console.error('Error escribiendo cars.json:', error);
  }
}

module.exports = {
  getCars: () => readCars(),
  addCar: (car) => {
    const cars = readCars();
    cars.push(car);
    writeCars(cars);
  },
};
