'use client';
import React from "react";

type Specs = {
  processor: string;
  ram: string;
  mainCamera: string;
  frontCamera: string;
  battery: string;
  display: string;
};

export default function ProductSpecs({ specs }: { specs: Specs }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500">Procesador</p>
            <p className="text-sm font-medium">{specs.processor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500">Cámara principal</p>
            <p className="text-sm font-medium">{specs.mainCamera}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500">Pantalla</p>
            <p className="text-sm font-medium">{specs.display}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500">Batería</p>
            <p className="text-sm font-medium">{specs.battery}</p>
          </div>
        </div>
      </div>
    </div>
  );
}