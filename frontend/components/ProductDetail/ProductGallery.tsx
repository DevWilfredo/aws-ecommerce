import Image from "next/image";

type Props = {
  images: string[];
  mainImage: string;
  onSelect: (img: string) => void;
};

export default function ProductGallery({ images, mainImage, onSelect }: Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        <Image src={mainImage} alt="Product" width={600} height={600} className="h-full w-full object-contain p-3 sm:p-4" unoptimized />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(img)}
            className={`flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 bg-gray-50 transition ${
              mainImage === img ? "border-black" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`Miniatura ${index + 1}`} width={120} height={120} className="h-full w-full object-contain p-1.5" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}
