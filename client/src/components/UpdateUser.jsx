import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', age: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  // ── Fetch existing user for pre-fill (GET /api/users/:id) ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        const { name, email, age } = res.data;
        setForm({ name, email, age: String(age) });
      } catch {
        setApiError('User not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Valid email is required';
    const age = Number(form.age);
    if (!form.age || age < 1 || age > 120)
      errs.age = 'Age must be between 1 and 120';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await axios.put(`/api/users/${id}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        age: Number(form.age),
      });
      navigate('/', { state: { toast: `✅ ${form.name} updated!` } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading"><div className="spinner"/> Fetching user data…</div>
  );

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/">Users</Link> / <span>Update</span>
        </div>
        <h1>Update User</h1>
        <p>Edit user data — form is pre-filled via GET <code style={{color:'var(--accent)'}}>
          /api/users/{id.slice(0,8)}…</code>
        </p>
      </div>

      <div className="form-card">
        <div className="form-card-head">
          <h2>Edit User</h2>
          <span className="method-badge badge-put">PUT</span>
        </div>

        <div className="form-card-body">
          <div className="route-preview">
            <span className="route-method" style={{color:'var(--warn)'}}>PUT</span>
            <span className="route-path">/api/users/{id.slice(0,10)}…</span>
          </div>

          {apiError && <div className="error-banner">⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  type="text" name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <div className="input-wrap">
                <span className="input-icon">🎂</span>
                <input
                  className={`form-input ${errors.age ? 'error' : ''}`}
                  type="number" name="age" min="1" max="120"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>

            {/* findByIdAndUpdate hint */}
            <div className="code-block">
              <span className="code-comment">// Express PUT route</span><br/>
              <span className="code-kw">await</span> User.findByIdAndUpdate(<br/>
              &nbsp;&nbsp;<span className="code-str">"{id.slice(0,10)}…"</span>,<br/>
              &nbsp;&nbsp;{'{ '}name, email, age{' }'},<br/>
              &nbsp;&nbsp;{'{ '}new: <span className="code-type">true</span>, runValidators: <span className="code-type">true</span>{' }'}<br/>
              )
            </div>

            <div className="form-card-footer" style={{padding:'0',marginTop:'24px'}}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? '⏳ Saving…' : '💾 Save Changes'}
              </button>
              <Link to="/" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateUser;
