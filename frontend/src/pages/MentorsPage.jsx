import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Search,
  Star,
  CheckCircle,
  GraduationCap,
  BookOpen,
  UserPlus,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const MentorsPage = ({ navigate }) => {
  const { user, allUsers, sendConnectionRequest, connections } = useApp();
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Mentors filter
  const mentors = allUsers.filter((u) => {
    const isMentor = u.is_verified_mentor || u.is_mentor || u.role === 'mentor';
    if (!isMentor) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(term) ||
      u.college?.toLowerCase().includes(term) ||
      u.skills?.some((s) => s.toLowerCase().includes(term)) ||
      u.subjects?.some((s) => s.toLowerCase().includes(term))
    );
  });

  const isConnected = (mentorId) => {
    return connections.some(
      (c) =>
        c.status === 'accepted' &&
        ((c.requester_id === user.id && c.receiver_id === mentorId) ||
          (c.receiver_id === user.id && c.requester_id === mentorId))
    );
  };

  const isPending = (mentorId) => {
    return connections.some(
      (c) => c.status === 'pending' && c.requester_id === user.id && c.receiver_id === mentorId
    );
  };

  return (
    <div className="page-container wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Mentors</h1>
          <p className="page-description">Learn from verified student mentors with proven track records</p>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '30rem' }}>
        <Search
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1rem',
            height: '1rem',
            color: 'var(--muted-foreground)'
          }}
        />
        <input
          type="text"
          className="input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Search by name, skill, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mentors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {mentors.map((mentor) => (
          <div key={mentor.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-content" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Profile Top */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                <div className="avatar-circle" style={{ width: '2.75rem', height: '2.75rem', fontSize: '1.125rem' }}>
                  {(mentor.full_name || 'M').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                      {mentor.full_name}
                    </span>
                    <CheckCircle style={{ width: '0.95rem', height: '0.95rem', color: 'var(--accent)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {mentor.college}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {mentor.branch}
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--secondary)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.875rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b45309' }}>
                  <Star style={{ width: '0.85rem', height: '0.85rem', fill: '#f59e0b', color: '#f59e0b' }} />
                  <span>{mentor.rating || '4.9'}</span>
                </div>
                <div style={{ color: 'var(--muted-foreground)' }}>•</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--foreground)' }}>
                  <GraduationCap style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary)' }} />
                  <span>{mentor.completed_classes || 0} classes</span>
                </div>
              </div>

              {/* Bio snippet */}
              {mentor.bio && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.4,
                    marginBottom: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {mentor.bio}
                </p>
              )}

              {/* Skills Tags */}
              {mentor.skills && mentor.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
                  {mentor.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      {skill}
                    </span>
                  ))}
                  {mentor.skills.length > 4 && (
                    <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                      +{mentor.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(mentor)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  View Profile
                </button>

                {mentor.id !== user.id && (
                  isConnected(mentor.id) ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/Chat?user=${mentor.id}&name=${encodeURIComponent(mentor.full_name)}`)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
                      Chat
                    </button>
                  ) : isPending(mentor.id) ? (
                    <button
                      type="button"
                      disabled
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Requested
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => sendConnectionRequest(mentor.id)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <UserPlus style={{ width: '0.85rem', height: '0.85rem' }} />
                      Connect
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <div className="modal-overlay">
          <div className="modal-content wide">
            <div className="modal-header">
              <h2 className="modal-title">Mentor Profile</h2>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="modal-close"
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="avatar-circle" style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.5rem' }}>
                  {(selectedMentor.full_name || 'M').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)' }}>
                      {selectedMentor.full_name}
                    </h3>
                    <CheckCircle style={{ width: '1.125rem', height: '1.125rem', color: 'var(--accent)' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    {selectedMentor.college} • {selectedMentor.branch} ({selectedMentor.year || 'Student'})
                  </p>
                </div>
              </div>

              {/* Metrics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <Star style={{ width: '1rem', height: '1rem', fill: '#f59e0b', color: '#f59e0b' }} />
                    {selectedMentor.rating || 4.9}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Rating</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {selectedMentor.completed_classes || 0}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Classes Conducted</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent)' }}>
                    Verified
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Status</div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.375rem' }}>
                  About Mentor
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.5 }}>
                  {selectedMentor.bio || 'Verified peer mentor dedicated to helping fellow engineering students.'}
                </p>
              </div>

              {/* Skills and Subjects */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                  Skills You Can Learn
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {(selectedMentor.skills || []).map((sk) => (
                    <span key={sk} className="badge badge-secondary">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {selectedMentor.subjects && selectedMentor.subjects.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    Subjects Taught
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {selectedMentor.subjects.map((sub) => (
                      <span key={sub} className="badge badge-outline">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {(selectedMentor.github_url || selectedMentor.portfolio_url) && (
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
                  {selectedMentor.github_url && (
                    <a
                      href={selectedMentor.github_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                      GitHub Profile
                    </a>
                  )}
                  {selectedMentor.portfolio_url && (
                    <a
                      href={selectedMentor.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                      Portfolio
                    </a>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {selectedMentor.id !== user.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isConnected(selectedMentor.id)) {
                        setSelectedMentor(null);
                        navigate(`/Chat?user=${selectedMentor.id}&name=${encodeURIComponent(selectedMentor.full_name)}`);
                      } else {
                        sendConnectionRequest(selectedMentor.id);
                        setSelectedMentor(null);
                      }
                    }}
                    className="btn btn-primary"
                  >
                    {isConnected(selectedMentor.id) ? 'Chat with Mentor' : 'Send Connection Request'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
