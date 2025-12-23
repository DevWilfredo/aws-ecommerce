interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { number: 1, label: 'Address' },
        { number: 2, label: 'Shipping' },
        { number: 3, label: 'Payment' }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        {/* Circle indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                    currentStep >= step.number
                                        ? 'bg-black text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`text-sm mt-2 font-medium ${
                                    currentStep >= step.number
                                        ? 'text-black'
                                        : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Line between steps */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-4 transition-all ${
                                    currentStep > step.number
                                        ? 'bg-black'
                                        : 'bg-gray-200'
                                }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
