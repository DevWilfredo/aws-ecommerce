export default function PlaceholderPanel({ title, message }: { title: string; message?: string }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <p className="text-gray-600">{message ?? 'No hay datos aún.'}</p>
        </div>
    );
}
