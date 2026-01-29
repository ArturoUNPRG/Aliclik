import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Estado para mensaje visual
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null); // Limpiamos errores previos

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      dispatch(setCredentials({ user: data.user, token: data.access_token }));
      
      toast.success(`Bienvenido, ${data.user.name}`);
      navigate('/dashboard'); 
    } catch (error) {
      console.error(error);
      
      // Lógica de UX pedida:
      setPassword(''); // Borra solo la contraseña
      const mensaje = 'Correo o contraseña incorrectos';
      setErrorMsg(mensaje); // Muestra el mensaje en el formulario
      toast.error(mensaje); // Muestra la notificación flotante
      document.getElementById('password')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      
      {errorMsg && (
        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-pulse">
          <AlertCircle className="h-4 w-4 mr-2" />
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* Input Email */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            required
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:border-brand focus:ring-brand sm:text-sm transition-all outline-none focus:ring-2"
            placeholder="correo@aliclik.app"
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
            className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-400 focus:border-brand focus:ring-brand sm:text-sm transition-all outline-none focus:ring-2"
            placeholder="••••••••"
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
            <Loader2 className="h-4 w-4 animate-spin" /> Verificando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Acceder a la Plataforma <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </button>
    </form>
  );
};