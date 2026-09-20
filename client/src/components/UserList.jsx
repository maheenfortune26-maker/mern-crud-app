import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AVATAR_COLORS = ['#63d2ff','#a78bfa','#34d399','#fbbf24','#f87171','#f472b6'];

function avatarColor(name = '') {
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name = '') {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

function UserList() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState({ show: false, msg: '', icon: '' });
  const navigate = useNavigate();

  // ── Fetch all users ──
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('Failed to connect to the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Delete user ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast('🗑️', `${name} deleted`);
    } catch (err) {
      showToast('❌', 'Delete failed');
    }
  };

  function showToast(icon, msg) {
    setToast({ show: true, msg, icon });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    String(u.age).includes(search)
  );

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="breadcrumb">Home / <span>Users</span></div>
        <h1>User Management</h1>
        <p>View, search, edit and delete users from the MongoDB collection.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card c1">
          <div className="stat-label">Total Users</div>
          <div className="stat-value c1">{users.length}</div>
          <div className="stat-sub">in collection</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Showing</div>
          <div className="stat-value c2">{filtered.length}</div>
          <div className="stat-sub">after filter</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Avg Age</div>
          <div className="stat-value c3">
            {users.length ? Math.round(users.reduce((s,u)=>s+u.age,0)/users.length) : '—'}
          </div>
          <div className="stat-sub">years</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">API Route</div>
          <div className="stat-value c4" style={{fontSize:'16px',marginTop:'4px'}}>GET /api/users</div>
          <div className="stat-sub">REST endpoint</div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      {/* Table panel */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">👥 Users Collection</div>
          <div className="panel-actions">
            <div className="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Link to="/create" className="btn btn-primary btn-sm">➕ New User</Link>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"/> Fetching from MongoDB…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗃️</div>
            <div className="empty-text">{search ? 'No users match your search.' : 'No users yet.'}</div>
            {!search && <Link to="/create" className="btn btn-primary">➕ Create First User</Link>}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>MongoDB _id</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => {
                  const color = avatarColor(user.name);
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div
                            className="avatar"
                            style={{ background: color + '22', color, border: `1.5px solid ${color}44` }}
                          >
                            {initials(user.name)}
                          </div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-handle">#{String(i+1).padStart(3,'0')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td><span className="age-badge">{user.age}</span></td>
                      <td className="id-cell">{user._id.slice(0,10)}…</td>
                      <td>
                        <div className="action-cell">
                          <button
                            className="btn-icon edit"
                            title="Edit"
                            onClick={() => navigate(`/update/${user._id}`)}
                          >✏️</button>
                          <button
                            className="btn-icon del"
                            title="Delete"
                            onClick={() => handleDelete(user._id, user.name)}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <span>{toast.icon}</span> {toast.msg}
      </div>
    </>
  );
}

export default UserList;
