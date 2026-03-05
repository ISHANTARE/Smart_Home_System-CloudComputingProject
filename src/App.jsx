import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SmartHomeProvider, useSmartHome } from './context/SmartHomeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoomTabs from './components/RoomTabs';
import ClimateControl from './components/ClimateControl';
import UsageStatus from './components/UsageStatus';
import MyDevices from './components/MyDevices';
import LightPanel from './components/LightPanel';
import AddRoomModal from './components/AddRoomModal';
import AddDeviceModal from './components/AddDeviceModal';
import SettingsPage from './components/SettingsPage';
import NotFoundPage from './components/NotFoundPage';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecentPage from './pages/RecentPage';
import BookmarkPage from './pages/BookmarkPage';
import DownloadedPage from './pages/DownloadedPage';
import { Loader2 } from 'lucide-react';

function Dashboard({ searchQuery }) {
  const { rooms, addRoom, addDevice, removeRoom, loading } = useSmartHome();
  const [activeRoom, setActiveRoom] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);

  const roomNames = Object.keys(rooms);

  // set first room as active if none selected
  if (!activeRoom && roomNames.length > 0) {
    setActiveRoom(roomNames[0]);
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  const roomData = rooms[activeRoom];

  // if active room was deleted, fall back
  if (!roomData && roomNames.length > 0) {
    setActiveRoom(roomNames[0]);
    return null;
  }

  if (!roomData) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-lg py-20">
        No rooms yet. Click "+ Add" to create one.
      </div>
    );
  }

  // filter devices by search
  const filteredDevices = searchQuery.trim()
    ? roomData.devices.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : roomData.devices;

  return (
    <>
      <RoomTabs
        rooms={roomNames}
        activeRoom={activeRoom}
        onRoomChange={setActiveRoom}
        onAddRoom={() => setShowAddRoom(true)}
        onAddDevice={() => setShowAddDevice(true)}
        onDeleteRoom={(name) => {
          removeRoom(name);
          if (activeRoom === name) {
            const remaining = roomNames.filter((r) => r !== name);
            setActiveRoom(remaining[0] || '');
          }
        }}
      />

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5" key={`top-${activeRoom}`}>
        <div className="lg:col-span-4 anim-fade anim-d1">
          <ClimateControl config={roomData.climateDevice} roomName={activeRoom} />
        </div>
        <div className="lg:col-span-8 anim-fade anim-d2">
          <UsageStatus
            data={roomData.usageData}
            totalSpend={roomData.totalSpend}
            totalHours={roomData.totalHours}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5" key={`bot-${activeRoom}`}>
        <div className="lg:col-span-8 anim-fade anim-d3">
          <MyDevices devices={filteredDevices} roomName={activeRoom} />
        </div>
        <div className="lg:col-span-4 anim-fade anim-d4">
          <LightPanel lights={roomData.lights} roomName={activeRoom} />
        </div>
      </div>

      <AddRoomModal
        isOpen={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        onAdd={addRoom}
        existingRooms={roomNames}
      />
      <AddDeviceModal
        isOpen={showAddDevice}
        onClose={() => setShowAddDevice(false)}
        onAdd={addDevice}
        roomName={activeRoom}
      />
    </>
  );
}

function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { toasts } = useSmartHome();
  const { user, logout } = useAuth();

  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    setSidebarOpen(false);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard searchQuery={searchQuery} />;
      case 'Recent':
        return <RecentPage />;
      case 'Bookmark':
        return <BookmarkPage />;
      case 'Downloaded':
        return <DownloadedPage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Support':
        return (
          <div className="flex items-center justify-center h-full py-20">
            <div className="text-center">
              <p className="text-text-white text-xl font-semibold mb-2">Support</p>
              <p className="text-text-muted text-[14px]">Contact us at support@smarth.cloud</p>
            </div>
          </div>
        );
      default:
        return <NotFoundPage onGoHome={() => setActivePage('Dashboard')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        <Header
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading, login, register } = useAuth();
  const [page, setPage] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (page === 'register') {
      return <RegisterPage onSwitch={() => setPage('login')} onRegister={register} />;
    }
    return <LoginPage onSwitch={() => setPage('register')} onLogin={login} />;
  }

  return (
    <SmartHomeProvider>
      <AuthenticatedApp />
    </SmartHomeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;