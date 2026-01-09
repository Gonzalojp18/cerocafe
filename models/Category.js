import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  orden: { type: Number, default: 0 }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);