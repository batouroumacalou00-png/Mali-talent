import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const tokenKey = 'mali_talent_token';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({ sport: '', level: '', city: '' });

  function logout() {
    localStorage.removeItem(tokenKey);
    navigate('/login');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function fetchProfiles() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.level) params.append('level', filters.level);
      if (filters.city) params.append('city', filters.city);

      const response = await axios.get(`${API_URL}/profile/all?${params.toString()}`);
      setProfiles(response.data);
    } catch (error) {
      console.error('Erreur chargement profils:', error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo">Mali Talent</div>

          <div className="top-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Mon profil
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="page">
        <div className="container">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Rechercher des talents</h2>

            <div className="search-box">
              <div className="field">
                <label>Sport</label>
                <input name="sport" value={filters.sport} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Niveau</label>
                <select name="level" value={filters.level} onChange={handleChange}>
                  <option value="">Tous</option>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                  <option value="PROFESSIONAL">Professionnel</option>
                </select>
              </div>

              <div className="field">
                <label>Ville</label>
                <input name="city" value={filters.city} onChange={handleChange} />
              </div>

              <div className="field">
                <label>&nbsp;</label>
                <button className="btn btn-primary" onClick={fetchProfiles}>Rechercher</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 style={{ marginBottom: 20 }}>Talents disponibles</h2>

            {loading ? (
              <p>Chargement...</p>
            ) : profiles.length === 0 ? (
              <p>Aucun profil trouvé.</p>
            ) : (
              <div className="grid grid-3">
                {profiles.map((user) => (
                  <div className="profile-card" key={user.id}>
                    {user.profile.avatar ? (
                      <img src={user.profile.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <div style={{ height: 180, background: '#e5e7eb', borderRadius: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        Photo
                      </div>
                    )}

                    <h3>{user.firstName} {user.lastName}</h3>
                    <p><strong>Sport :</strong> {user.profile.sport || 'Non renseigné'}</p>
                    <p><strong>Niveau :</strong> {user.profile.level || 'Non renseigné'}</p>
                    <p><strong>Ville :</strong> {user.profile.city || 'Non renseignée'}</p>
                    <p><strong>Pays :</strong> {user.profile.country || 'Mali'}</p>
                    <p><strong>Expérience :</strong> {user.profile.yearsExperience ?? 0} ans</p>
                    <p><strong>Bio :</strong> {user.profile.bio || 'Aucune bio'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
