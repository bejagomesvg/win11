import express from 'express';
import session from 'express-session';
import cors from 'cors';
import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const storageDir = path.join(rootDir, 'storage');
const dbFilePath = path.join(storageDir, 'app.sqlite');
const port = Number(process.env.PORT || 3001);

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const SQL = await initSqlJs({
  locateFile: (file) => path.join(rootDir, 'node_modules', 'sql.js', 'dist', file),
});

const db = fs.existsSync(dbFilePath)
  ? new SQL.Database(fs.readFileSync(dbFilePath))
  : new SQL.Database();

function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(dbFilePath, Buffer.from(data));
}

function bootstrapDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT NOT NULL DEFAULT 'dark',
      color_theme TEXT NOT NULL DEFAULT 'blue',
      interface_radius INTEGER NOT NULL DEFAULT 5,
      dock_position TEXT NOT NULL DEFAULT 'bottom',
      auto_hide INTEGER NOT NULL DEFAULT 0,
      panel_mode INTEGER NOT NULL DEFAULT 0,
      icon_size INTEGER NOT NULL DEFAULT 34,
      dock_radius INTEGER NOT NULL DEFAULT 0,
      dock_transparency INTEGER NOT NULL DEFAULT 92,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  try {
    db.run("ALTER TABLE settings ADD COLUMN interface_radius INTEGER NOT NULL DEFAULT 5");
  } catch {
    // Column already exists for existing databases.
  }

  try {
    db.run("ALTER TABLE settings ADD COLUMN color_theme TEXT NOT NULL DEFAULT 'blue'");
  } catch {
    // Column already exists for existing databases.
  }

  try {
    db.run("ALTER TABLE settings ADD COLUMN panel_mode INTEGER NOT NULL DEFAULT 0");
  } catch {
    // Column already exists for existing databases.
  }

  try {
    db.run("ALTER TABLE settings ADD COLUMN icon_size INTEGER NOT NULL DEFAULT 34");
  } catch {
    // Column already exists for existing databases.
  }

  try {
    db.run("ALTER TABLE settings ADD COLUMN dock_radius INTEGER NOT NULL DEFAULT 30");
  } catch {
    // Column already exists for existing databases.
  }

  try {
    db.run("ALTER TABLE settings ADD COLUMN dock_transparency INTEGER NOT NULL DEFAULT 92");
  } catch {
    // Column already exists for existing databases.
  }

  const userCheck = db.prepare('SELECT id FROM users WHERE username = ?');
  userCheck.bind(['demo']);
  const exists = userCheck.step() ? userCheck.getAsObject() : null;
  userCheck.free();

  if (!exists) {
    const insertUser = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    insertUser.run(['demo', bcrypt.hashSync('demo123', 10)]);
    insertUser.free();

    const newUser = db.exec("SELECT id FROM users WHERE username = 'demo'");
    const userId = Number(newUser[0].values[0][0]);
    const insertSettings = db.prepare(
      'INSERT INTO settings (user_id, theme, color_theme, interface_radius, dock_position, auto_hide, panel_mode, icon_size, dock_radius, dock_transparency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    );
    insertSettings.run([userId, 'dark', 'blue', 5, 'bottom', 0, 0, 34, 0, 92]);
    insertSettings.free();
    saveDatabase();
    return;
  }

  const settingsInsert = db.prepare(
    'INSERT OR IGNORE INTO settings (user_id, theme, color_theme, interface_radius, dock_position, auto_hide, panel_mode, icon_size, dock_radius, dock_transparency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  );
  settingsInsert.run([Number(exists.id), 'dark', 'blue', 5, 'bottom', 0, 0, 34, 0, 92]);
  settingsInsert.free();
  saveDatabase();
}

bootstrapDatabase();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-desktop-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

function sendError(res, status, message) {
  res.status(status).json({
    success: false,
    message,
  });
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return sendError(res, 401, 'Nao autenticado.');
  }

  next();
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?');
  stmt.bind([username]);

  if (!stmt.step()) {
    stmt.free();
    return null;
  }

  const row = stmt.getAsObject();
  stmt.free();
  return row;
}

function getSettingsByUserId(userId) {
  const stmt = db.prepare(
    'SELECT theme, color_theme, interface_radius, dock_position, auto_hide, panel_mode, icon_size, dock_radius, dock_transparency FROM settings WHERE user_id = ?',
  );
  stmt.bind([userId]);

  if (!stmt.step()) {
    stmt.free();
    return {
      theme: 'dark',
      colorTheme: 'blue',
      interfaceRadius: 5,
      dockPosition: 'bottom',
      autoHide: false,
      panelMode: false,
      iconSize: 34,
      dockRadius: 0,
      dockTransparency: 92,
    };
  }

  const row = stmt.getAsObject();
  stmt.free();

  return {
    theme: String(row.theme || 'dark'),
    colorTheme: String(row.color_theme || 'blue'),
    interfaceRadius: Number(row.interface_radius ?? 5),
    dockPosition: String(row.dock_position || 'bottom'),
    autoHide: Number(row.auto_hide || 0) === 1,
    panelMode: Number(row.panel_mode || 0) === 1,
    iconSize: Number(row.icon_size || 34),
    dockRadius: Number(row.dock_radius ?? 0),
    dockTransparency: Number(row.dock_transparency || 92),
  };
}

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (!username || !password) {
    return sendError(res, 422, 'Usuario e senha sao obrigatorios.');
  }

  const user = getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, String(user.password_hash))) {
    return sendError(res, 401, 'Credenciais invalidas.');
  }

  req.session.user = {
    id: Number(user.id),
    username: String(user.username),
  };

  return req.session.save((error) => {
    if (error) {
      return sendError(res, 500, 'Nao foi possivel iniciar a sessao.');
    }

    return res.json({
      success: true,
      user: req.session.user,
    });
  });
});

app.delete('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/user', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.session.user,
  });
});

app.get('/api/settings', requireAuth, (req, res) => {
  const settings = getSettingsByUserId(req.session.user.id);
  res.json({
    success: true,
    settings,
  });
});

app.post('/api/settings', requireAuth, (req, res) => {
  const allowedThemes = ['light', 'dark'];
  const allowedColorThemes = ['red', 'orange', 'yellow', 'green', 'teal', 'mist', 'blue', 'purple', 'fuchsia', 'pink'];
  const allowedPositions = ['left', 'right', 'top', 'bottom'];

  const theme = allowedThemes.includes(req.body.theme) ? req.body.theme : 'dark';
  const colorTheme = allowedColorThemes.includes(req.body.colorTheme) ? req.body.colorTheme : 'blue';
  const requestedInterfaceRadius = Number(req.body.interfaceRadius ?? 5);
  const interfaceRadius = Number.isFinite(requestedInterfaceRadius)
    ? Math.min(25, Math.max(2, Math.round(requestedInterfaceRadius)))
    : 5;
  const dockPosition = allowedPositions.includes(req.body.dockPosition)
    ? req.body.dockPosition
    : 'bottom';
  const autoHide = req.body.autoHide ? 1 : 0;
  const panelMode = req.body.panelMode ? 1 : 0;
  const requestedIconSize = Number(req.body.iconSize ?? 34);
  const iconSize = Number.isFinite(requestedIconSize)
    ? Math.min(56, Math.max(24, Math.round(requestedIconSize)))
    : 34;
  const requestedDockRadius = Number(req.body.dockRadius ?? 0);
  const dockRadius = Number.isFinite(requestedDockRadius)
    ? Math.min(40, Math.max(0, Math.round(requestedDockRadius)))
    : 0;
  const requestedDockTransparency = Number(req.body.dockTransparency ?? 92);
  const dockTransparency = Number.isFinite(requestedDockTransparency)
    ? Math.min(100, Math.max(35, Math.round(requestedDockTransparency)))
    : 92;

  const stmt = db.prepare(`
    INSERT INTO settings (user_id, theme, color_theme, interface_radius, dock_position, auto_hide, panel_mode, icon_size, dock_radius, dock_transparency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      theme = excluded.theme,
      color_theme = excluded.color_theme,
      interface_radius = excluded.interface_radius,
      dock_position = excluded.dock_position,
      auto_hide = excluded.auto_hide,
      panel_mode = excluded.panel_mode,
      icon_size = excluded.icon_size,
      dock_radius = excluded.dock_radius,
      dock_transparency = excluded.dock_transparency
  `);

  stmt.run([
    req.session.user.id,
    theme,
    colorTheme,
    interfaceRadius,
    dockPosition,
    autoHide,
    panelMode,
    iconSize,
    dockRadius,
    dockTransparency,
  ]);
  stmt.free();
  saveDatabase();

  res.json({
    success: true,
    settings: {
      theme,
      colorTheme,
      interfaceRadius,
      dockPosition,
      autoHide: autoHide === 1,
      panelMode: panelMode === 1,
      iconSize,
      dockRadius,
      dockTransparency,
    },
  });
});

app.listen(port, () => {
  console.log(`API server running on http://127.0.0.1:${port}`);
});
