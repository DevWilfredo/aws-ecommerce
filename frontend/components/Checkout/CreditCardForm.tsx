interface CreditCardFormProps {
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

export default function CreditCardForm({
    cardData,
    sameAsAddress,
    onCardInputChange,
    onFormatCardNumber,
    onSameAsAddressChange
}: CreditCardFormProps) {
    return (
        <div>
            {/* Credit Card Display */}
            <div className="mb-8 relative h-64">
                <div className="credit-card relative w-full h-full select-none pointer-events-none flex items-center justify-center">
                    <div className="verso relative overflow-hidden w-96 h-56 rounded-2xl bg-gray-400 shadow-2xl">
                        <div className="w-full h-12 bg-gray-200 absolute top-10">&nbsp;</div>
                    </div>

                    <div className="recto absolute overflow-hidden w-96 h-56 rounded-2xl px-8 py-6 bg-black text-white shadow-xl flex flex-col justify-end gap-6">
                        <div className="logo absolute top-6 right-8 w-16 h-8 flex justify-items-center items-center">
                            <svg viewBox="0 0 1000 324.68">
                                <path
                                    d="m651.19 0.5c-70.933 0-134.32 36.766-134.32 104.69 0 77.9 112.42 83.281 112.42 122.42 0 16.478-18.884 31.229-51.137 31.229-45.773 0-79.984-20.611-79.984-20.611l-14.638 68.547s39.41 17.41 91.734 17.41c77.552 0 138.58-38.571 138.58-107.66 0-82.316-112.89-87.536-112.89-123.86 0-12.908 15.502-27.052 47.663-27.052 36.287 0 65.892 14.99 65.892 14.99l14.326-66.204s-32.213-13.897-77.642-13.897zm-648.97 4.9966-1.7176 9.9931s29.842 5.4615 56.719 16.356c34.607 12.493 37.072 19.765 42.9 42.354l63.511 244.83h85.137l131.16-313.53h-84.942l-84.278 213.17-34.39-180.7c-3.1539-20.681-19.129-32.478-38.684-32.478h-135.41zm411.87 0-66.634 313.53h80.999l66.4-313.53h-80.765zm451.76 0c-19.532 0-29.88 10.457-37.474 28.73l-118.67 284.8h84.942l16.434-47.467h103.48l9.9931 47.467h74.948l-65.385-313.53h-68.273zm11.047 84.707 25.178 117.65h-67.454l42.276-117.65z"
                                    fill="#fff"
                                />
                            </svg>
                        </div>

                        <div className="pin w-11 h-7 rounded bg-yellow-100">&nbsp;</div>

                        <div className="number whitespace-nowrap text-2xl font-semibold">
                            {cardData.number || '4242  4242  4242  4242'}
                        </div>

                        <div className="credentials flex gap-8">
                            <div className="owner flex flex-col w-max">
                                <span className="text-xs uppercase">Card holder</span>
                                <span className="whitespace-nowrap text-lg">
                                    {cardData.name || 'John DOE'}
                                </span>
                            </div>
                            <div className="expires flex flex-col w-max">
                                <span className="text-xs uppercase">Expires</span>
                                <span className="whitespace-nowrap text-lg">
                                    {cardData.expiry || '09/21'}
                                </span>
                            </div>
                            <div className="cvc flex flex-col w-max">
                                <span className="text-xs uppercase">cvc</span>
                                <span className="whitespace-nowrap text-lg">
                                    {cardData.cvv || '123'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={cardData.name}
                        onChange={onCardInputChange}
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                    </label>
                    <input
                        type="text"
                        name="number"
                        value={cardData.number}
                        onChange={(e) => {
                            onFormatCardNumber(e.target.value);
                        }}
                        placeholder="Card Number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        maxLength={19}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exp. Date
                        </label>
                        <input
                            type="text"
                            name="expiry"
                            value={cardData.expiry}
                            onChange={onCardInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={onCardInputChange}
                            placeholder="CVV"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <input
                        type="checkbox"
                        id="same-address"
                        checked={sameAsAddress}
                        onChange={(e) => onSameAsAddressChange(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <label htmlFor="same-address" className="text-sm text-gray-700">
                        Same as billing address
                    </label>
                </div>
            </div>
        </div>
    );
}
