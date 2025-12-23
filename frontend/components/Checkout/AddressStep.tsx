import { Plus, Edit, Trash2 } from 'lucide-react';

interface Address {
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string;
}

interface AddressStepProps {
    addresses: Address[];
    selectedAddress: string;
    onSelectAddress: (id: string) => void;
}

export default function AddressStep({
    addresses,
    selectedAddress,
    onSelectAddress
}: AddressStepProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Select Address</h2>
            <div className="space-y-4 mb-8">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        onClick={() => onSelectAddress(address.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                            selectedAddress === address.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                                    selectedAddress === address.id
                                        ? 'border-black'
                                        : 'border-gray-300'
                                }`}
                            >
                                {selectedAddress === address.id && (
                                    <div className="w-3 h-3 bg-black rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">
                                        {address.name}
                                    </h3>
                                    <span className="text-xs bg-black text-white px-2 py-1 rounded">
                                        {address.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {address.address}
                                </p>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-600 hover:text-black transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-8">
                <Plus className="w-5 h-5" />
                Add New Address
            </button>
        </div>
    );
}
