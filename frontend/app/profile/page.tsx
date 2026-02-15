'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clientApiFetch } from '@/services/client-api';
import type { Order } from '@/types/commerce';

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    clientApiFetch<Order[]>('/orders/me')
      .then(setOrders)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Mis órdenes</h1>
      {error ? <p className="text-red-500">{error}</p> : null}
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/profile/orders/${order.id}`} className="block border rounded p-4 hover:bg-gray-50">
            <div className="flex justify-between">
              <span>Orden #{order.id.slice(0, 8)}</span>
              <span className="font-medium">{order.status}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()} · ${Number(order.total).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
