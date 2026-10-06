import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  HelpCircle,
  GraduationCap,
  Users,
  Award,
  MessageSquare,
  User,
  Sparkles,
  ShieldCheck,
  LogOut,
  CheckCircle,
  X
} from 'lucide-react';

export const Sidebar = ({ currentRoute, navigate, isOpen, onClose }) => {
  const { user, logout, switchUser } = useApp();

  const navItems = [
    { name: 'Home', path: '/Home', icon: Home },
    { name: 'Doubts', path: '/Doubts', icon: HelpCircle },
    { name: 'Classes', path: '/Classes', icon: GraduationCap },
    { name: 'Connections', path: '/Connections', icon: Users },
    { name: 'Mentors', path: '/Mentors', icon: Award },
    { name: 'Chat', path: '/Chat', icon: MessageSquare },
    { name: 'Profile', path: '/Profile', icon: User },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 35 }} 
          onClick={onClose} 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon-box">
              <GraduationCap style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <h1 className="brand-title">ConnectMitraa</h1>
              <p className="brand-subtitle">Learn together, grow together</p>
            </div>
          </div>
          {isOpen && (
            <button onClick={onClose} style={{ color: 'var(--muted-foreground)', padding: '0.25rem' }}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute.toLowerCase() === item.path.toLowerCase() || 
                             (item.path === '/Home' && currentRoute === '/');
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{item.name}</span>
              </a>
            );
          })}

          {/* Become a Mentor button (if not verified mentor) */}
          {!user.is_verified_mentor && (
            <a
              href="/BecomeMentor"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/BecomeMentor');
              }}
              className={`nav-item mentor-item ${currentRoute.toLowerCase() === '/becomementor' ? 'active' : ''}`}
            >
              <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Become a Mentor</span>
            </a>
          )}

          {/* Admin Panel button - always available & opens directly on /admin */}
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/admin');
            }}
            className={`nav-item admin-item ${currentRoute.toLowerCase() === '/admin' ? 'active' : ''}`}
          >
            <ShieldCheck style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Admin Panel</span>
          </a>

          {/* Persona Switcher for effortless demo testing */}
          <div style={{ marginTop: 'auto', padding: '0.75rem 0.25rem 0.25rem 0.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Quick Persona Switcher
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => switchUser('student')}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: user.role === 'student' && !user.is_verified_mentor ? 'var(--primary)' : 'var(--secondary)',
                  color: user.role === 'student' && !user.is_verified_mentor ? '#fff' : 'var(--foreground)',
                  fontWeight: 500
                }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => switchUser('usr_2')}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: user.is_verified_mentor && user.role !== 'admin' ? '#10b981' : 'var(--secondary)',
                  color: user.is_verified_mentor && user.role !== 'admin' ? '#fff' : 'var(--foreground)',
                  fontWeight: 500
                }}
              >
                Mentor
              </button>
              <button
                type="button"
                onClick={() => switchUser('admin')}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: user.role === 'admin' ? '#0f172a' : 'var(--secondary)',
                  color: user.role === 'admin' ? '#fff' : 'var(--foreground)',
                  fontWeight: 500
                }}
              >
                Admin
              </button>
            </div>
          </div>
        </nav>

        {/* Profile Card Footer */}
        <div className="sidebar-footer">
          <a
            href="/Profile"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/Profile');
            }}
            className="profile-card-link"
          >
            <div className="avatar-circle">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.full_name} />
              ) : (
                (user.full_name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div className="user-info">
              <div className="user-name-row">
                <span className="user-name">{user.full_name}</span>
                {user.is_verified_mentor && (
                  <CheckCircle 
                    style={{ 
                      width: '0.9rem', 
                      height: '0.9rem', 
                      color: 'var(--accent)', 
                      flexShrink: 0 
                    }} 
                  />
                )}
              </div>
              <p className="user-subtext">
                {user.college || "Complete your profile"}
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={logout}
            className="btn-logout"
          >
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
