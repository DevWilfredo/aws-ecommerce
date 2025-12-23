export default function Register() {
    return (
        <div className="flex justify-center pt-8 py-60">
            <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Crear Cuenta</h2>
                <form>
                    <input id="fullName" className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="text" placeholder="Ingresa tu Nombre Completo" required />
                    <input id="email" className="w-full bg-transparent border mt-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="email" placeholder="Ingresa tu Correo" required />
                    <input id="password" className="w-full bg-transparent border mt-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="password" placeholder="Crea una Contraseña" required />
                    <input id="confirmPassword" className="w-full bg-transparent border mt-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4" type="password" placeholder="Confirma tu Contraseña" required />
                    <div className="flex items-center my-4">
                        <input id="terms" type="checkbox" className="w-4 h-4 border border-gray-500/30 rounded" required />
                        <label htmlFor="terms" className="ml-2 text-gray-600">
                            Acepto los <a href="#" className="text-blue-600 underline">términos y condiciones</a>
                        </label>
                    </div>
                    <button type="submit" className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white hover:bg-indigo-600 transition-all">Registrarse</button>
                </form>
                <p className="text-center mt-4">¿Ya tienes cuenta? <a href="/login" className="text-blue-500 underline">Inicia Sesión</a></p>
                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                    </div>
                </div>
                <button type="button" className="w-full flex items-center gap-2 justify-center mt-4 bg-black py-2.5 rounded-full text-white cursor-pointer hover:bg-black/80 transition-all">
                    <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png" alt="appleLogo" />
                    Registrarse con Apple
                </button>
                <button type="button" className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 cursor-pointer hover:bg-gray-200 transition-all">
                    <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
                    Registrarse con Google
                </button>
            </div>
        </div>
    );
};
