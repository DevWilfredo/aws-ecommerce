'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export default function CartDrawer() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'MacBook Pro 16"',
            price: 2499,
            quantity: 1,
            image: 'https://placehold.co/80x80?text=MacBook',
        },
        {
            id: '2',
            name: 'Magic Mouse',
            price: 79,
            quantity: 2,
            image: 'https://placehold.co/80x80?text=Mouse',
        },
    ]);

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
        } else {
            setCartItems(cartItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            ));
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" title="Carrito de compras" className="relative">
                    {/* <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )} */}
                        <div className="relative py-2">
                            {cartItems.length > 0 && (
                                <div className="t-0 absolute left-5 mb-7">
                                    <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{cartItems.length}</p>
                                </div>
                            )}
                            <ShoppingCart className='size-6'/>
                        </div>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 flex flex-col px-8 py-4">
                <SheetHeader>
                    <SheetTitle>Mi Carrito</SheetTitle>
                </SheetHeader>

                {/* Contenedor scrollable de productos */}
                <div className="flex-1 overflow-y-auto py-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b pb-4">
                                    {/* Imagen del producto */}
                                    <div className="shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Detalles del producto */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">${item.price.toLocaleString()}</p>

                                        {/* Cantidad */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 border rounded hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 border rounded hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Eliminar del carrito"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con total y botón */}
                {cartItems.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                        <Button className="w-full bg-[#01bffe] text-[#0a2951] hover:bg-blue-400 cursor-pointer">
                            Ir al Carrito
                        </Button>
                        <Button variant="outline" className="w-full cursor-pointer">
                            Seguir comprando
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
