export default function ProfileHeader({ name, email }: { name: string, email: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tu cuenta</h1>
            <p className="text-gray-600 text-sm">{name}, Correo: {email}</p>
        </div>
    )
}