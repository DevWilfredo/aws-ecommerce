export default function Login() {
    return (
        <div className="flex justify-center pt-8 py-60">
            <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Bienvenido</h2>
                <form>
                    <input id="email" className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="email" placeholder="Ingresa tu Correo" required />
                    <input id="password" className="w-full bg-transparent border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="password" placeholder="Ingresa tu Contraseña" required />
                    <div className="text-right py-4">
                        <a className="text-blue-600 underline" href="#">Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit" className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white">Iniciar Sesión</button>
                </form>
                <p className="text-center mt-4">No tienes cuenta aún? <a href="/register" className="text-blue-500 underline">Registrarse</a></p>
                <button type="button" className="w-full flex items-center gap-2 justify-center mt-5 bg-black py-2.5 rounded-full text-white cursor-pointer hover:bg-black/80">
                    <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png" alt="appleLogo" />
                    Continuar con Apple
                </button>
                <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 cursor-pointer hover:bg-gray-200 transition-all">
                    <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
                    Continuar con Google
                </button>
            </div>
        </div>
    );
};