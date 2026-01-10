import mongoose from 'mongoose';

const CustomerActivitySchema = new mongoose.Schema({
  clienteId: { type: String, required: true },
  accion: { type: String, required: true }, // visita, pedido, etc.
  fecha: { type: Date, default: Date.now },
  detalles: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String }
});

export default mongoose.models.CustomerActivity || mongoose.model('CustomerActivity', CustomerActivitySchema);