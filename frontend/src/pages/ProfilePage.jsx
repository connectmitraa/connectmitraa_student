import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Edit3,
  X,
  Save,
  Github,
  Globe
} from 'lucide-react';

export const ProfilePage = ({ navigate }) => {
  const { user, classes, doubts, updateProfile } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(user.full_name || '');
  const [college, setCollege] = useState(user.college || '');
  const [branch, setBranch] = useState(user.branch || '');
  const [year, setYear] = useState(user.year || '3rd Year');
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState((user.skills || []).join(', '));
  const [githubUrl, setGithubUrl] = useState(user.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolio_url || '');

  const userClasses = classes.filter((c) => c.creator_id === user.id);
  const userDoubts = doubts.filter((d) => d.user_id === user.id);

  const handleOpenEdit = () => {
    setFullName(user.full_name || '');
    setCollege(user.college || '');
    setBranch(user.branch || '');
    setYear(user.year || '3rd Year');
    setBio(user.bio || '');
    setSkills((user.skills || []).join(', '));
    setGithubUrl(user.github_url || '');
    setPortfolioUrl(user.portfolio_url || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      college: college.trim(),
      branch: branch.trim(),
      year,
      bio: bio.trim(),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: githubUrl.trim(),
      portfolio_url: portfolioUrl.trim()
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '44rem' }}>
      {/* Header Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-content" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                className="avatar-circle"
                style={{ width: '4rem', height: '4rem', fontSize: '1.75rem', borderRadius: '1rem' }}
              >
                {(user.full_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
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

            <button
              type="button"
              onClick={handleOpenEdit}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Edit3 style={{ width: '0.85rem', height: '0.85rem' }} />
              Edit Profile
            </button>
          </div>

          {user.bio && (
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {user.bio}
            </p>
          )}

          {/* Social / External Links */}
          {(user.github_url || user.portfolio_url) && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
              {user.github_url && (
                <a
                  href={user.github_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Github style={{ width: '0.9rem', height: '0.9rem' }} />
                  GitHub
                </a>
              )}
              {user.portfolio_url && (
                <a
                  href={user.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Globe style={{ width: '0.9rem', height: '0.9rem' }} />
                  Portfolio
                </a>
              )}
            </div>
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '32rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="modal-close"
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">College</label>
                  <input
                    type="text"
                    className="input"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Branch</label>
                  <input
                    type="text"
                    className="input"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Year of Study</label>
                <select
                  className="select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio about yourself..."
                />
              </div>

              <div>
                <label className="label">Skills (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Java, Spring Boot, React, Python"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">GitHub URL</label>
                  <input
                    type="url"
                    className="input"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="label">Portfolio URL</label>
                  <input
                    type="url"
                    className="input"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!fullName.trim()}
                >
                  <Save style={{ width: '0.85rem', height: '0.85rem' }} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
