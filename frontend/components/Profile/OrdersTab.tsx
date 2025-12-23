'use client';

import OrderCard from './OrderCard';

export default function OrdersTab({ orders, user }: { orders: any[]; user: any }) {
    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-gray-200">
                <button className="px-4 py-3 border-b-2 border-indigo-500 text-indigo-600 font-medium">Actuales</button>
                <button className="px-4 py-3 text-gray-600 hover:text-gray-900">Sin pagar</button>
                <button className="px-4 py-3 text-gray-600 hover:text-gray-900">Todas las órdenes</button>
            </div>

            {orders.map((order) => (
                <OrderCard key={order.id} order={order} user={user} />
            ))}
        </div>
    );
}
