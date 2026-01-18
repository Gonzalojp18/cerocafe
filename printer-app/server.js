const express = require('express')
const escpos = require('escpos')
escpos.USB = require('escpos-usb')

const app = express()
app.use(express.json())

const PORT = 3001

// Endpoint para imprimir
app.post('/print', async (req, res) => {
    try {
        const { order } = req.body

        console.log('📄 Recibiendo orden para imprimir:', order.orderNumber)

        // Buscar impresora USB
        const device = new escpos.USB()
        const printer = new escpos.Printer(device)

        device.open(function (error) {
            if (error) {
                console.error('❌ Error al abrir impresora:', error)
                return res.status(500).json({
                    success: false,
                    error: 'No se pudo conectar a la impresora'
                })
            }

            // Generar ticket
            printer
                .font('a')
                .align('ct')
                .style('bu')
                .size(1, 1)
                .text('CERO CAFÉ')
                .text('Take Away')
                .style('normal')
                .text('--------------------------------')
                .align('lt')
                .text(`Orden: ${order.orderNumber}`)
                .text(`Fecha: ${new Date(order.createdAt).toLocaleString('es-AR')}`)
                .text('--------------------------------')
                .text(`Cliente: ${order.customer.name}`)
                .text(`Teléfono: ${order.customer.phone}`)

            if (order.customer.address) {
                printer.text(`Dirección: ${order.customer.address}`)
            }

            printer
                .text(`Tipo: ${order.deliveryType === 'delivery' ? 'DELIVERY' : 'RETIRO'}`)
                .text('--------------------------------')
                .text('ITEMS:')
                .text('')

            // Items del pedido
            order.items.forEach(item => {
                printer
                    .text(`${item.quantity}x ${item.name}`)
                    .text(`   $${item.price} c/u = $${item.price * item.quantity}`)
                    .text('')
            })

            printer
                .text('--------------------------------')
                .size(1, 1)
                .text(`TOTAL: $${order.total}`)
                .size(0, 0)
                .text('--------------------------------')

            if (order.paymentId) {
                printer
                    .text(`Pago ID: ${order.paymentId}`)
                    .text('PAGO CONFIRMADO')
                    .text('--------------------------------')
            }

            printer
                .text('')
                .text('Gracias por tu compra!')
                .text('')
                .cut()
                .close()

            console.log('✅ Ticket impreso exitosamente')
            res.json({ success: true, message: 'Impreso correctamente' })
        })

    } catch (error) {
        console.error('❌ Error al imprimir:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor de impresión activo' })
})

app.listen(PORT, () => {
    console.log(`🖨️  Servidor de impresión corriendo en http://localhost:${PORT}`)
    console.log(`📡 Esperando órdenes para imprimir...`)
})