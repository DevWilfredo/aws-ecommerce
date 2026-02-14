export enum OrderStatus {
  PENDING = 'PENDING',          // creada pero no pagada (si aplica)
  PAID = 'PAID',                // pago confirmado
  PROCESSING = 'PROCESSING',    // preparando
  SHIPPED = 'SHIPPED',          // enviada
  DELIVERED = 'DELIVERED',      // entregada
  CANCELED = 'CANCELED',        // cancelada
  REFUNDED = 'REFUNDED',        // reembolsada (si aplica)
}