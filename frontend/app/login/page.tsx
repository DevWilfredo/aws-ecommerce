'use client';

const API = process.env.NEXT_PUBLIC_API_BASE_URL; 

export default function Login() {
  const loginUrl = `${API}/auth/login`;
  const googleUrl = `${API}/auth/login?provider=Google`;

  return (
    <div className="flex justify-center pt-8 py-60">
      <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Bienvenido</h2>

        {/* En este modelo NO hay login local con email/password */}
        <button
          type="button"
          onClick={() => (window.location.href = loginUrl)}
          className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white"
        >
          Iniciar sesión
        </button>

        <p className="text-center mt-4">
          No tienes cuenta aún?{" "}
          <a href={`${API}/auth/register`} className="text-blue-500 underline">
            Registrarse
          </a>
        </p>

        <button
          type="button"
          onClick={() => (window.location.href = googleUrl)}
          className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 cursor-pointer hover:bg-gray-200 transition-all"
        >
          <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
