import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    dishId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})

const orderSchema = new mongoose.Schema({
    // Número de orden único
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    // Items del pedido
    items: [orderItemSchema],

    // Total del pedido
    total: {
        type: Number,
        required: true,
        min: 0
    },

    // Datos del cliente
    customer: {
        userId: {
            type: String,  // ID del usuario si está registrado
            required: false
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        }
    },

    // Tipo de entrega
    deliveryType: {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },

    // Dirección (solo si es delivery)
    address: {
        type: String,
        required: false
    },

    // Estado del pedido
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Pago (para fase 2 con Mercado Pago)
    paymentStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    paymentId: {
        type: String,  // ID de Mercado Pago
        required: false
    }
}, {
    // ✅ OPCIÓN 1: Usar timestamps automáticos de Mongoose
    timestamps: true  // Esto crea createdAt y updatedAt automáticamente
})


const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order