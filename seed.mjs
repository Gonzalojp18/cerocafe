import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './lib/mongodb.js';
import Category from './models/Category.js';
import Dish from './models/Dish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedData = async () => {
  try {
    console.log('🚀 Iniciando proceso de seeding...');
    await connectDB();

    // Leer datos desde seed-data.json
    const dataPath = path.join(__dirname, 'seed-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const { categories, dishes } = JSON.parse(rawData);

    // Limpiar colecciones (Idempotencia)
    console.log('🧹 Limpiando colecciones existentes...');
    await Category.deleteMany({});
    await Dish.deleteMany({});

    // Sembrar categorías
    console.log(`📦 Insertando ${categories.length} categorías...`);
    await Category.insertMany(categories);

    // Sembrar platos
    console.log(`🍽️ Insertando ${dishes.length} platos...`);
    await Dish.insertMany(dishes);

    console.log('✅ Datos sembrados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sembrando datos:', error);
    process.exit(1);
  }
};

seedData();
