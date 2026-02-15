export type ProductOptionValue = {
  id: string;
  label: string;
  priceAdjustment: number;
};

export type ProductOptionGroup = {
  id: string;
  name: string;
  optionValues: ProductOptionValue[];
};

export type ProductImage = {
  imageUrl: string;
  isFeatured?: boolean;
  position?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  images: ProductImage[];
  brand?: { id: string; name: string };
  category?: { id: string; name: string; slug?: string };
  optionGroups?: ProductOptionGroup[];
};

export type CartSelection = {
  optionGroupId: string;
  optionGroupName: string;
  optionValueId: string;
  optionValueLabel: string;
  priceAdjustment: number;
};

export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  image: string;
  quantity: number;
  basePrice: number;
  selectedOptions: CartSelection[];
};

export type ShippingForm = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  createdAt: string;
  shippingFullName: string;
  shippingAddressLine1: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountryCode: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    selectedOptions?: CartSelection[];
  }>;
};
