import CreditCardForm from './CreditCardForm';

interface PaymentStepProps {
    paymentMethod: string;
    onSelectPaymentMethod: (method: string) => void;
    cardData: {
        name: string;
        number: string;
        expiry: string;
        cvv: string;
    };
    sameAsAddress: boolean;
    onCardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormatCardNumber: (value: string) => void;
    onSameAsAddressChange: (checked: boolean) => void;
}

export default function PaymentStep({
    paymentMethod,
    onSelectPaymentMethod,
    cardData,
    sameAsAddress,
    onCardInputChange,
    onFormatCardNumber,
    onSameAsAddressChange
}: PaymentStepProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Payment</h2>

            {/* Payment Method Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => onSelectPaymentMethod('credit-card')}
                    className={`pb-4 font-medium transition-colors ${
                        paymentMethod === 'credit-card'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-600 hover:text-black'
                    }`}
                >
                    Credit Card
                </button>
                <button
                    onClick={() => onSelectPaymentMethod('paypal')}
                    className={`pb-4 font-medium transition-colors ${
                        paymentMethod === 'paypal'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-600 hover:text-black'
                    }`}
                >
                    PayPal
                </button>
                <button
                    onClick={() => onSelectPaymentMethod('paypal-credit')}
                    className={`pb-4 font-medium transition-colors ${
                        paymentMethod === 'paypal-credit'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-600 hover:text-black'
                    }`}
                >
                    PayPal Credit
                </button>
            </div>

            {/* Credit Card */}
            {paymentMethod === 'credit-card' && (
                <CreditCardForm
                    cardData={cardData}
                    sameAsAddress={sameAsAddress}
                    onCardInputChange={onCardInputChange}
                    onFormatCardNumber={onFormatCardNumber}
                    onSameAsAddressChange={onSameAsAddressChange}
                />
            )}

            {/* PayPal */}
            {paymentMethod === 'paypal' && (
                <div className="text-center py-12">
                    <p className="text-gray-600">
                        Serás redirigido a PayPal para completar tu compra
                    </p>
                </div>
            )}

            {/* PayPal Credit */}
            {paymentMethod === 'paypal-credit' && (
                <div className="text-center py-12">
                    <p className="text-gray-600">
                        Serás redirigido a PayPal Credit para completar tu compra
                    </p>
                </div>
            )}
        </div>
    );
}
