"use client";

import { Dispatch, SetStateAction } from 'react';

type MenuItem = { id: string; label: string; icon?: any };

export default function SidebarMenu({
    menuItems,
    activeTab,
    setActiveTab
}: {
    menuItems: MenuItem[];
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}) {
    return (
        <div className="w-56">
            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                                isActive
                                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                            } ${item.id === 'logout' ? 'text-red-600 hover:bg-red-50' : ''}`}
                        >
                            {Icon ? <Icon className="w-5 h-5" /> : null}
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}