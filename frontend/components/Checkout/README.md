# Estructura de Componentes - Checkout Page

## Descripción General
La página de checkout ha sido componentizada en varios componentes reutilizables para mejorar la mantenibilidad y claridad del código.

## Componentes Creados

### 1. **StepIndicator** (`StepIndicator.tsx`)
Indicador visual del progreso a través de los 3 pasos del checkout.

**Props:**
- `currentStep: number` - Paso actual (1, 2 o 3)

**Responsabilidades:**
- Mostrar 3 círculos numerados (Address, Shipping, Payment)
- Actualizar el color de los círculos según el paso actual
- Conectar los círculos con líneas que se actualizan según el progreso

---

### 2. **CartSummary** (`CartSummary.tsx`)
Resumen del carrito y precios (sidebar derecho).

**Props:**
- `items: CartItem[]` - Lista de artículos en el carrito
- `subtotal: number` - Subtotal
- `tax: number` - Impuestos
- `shipping: number` - Costo de envío
- `total: number` - Total final
- `currentStep: number` - Paso actual
- `selectedAddress?: string` - ID de dirección seleccionada
- `selectedShipping?: string` - Método de envío seleccionado
- `addresses?: Address[]` - Lista de direcciones disponibles
- `onNextStep: () => void` - Callback para ir al siguiente paso
- `onPrevStep: () => void` - Callback para ir al paso anterior

**Responsabilidades:**
- Mostrar los artículos del carrito con imágenes y precios
- Mostrar información de la dirección y envío (solo si es visible según el paso)
- Mostrar desglose de precios (subtotal, tax, shipping, total)
- Botones de navegación (Back/Next)

---

### 3. **AddressStep** (`AddressStep.tsx`)
Paso 1: Selección de dirección de envío.

**Props:**
- `addresses: Address[]` - Lista de direcciones disponibles
- `selectedAddress: string` - ID de la dirección seleccionada
- `onSelectAddress: (id: string) => void` - Callback para cambiar la dirección

**Responsabilidades:**
- Mostrar lista de direcciones disponibles
- Permitir seleccionar una dirección
- Mostrar botones para editar o eliminar direcciones
- Botón para agregar nueva dirección

---

### 4. **ShippingStep** (`ShippingStep.tsx`)
Paso 2: Selección del método de envío.

**Props:**
- `selectedShipping: string` - Método de envío seleccionado ('free' o 'express')
- `onSelectShipping: (method: string) => void` - Callback para cambiar el método

**Responsabilidades:**
- Mostrar opciones de envío (Free - $29, Express - $50)
- Permitir seleccionar el método de envío
- Mostrar descripción de cada método (tiempos de entrega)

---

### 5. **PaymentStep** (`PaymentStep.tsx`)
Paso 3: Selección del método de pago.

**Props:**
- `paymentMethod: string` - Método de pago seleccionado
- `onSelectPaymentMethod: (method: string) => void` - Callback para cambiar método
- `cardData: CardData` - Datos de la tarjeta de crédito
- `sameAsAddress: boolean` - Si la dirección de facturación es igual a la de envío
- `onCardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Manejo de cambios
- `onFormatCardNumber: (value: string) => void` - Formateo del número de tarjeta
- `onSameAsAddressChange: (checked: boolean) => void` - Cambio de checkbox

**Responsabilidades:**
- Mostrar tabs para elegir método de pago (Credit Card, PayPal, PayPal Credit)
- Renderizar formulario de tarjeta de crédito si es seleccionado
- Mostrar mensajes de redirección para PayPal

---

### 6. **CreditCardForm** (`CreditCardForm.tsx`)
Formulario para ingresar datos de tarjeta de crédito.

**Props:**
- `cardData: CardData` - Datos de la tarjeta
- `sameAsAddress: boolean` - Si la dirección de facturación es igual a la de envío
- `onCardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Manejo de cambios
- `onFormatCardNumber: (value: string) => void` - Formateo del número
- `onSameAsAddressChange: (checked: boolean) => void` - Cambio de checkbox

**Responsabilidades:**
- Mostrar visualización de la tarjeta en 3D
- Formulario con campos: Nombre, Número, Fecha de vencimiento, CVV
- Actualizar la vista previa de la tarjeta en tiempo real
- Checkbox para dirección de facturación igual a de envío

---

## Flujo de Datos

```
Checkout Page (page.tsx)
├── State Management
│   ├── currentStep
│   ├── selectedAddress
│   ├── selectedShipping
│   ├── paymentMethod
│   ├── cardData
│   └── sameAsAddress
│
└── Components
    ├── StepIndicator
    ├── CartSummary
    └── Dynamic Step Components
        ├── AddressStep (if step === 1)
        ├── ShippingStep (if step === 2)
        └── PaymentStep (if step === 3)
            └── CreditCardForm (if paymentMethod === 'credit-card')
```

---

## Archivos Generados

```
components/
└── Checkout/
    ├── index.ts (exporta todos los componentes)
    ├── StepIndicator.tsx
    ├── CartSummary.tsx
    ├── AddressStep.tsx
    ├── ShippingStep.tsx
    ├── PaymentStep.tsx
    └── CreditCardForm.tsx
```

---

## Mejoras Implementadas

✅ **Separación de responsabilidades** - Cada componente tiene una única responsabilidad  
✅ **Reutilizabilidad** - Los componentes pueden ser usados en otras partes de la aplicación  
✅ **Mantenibilidad** - Código más limpio y fácil de mantener  
✅ **Escalabilidad** - Fácil de agregar nuevas funcionalidades o métodos de pago  
✅ **Props bien tipadas** - Uso de TypeScript para mayor seguridad  
✅ **Exportación centralizada** - archivo `index.ts` para importaciones limpias  

---

## Próximos Pasos (Opcional)

- Crear un custom hook `useCheckout` para centralizar la lógica de estado
- Agregar validación de formularios
- Conectar con API real para procesar el pago
- Agregar animaciones de transición entre pasos
- Crear componentes de error y success
