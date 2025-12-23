'use client';

import { useState } from 'react';
import {
    StepIndicator,
    CartSummary,
    AddressStep,
    ShippingStep,
    PaymentStep
} from '@/components/Checkout';

export default function Checkout() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState('home');
    const [selectedShipping, setSelectedShipping] = useState('free');
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [sameAsAddress, setSameAsAddress] = useState(true);

    const addresses = [
        {
            id: 'home',
            name: '2118 Thornridge',
            type: 'HOME',
            address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
            phone: '(209) 555-0104'
        },
        {
            id: 'office',
            name: 'Headoffice',
            type: 'OFFICE',
            address: '2715 Ash Dr. San Jose, South Dakota 83475',
            phone: '(704) 555-0127'
        }
    ];

    const cartItems = [
        {
            id: 1,
            name: 'Apple iPhone 14 Pro Max 128gb',
            price: 1399,
            image: '/Iphone-pro-1.png'
        },
        {
            id: 2,
            name: 'AirPods Max Silver',
            price: 549,
            image: '/Iphone-pro-1.png'
        },
        {
            id: 3,
            name: 'Apple Watch Series 9 GPS 41mm',
            price: 399,
            image: '/Iphone-pro-1.png'
        }
    ];

    const subtotal = 2347;
    const tax = 50;
    const shipping = selectedShipping === 'free' ? 29 : 50;
    const total = subtotal + tax + shipping;

    const handleNextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormatCardNumber = (value: string) => {
        const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setCardData(prev => ({
            ...prev,
            number: formatted
        }));
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Steps Indicator */}
                <StepIndicator currentStep={currentStep} />

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Summary Sidebar */}
                    <div className="md:col-span-2">
                        <CartSummary
                            items={cartItems}
                            subtotal={subtotal}
                            tax={tax}
                            shipping={shipping}
                            total={total}
                            currentStep={currentStep}
                            selectedAddress={selectedAddress}
                            selectedShipping={selectedShipping}
                            addresses={addresses}
                            onNextStep={handleNextStep}
                            onPrevStep={handlePrevStep}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-1">
                        {/* Step 1: Address */}
                        {currentStep === 1 && (
                            <AddressStep
                                addresses={addresses}
                                selectedAddress={selectedAddress}
                                onSelectAddress={setSelectedAddress}
                            />
                        )}

                        {/* Step 2: Shipping */}
                        {currentStep === 2 && (
                            <ShippingStep
                                selectedShipping={selectedShipping}
                                onSelectShipping={setSelectedShipping}
                            />
                        )}

                        {/* Step 3: Payment */}
                        {currentStep === 3 && (
                            <PaymentStep
                                paymentMethod={paymentMethod}
                                onSelectPaymentMethod={setPaymentMethod}
                                cardData={cardData}
                                sameAsAddress={sameAsAddress}
                                onCardInputChange={handleCardInputChange}
                                onFormatCardNumber={handleFormatCardNumber}
                                onSameAsAddressChange={setSameAsAddress}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
