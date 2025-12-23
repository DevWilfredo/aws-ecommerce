import Image from "next/image";

type Props = {
  images: string[];
  mainImage: string;
  onSelect: (img: string) => void;
};

export default function ProductGallery({ images, mainImage, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        <Image src={mainImage} alt="Product" width={600} height={600} className="object-cover" unoptimized />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(img)}
            className={`aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer transition border-2 ${
              mainImage === img ? "border-black" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`Miniatura ${index + 1}`} width={120} height={120} className="object-contain" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}