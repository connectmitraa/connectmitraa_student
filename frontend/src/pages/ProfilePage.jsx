import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ProfilePage = ({ navigate }) => {
  const { user, classes, doubts } = useApp();

  const userClasses = classes.filter((c) => c.creator_id === user.id);
  const userDoubts = doubts.filter((d) => d.user_id === user.id);

  return (
    <div className="page-container" style={{ maxWidth: '44rem' }}>
      {/* Header Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-content" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div
              className="avatar-circle"
              style={{ width: '4rem', height: '4rem', fontSize: '1.75rem', borderRadius: '1rem' }}
            >
              {(user.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  {user.full_name}
                </h2>
                {user.is_verified_mentor && (
                  <CheckCircle style={{ width: '1.125rem', height: '1.125rem', color: 'var(--accent)' }} />
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
                {user.college || 'Engineering Student'} • {user.branch || 'CSE'} ({user.year || '3rd Year'})
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </span>
                {user.is_verified_mentor && (
                  <span className="badge badge-success">
                    Verified Mentor
                  </span>
                )}
              </div>
            </div>
          </div>

          {user.bio && (
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {user.bio}
            </p>
          )}

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                {userClasses.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Classes Created</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                {userDoubts.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Doubts Asked</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b45309' }}>
                {user.rating || 5.0} ⭐
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Peer Rating</div>
            </div>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.375rem' }}>
                Skills & Technologies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {user.skills.map((s) => (
                  <span key={s} className="badge badge-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            {!user.is_verified_mentor ? (
              <button
                type="button"
                onClick={() => navigate('/BecomeMentor')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Sparkles style={{ width: '1rem', height: '1rem' }} />
                Apply for Mentor Verification
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/Classes')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <GraduationCap style={{ width: '1rem', height: '1rem' }} />
                Schedule Peer Class
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
