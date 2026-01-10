import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  clienteId: { type: String },
  tipoPago: { type: String, enum: ['efectivo', 'tarjeta', 'transferencia'], default: 'efectivo' }
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);