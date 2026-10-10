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
  const { user, logout, switchUser, isAdminAuthenticated } = useApp();

  const navItems = [
    { name: 'Home', path: '/Home', icon: Home },
    { name: 'Doubts', path: '/Doubts', icon: HelpCircle },
    { name: 'Classes', path: '/Classes', icon: GraduationCap },
    { name: 'Connections', path: '/Connections', icon: Users },
    { name: 'Mentors', path: '/Mentors', icon: Award },
    { name: 'Chat', path: '/Chat', icon: MessageSquare },
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
          {(() => {
            const cleanRoute = (currentRoute.split('?')[0] || '').toLowerCase();
            return (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const itemPath = item.path.toLowerCase();
                  const isActive = cleanRoute === itemPath || (itemPath === '/home' && (cleanRoute === '/' || cleanRoute === ''));
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
                    className={`nav-item mentor-item ${cleanRoute === '/becomementor' ? 'active' : ''}`}
                  >
                    <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Become a Mentor</span>
                  </a>
                )}

              </>
            );
          })()}

          {/* Persona Switcher for effortless demo testing (Student & Peer Mentor only) */}
          <div style={{ marginTop: 'auto', padding: '0.75rem 0.25rem 0.75rem 0.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Switch Persona
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                type="button"
                onClick={() => {
                  switchUser('student');
                  handleNav('/Home');
                }}
                style={{
                  flex: 1,
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius)',
                  background: user.role === 'student' && !user.is_verified_mentor ? 'var(--primary)' : 'var(--secondary)',
                  color: user.role === 'student' && !user.is_verified_mentor ? '#fff' : 'var(--foreground)',
                  fontWeight: 600,
                  border: '1px solid var(--border)'
                }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUser('usr_2');
                  handleNav('/Home');
                }}
                style={{
                  flex: 1,
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius)',
                  background: user.is_verified_mentor ? '#10b981' : 'var(--secondary)',
                  color: user.is_verified_mentor ? '#fff' : 'var(--foreground)',
                  fontWeight: 600,
                  border: '1px solid var(--border)'
                }}
              >
                Mentor ✓
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
