import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const tokenKey = 'mali_talent_token';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'ATHLETE'
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      localStorage.setItem(tokenKey, res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1>Mali Talent</h1>
        <p>Créez votre compte</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Prénom</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Nom</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="field mt-4">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="field mt-4">
            <label>Type de compte</label>
            <select name="userType" value={form.userType} onChange={handleChange}>
              <option value="ATHLETE">Athlète</option>
              <option value="RECRUITER">Recruteur</option>
            </select>
          </div>

          <div className="field mt-4">
            <label>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <button className="btn btn-primary mt-4" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Vous avez déjà un compte ? <Link to="/login" className="text-link">Connexion</Link>
        </p>
      </div>
    </div>
  );
}
