import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  ExternalLink,
  Trash2,
  Settings,
  Users,
  Award,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Save,
  Check,
  X
} from 'lucide-react';

export const AdminPage = () => {
  const {
    allUsers,
    mentorApplications,
    posts,
    doubts,
    classes,
    platformSettings,
    approveMentorApplication,
    rejectMentorApplication,
    toggleStudentVerification,
    deletePost,
    deleteDoubt,
    updatePlatformSettings,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('applications');
  const [studentSearch, setStudentSearch] = useState('');
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  // Settings State
  const [maxClassPrice, setMaxClassPrice] = useState(platformSettings.max_class_price || 500);
  const [platformFee, setPlatformFee] = useState(platformSettings.platform_fee_percent || 10);
  const [minClasses, setMinClasses] = useState(platformSettings.min_classes_for_paid || 10);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePlatformSettings({
      max_class_price: parseInt(maxClassPrice),
      platform_fee_percent: parseInt(platformFee),
      min_classes_for_paid: parseInt(minClasses)
    });
  };

  const handleRejectConfirm = (appId) => {
    rejectMentorApplication(appId, rejectNotes);
    setRejectingAppId(null);
    setRejectNotes('');
  };

  const filteredStudents = allUsers.filter(
    (s) =>
      !studentSearch ||
      s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.college?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="page-container wide">
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ShieldCheck style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Admin Panel</h1>
          <p className="page-description" style={{ margin: 0 }}>
            Moderate community, review applications, and configure platform settings
          </p>
        </div>
      </div>

      {/* Admin Tabs Bar matching exact studentconnect tabs */}
      <div className="tabs-header" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Mentor Applications ({mentorApplications.filter((a) => a.status === 'pending').length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students ({allUsers.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'doubts' ? 'active' : ''}`}
          onClick={() => setActiveTab('doubts')}
        >
          Doubts ({doubts.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          Classes ({classes.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* 1. MENTOR APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mentorApplications.length === 0 ? (
            <div className="card">
              <div className="card-content" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>No mentor applications submitted yet</p>
              </div>
            </div>
          ) : (
            mentorApplications.map((app) => (
              <div key={app.id} className="card">
                <div className="card-content" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)' }}>
                          {app.applicant_name}
                        </h3>
                        <span
                          className={`badge ${
                            app.status === 'approved'
                              ? 'badge-success'
                              : app.status === 'rejected'
                              ? 'badge-outline'
                              : 'badge-warning'
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                        {app.applicant_email} • {app.college} ({app.branch}, {app.year})
                      </p>
                    </div>

                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => approveMentorApplication(app.id)}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          <Check style={{ width: '0.85rem', height: '0.85rem' }} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingAppId(app.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#ef4444', borderColor: '#ef4444' }}
                        >
                          <X style={{ width: '0.85rem', height: '0.85rem' }} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem', backgroundColor: 'var(--secondary)', padding: '0.875rem', borderRadius: 'var(--radius)', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Skills to teach: </span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{app.skills}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Subjects: </span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{app.subjects}</span>
                    </div>
                    {app.teaching_experience && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Experience: </span>
                        <span style={{ color: 'var(--muted-foreground)' }}>{app.teaching_experience}</span>
                      </div>
                    )}
                  </div>

                  {/* Links & Attachments */}
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                    {app.github_url && (
                      <a href={app.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} /> GitHub
                      </a>
                    )}
                    {app.portfolio_url && (
                      <a href={app.portfolio_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} /> Portfolio
                      </a>
                    )}
                    <span style={{ color: 'var(--muted-foreground)' }}>Resume: {app.resume_file}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>ID Proof: {app.student_id_file}</span>
                  </div>

                  {/* Reject Modal / Input */}
                  {rejectingAppId === app.id && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius)', border: '1px solid #fecaca' }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#b91c1c', marginBottom: '0.25rem' }}>
                        Provide Reason for Rejection
                      </p>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Please upload clear institutional student ID card"
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setRejectingAppId(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectConfirm(app.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. STUDENTS TAB */}
      {activeTab === 'students' && (
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem', maxWidth: '24rem' }}>
            <Search
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '0.9rem',
                height: '0.9rem',
                color: 'var(--muted-foreground)'
              }}
            />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredStudents.map((stu) => (
              <div key={stu.id} className="card">
                <div className="card-content" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar-circle">
                      {(stu.full_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                          {stu.full_name}
                        </span>
                        {stu.is_verified_mentor && (
                          <CheckCircle style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent)' }} />
                        )}
                        <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          {stu.role}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        {stu.email} • {stu.college} ({stu.branch})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStudentVerification(stu.id)}
                    className="btn btn-outline btn-sm"
                    style={{
                      borderColor: stu.is_verified_mentor ? '#10b981' : 'var(--border)',
                      color: stu.is_verified_mentor ? '#059669' : 'inherit'
                    }}
                  >
                    {stu.is_verified_mentor ? 'Verified Mentor ✓' : 'Mark as Verified'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POSTS MODERATION TAB */}
      {activeTab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="card-content" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                      {post.author_name}
                    </span>
                    <span className="badge badge-outline">{post.post_type}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--foreground)', lineHeight: 1.4 }}>
                    {post.content}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deletePost(post.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#ef4444' }}
                  title="Delete post"
                >
                  <Trash2 style={{ width: '0.9rem', height: '0.9rem' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. DOUBTS MODERATION TAB */}
      {activeTab === 'doubts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {doubts.map((doubt) => (
            <div key={doubt.id} className="card">
              <div className="card-content" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-secondary">{doubt.subject}</span>
                    <span className="badge badge-outline">{doubt.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--foreground)', fontWeight: 500 }}>
                    {doubt.question}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                    by {doubt.author_name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDoubt(doubt.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#ef4444' }}
                  title="Delete doubt"
                >
                  <Trash2 style={{ width: '0.9rem', height: '0.9rem' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. CLASSES MODERATION TAB */}
      {activeTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {classes.map((cls) => (
            <div key={cls.id} className="card">
              <div className="card-content" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {cls.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    by {cls.creator_name} • {cls.subject} • {cls.scheduled_date}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cls.is_paid && (
                    <span className="badge badge-warning">₹{cls.price}</span>
                  )}
                  <span className="badge badge-outline">{cls.class_type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '30rem' }}>
          <div className="card-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Settings style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)' }}>
                Platform Settings
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Maximum Class Price (₹)</label>
                <input
                  type="number"
                  className="input"
                  value={maxClassPrice}
                  onChange={(e) => setMaxClassPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Platform Fee (%)</label>
                <input
                  type="number"
                  className="input"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Minimum Classes for Paid Teaching</label>
                <input
                  type="number"
                  className="input"
                  value={minClasses}
                  onChange={(e) => setMinClasses(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Save style={{ width: '0.85rem', height: '0.85rem' }} />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
