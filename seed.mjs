import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import connectDB from './lib/mongodb.js';
import Category from './models/Category.js';
import Dish from './models/Dish.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Dish.deleteMany({});

    // Seed categories
    const categories = await Category.insertMany([
      { nombre: 'Café', descripcion: 'Nuestros cafés de especialidad', orden: 1 },
      { nombre: 'Té', descripcion: 'Selección de tés premium', orden: 2 },
      { nombre: 'Pastelería', descripcion: 'Deliciosos postres artesanales', orden: 3 },
    ]);

    // Seed dishes
    const dishes = await Dish.insertMany([
      { nombre: 'Espresso', descripcion: 'Café espresso intenso y aromático', precio: 3.50, categoria: 'Café', orden: 1 },
      { nombre: 'Cappuccino', descripcion: 'Café con leche espumosa y cacao', precio: 4.00, categoria: 'Café', orden: 2 },
      { nombre: 'Latte', descripcion: 'Café con leche al vapor', precio: 4.50, categoria: 'Café', orden: 3 },
      { nombre: 'Té Verde', descripcion: 'Té verde orgánico relajante', precio: 3.00, categoria: 'Té', orden: 1 },
      { nombre: 'Té Negro', descripcion: 'Té negro con notas afrutadas', precio: 3.00, categoria: 'Té', orden: 2 },
      { nombre: 'Croissant', descripcion: 'Croissant recién horneado', precio: 2.50, categoria: 'Pastelería', orden: 1 },
      { nombre: 'Tarta de Manzana', descripcion: 'Tarta casera con manzanas frescas', precio: 5.00, categoria: 'Pastelería', orden: 2 },
    ]);

    console.log('Datos sembrados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error sembrando datos:', error);
    process.exit(1);
  }
};

seedData();