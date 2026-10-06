import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { FeedPage } from './pages/FeedPage';
import { DoubtsPage } from './pages/DoubtsPage';
import { ClassesPage } from './pages/ClassesPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MentorsPage } from './pages/MentorsPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { BecomeMentorPage } from './pages/BecomeMentorPage';
import { AdminPage } from './pages/AdminPage';
import { Menu, GraduationCap, User, CheckCircle } from 'lucide-react';

export const App = () => {
  const { toast, user, isAuthModalOpen, setIsAuthModalOpen } = useApp();
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname || '/Home';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync route on popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/Home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const normalizedRoute = currentRoute.toLowerCase();

  // Render Page according to normalized route
  const renderCurrentPage = () => {
    if (normalizedRoute === '/doubts') {
      return <DoubtsPage />;
    }
    if (normalizedRoute === '/classes') {
      return <ClassesPage />;
    }
    if (normalizedRoute === '/connections') {
      return <ConnectionsPage navigate={navigate} />;
    }
    if (normalizedRoute === '/mentors') {
      return <MentorsPage navigate={navigate} />;
    }
    if (normalizedRoute === '/chat') {
      return <ChatPage />;
    }
    if (normalizedRoute === '/profile') {
      return <ProfilePage navigate={navigate} />;
    }
    if (normalizedRoute === '/becomementor' || normalizedRoute === '/become-mentor') {
      return <BecomeMentorPage navigate={navigate} />;
    }
    if (normalizedRoute === '/admin') {
      return <AdminPage />;
    }
    // Default to /Home feed
    return <FeedPage />;
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            backgroundColor: toast.type === 'error' ? '#ef4444' : '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Persistent Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        navigate={navigate}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Desktop Top Navbar with Top Corner Profile Bar */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <span className="top-navbar-greeting">Welcome back, {user.full_name?.split(' ')[0]} 👋</span>
            <span className="top-navbar-subgreeting">Connect &amp; collaborate in real time</span>
          </div>

          <div className="top-corner-profile-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              <span className="presence-dot"></span>
              <span>Online</span>
            </div>

            <button 
              type="button" 
              onClick={() => navigate('/Profile')} 
              className="top-profile-pill"
              title="View your profile"
            >
              <div 
                className="avatar-circle" 
                style={{ width: '1.85rem', height: '1.85rem', fontSize: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)' }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} style={{ width: '100%', height: '100%', borderRadius: '9999px', objectFit: 'cover' }} />
                ) : (
                  (user.full_name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {user.full_name}
                  </span>
                  {user.is_verified_mentor && (
                    <CheckCircle style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} />
                  )}
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                  {user.is_verified_mentor ? 'Verified Mentor' : (user.role === 'admin' ? 'Administrator' : 'Student')}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="mobile-header">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            style={{ color: 'var(--foreground)', padding: '0.25rem' }}
          >
            <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="logo-icon-box" style={{ width: '1.75rem', height: '1.75rem', borderRadius: '6px' }}>
              <GraduationCap style={{ width: '1rem', height: '1rem' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>ConnectMitraa</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/Profile')}
            className="avatar-circle"
            style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.75rem' }}
          >
            {(user.full_name || 'U').charAt(0).toUpperCase()}
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, paddingBottom: '3rem' }}>
          {renderCurrentPage()}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
};
