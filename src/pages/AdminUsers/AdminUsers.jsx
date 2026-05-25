import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import './AdminUsers.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const RANGOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'emailmkt', label: 'Email MKT' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'bloqueado', label: 'Bloqueado' },
];

async function apiRequest(endpoint, options = {}, token = '') {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminUsers() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const admin = useMemo(() => getAdminFromToken(token), [token]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const loadUsers = async () => {
    if (!token || admin?.rango !== 'superadmin') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/emailmkt/users', {}, token);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, admin?.rango]);

  const updateUser = async (user, patch) => {
    setSavingId(user.id);
    setMessage('');
    setError('');

    try {
      const data = await apiRequest(`/api/emailmkt/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          rango: patch.rango ?? user.rango,
          active: patch.active ?? user.active,
        }),
      }, token);

      setUsers((current) => current.map((item) => (item.id === user.id ? data.user : item)));
      setMessage(`Usuario ${data.user.username} actualizado.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId('');
    }
  };

  if (!token) {
    return (
      <main className="admin-users-page admin-users-page--center">
        <section className="admin-users-empty">
          <h1>Usuarios</h1>
          <p>Tenes que iniciar sesion como super admin para entrar.</p>
          <a href="/emailmkt">Ir a login</a>
        </section>
      </main>
    );
  }

  if (admin?.rango !== 'superadmin') {
    return (
      <main className="admin-users-page">
        <AdminNav />
        <section className="admin-users-empty">
          <h1>Usuarios</h1>
          <p>Esta vista es solo para super admin.</p>
          <button type="button" onClick={logout}>Salir</button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-users-page">
      <AdminNav />

      <header className="admin-users-header">
        <div>
          <h1>Usuarios</h1>
          <p>Habilita registros nuevos y administra permisos internos.</p>
        </div>
        <div className="admin-users-actions">
          <button type="button" onClick={loadUsers}>Actualizar</button>
          <button type="button" className="is-secondary" onClick={logout}>Salir</button>
        </div>
      </header>

      {message && <div className="admin-users-alert admin-users-alert--ok">{message}</div>}
      {error && <div className="admin-users-alert admin-users-alert--error">{error}</div>}

      <section className="admin-users-card">
        {loading ? (
          <p className="admin-users-muted">Cargando usuarios...</p>
        ) : (
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rango</th>
                  <th>Activo</th>
                  <th>Registro</th>
                  <th>Ultimo ingreso</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.rango}
                        disabled={savingId === user.id}
                        onChange={(event) => updateUser(user, { rango: event.target.value })}
                      >
                        {RANGOS.map((rango) => (
                          <option value={rango.value} key={rango.value}>{rango.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label className="admin-users-switch">
                        <input
                          type="checkbox"
                          checked={user.active}
                          disabled={savingId === user.id}
                          onChange={(event) => updateUser(user, { active: event.target.checked })}
                        />
                        <span>{user.active ? 'Si' : 'No'}</span>
                      </label>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastLoginAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
