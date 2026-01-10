import 'dotenv/config';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Dish from '@/models/Dish'

export async function GET() {
  try {
    console.log('🚀 API Menu: Iniciando petición GET');
    
    // TEMPORAL: Forzar respuesta hardcoded para probar hot-reloading
    const testData = [
      {
        title: "Entrantes",
        description: "Para empezar",
        products: [
          { name: "Ensalada César", description: "Lechuga romana, pollo, parmesano", price: "8.50" },
          { name: "Gambas al ajillo", description: "Gambas salteadas con ajo", price: "12.00" }
        ]
      },
      {
        title: "Platos Principales",
        description: "Nuestras especialidades",
        products: [
          { name: "Paella Valenciana", description: "Arroz con marisco y pollo", price: "18.00" },
          { name: "Carrilleras de cerdo", description: "Cocinadas a baja temperatura", price: "15.50" }
        ]
      }
    ];
    
    console.log('🔍 MONGODB_URI existe:', !!process.env.MONGODB_URI);
    console.log('🔍 MONGODB_URI (primeros 50 chars):', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await connectDB(); // Conecta a MongoDB
    
    // Log de conexión
    console.log('📊 Estado de conexión mongoose:', mongoose.connection.readyState);
    console.log('📊 Nombre de la base de datos:', mongoose.connection.name);
    console.log('📊 Host de conexión:', mongoose.connection.host);

    // Traemos todas las categorías ordenadas
    console.log('🔍 Buscando categorías...');
    const categories = await Category.find({}).sort({ orden: 1 });
    console.log(`📋 Categorías encontradas: ${categories.length}`);
    console.log('📋 Nombres de categorías:', categories.map(cat => cat.nombre));

    // Traemos todos los platos
    console.log('🔍 Buscando platos...');
    const dishes = await Dish.find({}).sort({ categoria: 1, orden: 1 });
    console.log(`🍽️ Platos encontrados: ${dishes.length}`);
    
    if (dishes.length > 0) {
      console.log('🍽️ Primer plato:', JSON.stringify(dishes[0], null, 2));
      const categories = dishes.map(dish => dish.categoria);
      const uniqueCategories = categories.filter((cat, index) => categories.indexOf(cat) === index);
      console.log('🍽️ Categorías de platos:', uniqueCategories);
      
      // Si hay datos reales, usarlos
      const menuData = categories.map((cat) => {
        const categoryDishes = dishes.filter((dish: any) => dish.categoria === cat.nombre);
        console.log(`📂 Categoría "${cat.nombre}": ${categoryDishes.length} platos`);
        
        return {
          title: cat.nombre,
          description: cat.descripcion || '',
          products: categoryDishes.map((dish: any) => ({
            name: dish.nombre,
            description: dish.descripcion || '',
            price: dish.precio.toString(),
          })),
        };
      });

      console.log('✅ API Menu: Datos reales enviados exitosamente');
      return NextResponse.json(menuData);
    } else {
      // Si no hay datos, devolver datos de prueba
      console.log('⚠️ No hay datos en la BD, devolviendo datos de prueba');
      console.log('📦 Estructura de prueba:', JSON.stringify(testData, null, 2));
      return NextResponse.json(testData);
    }

  } catch (error) {
    console.error('❌ Error fetching menu:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('❌ Stack trace:', errorStack);
    return NextResponse.json({ error: 'Error al cargar el menú', details: errorMessage }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // Para que siempre traiga datos frescos