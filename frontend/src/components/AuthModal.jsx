import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, X, Mail, Lock, User, School, BookOpen } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, signup } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('student');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (!email.trim()) return;
      login(email, password);
    } else {
      signup({
        email,
        password,
        full_name: fullName,
        college,
        branch,
        role
      });
    }
  };

  const handleGoogleLogin = () => {
    // Instant self-contained Google login without requiring external keys
    login('student.google@connectmitraa.edu', 'google_mock_pwd');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '28rem' }}>
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="modal-close"
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        <div className="modal-body" style={{ padding: '2rem 1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              className="logo-icon-box"
              style={{
                width: '3rem',
                height: '3rem',
                margin: '0 auto 0.75rem auto',
                borderRadius: '0.875rem'
              }}
            >
              <GraduationCap style={{ width: '1.75rem', height: '1.75rem' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>
              {authMode === 'login' ? 'Welcome to ConnectMitraa' : 'Create an Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              {authMode === 'login'
                ? 'Sign in to access peer classes and live doubt rooms'
                : 'Join our peer-to-peer collaborative learning network'}
            </p>
          </div>

          {/* Self-contained Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.625rem',
              fontWeight: 600,
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.25rem 0',
              color: 'var(--muted-foreground)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ padding: '0 0.75rem' }}>or email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="label">Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Hemadri Kaligiri"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label className="label">College</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. VIT"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Branch</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. CSE"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                className="input"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.625rem' }}
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {authMode === 'login' ? (
              <p style={{ color: 'var(--muted-foreground)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p style={{ color: 'var(--muted-foreground)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
