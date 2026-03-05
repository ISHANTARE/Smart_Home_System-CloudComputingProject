import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, seedDefaultRooms, logActivity } from '../db.js';
import { authenticate, signToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // check if user already exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const colors = ['#4F6EF7', '#22D3EE', '#8B5CF6', '#22C55E', '#EF4444', '#F97316'];
        const avatarColor = colors[Math.floor(Math.random() * colors.length)];

        const result = db.prepare(
            'INSERT INTO users (name, email, password, avatar_color) VALUES (?, ?, ?, ?)'
        ).run(name, email, hashedPassword, avatarColor);

        // seed default rooms for the new user
        seedDefaultRooms(result.lastInsertRowid);

        res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = signToken(user.id);

        logActivity(user.id, 'login', 'auth', 'User logged in');

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarColor: user.avatar_color,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/me — get current user
router.get('/me', authenticate, (req, res) => {
    try {
        const user = db.prepare('SELECT id, name, email, avatar_color, created_at FROM users WHERE id = ?')
            .get(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarColor: user.avatar_color,
            createdAt: user.created_at,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/auth/profile — update name/email
router.put('/profile', authenticate, (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name && !email) {
            return res.status(400).json({ error: 'Provide name or email to update' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (email && email !== user.email) {
            const dup = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.userId);
            if (dup) return res.status(409).json({ error: 'Email already in use' });
        }

        db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
            .run(name || user.name, email || user.email, req.userId);

        logActivity(req.userId, 'update', 'profile', `Updated profile`);

        res.json({ message: 'Profile updated', name: name || user.name, email: email || user.email });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/auth/password — change password
router.put('/password', authenticate, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashed = bcrypt.hashSync(newPassword, 10);
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.userId);

        logActivity(req.userId, 'update', 'password', 'Password changed');

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/activity — get activity log
router.get('/activity', authenticate, (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const logs = db.prepare(
            'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
        ).all(req.userId, limit);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
