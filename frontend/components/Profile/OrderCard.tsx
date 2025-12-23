'use client';

import { FileDown } from 'lucide-react';
import OrderItem from './OrderItem';

export default function OrderCard({ order, user }: { order: any; user: any }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                <div>
                    <h3 className="font-semibold text-gray-900">Pedido #: {order.id}</h3>
                    <p className="text-sm text-gray-600">
                        {order.products} productos | Por {user.name} | {order.time}, {order.date}
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer">
                    <FileDown />
                    Descargar factura
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-sm text-gray-600">Estado:</p>
                    <p className={`font-medium ${order.statusColor}`}>{order.status}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Fecha de entrega:</p>
                    <p className="font-medium text-gray-900">{order.deliveryDate}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-gray-600">Entregado a:</p>
                    <p className="font-medium text-gray-900">{order.deliveredTo}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-gray-600">Total:</p>
                    <p className="font-semibold text-lg text-gray-900">{order.total}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {order.items.map((it: any) => (
                    <OrderItem key={it.id} item={it} />
                ))}
            </div>
        </div>
    );
}
