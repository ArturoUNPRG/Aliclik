import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Lock, Mail, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await api.post('/auth/register', { name, email, password });
      
      toast.success('¡Cuenta creada! Por favor inicia sesión.');
      navigate('/login'); 
    } catch (error) {
      console.error(error);
      const err = error as AxiosError<{ message: string | string[] }>;
      const msg = err.response?.data?.message || 'Error al registrar usuario';
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
      
      {errorMsg && (
        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Input Nombre */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            required
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:border-brand focus:ring-brand sm:text-sm outline-none focus:ring-2"
            placeholder="Tu Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Input Email */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            required
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:border-brand focus:ring-brand sm:text-sm outline-none focus:ring-2"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Input Password */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:border-brand focus:ring-brand sm:text-sm outline-none focus:ring-2"
            placeholder="Contraseña (min 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full justify-center rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-70 transition-all shadow-lg shadow-brand/20"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Registrarme <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </button>

      <div className="flex items-center justify-center text-sm">
        <span className="text-gray-500">¿Ya tienes cuenta?</span>
        <Link 
          to="/login" 
          className="ml-2 font-semibold text-brand hover:text-brand-hover hover:underline transition-colors"
        >
          Ingresa aquí
        </Link>
      </div>
    </form>
  );
};