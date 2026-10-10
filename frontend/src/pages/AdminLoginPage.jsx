import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import {
  getAdminSecretSlug,
  DEMO_ADMIN_CREDENTIALS
} from '../services/supabaseAuth';

export const AdminLoginPage = ({ navigate }) => {
  const { adminLogin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Invalid credentials. Please verify your email and password.');
      } else {
        if (navigate) {
          navigate(getAdminSecretSlug());
        }
      }
    } catch (err) {
      setErrorMsg('Unexpected server error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail(DEMO_ADMIN_CREDENTIALS.email);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setErrorMsg('');
    setLoading(true);
    try {
      const result = await adminLogin(
        DEMO_ADMIN_CREDENTIALS.email,
        DEMO_ADMIN_CREDENTIALS.password
      );
      if (result.success && navigate) {
        navigate(getAdminSecretSlug());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden'
        }}
      >
        {/* Simple Clean Header */}
        <div
          style={{
            padding: '2rem 1.5rem 1.25rem 1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto'
            }}
          >
            <ShieldCheck style={{ width: '1.75rem', height: '1.75rem' }} />
          </div>

          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--foreground)' }}>
            Admin Login
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: 0 }}>
            ConnectMitraa Administration
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Quick Demo Helper Button */}
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn btn-outline btn-sm"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem'
              }}
            >
              <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }} />
              <span>1-Click Demo Admin Sign-In</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius)',
                padding: '0.625rem 0.875rem',
                color: '#dc2626',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                <Mail style={{ width: '0.85rem', height: '0.85rem' }} />
                Email
              </label>
              <input
                type="text"
                className="input"
                placeholder="admin@connectmitraa.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                <Lock style={{ width: '0.85rem', height: '0.85rem' }} />
                Password
              </label>
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
              disabled={loading || !email.trim() || !password.trim()}
              className="btn btn-primary"
              style={{
                padding: '0.625rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.25rem'
              }}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </>
              )}
            </button>
          </form>

          {/* Clean Return Link */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate && navigate('/Home')}
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Back to Student App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
