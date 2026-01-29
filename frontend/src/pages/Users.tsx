import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Modal } from '../components/ui/Modal';
import { useTableSettings } from '../hooks/useTableSettings';
import { 
  Plus, Pencil, Trash2, Search, User as UserIcon, Mail, Shield,
  Loader2, Camera, ChevronLeft, ChevronRight, MapPin, 
  ArrowUpDown, Phone, Lock, Unlock, ShieldCheck, 
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  avatar?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiErrorResponse {
  message: string | string[];
}

export default function UsersPage() {
  // Datos y Configuración
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  
  // Hook de Configuración
  const { settings, updateSettings } = useTableSettings<User>('usersTableConfig', {
    search: '', sort: null, page: 1, isLocked: false
  });

  // Estados UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0, name: '', email: '', role: 'user', phone: '', address: '', avatar: '', password: ''
  });

  // Carga de Datos
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Lógica de Tabla (Filtros y Orden)
  const processedUsers = useMemo(() => {
    let data = [...users];

    // Filtros
    if (settings.search) {
      const lowerTerm = settings.search.toLowerCase();
      data = data.filter(u => 
        u.name.toLowerCase().includes(lowerTerm) ||
        u.email.toLowerCase().includes(lowerTerm) ||
        (u.phone && u.phone.includes(lowerTerm))
      );
    }

    // Ordenamiento
    if (settings.sort) {
      data.sort((a, b) => {
        const aVal = a[settings.sort!.key] || '';
        const bVal = b[settings.sort!.key] || '';
        if (aVal < bVal) return settings.sort!.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return settings.sort!.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [users, settings.search, settings.sort]);

  // Paginación
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const safePage = Math.min(Math.max(1, settings.page), Math.max(1, totalPages));
  const currentUsers = processedUsers.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  const emptyRows = itemsPerPage - currentUsers.length;

  // Handlers
  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (settings.sort && settings.sort.key === key && settings.sort.direction === 'asc') direction = 'desc';
    updateSettings({ sort: { key, direction } });
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setIsEditing(true);
      setFormData({ ...user, password: '' });
    } else {
      setIsEditing(false);
      setFormData({ id: 0, name: '', email: '', role: 'user', phone: '', address: '', avatar: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('Máximo 5MB permitidos');
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error('Campos obligatorios faltantes');

    try {
      // Limpieza de payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...cleanPayload } = formData;
      if (!cleanPayload.password) delete cleanPayload.password;

      if (isEditing) {
        await api.patch(`/users/${formData.id}`, cleanPayload);
        toast.success('Usuario actualizado');
      } else {
        if (!formData.password) return toast.error('Contraseña requerida');
        await api.post('/users', cleanPayload);
        toast.success('Usuario creado');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      if (err.response?.status === 413) return toast.error('Imagen demasiado pesada');
      const msg = err.response?.data?.message || 'Error en la operación';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar usuario permanentemente?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Eliminado correctamente');
      fetchUsers();
    } catch { toast.error('No se pudo eliminar'); }
  };

  // Componente Header
  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: keyof User }) => (
    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
      onClick={() => handleSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 transition-opacity ${settings.sort?.key === sortKey ? 'opacity-100 text-brand' : 'opacity-30 group-hover:opacity-100'}`} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500">Administración de accesos</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-all shadow-sm active:scale-95">
          <Plus className="h-5 w-5 mr-2" /> Nuevo Usuario
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
          <input type="text" placeholder="Buscar..." className="pl-10 block w-full rounded-lg border-gray-300 bg-white border py-2 text-sm focus:border-brand focus:ring-brand outline-none transition-shadow focus:ring-2"
            value={settings.search} onChange={(e) => { updateSettings({ search: e.target.value, page: 1 }); }} />
        </div>
        <button onClick={() => updateSettings({ isLocked: !settings.isLocked })}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${settings.isLocked ? 'bg-brand/10 border-brand text-brand' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
          {settings.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />} {settings.isLocked ? 'Vista Fijada (F5)' : 'Fijar Vista'}
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Header ID también es ordenable */}
                    <SortableHeader label="# ID" sortKey="id" />
                    <SortableHeader label="Perfil" sortKey="name" />
                    <SortableHeader label="Correo" sortKey="email" />
                    <SortableHeader label="Teléfono" sortKey="phone" /> 
                    <SortableHeader label="Ubicación" sortKey="address" />
                    <SortableHeader label="Rol" sortKey="role" />
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => {
                    
                    // CORRECCIÓN 2: USAR ID DE BASE DE DATOS
                    // Formatea el ID 19 -> "00019"
                    const formattedId = user.id.toString().padStart(5, '0');

                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors group h-[60px]">
                        
                        {/* ID DB */}
                        <td className="px-6 py-2 whitespace-nowrap text-xs font-mono text-gray-400 font-medium">
                          {formattedId}
                        </td>
                        
                        {/* Perfil */}
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                              {user.avatar ? <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" /> : <span className="text-brand font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>}
                            </div>
                            <div className="ml-3 font-medium text-gray-900 text-sm">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{user.phone ? <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-gray-400" /> {user.phone}</div> : <span className="text-gray-300 text-xs">--</span>}</td>
                        <td className="px-6 py-2 text-sm text-gray-500 max-w-[150px]">{user.address ? <div className="flex items-center"><MapPin className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" /><span className="truncate">{user.address}</span></div> : <span className="text-gray-300 text-xs">--</span>}</td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                             {user.role === 'admin' ? <ShieldCheck className="h-3 w-3 mr-1 self-center"/> : <UserIcon className="h-3 w-3 mr-1 self-center"/>}
                             {user.role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(user)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Editar"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => <tr key={`empty-${i}`} style={{ height: '60px' }}><td colSpan={7}></td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50 mt-auto select-none">
                <button onClick={() => updateSettings({ page: safePage - 1 })} disabled={safePage === 1} className="p-1.5 rounded-md border border-gray-300 hover:bg-white disabled:opacity-50 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">Página {totalPages === 0 ? 0 : safePage} de {totalPages}</span>
                <button onClick={() => updateSettings({ page: safePage + 1 })} disabled={safePage === totalPages || totalPages === 0} className="p-1.5 rounded-md border border-gray-300 hover:bg-white disabled:opacity-50 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Perfil' : 'Nuevo Miembro'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECCIÓN AVATAR: Centrada y con estilo 'Badge' */}
          <div className="flex flex-col items-center justify-center -mt-2 mb-6">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Camera className="h-8 w-8 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Foto</span>
                    </div>
                  )}
                  {/* Overlay al pasar el mouse */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
            </div>
            <p className="mt-3 text-xs text-gray-400 font-medium">Click para subir imagen (Max 5MB)</p>
          </div>

          {/* GRID DE DATOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Nombre */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nombre Completo <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium text-gray-700"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ej. Arturo Becerra"
                />
              </div>
            </div>
            
            {/* Correo */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Correo Electrónico <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium text-gray-700"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="usuario@aliclik.app"
                />
              </div>
            </div>

            {/* Password */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">
                Contraseña {isEditing ? <span className="text-gray-400 font-normal normal-case text-[10px]">(Opcional: dejar en blanco para mantener)</span> : <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all font-mono text-sm"
                  value={formData.password || ''} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {/* Teléfono */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm"
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="+51 922041..."
                  />
                </div>
            </div>

            {/* Rol */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Rol de Acceso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none text-sm"
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
            </div>

            {/* Dirección */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Ubicación</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm"
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    placeholder="Dirección completa..."
                  />
                </div>
            </div>

            
          </div>

          {/* Footer Botones */}
          <div className="pt-6 flex gap-4 mt-2">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold text-sm transition-all duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-gradient-to-r from-brand to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-brand/30 font-semibold text-sm transition-all duration-200 transform active:scale-95"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}