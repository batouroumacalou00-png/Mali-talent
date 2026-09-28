import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'db.json');

export function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [] }, null, 2));
  }
}

export function readUsers() {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.users) ? parsed.users : [];
  } catch (error) {
    return [];
  }
}

export function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify({ users }, null, 2));
}
