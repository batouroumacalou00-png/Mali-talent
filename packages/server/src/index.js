import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readUsers, writeUsers } from './dataStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mali-talent-secret-key';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function findUserByEmail(email) {
  return readUsers().find((user) => user.email && user.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return readUsers().find((user) => user.id === id);
}

function saveUser(user) {
  const users = readUsers();
  const index = users.findIndex((item) => item.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  writeUsers(users);
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
}

function randomId() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mali Talent API active' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: randomId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType: userType === 'RECRUITER' ? 'RECRUITER' : 'ATHLETE',
      profile: {
        bio: '',
        sport: '',
        level: 'BEGINNER',
        city: '',
        country: 'Mali',
        age: null,
        height: null,
        weight: null,
        achievements: [],
        videos: [],
        certifications: [],
        yearsExperience: 0,
        availability: 'AVAILABLE',
        avatar: ''
      },
      recruiter: {
        company: '',
        position: '',
        bio: ''
      }
    };

    const users = readUsers();
    users.push(user);
    writeUsers(users);

    const token = createToken(user);

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = createToken(user);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

app.get('/api/profile/me', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
    profile: user.profile
  });
});

app.post('/api/profile/update', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  user.profile = {
    ...user.profile,
    ...req.body
  };

  saveUser(user);

  res.json({
    message: 'Profil enregistré',
    profile: user.profile
  });
});

app.get('/api/profile/all', (req, res) => {
  const users = readUsers();

  const filters = {
    sport: (req.query.sport || '').toString(),
    level: (req.query.level || '').toString(),
    city: (req.query.city || '').toString()
  };

  const results = users
    .filter((user) => {
      if (!user.profile) return false;
      if (filters.sport && user.profile.sport.toLowerCase() !== filters.sport.toLowerCase()) return false;
      if (filters.level && user.profile.level !== filters.level) return false;
      if (filters.city && user.profile.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      return true;
    })
    .map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      profile: user.profile
    }));

  res.json(results);
});

app.get('/api/recruiter/me', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  res.json({
    id: user.id,
    company: user.recruiter.company,
    position: user.recruiter.position,
    bio: user.recruiter.bio,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });
});

app.post('/api/recruiter/update', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  user.recruiter = {
    ...user.recruiter,
    ...req.body
  };

  saveUser(user);

  res.json({
    message: 'Profil recruteur enregistré',
    recruiter: user.recruiter
  });
});

app.listen(PORT, () => {
  console.log(`Mali Talent API running on http://localhost:${PORT}`);
});
