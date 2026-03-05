import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'smarth.db');

const db = new Database(DB_PATH);

// enable WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create tables ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#4F6EF7',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    climate_type TEXT DEFAULT 'ac',
    climate_name TEXT DEFAULT 'Air Conditioner',
    climate_temp INTEGER DEFAULT 24,
    climate_speed INTEGER DEFAULT 2,
    climate_on INTEGER DEFAULT 0,
    total_spend TEXT DEFAULT '0Kwh',
    total_hours TEXT DEFAULT '0h',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, name)
  );

  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Plug',
    status TEXT DEFAULT 'Just added',
    power TEXT DEFAULT '0Kwh',
    is_on INTEGER DEFAULT 0,
    color TEXT DEFAULT '#4F6EF7',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS lights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    brightness INTEGER DEFAULT 80,
    is_on INTEGER DEFAULT 1,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS usage_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    time_label TEXT NOT NULL,
    value INTEGER DEFAULT 0,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    detail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    UNIQUE(user_id, device_id)
  );
`);

// ── Seed default data for a user ──────────────────────────
function seedDefaultRooms(userId) {
    const defaultRooms = [
        {
            name: 'Living Room', climateType: 'ac', climateName: 'Air Conditioner',
            climateTemp: 24, climateOn: 1, totalSpend: '35.02Kwh', totalHours: '32h',
            devices: [
                { name: 'Smart TV', icon: 'Monitor', status: 'Active for 3 hours', power: '5Kwh', isOn: 0, color: '#8B5CF6' },
                { name: 'Speaker', icon: 'Speaker', status: 'Active for 3 hours', power: '5Kwh', isOn: 1, color: '#22D3EE' },
                { name: 'Router', icon: 'Router', status: 'Active for 3 hours', power: '5Kwh', isOn: 0, color: '#2DD4BF' },
                { name: 'Wifi', icon: 'Wifi', status: 'Active for 3 hours', power: '5Kwh', isOn: 1, color: '#4F6EF7' },
                { name: 'Heater', icon: 'Flame', status: 'Active for 3 hours', power: '5Kwh', isOn: 1, color: '#EF4444' },
                { name: 'Socket', icon: 'Plug', status: 'Active for 3 hours', power: '5Kwh', isOn: 0, color: '#F59E0B' },
            ],
            lights: [
                { name: 'Light 1', brightness: 60, isOn: 1 },
                { name: 'Light 2', brightness: 80, isOn: 1 },
                { name: 'Light 3', brightness: 45, isOn: 1 },
                { name: 'Light 4', brightness: 60, isOn: 0 },
                { name: 'Light 5', brightness: 60, isOn: 1 },
            ],
            usage: [12, 18, 22, 30, 20, 15, 17, 14, 10, 8],
        },
        {
            name: 'Kitchen Room', climateType: 'exhaust', climateName: 'Exhaust / Chimney',
            climateTemp: 24, climateSpeed: 3, climateOn: 1, totalSpend: '42.50Kwh', totalHours: '28h',
            devices: [
                { name: 'Chimney', icon: 'Wind', status: 'Active for 1 hour', power: '3Kwh', isOn: 1, color: '#22D3EE' },
                { name: 'Exhaust Fan', icon: 'Fan', status: 'Active for 1 hour', power: '1Kwh', isOn: 1, color: '#8B5CF6' },
                { name: 'Refrigerator', icon: 'Refrigerator', status: 'Always on', power: '8Kwh', isOn: 1, color: '#2DD4BF' },
                { name: 'Smart Oven', icon: 'CookingPot', status: 'Inactive', power: '0Kwh', isOn: 0, color: '#EF4444' },
                { name: 'Dishwasher', icon: 'GlassWater', status: 'Inactive', power: '0Kwh', isOn: 0, color: '#4F6EF7' },
                { name: 'Socket', icon: 'Plug', status: 'Active for 8 hours', power: '2Kwh', isOn: 1, color: '#F59E0B' },
            ],
            lights: [
                { name: 'Main Light', brightness: 100, isOn: 1 },
                { name: 'Counter Light', brightness: 75, isOn: 1 },
                { name: 'Cabinet Light', brightness: 50, isOn: 0 },
            ],
            usage: [8, 12, 25, 35, 28, 10, 8, 6, 18, 30],
        },
        {
            name: 'Bed Room', climateType: 'ac', climateName: 'Air Conditioner',
            climateTemp: 22, climateOn: 1, totalSpend: '18.40Kwh', totalHours: '40h',
            devices: [
                { name: 'Smart Speaker', icon: 'Speaker', status: 'Active for 1 hour', power: '1Kwh', isOn: 1, color: '#22D3EE' },
                { name: 'Humidifier', icon: 'Droplets', status: 'Active for 5 hours', power: '2Kwh', isOn: 1, color: '#8B5CF6' },
                { name: 'Ceiling Fan', icon: 'Fan', status: 'Active for 6 hours', power: '1.5Kwh', isOn: 1, color: '#2DD4BF' },
                { name: 'Smart Alarm', icon: 'AlarmClock', status: 'Standby', power: '0.1Kwh', isOn: 1, color: '#F59E0B' },
                { name: 'Air Purifier', icon: 'Wind', status: 'Active for 8 hours', power: '3Kwh', isOn: 1, color: '#4F6EF7' },
                { name: 'Wireless Charger', icon: 'BatteryCharging', status: 'Charging', power: '0.5Kwh', isOn: 1, color: '#22C55E' },
            ],
            lights: [
                { name: 'Main Light', brightness: 40, isOn: 1 },
                { name: 'Bedside Left', brightness: 25, isOn: 1 },
                { name: 'Bedside Right', brightness: 25, isOn: 0 },
                { name: 'Wardrobe Light', brightness: 60, isOn: 0 },
                { name: 'Night Light', brightness: 10, isOn: 1 },
            ],
            usage: [5, 3, 2, 4, 6, 5, 8, 10, 15, 20],
        },
        {
            name: 'Movie Room', climateType: 'ac', climateName: 'Air Conditioner',
            climateTemp: 21, climateOn: 0, totalSpend: '12.80Kwh', totalHours: '15h',
            devices: [
                { name: 'Projector', icon: 'Projector', status: 'Inactive', power: '0Kwh', isOn: 0, color: '#8B5CF6' },
                { name: 'Soundbar', icon: 'Speaker', status: 'Inactive', power: '0Kwh', isOn: 0, color: '#22D3EE' },
                { name: 'Subwoofer', icon: 'Volume2', status: 'Inactive', power: '0Kwh', isOn: 0, color: '#EF4444' },
                { name: 'AV Receiver', icon: 'Radio', status: 'Standby', power: '0.2Kwh', isOn: 1, color: '#2DD4BF' },
                { name: 'Streaming Box', icon: 'Tv', status: 'Standby', power: '0.3Kwh', isOn: 1, color: '#F59E0B' },
                { name: 'Power Strip', icon: 'Plug', status: 'Active', power: '1Kwh', isOn: 1, color: '#4F6EF7' },
            ],
            lights: [
                { name: 'Ambient Left', brightness: 15, isOn: 1 },
                { name: 'Ambient Right', brightness: 15, isOn: 1 },
                { name: 'Ceiling Spots', brightness: 0, isOn: 0 },
                { name: 'LED Strip', brightness: 20, isOn: 1 },
            ],
            usage: [2, 2, 3, 5, 4, 8, 12, 18, 22, 25],
        },
        {
            name: 'Game Room', climateType: 'ac', climateName: 'Air Conditioner',
            climateTemp: 20, climateOn: 1, totalSpend: '52.10Kwh', totalHours: '44h',
            devices: [
                { name: 'Gaming Monitor', icon: 'Monitor', status: 'Active for 4 hours', power: '4Kwh', isOn: 1, color: '#8B5CF6' },
                { name: 'Gaming PC', icon: 'Cpu', status: 'Active for 4 hours', power: '12Kwh', isOn: 1, color: '#EF4444' },
                { name: 'Console', icon: 'Gamepad2', status: 'Standby', power: '0.5Kwh', isOn: 1, color: '#22D3EE' },
                { name: 'Speakers', icon: 'Speaker', status: 'Active for 4 hours', power: '2Kwh', isOn: 1, color: '#2DD4BF' },
                { name: 'Gaming Router', icon: 'Router', status: 'Always on', power: '1.5Kwh', isOn: 1, color: '#F59E0B' },
                { name: 'Power Strip', icon: 'Plug', status: 'Always on', power: '1Kwh', isOn: 1, color: '#4F6EF7' },
            ],
            lights: [
                { name: 'RGB Strips', brightness: 90, isOn: 1 },
                { name: 'Desk Lamp', brightness: 50, isOn: 1 },
                { name: 'Ceiling Light', brightness: 30, isOn: 0 },
                { name: 'Ambient Wall', brightness: 70, isOn: 1 },
                { name: 'Monitor Bias', brightness: 85, isOn: 1 },
            ],
            usage: [5, 15, 20, 18, 10, 22, 28, 32, 30, 25],
        },
    ];

    const timeLabels = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    const insertRoom = db.prepare(`
    INSERT INTO rooms (user_id, name, climate_type, climate_name, climate_temp, climate_speed, climate_on, total_spend, total_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertDevice = db.prepare(`
    INSERT INTO devices (room_id, name, icon, status, power, is_on, color) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const insertLight = db.prepare(`
    INSERT INTO lights (room_id, name, brightness, is_on) VALUES (?, ?, ?, ?)
  `);
    const insertUsage = db.prepare(`
    INSERT INTO usage_data (room_id, time_label, value) VALUES (?, ?, ?)
  `);

    const seedAll = db.transaction(() => {
        for (const room of defaultRooms) {
            const result = insertRoom.run(
                userId, room.name, room.climateType, room.climateName,
                room.climateTemp, room.climateSpeed || 2, room.climateOn ? 1 : 0,
                room.totalSpend, room.totalHours
            );
            const roomId = result.lastInsertRowid;

            for (const d of room.devices) {
                insertDevice.run(roomId, d.name, d.icon, d.status, d.power, d.isOn ? 1 : 0, d.color);
            }
            for (const l of room.lights) {
                insertLight.run(roomId, l.name, l.brightness, l.isOn ? 1 : 0);
            }
            for (let i = 0; i < room.usage.length; i++) {
                insertUsage.run(roomId, timeLabels[i], room.usage[i]);
            }
        }
    });

    seedAll();
}

// ── Helper: log an activity ──────────────────────────────
function logActivity(userId, action, target, detail = null) {
    db.prepare('INSERT INTO activity_log (user_id, action, target, detail) VALUES (?, ?, ?, ?)')
        .run(userId, action, target, detail);
}

export { db, seedDefaultRooms, logActivity };
