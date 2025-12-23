interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface CartSummaryProps {
    items: CartItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currentStep: number;
    selectedAddress?: string;
    selectedShipping?: string;
    addresses?: Array<{ id: string; address: string }>;
    onNextStep: () => void;
    onPrevStep: () => void;
}

export default function CartSummary({
    items,
    subtotal,
    tax,
    shipping,
    total,
    currentStep,
    selectedAddress,
    selectedShipping,
    addresses,
    onNextStep,
    onPrevStep
}: CartSummaryProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h3 className="font-bold text-lg mb-6 text-gray-900">Summary</h3>

            {/* Items */}
            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded bg-gray-200"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-6 pb-6">
                {/* Address Info */}
                {currentStep >= 2 && selectedAddress && addresses && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Address</h4>
                        <p className="text-sm text-gray-900">
                            {addresses.find(a => a.id === selectedAddress)?.address}
                        </p>
                    </div>
                )}

                {/* Shipping Info */}
                {currentStep >= 2 && selectedShipping && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Shipment method</h4>
                        <p className="text-sm text-gray-900">
                            {selectedShipping === 'free' ? 'Free' : 'Express'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pricing */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                    <span>Estimated Tax</span>
                    <span className="font-semibold">${tax}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                    <span>Estimated shipping & Handling</span>
                    <span className="font-semibold">${shipping}</span>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onPrevStep}
                    disabled={currentStep === 1}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                <button
                    onClick={onNextStep}
                    disabled={currentStep === 3}
                    className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentStep === 3 ? 'Pay' : 'Next'}
                </button>
            </div>
        </div>
    );
}
