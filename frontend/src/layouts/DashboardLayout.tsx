import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';
import { 
  Users, 
  Gamepad2, 
  LogOut, 
  Menu, 
  X, 
  Settings, 
  FileText,
  Bell,
  ChevronRight,
  Info
} from 'lucide-react';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Sesión finalizada correctamente');
  };

  const handleFutureFeature = (featureName: string) => {
    toast.dismiss(); // Evita que se acumulen mensajes
    
    toast(() => (
      <div className="flex items-center">
        <Info className="h-4 w-4 mr-2 text-blue-400" />
        <span>El módulo de <strong>{featureName}</strong> se habilitará en próximas actualizaciones.</span>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#1f2937',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: '8px',
        border: '1px solid #374151'
      },
    });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-white/10 text-white font-medium shadow-sm' 
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 shadow-xl flex flex-col`}
      >
        {/* Header Sidebar */}
        <div className="flex items-center h-20 px-6 border-b border-white/10 bg-black/10">
          <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl">
             <img src="/logo.png" alt="Aliclik" className="h-full w-full object-contain" />
          </div>
          <span className="ml-3 text-lg font-bold tracking-wide text-white">ALICLIK</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Plataforma
          </div>
          
          <NavLink to="/dashboard/users" className={navLinkClass}>
            <Users className="h-5 w-5 mr-3" />
            <span>Usuarios</span>
            <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>

          <NavLink to="/dashboard/pokemon" className={navLinkClass}>
            <Gamepad2 className="h-5 w-5 mr-3" />
            <span>Catálogo Pokémon</span>
            <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>

          <div className="pt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sistema
          </div>
          
          <button 
            onClick={() => handleFutureFeature('Reportes')}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors group"
          >
            <FileText className="h-5 w-5 mr-3 group-hover:text-white" />
            <span>Reportes</span>
          </button>
          
          <button 
            onClick={() => handleFutureFeature('Configuración')}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors group"
          >
            <Settings className="h-5 w-5 mr-3 group-hover:text-white" />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-red-500/10 text-red-200 hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium border border-transparent hover:border-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-brand focus:outline-none"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center ml-auto gap-4">
            <button 
              onClick={() => handleFutureFeature('Notificaciones')}
              className="p-2 rounded-full text-gray-400 hover:text-brand hover:bg-gray-50 transition-all relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};