import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const tokenKey = 'mali_talent_token';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    bio: '',
    sport: '',
    level: 'BEGINNER',
    city: '',
    age: '',
    height: '',
    weight: '',
    achievements: '',
    videos: '',
    certifications: '',
    yearsExperience: '',
    availability: 'AVAILABLE'
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem(tokenKey);
      const payload = {
        bio: form.bio,
        sport: form.sport,
        level: form.level,
        city: form.city,
        age: form.age ? Number(form.age) : null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        achievements: form.achievements ? form.achievements.split(',').map((item) => item.trim()).filter(Boolean) : [],
        videos: form.videos ? form.videos.split(',').map((item) => item.trim()).filter(Boolean) : [],
        certifications: form.certifications ? form.certifications.split(',').map((item) => item.trim()).filter(Boolean) : [],
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : 0,
        availability: form.availability
      };

      await axios.post(`${API_URL}/profile/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’enregistrement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1 style={{ marginTop: 0, marginBottom: 24 }}>Complétez votre profil</h1>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Sport</label>
                <input name="sport" value={form.sport} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Niveau</label>
                <select name="level" value={form.level} onChange={handleChange}>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                  <option value="PROFESSIONAL">Professionnel</option>
                </select>
              </div>

              <div className="field">
                <label>Ville</label>
                <input name="city" value={form.city} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Âge</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Taille (cm)</label>
                <input type="number" name="height" value={form.height} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Poids (kg)</label>
                <input type="number" name="weight" value={form.weight} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Années d’expérience</label>
                <input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Disponibilité</label>
                <select name="availability" value={form.availability} onChange={handleChange}>
                  <option value="AVAILABLE">Disponible</option>
                  <option value="NOT_AVAILABLE">Non disponible</option>
                </select>
              </div>

              <div className="field full">
                <label>Biographie</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} />
              </div>

              <div className="field full">
                <label>Réalisations (séparées par des virgules)</label>
                <textarea name="achievements" value={form.achievements} onChange={handleChange} />
              </div>

              <div className="field full">
                <label>Vidéos (URLs séparées par des virgules)</label>
                <textarea name="videos" value={form.videos} onChange={handleChange} />
              </div>

              <div className="field full">
                <label>Certifications (séparées par des virgules)</label>
                <textarea name="certifications" value={form.certifications} onChange={handleChange} />
              </div>
            </div>

            <button className="btn btn-primary mt-4" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer le profil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
