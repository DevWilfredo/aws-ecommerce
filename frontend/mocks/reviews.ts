type ProductReviewSeed = {
  id: string;
  name: string;
  brandName?: string;
  categoryName?: string;
};

export type MockProductReview = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
};

export type ProductReviewsMock = {
  reviews: MockProductReview[];
  rating: number;
  total: number;
};

const AUTHORS = [
  'Laura M.',
  'Carlos G.',
  'Sofia R.',
  'Daniel P.',
  'Valentina C.',
  'Andres T.',
  'Marta N.',
  'Javier S.',
  'Camila O.',
  'Pablo V.',
];

const DATE_LABELS = [
  'hace 2 dias',
  'hace 4 dias',
  'hace 1 semana',
  'hace 2 semanas',
  'hace 3 semanas',
  'hace 1 mes',
  'hace 2 meses',
  'hace 3 meses',
];

const RATING_PATTERNS: number[][] = [
  [5, 5, 4, 5, 4, 5, 4, 5],
  [5, 4, 4, 5, 5, 4, 3, 5],
  [4, 4, 5, 4, 5, 4, 5, 4],
  [5, 5, 5, 4, 4, 5, 3, 4],
];

const PLACEHOLDER_BACKGROUNDS = ['e2e8f0', 'dbeafe', 'fef3c7', 'dcfce7'];

function hashFromString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function buildPlaceholder(width: number, height: number, text: string, background = 'e2e8f0') {
  return `https://placehold.co/${width}x${height}/${background}/0f172a?text=${encodeURIComponent(text)}`;
}

function buildReviewContent(seed: ProductReviewSeed, index: number) {
  const brandPart = seed.brandName ? ` de ${seed.brandName}` : '';
  const categoryPart = seed.categoryName ? ` en la categoria ${seed.categoryName}` : '';

  const templates = [
    `La compra del ${seed.name}${brandPart} fue excelente. El equipo responde bien y la entrega fue puntual.`,
    `Buen producto${categoryPart}. La relacion calidad-precio me parecio correcta y cumple con lo esperado.`,
    `Despues de varios dias de uso, el ${seed.name} se siente estable y comodo para el dia a dia.`,
    `Me gusto la construccion y el rendimiento del ${seed.name}. Recomendado para uso diario.`,
    `El ${seed.name} llego en buen estado y con la configuracion correcta. Hasta ahora todo bien.`,
    `Lo compre para trabajo y ocio; el ${seed.name}${brandPart} ha cumplido bastante bien.`,
  ];

  return templates[index % templates.length];
}

export function getMockReviewsForProduct(seed: ProductReviewSeed): ProductReviewsMock {
  const hash = hashFromString(`${seed.id}-${seed.name}`);
  const reviewCount = 8;
  const ratingPattern = RATING_PATTERNS[hash % RATING_PATTERNS.length];

  const reviews: MockProductReview[] = Array.from({ length: reviewCount }).map((_, index) => {
    const author = AUTHORS[(hash + index) % AUTHORS.length];
    const initials = getInitials(author);
    const background = PLACEHOLDER_BACKGROUNDS[(hash + index) % PLACEHOLDER_BACKGROUNDS.length];
    const rating = ratingPattern[index % ratingPattern.length] ?? 4;

    const imageCount = index % 2 === 0 ? 2 : 1;
    const images = Array.from({ length: imageCount }).map((__, imageIndex) =>
      buildPlaceholder(
        220,
        160,
        `${seed.name} ${index + 1}-${imageIndex + 1}`,
        PLACEHOLDER_BACKGROUNDS[(hash + index + imageIndex) % PLACEHOLDER_BACKGROUNDS.length],
      ),
    );

    return {
      id: `${seed.id}-review-${index + 1}`,
      author,
      avatar: buildPlaceholder(96, 96, initials, background),
      rating,
      date: DATE_LABELS[(hash + index) % DATE_LABELS.length] ?? 'hace 1 semana',
      content: buildReviewContent(seed, index),
      images,
    };
  });

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(reviews.length, 1);
  const rating = Number(average.toFixed(1));
  const total = 40 + (hash % 120);

  return {
    reviews,
    rating,
    total,
  };
}
