import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dish from '@/models/Dish';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;
    const dish = await Dish.findByIdAndUpdate(id, body, { new: true });
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ error: 'Error updating dish' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const dish = await Dish.findByIdAndDelete(id);
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Dish deleted' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ error: 'Error deleting dish' }, { status: 500 });
  }
}