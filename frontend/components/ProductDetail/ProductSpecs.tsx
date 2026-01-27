'use client';
import React from "react";

type SpecItem = {
  label: string;
  value: string;
};

export default function ProductSpecs({ specs }: { specs: SpecItem[] }) {
  if (!specs.length) {
    return (
      <div className="py-6 border-t border-b text-sm text-gray-600">
        Sin especificaciones registradas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div>
            <p className="text-xs text-gray-500">{spec.label}</p>
            <p className="text-sm font-medium">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
