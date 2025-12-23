'use client';

export default function OrderItem({ item }: { item: any }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-600 mt-2">Cantidad: 1x × USD {item.price}</p>
                <p className="text-xs text-gray-600">Color: {item.color}</p>
                <p className="text-xs text-gray-600">Talla: {item.size}</p>
            </div>
        </div>
    );
}
