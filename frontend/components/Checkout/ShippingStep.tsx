interface ShippingStepProps {
    selectedShipping: string;
    onSelectShipping: (method: string) => void;
}

export default function ShippingStep({
    selectedShipping,
    onSelectShipping
}: ShippingStepProps) {
    const shippingMethods = [
        {
            id: 'free',
            name: 'Free',
            description: 'Delivery in 5-7 business days',
            price: 29
        },
        {
            id: 'express',
            name: 'Express',
            description: 'Delivery in 2-3 business days',
            price: 50
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Select Shipping Method</h2>
            <div className="space-y-4 mb-8">
                {shippingMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => onSelectShipping(method.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                            selectedShipping === method.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedShipping === method.id
                                        ? 'border-black'
                                        : 'border-gray-300'
                                }`}
                            >
                                {selectedShipping === method.id && (
                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {method.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {method.description}
                                </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                                ${method.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
