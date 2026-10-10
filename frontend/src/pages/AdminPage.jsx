import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  Users,
  Award,
  HelpCircle,
  GraduationCap,
  Save,
  BarChart3,
  MessageSquare,
  Clock,
  LogOut,
  Sliders,
  Check,
  X,
  AlertCircle,
  RotateCcw,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const AdminPage = ({ navigate }) => {
  const {
    allUsers,
    mentorApplications,
    posts,
    doubts,
    classes,
    platformSettings,
    recycleBin,
    approveMentorApplication,
    rejectMentorApplication,
    revokeMentor,
    grantMentor,
    restoreRevokedMentor,
    permanentDeleteRevokedMentor,
    deletePost,
    restorePost,
    permanentDeletePost,
    deleteDoubt,
    restoreDoubt,
    permanentDeleteDoubt,
    cancelClass,
    restoreClass,
    permanentDeleteClass,
    emptyRecycleBin,
    updatePlatformSettings,
    adminLogout,
    showToast
  } = useApp();

  // Active Category State
  const [activeCategory, setActiveCategory] = useState('overview');

  // Search & Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [postSearch, setPostSearch] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('all');
  const [doubtSearch, setDoubtSearch] = useState('');
  const [doubtStatusFilter, setDoubtStatusFilter] = useState('all');
  const [classSearch, setClassSearch] = useState('');
  const [binSearch, setBinSearch] = useState('');
  const [binFilter, setBinFilter] = useState('all'); // 'all' | 'posts' | 'doubts' | 'mentors' | 'classes'

  // Settings State
  const [maxClassPrice, setMaxClassPrice] = useState(platformSettings.max_class_price || 500);
  const [platformFee, setPlatformFee] = useState(platformSettings.platform_fee_percent || 10);
  const [minClasses, setMinClasses] = useState(platformSettings.min_classes_for_paid || 10);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemDetails: '',
    confirmText: 'Delete',
    isDanger: true,
    onConfirm: () => {}
  });

  const openConfirmModal = ({ title, message, itemDetails, confirmText = 'Delete', isDanger = true, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      itemDetails,
      confirmText,
      isDanger,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePlatformSettings({
      max_class_price: parseInt(maxClassPrice),
      platform_fee_percent: parseInt(platformFee),
      min_classes_for_paid: parseInt(minClasses)
    });
  };

  const handleExitToStudentApp = () => {
    if (adminLogout) adminLogout();
    if (navigate) navigate('/Home');
  };

  // Safe Action Triggers with Confirmation Modal
  const handlePromptDeletePost = (post) => {
    openConfirmModal({
      title: 'Move Post to Recycle Bin?',
      message: 'This post will be removed from the student community feed and moved into the Recycle Bin with a 30-day retention guarantee.',
      itemDetails: `"${post.content.slice(0, 90)}${post.content.length > 90 ? '...' : ''}" — by ${post.author_name}`,
      confirmText: 'Move to Recycle Bin',
      isDanger: true,
      onConfirm: () => deletePost(post.id)
    });
  };

  const handlePromptDeleteDoubt = (doubt) => {
    openConfirmModal({
      title: 'Move Doubt to Recycle Bin?',
      message: 'This question will be archived into the Recycle Bin for 30 days before permanent deletion. You can restore it anytime.',
      itemDetails: `[${doubt.subject}] "${doubt.topic}" — asked by ${doubt.author_name}`,
      confirmText: 'Move to Recycle Bin',
      isDanger: true,
      onConfirm: () => deleteDoubt(doubt.id)
    });
  };

  const handlePromptRevokeMentor = (student) => {
    openConfirmModal({
      title: 'Revoke Mentor Privileges?',
      message: 'Are you sure you want to revoke verified mentor status for this user? They will return to standard student privileges and this record will be stored in the Recycle Bin for 30 days.',
      itemDetails: `${student.full_name} (${student.college || 'Student'})`,
      confirmText: 'Confirm Revoke',
      isDanger: true,
      onConfirm: () => revokeMentor(student.id)
    });
  };

  const handlePromptCancelClass = (cls) => {
    openConfirmModal({
      title: 'Cancel Scheduled Class?',
      message: 'This class will be removed from the public schedule and archived in the Recycle Bin for 30 days.',
      itemDetails: `"${cls.title}" — Instructor: ${cls.creator_name}`,
      confirmText: 'Cancel Class',
      isDanger: true,
      onConfirm: () => cancelClass(cls.id)
    });
  };

  const handlePromptPurgeRecord = (nameOrTitle, onPurge) => {
    openConfirmModal({
      title: 'Permanently Purge Record?',
      message: 'Warning: This action is permanent and cannot be undone. The record will be permanently deleted from the database.',
      itemDetails: nameOrTitle,
      confirmText: 'Permanently Purge',
      isDanger: true,
      onConfirm: onPurge
    });
  };

  const handlePromptEmptyBin = () => {
    openConfirmModal({
      title: 'Empty Recycle Bin?',
      message: 'Warning: All deleted posts, doubts, cancelled classes, and archived mentor records will be permanently purged immediately.',
      itemDetails: `${totalBinItems} items will be permanently erased.`,
      confirmText: 'Empty Bin Now',
      isDanger: true,
      onConfirm: emptyRecycleBin
    });
  };

  // Queries
  const pendingAppsCount = mentorApplications.filter((a) => a.status === 'pending').length;

  const totalBinItems =
    (recycleBin?.deletedPosts?.length || 0) +
    (recycleBin?.deletedDoubts?.length || 0) +
    (recycleBin?.revokedMentors?.length || 0) +
    (recycleBin?.cancelledClasses?.length || 0);

  const filteredApps = mentorApplications
    .filter((a) => {
      if (appFilter === 'all') return true;
      return a.status === appFilter;
    })
    .filter((a) => {
      if (!appSearch) return true;
      const q = appSearch.toLowerCase();
      return (
        a.applicant_name?.toLowerCase().includes(q) ||
        a.college?.toLowerCase().includes(q) ||
        a.applicant_email?.toLowerCase().includes(q) ||
        a.skills?.toLowerCase().includes(q)
      );
    });

  const filteredStudents = allUsers.filter(
    (s) =>
      !studentSearch ||
      s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.college?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.branch?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredPosts = posts
    .filter((p) => {
      if (postTypeFilter === 'all') return true;
      return p.post_type === postTypeFilter;
    })
    .filter((p) => {
      if (!postSearch) return true;
      const q = postSearch.toLowerCase();
      return (
        p.content?.toLowerCase().includes(q) ||
        p.author_name?.toLowerCase().includes(q) ||
        p.author_college?.toLowerCase().includes(q)
      );
    });

  const filteredDoubts = doubts
    .filter((d) => {
      if (doubtStatusFilter === 'all') return true;
      return d.status === doubtStatusFilter;
    })
    .filter((d) => {
      if (!doubtSearch) return true;
      const q = doubtSearch.toLowerCase();
      return (
        d.subject?.toLowerCase().includes(q) ||
        d.topic?.toLowerCase().includes(q) ||
        d.question?.toLowerCase().includes(q) ||
        d.author_name?.toLowerCase().includes(q)
      );
    });

  const filteredClasses = classes.filter((c) => {
    if (!classSearch) return true;
    const q = classSearch.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.creator_name?.toLowerCase().includes(q)
    );
  });

  // Recycle Bin Compiled Items
  const binItems = [
    ...(recycleBin?.deletedPosts || []).map((p) => ({
      id: p.id,
      binType: 'post',
      title: `Post by ${p.author_name}`,
      subtitle: p.content,
      tag: p.post_type || 'post',
      deletedAt: p.deleted_at,
      expiresIn: p.expires_in_days || 30,
      original: p
    })),
    ...(recycleBin?.deletedDoubts || []).map((d) => ({
      id: d.id,
      binType: 'doubt',
      title: `[${d.subject}] ${d.topic}`,
      subtitle: d.question,
      tag: d.subject || 'doubt',
      deletedAt: d.deleted_at,
      expiresIn: d.expires_in_days || 30,
      original: d
    })),
    ...(recycleBin?.revokedMentors || []).map((m) => ({
      id: m.id,
      binType: 'mentor',
      title: `${m.full_name} (Revoked Mentor)`,
      subtitle: `${m.college || 'Student'} • ${m.email}`,
      tag: 'Mentor Role',
      deletedAt: m.revoked_at,
      expiresIn: m.expires_in_days || 30,
      original: m
    })),
    ...(recycleBin?.cancelledClasses || []).map((c) => ({
      id: c.id,
      binType: 'class',
      title: c.title,
      subtitle: `Instructor: ${c.creator_name} • ${c.subject}`,
      tag: c.subject || 'class',
      deletedAt: c.cancelled_at,
      expiresIn: c.expires_in_days || 30,
      original: c
    }))
  ];

  const filteredBinItems = binItems
    .filter((item) => {
      if (binFilter === 'all') return true;
      if (binFilter === 'posts') return item.binType === 'post';
      if (binFilter === 'doubts') return item.binType === 'doubt';
      if (binFilter === 'mentors') return item.binType === 'mentor';
      if (binFilter === 'classes') return item.binType === 'class';
      return true;
    })
    .filter((item) => {
      if (!binSearch) return true;
      const q = binSearch.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.tag?.toLowerCase().includes(q)
      );
    });

  // Nav Items
  const adminNavItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3, badge: null },
    { id: 'applications', name: 'Mentor Applications', icon: Award, badge: pendingAppsCount > 0 ? pendingAppsCount : null },
    { id: 'students', name: 'Students', icon: Users, badge: allUsers.length },
    { id: 'posts', name: 'Posts', icon: MessageSquare, badge: posts.length },
    { id: 'doubts', name: 'Doubts', icon: HelpCircle, badge: doubts.length },
    { id: 'classes', name: 'Classes', icon: GraduationCap, badge: classes.length },
    {
      id: 'recycle_bin',
      name: 'Recycle Bin',
      icon: Trash2,
      badge: totalBinItems > 0 ? totalBinItems : null,
      badgeColor: '#ef4444'
    },
    { id: 'settings', name: 'Settings', icon: Sliders, badge: null }
  ];

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* ========================================================
          1. CLEAN WHITE SIDEBAR (MATCHING STUDENT SIDEBAR DESIGN)
          ======================================================== */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--card)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon-box">
              <ShieldCheck style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <h1 className="brand-title">ConnectMitraa</h1>
              <p className="brand-subtitle">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Clean Nav Items List */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCategory(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon style={{ width: '1.15rem', height: '1.15rem' }} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : item.badgeColor
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'var(--secondary)',
                      color: isActive ? '#ffffff' : item.badgeColor || 'var(--foreground)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Exit to Student App */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={handleExitToStudentApp}
            className="btn btn-ghost"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#ef4444',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem'
            }}
          >
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            <span>Exit to Student App</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. MAIN CONTENT AREA
          ======================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <header className="top-navbar">
          <div className="top-navbar-left">
            <span className="top-navbar-greeting">
              {adminNavItems.find((i) => i.id === activeCategory)?.name}
            </span>
            <span className="top-navbar-subgreeting">ConnectMitraa Control Center</span>
          </div>

          <div className="top-corner-profile-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              <span className="presence-dot"></span>
              <span>Online</span>
            </div>

            <div className="top-profile-pill" style={{ cursor: 'default' }}>
              <div
                className="avatar-circle"
                style={{ width: '1.85rem', height: '1.85rem', fontSize: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)' }}
              >
                A
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)' }}>
                  Admin Moderator
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main style={{ padding: '1.5rem 2rem', flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          {/* ========================================================
              VIEW 1: OVERVIEW
              ======================================================== */}
          {activeCategory === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Metric Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        Total Students
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'var(--foreground)' }}>
                        {allUsers.length}
                      </h3>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        Verified Mentors
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'var(--foreground)' }}>
                        {allUsers.filter((u) => u.is_verified_mentor).length}
                      </h3>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        Pending Applications
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: pendingAppsCount > 0 ? '#f59e0b' : 'var(--foreground)' }}>
                        {pendingAppsCount}
                      </h3>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        Peer Doubts
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'var(--foreground)' }}>
                        {doubts.length}
                      </h3>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HelpCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                        Recycle Bin Items
                      </span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: totalBinItems > 0 ? '#ef4444' : 'var(--foreground)' }}>
                        {totalBinItems}
                      </h3>
                    </div>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Mentor Applications Quick Review */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>
                    Pending Mentor Applications ({pendingAppsCount})
                  </h3>
                  {pendingAppsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveCategory('applications')}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      View All Applications →
                    </button>
                  )}
                </div>

                {pendingAppsCount === 0 ? (
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: 0 }}>
                    No pending mentor applications. All reviews are up to date!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {mentorApplications
                      .filter((a) => a.status === 'pending')
                      .slice(0, 3)
                      .map((app) => (
                        <div
                          key={app.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.875rem 1rem',
                            backgroundColor: 'var(--secondary)',
                            borderRadius: 'var(--radius)',
                            gap: '1rem',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                              {app.applicant_name}
                            </strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>
                              {app.college} • {app.skills}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => approveMentorApplication(app.id)}
                              className="btn btn-sm"
                              style={{ backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Check style={{ width: '0.85rem', height: '0.85rem' }} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectMentorApplication(app.id, 'Does not meet requirements')}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <X style={{ width: '0.85rem', height: '0.85rem' }} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 2: MENTOR APPLICATIONS
              ======================================================== */}
          {activeCategory === 'applications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['all', 'pending', 'approved', 'rejected'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`btn btn-sm ${appFilter === f ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setAppFilter(f)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--muted-foreground)' }} />
                  <input
                    type="text"
                    className="input"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search applicant name, college, skills..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                  />
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No mentor applications found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredApps.map((app) => (
                    <div key={app.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>
                              {app.applicant_name}
                            </strong>
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
                          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: '0.2rem 0' }}>
                            {app.applicant_email} • {app.college} ({app.branch})
                          </p>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--foreground)', marginTop: '0.25rem' }}>
                            <strong>Skills:</strong> {app.skills}
                          </div>
                        </div>

                        {app.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => approveMentorApplication(app.id)}
                              className="btn btn-sm"
                              style={{ backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Check style={{ width: '0.85rem', height: '0.85rem' }} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectMentorApplication(app.id, 'Does not meet requirements')}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <X style={{ width: '0.85rem', height: '0.85rem' }} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 3: STUDENTS DIRECTORY
              ======================================================== */}
          {activeCategory === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="Search students by name, college..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Student</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>College</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Role</th>
                      <th style={{ padding: '0.75rem 1rem', color: 'var(--muted-foreground)', fontWeight: 600, textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{s.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--muted-foreground)' }}>
                          {s.college} ({s.branch || 'CSE'})
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge ${s.is_verified_mentor ? 'badge-success' : 'badge-outline'}`}>
                            {s.is_verified_mentor ? 'Verified Mentor' : 'Student'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          {s.is_verified_mentor ? (
                            <button
                              type="button"
                              onClick={() => handlePromptRevokeMentor(s)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            >
                              Revoke Mentor
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => grantMentor(s.id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                            >
                              Grant Mentor ✓
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: COMMUNITY POSTS
              ======================================================== */}
          {activeCategory === 'posts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--muted-foreground)' }} />
                  <input
                    type="text"
                    className="input"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search posts..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                  />
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No posts found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                            {post.author_name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginLeft: '0.5rem' }}>
                            {post.author_college} • {post.created_date || 'Today'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePromptDeletePost(post)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ef4444', padding: '0.25rem 0.5rem' }}
                          title="Delete Post (Move to Recycle Bin)"
                        >
                          <Trash2 style={{ width: '0.9rem', height: '0.9rem' }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0, lineHeight: 1.5 }}>
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 5: DOUBTS MODERATION
              ======================================================== */}
          {activeCategory === 'doubts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="Search doubts..."
                  value={doubtSearch}
                  onChange={(e) => setDoubtSearch(e.target.value)}
                />
              </div>

              {filteredDoubts.length === 0 ? (
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No doubts found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredDoubts.map((doubt) => (
                    <div key={doubt.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="badge badge-outline">{doubt.subject}</span>
                            <span className={`badge ${doubt.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                              {doubt.status}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0 0.15rem 0', color: 'var(--foreground)' }}>
                            {doubt.topic}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            Asked by {doubt.author_name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePromptDeleteDoubt(doubt)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ef4444', padding: '0.25rem 0.5rem' }}
                          title="Delete Doubt (Move to Recycle Bin)"
                        >
                          <Trash2 style={{ width: '0.9rem', height: '0.9rem' }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--foreground)', margin: 0 }}>
                        {doubt.question}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 6: CLASSES OVERSIGHT
              ======================================================== */}
          {activeCategory === 'classes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="Search classes..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
              </div>

              {filteredClasses.length === 0 ? (
                <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No classes found.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {filteredClasses.map((cls) => (
                    <div key={cls.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className="badge badge-outline">{cls.subject}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cls.is_paid ? 'var(--primary)' : '#10b981' }}>
                            {cls.is_paid ? `₹${cls.price}` : 'FREE'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePromptCancelClass(cls)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#ef4444', padding: '0.2rem' }}
                            title="Cancel Class (Move to Recycle Bin)"
                          >
                            <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
                          </button>
                        </div>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem 0', color: 'var(--foreground)' }}>
                        {cls.title}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: 0 }}>
                        Instructor: {cls.creator_name}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          {cls.participants_count || 1} Learners Enrolled
                        </span>
                        <span className="badge badge-success">SCHEDULED</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 7: RECYCLE BIN (SOFT DELETE WITH 30-DAY RETENTION)
              ======================================================== */}
          {activeCategory === 'recycle_bin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Box */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                      Recycle Bin Archive ({totalBinItems})
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: 0 }}>
                      Deleted items are preserved for 30 days before auto-purge. You can restore them anytime.
                    </p>
                  </div>
                  {totalBinItems > 0 && (
                    <button
                      type="button"
                      onClick={handlePromptEmptyBin}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      Empty Entire Bin
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${binFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBinFilter('all')}
                  >
                    All ({totalBinItems})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${binFilter === 'posts' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBinFilter('posts')}
                  >
                    Posts ({recycleBin?.deletedPosts?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${binFilter === 'doubts' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBinFilter('doubts')}
                  >
                    Doubts ({recycleBin?.deletedDoubts?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${binFilter === 'mentors' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBinFilter('mentors')}
                  >
                    Revoked Mentors ({recycleBin?.revokedMentors?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${binFilter === 'classes' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBinFilter('classes')}
                  >
                    Classes ({recycleBin?.cancelledClasses?.length || 0})
                  </button>
                </div>
              </div>

              {/* Items List */}
              {filteredBinItems.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  <Trash2 style={{ width: '2.5rem', height: '2.5rem', color: 'var(--muted-foreground)', margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Recycle Bin is empty</p>
                  <span style={{ fontSize: '0.75rem' }}>No deleted items matching the current filter.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredBinItems.map((item) => (
                    <div key={`${item.binType}_${item.id}`} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: 1, minWidth: '240px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  item.binType === 'post'
                                    ? 'rgba(79, 70, 229, 0.1)'
                                    : item.binType === 'doubt'
                                    ? 'rgba(6, 182, 212, 0.1)'
                                    : item.binType === 'mentor'
                                    ? 'rgba(245, 158, 11, 0.1)'
                                    : 'rgba(139, 92, 246, 0.1)',
                                color:
                                  item.binType === 'post'
                                    ? 'var(--primary)'
                                    : item.binType === 'doubt'
                                    ? '#06b6d4'
                                    : item.binType === 'mentor'
                                    ? '#f59e0b'
                                    : '#8b5cf6',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                textTransform: 'uppercase'
                              }}
                            >
                              {item.binType}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                              Deleted {formatRelativeDate(item.deletedAt)}
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '9999px',
                                fontWeight: 600
                              }}
                            >
                              Auto-purges in {item.expiresIn} days
                            </span>
                          </div>

                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--foreground)' }}>
                            {item.title}
                          </h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.4 }}>
                            {item.subtitle}
                          </p>
                        </div>

                        {/* Restore & Purge Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.binType === 'post') restorePost(item.id);
                              if (item.binType === 'doubt') restoreDoubt(item.id);
                              if (item.binType === 'mentor') restoreRevokedMentor(item.id);
                              if (item.binType === 'class') restoreClass(item.id);
                            }}
                            className="btn btn-sm"
                            style={{ backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <RotateCcw style={{ width: '0.85rem', height: '0.85rem' }} />
                            <span>Restore</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handlePromptPurgeRecord(item.title, () => {
                                if (item.binType === 'post') permanentDeletePost(item.id);
                                if (item.binType === 'doubt') permanentDeleteDoubt(item.id);
                                if (item.binType === 'mentor') permanentDeleteRevokedMentor(item.id);
                                if (item.binType === 'class') permanentDeleteClass(item.id);
                              });
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            title="Permanently Purge Record"
                          >
                            Purge ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 8: PLATFORM SETTINGS
              ======================================================== */}
          {activeCategory === 'settings' && (
            <div className="card" style={{ maxWidth: '520px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: 'var(--foreground)' }}>
                Platform Settings
              </h3>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.8125rem' }}>
                    Max Class Price (₹)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={maxClassPrice}
                    onChange={(e) => setMaxClassPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.8125rem' }}>
                    Platform Commission Fee (%)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.8125rem' }}>
                    Minimum Free Classes Before Paid
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={minClasses}
                    onChange={(e) => setMinClasses(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    padding: '0.625rem'
                  }}
                >
                  <Save style={{ width: '1rem', height: '1rem' }} />
                  <span>Save Settings</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          CONFIRMATION MODAL (SAFE DELETION & REVOCATION)
          ======================================================== */}
      {confirmModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius)',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '9999px',
                  backgroundColor: confirmModal.isDanger ? '#fef2f2' : '#fef3c7',
                  color: confirmModal.isDanger ? '#ef4444' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AlertCircle style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--foreground)' }}>
                  {confirmModal.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                  {confirmModal.message}
                </p>

                {confirmModal.itemDetails && (
                  <div
                    style={{
                      backgroundColor: 'var(--secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '0.625rem 0.875rem',
                      fontSize: '0.8125rem',
                      color: 'var(--foreground)',
                      fontWeight: 500,
                      marginBottom: '1.25rem',
                      wordBreak: 'break-word'
                    }}
                  >
                    {confirmModal.itemDetails}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={closeConfirmModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      backgroundColor: confirmModal.isDanger ? '#ef4444' : 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 600
                    }}
                    onClick={confirmModal.onConfirm}
                  >
                    {confirmModal.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
