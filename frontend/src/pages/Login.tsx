import { LoginForm } from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl border border-gray-100">
        
        {/* Header Visual */}
        <div className="text-center flex flex-col items-center">
          <div className="h-16 w-auto mb-6 transform hover:scale-105 transition-transform duration-300">
             {/* Logo Aliclik */}
             <img src="/logo.png" alt="Aliclik Logo" className="h-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand">
            Bienvenido
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestión de usuarios y control administrativo
          </p>
        </div>

        <LoginForm />

        {/* Footer pequeño */}
        <div className="mt-6 text-center text-xs text-gray-400">
            Postulante: Arturo Becerra | &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}