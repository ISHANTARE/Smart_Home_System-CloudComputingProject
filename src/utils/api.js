// API helper — all backend calls go through here
// Easy to swap base URL for AWS deployment later

const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('smarth_token');
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

export const api = {
    // Auth
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => request('/auth/me'),
    updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
    changePassword: (body) => request('/auth/password', { method: 'PUT', body: JSON.stringify(body) }),
    getActivity: (limit = 30) => request(`/auth/activity?limit=${limit}`),

    // Rooms
    getRooms: () => request('/rooms'),
    addRoom: (name) => request('/rooms', { method: 'POST', body: JSON.stringify({ name }) }),
    deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
    updateClimate: (id, body) => request(`/rooms/${id}/climate`, { method: 'PUT', body: JSON.stringify(body) }),

    // Devices
    addDevice: (body) => request('/devices', { method: 'POST', body: JSON.stringify(body) }),
    updateDevice: (id, body) => request(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteDevice: (id) => request(`/devices/${id}`, { method: 'DELETE' }),
    updateLight: (id, body) => request(`/devices/light/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    toggleBookmark: (id) => request(`/devices/bookmark/${id}`, { method: 'POST' }),
    getBookmarks: () => request('/devices/bookmarks/all'),
};
