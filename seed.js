import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './lib/mongodb.js';
import Category from './models/Category.js';
import Dish from './models/Dish.js';
import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.resolve('seed-data.json'), 'utf-8'));

async function seed() {
  await connectDB();

  // Limpiamos colecciones
  await Category.deleteMany({});
  await Dish.deleteMany({});
  console.log('Colecciones limpiadas');

  // Insertamos categorías
  await Category.insertMany(data.categories);
  console.log('Categorías insertadas:', data.categories.length);

  // Insertamos platos
  await Dish.insertMany(data.dishes);
  console.log('Platos insertados:', data.dishes.length);

  console.log('¡Seed completado! Todo el menú de Cero Cafe cargado.');
  process.exit();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});