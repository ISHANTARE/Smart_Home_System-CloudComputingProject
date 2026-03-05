import { Router } from 'express';
import { db, logActivity } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const COLORS = ['#8B5CF6', '#22D3EE', '#2DD4BF', '#EF4444', '#4F6EF7', '#F59E0B', '#22C55E', '#EC4899'];

// POST /api/devices — add a device to a room
router.post('/', (req, res) => {
    try {
        const { roomId, name, icon, power } = req.body;
        if (!roomId || !name) {
            return res.status(400).json({ error: 'roomId and name are required' });
        }

        // verify room belongs to user
        const room = db.prepare('SELECT * FROM rooms WHERE id = ? AND user_id = ?')
            .get(roomId, req.userId);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const count = db.prepare('SELECT COUNT(*) as c FROM devices WHERE room_id = ?').get(roomId).c;
        const color = COLORS[count % COLORS.length];

        const result = db.prepare(
            'INSERT INTO devices (room_id, name, icon, status, power, is_on, color) VALUES (?, ?, ?, ?, ?, 0, ?)'
        ).run(roomId, name, icon || 'Plug', 'Just added', power || '0Kwh', color);

        logActivity(req.userId, 'add', 'device', `Added "${name}" to "${room.name}"`);

        res.status(201).json({
            id: result.lastInsertRowid,
            name, icon: icon || 'Plug', status: 'Just added',
            power: power || '0Kwh', isOn: false, color,
        });
    } catch (err) {
        console.error('Add device error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/devices/:id — toggle or update a device
router.put('/:id', (req, res) => {
    try {
        const device = db.prepare(`
      SELECT d.*, r.user_id FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE d.id = ? AND r.user_id = ?
    `).get(req.params.id, req.userId);

        if (!device) return res.status(404).json({ error: 'Device not found' });

        const { isOn, name, status, power } = req.body;

        if (isOn !== undefined) {
            db.prepare('UPDATE devices SET is_on = ? WHERE id = ?').run(isOn ? 1 : 0, req.params.id);
        }
        if (name) db.prepare('UPDATE devices SET name = ? WHERE id = ?').run(name, req.params.id);
        if (status) db.prepare('UPDATE devices SET status = ? WHERE id = ?').run(status, req.params.id);
        if (power) db.prepare('UPDATE devices SET power = ? WHERE id = ?').run(power, req.params.id);

        res.json({ message: 'Device updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/devices/:id — delete a device
router.delete('/:id', (req, res) => {
    try {
        const device = db.prepare(`
      SELECT d.*, r.user_id, r.name as room_name FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE d.id = ? AND r.user_id = ?
    `).get(req.params.id, req.userId);

        if (!device) return res.status(404).json({ error: 'Device not found' });

        db.prepare('DELETE FROM devices WHERE id = ?').run(req.params.id);

        logActivity(req.userId, 'delete', 'device', `Deleted "${device.name}" from "${device.room_name}"`);

        res.json({ message: 'Device deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/devices/light/:id — update light brightness/state
router.put('/light/:id', (req, res) => {
    try {
        const light = db.prepare(`
      SELECT l.*, r.user_id FROM lights l
      JOIN rooms r ON l.room_id = r.id
      WHERE l.id = ? AND r.user_id = ?
    `).get(req.params.id, req.userId);

        if (!light) return res.status(404).json({ error: 'Light not found' });

        const { brightness, isOn } = req.body;
        if (brightness !== undefined) {
            db.prepare('UPDATE lights SET brightness = ? WHERE id = ?').run(brightness, req.params.id);
        }
        if (isOn !== undefined) {
            db.prepare('UPDATE lights SET is_on = ? WHERE id = ?').run(isOn ? 1 : 0, req.params.id);
        }

        res.json({ message: 'Light updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/devices/bookmark/:id — toggle bookmark
router.post('/bookmark/:id', (req, res) => {
    try {
        const device = db.prepare(`
      SELECT d.*, r.user_id FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE d.id = ? AND r.user_id = ?
    `).get(req.params.id, req.userId);

        if (!device) return res.status(404).json({ error: 'Device not found' });

        const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND device_id = ?')
            .get(req.userId, req.params.id);

        if (existing) {
            db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
            res.json({ bookmarked: false });
        } else {
            db.prepare('INSERT INTO bookmarks (user_id, device_id) VALUES (?, ?)')
                .run(req.userId, req.params.id);
            res.json({ bookmarked: true });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/devices/bookmarks — get all bookmarked devices
router.get('/bookmarks/all', (req, res) => {
    try {
        const bookmarks = db.prepare(`
      SELECT d.*, r.name as room_name, b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN devices d ON b.device_id = d.id
      JOIN rooms r ON d.room_id = r.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.userId);

        res.json(bookmarks.map((b) => ({
            id: b.id,
            name: b.name,
            icon: b.icon,
            status: b.status,
            power: b.power,
            isOn: !!b.is_on,
            color: b.color,
            roomName: b.room_name,
            bookmarkedAt: b.bookmarked_at,
        })));
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
