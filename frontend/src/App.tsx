import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { type RootState } from './store/store';
import Login from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import UsersPage from './pages/Users';
import PokemonPage from './pages/Pokemon';
import Register from './pages/Register';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 2000,
          className: '',
          style: {
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '50px',
            fontSize: '14px',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          },
          success: {
            style: { background: '#10B981' },
            iconTheme: { primary: '#fff', secondary: '#10B981' },
          },
          error: {
            style: { background: '#EF4444' },
            iconTheme: { primary: '#fff', secondary: '#EF4444' },
          },
        }}
        containerStyle={{
          top: 25,
          right: 25,
          zIndex: 99999999,
        }}
      />

      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="pokemon" element={<PokemonPage />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
