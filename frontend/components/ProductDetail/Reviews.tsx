'use client';
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import React from "react";

type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
};

export default function Reviews({ reviews, rating, total }: { reviews: Review[]; rating: number; total: number }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reviews : reviews.slice(0, 3);

  const distribution = [
    { label: "Excelente", count: 101, percentage: 80 },
    { label: "Bueno", count: 11, percentage: 9 },
    { label: "Promedio", count: 3, percentage: 2 },
    { label: "Por debajo del promedio", count: 8, percentage: 6 },
    { label: "Pobre", count: 2, percentage: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 border-t">
      <h2 className="text-2xl font-bold mb-12">Reseñas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{rating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600">de {total} reseñas</p>
            </div>

            <div className="space-y-3">
              {distribution.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-700 min-w-[100px]">{item.label}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 min-w-[30px] text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <input type="text" placeholder="Dejar comentario" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black" />
            </div>

            {displayed.map((r) => (
              <div key={r.id} className="pb-6 border-b last:border-b-0">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <Image src={r.avatar} alt={r.author} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{r.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(r.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{r.date}</span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{r.content}</p>

                    {r.images && r.images.length > 0 && (
                      <div className="flex gap-2">
                        {r.images.map((img, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <Image src={img} alt={`Imagen reseña ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!showAll && reviews.length > 3 && (
              <div className="flex justify-center pt-6">
                <button onClick={() => setShowAll(true)} className="px-8 py-2 border border-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                  Ver más <span>↓</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}