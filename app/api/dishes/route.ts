import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dish from '@/models/Dish';

export async function GET() {
  try {
    await connectDB();
    const dishes = await Dish.find().sort({ categoria: 1, orden: 1 });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json({ error: 'Error fetching dishes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const dish = new Dish(body);
    await dish.save();
    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ error: 'Error creating dish' }, { status: 500 });
  }
}