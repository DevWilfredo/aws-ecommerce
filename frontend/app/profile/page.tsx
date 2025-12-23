'use client';

import { useState } from 'react';
import { ShoppingBag, MapPin, Lock, CreditCard, Heart, LifeBuoy, LogOut } from 'lucide-react';
import { orders } from '@/mocks/profileOrders';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import SidebarMenu from '@/components/Profile/SidebarMenu';
import OrdersTab from '@/components/Profile/OrdersTab';
import PlaceholderPanel from '@/components/Profile/PlaceholderPanel';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('orders');

    // Mock data
    const userData = {
        name: 'Alex John',
        email: 'alexjohn@gmail.com'
    };

    const menuItems = [
        { id: 'orders', label: 'Mis órdenes', icon: ShoppingBag },
        { id: 'addresses', label: 'Mis direcciones', icon: MapPin },
        { id: 'security', label: 'Seguridad', icon: Lock },
        { id: 'payments', label: 'Métodos de pago', icon: CreditCard },
        { id: 'saved', label: 'Favoritos', icon: Heart },
        { id: 'support', label: 'Ayuda', icon: LifeBuoy },
        { id: 'logout', label: 'Cerrar sesión', icon: LogOut }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <ProfileHeader name={userData.name} email={userData.email} />

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <SidebarMenu menuItems={menuItems} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'orders' && <OrdersTab orders={orders} user={userData} />}

                        {activeTab === 'addresses' && <PlaceholderPanel title="Tus direcciones" message="No hay direcciones guardadas aún. Añade una nueva dirección para comenzar." />}

                        {activeTab === 'security' && <PlaceholderPanel title="Inicio de sesión y seguridad" message="Gestiona tu contraseña y ajustes de seguridad aquí." />}

                        {activeTab === 'payments' && <PlaceholderPanel title="Métodos de pago" message="Gestiona tus métodos de pago aquí." />}

                        {activeTab === 'archived' && <PlaceholderPanel title="Órdenes archivadas" message="No hay órdenes archivadas aún." />}

                        {activeTab === 'saved' && <PlaceholderPanel title="Artículos guardados" message="Tus artículos guardados aparecerán aquí." />}

                        {activeTab === 'support' && <PlaceholderPanel title="Soporte al cliente" message="Contacta a nuestro equipo de soporte para recibir ayuda." />}
                    </div>
                </div>
            </div>
        </div>
    );
}
