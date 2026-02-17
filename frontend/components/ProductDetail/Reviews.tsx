'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
};

type RatingRow = {
  label: string;
  count: number;
  percentage: number;
};

const ratingScale = [
  { stars: 5, label: 'Excelente' },
  { stars: 4, label: 'Bueno' },
  { stars: 3, label: 'Promedio' },
  { stars: 2, label: 'Por debajo del promedio' },
  { stars: 1, label: 'Pobre' },
] as const;

function scaleDistribution(rawCounts: number[], total: number) {
  const rawTotal = rawCounts.reduce((sum, value) => sum + value, 0);
  if (rawTotal === 0 || total <= 0) return rawCounts.map(() => 0);

  const scaled = rawCounts.map((count) => Math.floor((count / rawTotal) * total));
  const fractional = rawCounts
    .map((count, index) => ({
      index,
      fraction: (count / rawTotal) * total - scaled[index],
    }))
    .sort((a, b) => b.fraction - a.fraction);

  let assigned = scaled.reduce((sum, value) => sum + value, 0);
  let cursor = 0;

  while (assigned < total) {
    scaled[fractional[cursor % fractional.length].index] += 1;
    assigned += 1;
    cursor += 1;
  }

  return scaled;
}

export default function Reviews({
  reviews,
  rating,
  total,
}: {
  reviews: Review[];
  rating: number;
  total: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reviews : reviews.slice(0, 3);

  const distribution = useMemo<RatingRow[]>(() => {
    if (!reviews.length) {
      return ratingScale.map((row) => ({
        label: row.label,
        count: 0,
        percentage: 0,
      }));
    }

    const rawCounts = ratingScale.map(
      (row) => reviews.filter((review) => Math.round(review.rating) === row.stars).length,
    );
    const expectedTotal = Math.max(total, reviews.length);
    const scaledCounts = scaleDistribution(rawCounts, expectedTotal);

    return ratingScale.map((row, index) => {
      const count = scaledCounts[index] ?? 0;
      const percentage = expectedTotal > 0 ? Math.round((count / expectedTotal) * 100) : 0;
      return {
        label: row.label,
        count,
        percentage,
      };
    });
  }, [reviews, total]);

  return (
    <div className="mx-auto max-w-7xl border-t px-6 py-16">
      <h2 className="mb-12 text-2xl font-bold">Reseñas</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">{rating}</div>
              <div className="mb-2 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">de {total} reseñas</p>
            </div>

            <div className="space-y-3">
              {distribution.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="min-w-[140px] text-xs font-medium text-gray-700">{item.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="min-w-[30px] text-right text-xs text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Escribe un comentario"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {displayed.map((review) => (
              <article key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{review.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(review.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>

                    <p className="mb-3 text-sm leading-relaxed text-gray-700">{review.content}</p>

                    {review.images && review.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {review.images.map((image, imageIndex) => (
                          <div
                            key={`${review.id}-${imageIndex}`}
                            className="h-20 w-28 overflow-hidden rounded-lg bg-gray-100"
                          >
                            <Image
                              src={image}
                              alt={`Imagen de reseña ${imageIndex + 1}`}
                              width={112}
                              height={80}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}

            {!showAll && reviews.length > 3 ? (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-400 px-8 py-2 text-sm font-medium transition hover:bg-gray-50"
                >
                  Ver más <span>↓</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
