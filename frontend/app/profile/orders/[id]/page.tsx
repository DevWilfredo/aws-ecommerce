'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { clientApiFetch } from '@/services/client-api';
import type { Order } from '@/types/commerce';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    clientApiFetch<Order>(`/orders/me/${params.id}`)
      .then(setOrder)
      .catch((e) => setError(e.message));
  }, [params?.id]);

  if (error) return <div className="max-w-4xl mx-auto py-10 text-red-500">{error}</div>;
  if (!order) return <div className="max-w-4xl mx-auto py-10">Cargando orden...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Detalle de orden</h1>
      <p className="text-sm text-gray-500 mt-1">Estado: {order.status}</p>
      <div className="mt-6 border rounded p-4">
        {order.items.map((item) => (
          <div key={item.id} className="border-b py-3 last:border-b-0">
            <div className="flex justify-between"><span>{item.productName} × {item.quantity}</span><span>${Number(item.lineTotal).toFixed(2)}</span></div>
            <p className="text-xs text-gray-500">{item.selectedOptions?.map((opt) => `${opt.optionGroupName}: ${opt.optionValueLabel}`).join(' · ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
