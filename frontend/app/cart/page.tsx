'use client';

import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Apple iPhone 14 Pro Max',
            specs: '128gb Deep Purple',
            sku: '#2513952691984',
            price: 1399,
            quantity: 1,
            image: 'https://via.placeholder.com/100?text=iPhone14'
        },
        {
            id: 2,
            name: 'AirPods Max Silver',
            specs: '',
            sku: '#534958358345',
            price: 549,
            quantity: 1,
            image: 'https://via.placeholder.com/100?text=AirPods'
        },
        {
            id: 3,
            name: 'Apple Watch Series 9',
            specs: 'GPS 41mm Starlight Aluminium',
            sku: '#63632324',
            price: 399,
            quantity: 1,
            image: 'https://via.placeholder.com/100?text=AppleWatch'
        }
    ]);

    const [promoCode, setPromoCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }
        setCartItems(
            cartItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.02 * 100) / 100;
    const shipping = 29;
    const total = subtotal + tax + shipping;

    return (
        <div className="min-h-screen bg-white py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Shopping Cart */}
                    <div className="md:col-span-2">
                        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
                        
                        {cartItems.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <p className="text-gray-600">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        {/* Product Image */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded bg-gray-100"
                                        />

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            {item.specs && (
                                                <p className="text-sm text-gray-600">{item.specs}</p>
                                            )}
                                            <p className="text-xs text-gray-500">{item.sku}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right mr-4">
                                            <p className="font-semibold text-gray-900">
                                                ${item.price.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount code / Promo code
                                </label>
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Code"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Card Number */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your bonus card number
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="Enter Card Number"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Summary Details */}
                            <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">
                                        ${subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Estimated Tax</span>
                                    <span className="font-semibold">
                                        ${tax.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Estimated shipping & Handling</span>
                                    <span className="font-semibold">
                                        ${shipping.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>${total.toLocaleString()}</span>
                            </div>

                            {/* Checkout Button */}
                            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
