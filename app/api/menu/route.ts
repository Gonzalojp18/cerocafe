import 'dotenv/config';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Dish from '@/models/Dish'

export async function GET() {
  try {
    await connectDB(); // Conecta a MongoDB

    // Traemos todas las categorías ordenadas
    const categories = await Category.find({}).sort({ orden: 1 });

    // Traemos todos los platos
    const dishes = await Dish.find({}).sort({ categoria: 1, orden: 1 });

    // Agrupamos los platos por categoría
    const menuData = categories.map((cat) => ({
      title: cat.nombre,
      description: cat.descripcion || '',
      products: dishes
        .filter((dish: any) => dish.categoria === cat.nombre)
        .map((dish: any) => ({
          name: dish.nombre,
          description: dish.descripcion || '',
          price: dish.precio.toString(),
        })),
    }));

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Error al cargar el menú' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // Para que siempre traiga datos frescos