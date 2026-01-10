import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true }, // referencia por nombre
  disponible: { type: Boolean, default: true },
  orden: { type: Number, default: 0 },
  inventario: { type: Number, default: 0 },
  stockMinimo: { type: Number, default: 10 },
  ventas: { type: Number, default: 0 },
  fechaUltimaVenta: { type: Date }
});

export default mongoose.models.Dish || mongoose.model('Dish', DishSchema);