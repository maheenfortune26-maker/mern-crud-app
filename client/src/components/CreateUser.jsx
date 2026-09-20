import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', age: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

    setLoading(true);
    try {
      await API.post('/api/users', {
        name: form.name.trim(),
        email: form.email.trim(),
        age: Number(form.age),
      });
      navigate('/', { state: { toast: `✅ ${form.name} created!` } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/">Users</Link> / <span>Create</span>
        </div>
        <h1>Create User</h1>
        <p>Add a new user to the MongoDB collection via a POST request.</p>
      </div>

      <div className="form-card">
        <div className="form-card-head">
          <h2>New User</h2>
          <span className="method-badge badge-post">POST</span>
        </div>

        <div className="form-card-body">
          <div className="route-preview">
            <span className="route-method" style={{color:'var(--accent3)'}}>POST</span>
            <span className="route-path">/api/users</span>
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
                  placeholder="e.g. Maheen Fatima"
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
                  placeholder="e.g. maheen@iiui.edu.pk"
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
                  placeholder="e.g. 21"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>

            {/* Mongoose schema hint */}
            <div className="code-block">
              <span className="code-comment">// Mongoose Schema — User.js</span><br/>
              <span className="code-kw">const</span> userSchema = <span className="code-kw">new</span> Schema({'{'}<br/>
              &nbsp;&nbsp;name:  <span className="code-type">String</span>, &nbsp;<span className="code-comment">// ← "{form.name || '…'}"</span><br/>
              &nbsp;&nbsp;email: <span className="code-type">String</span>, &nbsp;<span className="code-comment">// ← "{form.email || '…'}"</span><br/>
              &nbsp;&nbsp;age:   <span className="code-type">Number</span>, &nbsp;<span className="code-comment">// ← {form.age || '…'}</span><br/>
              {'}'})
            </div>

            <div className="form-card-footer" style={{padding:'0',marginTop:'24px'}}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? '⏳ Saving…' : '➕ Create User'}
              </button>
              <Link to="/" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
