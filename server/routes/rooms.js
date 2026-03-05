import { Router } from 'express';
import { db, logActivity } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// all routes require authentication
router.use(authenticate);

// GET /api/rooms — get all rooms for current user with nested data
router.get('/', (req, res) => {
    try {
        const rooms = db.prepare('SELECT * FROM rooms WHERE user_id = ? ORDER BY created_at ASC')
            .all(req.userId);

        const result = {};

        for (const room of rooms) {
            const devices = db.prepare('SELECT * FROM devices WHERE room_id = ? ORDER BY created_at ASC')
                .all(room.id);
            const lights = db.prepare('SELECT * FROM lights WHERE room_id = ?')
                .all(room.id);
            const usageData = db.prepare('SELECT * FROM usage_data WHERE room_id = ? ORDER BY id ASC')
                .all(room.id);

            result[room.name] = {
                id: room.id,
                climateDevice: {
                    type: room.climate_type,
                    name: room.climate_name,
                    defaultTemp: room.climate_temp,
                    defaultSpeed: room.climate_speed,
                    isOn: !!room.climate_on,
                },
                devices: devices.map((d) => ({
                    id: d.id,
                    icon: d.icon,
                    name: d.name,
                    status: d.status,
                    power: d.power,
                    isOn: !!d.is_on,
                    color: d.color,
                })),
                lights: lights.map((l) => ({
                    id: l.id,
                    name: l.name,
                    brightness: l.brightness,
                    isOn: !!l.is_on,
                })),
                usageData: usageData.map((u) => ({ time: u.time_label, value: u.value })),
                totalSpend: room.total_spend,
                totalHours: room.total_hours,
            };
        }

        res.json(result);
    } catch (err) {
        console.error('Get rooms error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/rooms — add a new room
router.post('/', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Room name is required' });
        }

        const existing = db.prepare('SELECT id FROM rooms WHERE user_id = ? AND name = ?')
            .get(req.userId, name.trim());
        if (existing) {
            return res.status(409).json({ error: 'Room already exists' });
        }

        const result = db.prepare(`
      INSERT INTO rooms (user_id, name, climate_type, climate_name, climate_temp, climate_on)
      VALUES (?, ?, 'ac', 'Air Conditioner', 24, 0)
    `).run(req.userId, name.trim());

        const roomId = result.lastInsertRowid;

        // add a default light
        db.prepare('INSERT INTO lights (room_id, name, brightness, is_on) VALUES (?, ?, 80, 1)')
            .run(roomId, 'Main Light');

        // add default usage data
        const timeLabels = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        const insertUsage = db.prepare('INSERT INTO usage_data (room_id, time_label, value) VALUES (?, ?, ?)');
        for (const t of timeLabels) {
            insertUsage.run(roomId, t, 0);
        }

        logActivity(req.userId, 'add', 'room', `Added room "${name.trim()}"`);

        res.status(201).json({ message: 'Room created', roomId });
    } catch (err) {
        console.error('Add room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/rooms/:id — delete a room
router.delete('/:id', (req, res) => {
    try {
        const room = db.prepare('SELECT * FROM rooms WHERE id = ? AND user_id = ?')
            .get(req.params.id, req.userId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        db.prepare('DELETE FROM rooms WHERE id = ?').run(req.params.id);

        logActivity(req.userId, 'delete', 'room', `Deleted room "${room.name}"`);

        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/rooms/:id/climate — update climate settings
router.put('/:id/climate', (req, res) => {
    try {
        const { isOn, defaultTemp, defaultSpeed } = req.body;
        const room = db.prepare('SELECT * FROM rooms WHERE id = ? AND user_id = ?')
            .get(req.params.id, req.userId);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const updates = {};
        if (isOn !== undefined) updates.climate_on = isOn ? 1 : 0;
        if (defaultTemp !== undefined) updates.climate_temp = defaultTemp;
        if (defaultSpeed !== undefined) updates.climate_speed = defaultSpeed;

        const setClauses = Object.keys(updates).map((k) => `${k} = ?`).join(', ');
        if (setClauses) {
            db.prepare(`UPDATE rooms SET ${setClauses} WHERE id = ?`)
                .run(...Object.values(updates), req.params.id);
        }

        res.json({ message: 'Climate updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
