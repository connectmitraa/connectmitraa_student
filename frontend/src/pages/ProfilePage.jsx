import React, { useState, useEffect } from 'react';
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
  Globe,
  Linkedin,
  FileText,
  Code,
  Briefcase,
  MapPin,
  Mail,
  Share2,
  MessageSquare,
  UserPlus,
  Check,
  Plus,
  Trash2,
  Star,
  Users,
  Layers,
  Terminal,
  Download,
  ArrowLeft,
  Flame,
  Trophy,
  Activity,
  Search,
  Eye,
  Building,
  Clock,
  Compass,
  SlidersHorizontal,
  ThumbsUp,
  Bookmark
} from 'lucide-react';

export const ProfilePage = ({ navigate, currentRoute }) => {
  const {
    user,
    allUsers,
    classes,
    doubts,
    posts,
    connections,
    sendConnectionRequest,
    acceptConnection,
    updateProfile,
    showToast,
    getUserProfile,
    switchUser
  } = useApp();

  // 1. Resolve Target User Profile (My Profile vs Public Peer Profile)
  const searchParams = new URLSearchParams(
    currentRoute && currentRoute.includes('?')
      ? currentRoute.substring(currentRoute.indexOf('?'))
      : window.location.search
  );
  const targetUserParam = searchParams.get('user') || searchParams.get('id');
  const profileUser = targetUserParam ? getUserProfile(targetUserParam) : user;
  const isOwner = profileUser.id === user.id;

  // Preview Mode Toggle for Owner (see how other students see their profile)
  const [isPreviewAsVisitor, setIsPreviewAsVisitor] = useState(false);
  const effectiveIsOwner = isOwner && !isPreviewAsVisitor;

  // 2. Navigation search bar state inside top bar
  const [peerSearchQuery, setPeerSearchQuery] = useState('');
  const [peerSearchResults, setPeerSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 3. Connection State with target user
  const isConnected = connections.some(
    (c) =>
      ((c.requester_id === user.id && c.receiver_id === profileUser.id) ||
       (c.requester_id === profileUser.id && c.receiver_id === user.id)) &&
      c.status === 'accepted'
  );
  const isPendingConnection = connections.some(
    (c) =>
      c.requester_id === user.id &&
      c.receiver_id === profileUser.id &&
      c.status === 'pending'
  );

  // 4. Activity Statistics & Posts
  const userClasses = classes.filter((c) => c.creator_id === profileUser.id);
  const userDoubts = doubts.filter((d) => d.user_id === profileUser.id);
  const userPosts = posts ? posts.filter((p) => p.user_id === profileUser.id || p.author_name === profileUser.full_name) : [];
  const userConnectionsCount = connections.filter(
    (c) =>
      (c.requester_id === profileUser.id || c.receiver_id === profileUser.id) &&
      c.status === 'accepted'
  ).length;

  // 5. Endorsements local state for interactive clicks
  const [endorsedSkills, setEndorsedSkills] = useState({});

  // 6. Active in-page section tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'experience' | 'education' | 'achievements' | 'skills' | 'activity'

  // 7. Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('basic'); // 'basic' | 'resume' | 'social' | 'projects' | 'experience' | 'education' | 'achievements' | 'skills'

  // Editable Form Fields
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Resume & Career Preferences
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer / SDE-1');
  const [preferredLocations, setPreferredLocations] = useState('Bengaluru, Hyderabad, Chennai, Remote');
  const [availability, setAvailability] = useState('Immediate / 2026 Batch');
  const [jobType, setJobType] = useState('Full-time & Internship');

  // Social & Coding Profiles
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [leetcodeUrl, setLeetcodeUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Skills
  const [skills, setSkills] = useState('');
  const [subjects, setSubjects] = useState('');
  const [wantsToLearn, setWantsToLearn] = useState('');

  // Arrays
  const [projectsList, setProjectsList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);

  // Form Sub-states for Adding items
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '', description: '', location: '' });
  const [newEdu, setNewEdu] = useState({ degree: '', college: '', duration: '', grade: '' });
  const [newAch, setNewAch] = useState({ title: '', issuer: '', date: '', description: '' });

  // Open Edit Modal with Pre-populated Profile
  const handleOpenEditModal = () => {
    setFullName(profileUser.full_name || '');
    setHeadline(profileUser.headline || '');
    setCollege(profileUser.college || '');
    setBranch(profileUser.branch || '');
    setYear(profileUser.year || '3rd Year');
    setLocation(profileUser.location || '');
    setBio(profileUser.bio || '');

    setResumeUrl(profileUser.resume_url || '');
    setResumeName(profileUser.resume_name || `${(profileUser.full_name || 'Student').replace(/\s+/g, '_')}_Resume.pdf`);
    setTargetRole(profileUser.target_role || 'Full Stack Software Engineer / SDE-1');
    setPreferredLocations(profileUser.preferred_locations || 'Bengaluru, Hyderabad, Chennai, Remote');
    setAvailability(profileUser.availability || 'Immediate / 2026 Batch');
    setJobType(profileUser.job_type || 'Full-time & Internship');

    setGithubUrl(profileUser.github_url || '');
    setLinkedinUrl(profileUser.linkedin_url || '');
    setLeetcodeUrl(profileUser.leetcode_url || '');
    setPortfolioUrl(profileUser.portfolio_url || '');

    setSkills(Array.isArray(profileUser.skills) ? profileUser.skills.join(', ') : (profileUser.skills || ''));
    setSubjects(Array.isArray(profileUser.subjects) ? profileUser.subjects.join(', ') : (profileUser.subjects || ''));
    setWantsToLearn(Array.isArray(profileUser.wants_to_learn) ? profileUser.wants_to_learn.join(', ') : (profileUser.wants_to_learn || ''));

    setProjectsList(Array.isArray(profileUser.projects) ? [...profileUser.projects] : []);
    setExperienceList(Array.isArray(profileUser.experience) ? [...profileUser.experience] : []);
    setEducationList(Array.isArray(profileUser.education) ? [...profileUser.education] : []);
    setAchievementsList(Array.isArray(profileUser.achievements) ? [...profileUser.achievements] : []);

    setIsEditModalOpen(true);
  };

  // Save changes to AppContext and localStorage
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const parseList = (str) =>
      str
        ? str
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const updatedProfile = {
      full_name: fullName.trim() || profileUser.full_name,
      headline: headline.trim(),
      college: college.trim(),
      branch: branch.trim(),
      year: year.trim(),
      location: location.trim(),
      bio: bio.trim(),

      resume_url: resumeUrl.trim(),
      resume_name: resumeName.trim() || `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      target_role: targetRole.trim(),
      preferred_locations: preferredLocations.trim(),
      availability: availability.trim(),
      job_type: jobType.trim(),

      github_url: githubUrl.trim(),
      linkedin_url: linkedinUrl.trim(),
      leetcode_url: leetcodeUrl.trim(),
      portfolio_url: portfolioUrl.trim(),

      skills: parseList(skills),
      subjects: parseList(subjects),
      wants_to_learn: parseList(wantsToLearn),

      projects: projectsList,
      experience: experienceList,
      education: educationList,
      achievements: achievementsList
    };

    updateProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  // Add Item Helpers
  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    const projectItem = {
      id: `proj_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      tech_stack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: newProject.githubUrl.trim(),
      live_url: newProject.liveUrl.trim()
    };
    setProjectsList([projectItem, ...projectsList]);
    setNewProject({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
  };

  const handleAddExperience = () => {
    if (!newExp.role.trim() || !newExp.company.trim()) return;
    const expItem = {
      id: `exp_${Date.now()}`,
      role: newExp.role.trim(),
      company: newExp.company.trim(),
      duration: newExp.duration.trim() || '2025 - Present',
      location: newExp.location.trim() || 'Remote',
      description: newExp.description.trim()
    };
    setExperienceList([expItem, ...experienceList]);
    setNewExp({ role: '', company: '', duration: '', description: '', location: '' });
  };

  const handleAddEducation = () => {
    if (!newEdu.degree.trim() || !newEdu.college.trim()) return;
    const eduItem = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree.trim(),
      college: newEdu.college.trim(),
      duration: newEdu.duration.trim() || '2022 - 2026',
      grade: newEdu.grade.trim() || 'CGPA: 8.5 / 10.0'
    };
    setEducationList([eduItem, ...educationList]);
    setNewEdu({ degree: '', college: '', duration: '', grade: '' });
  };

  const handleAddAchievement = () => {
    if (!newAch.title.trim()) return;
    const achItem = {
      id: `ach_${Date.now()}`,
      title: newAch.title.trim(),
      issuer: newAch.issuer.trim(),
      date: newAch.date.trim() || '2025',
      description: newAch.description.trim()
    };
    setAchievementsList([achItem, ...achievementsList]);
    setNewAch({ title: '', issuer: '', date: '', description: '' });
  };

  const handleShareProfile = () => {
    const shareableUrl = `${window.location.origin}/Profile?user=${profileUser.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      showToast(`🔗 Copied ${profileUser.full_name}'s public profile link to clipboard!`);
    } else {
      showToast(`Profile Link: ${shareableUrl}`);
    }
  };

  const handleEndorse = (skillName) => {
    setEndorsedSkills((prev) => ({
      ...prev,
      [skillName]: (prev[skillName] || 0) + 1
    }));
    showToast(`You endorsed ${profileUser.full_name.split(' ')[0]} for ${skillName}! ⭐`);
  };

  // Peer search filter
  useEffect(() => {
    if (!peerSearchQuery.trim()) {
      setPeerSearchResults([]);
    } else {
      const q = peerSearchQuery.toLowerCase();
      const filtered = allUsers.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.college?.toLowerCase().includes(q) ||
          u.skills?.some((s) => s.toLowerCase().includes(q))
      );
      setPeerSearchResults(filtered.slice(0, 5));
    }
  }, [peerSearchQuery, allUsers]);

  // Generate 52 weeks of mock heatmap data (LeetCode / GitHub style)
  const heatmapWeeks = 52;
  const daysPerWeek = 7;
  // Deterministic seed based on user id for realistic looking heatmap
  const getContributionLevel = (weekIndex, dayIndex) => {
    const pseudoRandom = Math.sin(weekIndex * 7 + dayIndex + (profileUser.id === 'usr_2' ? 3 : 1)) * 10000;
    const val = Math.floor(Math.abs(pseudoRandom)) % 10;
    if (val < 4) return 0; // no activity
    if (val < 7) return 1; // light green
    if (val < 9) return 2; // medium green
    return 3; // deep green
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Other students for "Recommended Peers" column
  const otherPeers = allUsers.filter((u) => u.id !== profileUser.id && u.id !== user.id).slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      {/* ========================================================= */}
      {/* 1. DEDICATED FULL-PAGE TOP NAVIGATION BAR                 */}
      {/* ========================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.625rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Left Brand & Return Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              type="button"
              onClick={() => navigate('/Home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Return to StudyLoop Live Feed"
            >
              <ArrowLeft style={{ width: '0.95rem', height: '0.95rem' }} />
              <span>Back to Feed</span>
            </button>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => navigate('/Home')}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <GraduationCap style={{ width: '1.2rem', height: '1.2rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  ConnectMitraa
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Portfolio Portal
                </span>
              </div>
            </div>
          </div>

          {/* Center Peer Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '420px', display: 'none', minWidth: '240px' }} className="d-md-block">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                gap: '0.5rem'
              }}
            >
              <Search style={{ width: '0.9rem', height: '0.9rem', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search peers by name, skills, or college..."
                value={peerSearchQuery}
                onChange={(e) => setPeerSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '0.8125rem',
                  color: '#1e293b'
                }}
              />
              {peerSearchQuery && (
                <button
                  type="button"
                  onClick={() => setPeerSearchQuery('')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                >
                  <X style={{ width: '0.85rem', height: '0.85rem' }} />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && peerSearchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.35rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  zIndex: 50,
                  overflow: 'hidden'
                }}
              >
                {peerSearchResults.map((peer) => (
                  <div
                    key={peer.id}
                    onClick={() => {
                      navigate(`/Profile?user=${peer.id}`);
                      setPeerSearchQuery('');
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {(peer.full_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>{peer.full_name}</span>
                        {peer.is_verified_mentor && <CheckCircle style={{ width: '0.75rem', height: '0.75rem', color: '#10b981' }} />}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                        {peer.college || 'Peer Student'} • {peer.branch}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Controls: Persona Switcher & Quick Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Quick Switch Persona Tool */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <select
                aria-label="Switch Active Persona"
                value={user.id}
                onChange={(e) => {
                  switchUser(e.target.value);
                  showToast(`Switched active session to ${allUsers.find((u) => u.id === e.target.value)?.full_name}`);
                }}
                style={{
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <option value="usr_1">👤 Hemadri Kaligiri (VIT)</option>
                <option value="usr_2">👤 Aarav Sharma (IIT Madras)</option>
                <option value="usr_3">👤 Priya Patel (BITS Pilani)</option>
                <option value="usr_4">👤 Rohan Verma (DTU)</option>
                <option value="usr_admin">🛡️ Admin Moderator</option>
              </select>
            </div>

            {/* Share Profile Button */}
            <button
              type="button"
              onClick={handleShareProfile}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.7rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
              title="Share profile link"
            >
              <Share2 style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Share</span>
            </button>

            {/* Top Bar Quick Action: Edit Profile (if owner) */}
            {effectiveIsOwner && (
              <button
                type="button"
                onClick={handleOpenEditModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(79, 70, 229, 0.2)'
                }}
              >
                <Edit3 style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>Edit Profile</span>
              </button>
            )}

            {/* Top Bar Quick Action: Connect & Message (if visitor) */}
            {!effectiveIsOwner && (
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/Chat?user=${profileUser.id}&name=${encodeURIComponent(profileUser.full_name)}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #4f46e5',
                    color: '#4f46e5',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
                  <span>Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendConnectionRequest(profileUser.id)}
                  disabled={isConnected || isPendingConnection}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    backgroundColor: isConnected ? '#10b981' : isPendingConnection ? '#94a3b8' : '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: isConnected || isPendingConnection ? 'default' : 'pointer'
                  }}
                >
                  {isConnected ? (
                    <>
                      <Check style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>Connected</span>
                    </>
                  ) : isPendingConnection ? (
                    <span>Pending</span>
                  ) : (
                    <>
                      <UserPlus style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN PROFILE CONTAINER (Full width, 2-column layout)    */}
      {/* ========================================================= */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="profile-grid-layout">
          
          {/* Main Column */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>

            {/* ===================================================== */}
            {/* HERO PROFILE CARD (LinkedIn + GitHub hybrid)          */}
            {/* ===================================================== */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}
            >
              {/* Cover Gradient Banner */}
              <div
                style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #312e81 0%, #4338ca 35%, #0284c7 70%, #0d9488 100%)',
                  position: 'relative'
                }}
              >
                {/* Visual grid pattern overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.15,
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Cover Badges */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.45)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                  >
                    <Sparkles style={{ width: '0.75rem', height: '0.75rem', color: '#fbbf24' }} />
                    Verified Student Portfolio
                  </span>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => setIsPreviewAsVisitor(!isPreviewAsVisitor)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        backgroundColor: isPreviewAsVisitor ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Preview how visitors see your profile"
                    >
                      <Eye style={{ width: '0.75rem', height: '0.75rem' }} />
                      <span>{isPreviewAsVisitor ? 'Preview Mode (Visitor)' : 'View as Visitor'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Details Body */}
              <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', position: 'relative' }}>
                {/* Floating Avatar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginTop: '-60px',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '9999px',
                        backgroundColor: '#ffffff',
                        padding: '4px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '9999px',
                          backgroundColor: '#e0e7ff',
                          color: '#4338ca',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          overflow: 'hidden'
                        }}
                      >
                        {profileUser.profile_photo ? (
                          <img
                            src={profileUser.profile_photo}
                            alt={profileUser.full_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          (profileUser.full_name || 'S').charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>

                    {/* Online Status Dot */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '9999px',
                        backgroundColor: '#10b981',
                        border: '3px solid #ffffff'
                      }}
                      title="Active on ConnectMitraa"
                    />
                  </div>

                  {/* Primary Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {effectiveIsOwner ? (
                      <>
                        <button
                          type="button"
                          onClick={handleOpenEditModal}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            backgroundColor: '#4f46e5',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)'
                          }}
                        >
                          <Edit3 style={{ width: '0.95rem', height: '0.95rem' }} />
                          <span>Edit Full Profile</span>
                        </button>

                        {profileUser.resume_url && (
                          <a
                            href={profileUser.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.6rem 1.125rem',
                              backgroundColor: '#ffffff',
                              border: '1.5px solid #cbd5e1',
                              color: '#334155',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <Download style={{ width: '0.95rem', height: '0.95rem', color: '#4f46e5' }} />
                            <span>Download Resume</span>
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => sendConnectionRequest(profileUser.id)}
                          disabled={isConnected || isPendingConnection}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            backgroundColor: isConnected ? '#10b981' : isPendingConnection ? '#94a3b8' : '#4f46e5',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: isConnected || isPendingConnection ? 'default' : 'pointer'
                          }}
                        >
                          {isConnected ? (
                            <>
                              <Check style={{ width: '1rem', height: '1rem' }} />
                              <span>Connected</span>
                            </>
                          ) : isPendingConnection ? (
                            <span>Pending Request</span>
                          ) : (
                            <>
                              <UserPlus style={{ width: '1rem', height: '1rem' }} />
                              <span>Connect</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/Chat?user=${profileUser.id}&name=${encodeURIComponent(profileUser.full_name)}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            backgroundColor: '#ffffff',
                            border: '1.5px solid #4f46e5',
                            color: '#4f46e5',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare style={{ width: '1rem', height: '1rem' }} />
                          <span>Direct Message</span>
                        </button>

                        {profileUser.resume_url && (
                          <a
                            href={profileUser.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.6rem 1.125rem',
                              backgroundColor: '#ffffff',
                              border: '1.5px solid #cbd5e1',
                              color: '#334155',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <Download style={{ width: '0.95rem', height: '0.95rem', color: '#4f46e5' }} />
                            <span>Resume</span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Identity Information & Headline */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                      {profileUser.full_name}
                    </h1>

                    {profileUser.is_verified_mentor && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.6rem',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #a7f3d0'
                        }}
                      >
                        <CheckCircle style={{ width: '0.85rem', height: '0.85rem' }} />
                        Verified Peer Mentor
                      </span>
                    )}

                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {profileUser.year || 'Undergrad'}
                    </span>
                  </div>

                  <p style={{ fontSize: '1rem', color: '#334155', fontWeight: 500, lineHeight: 1.5, margin: '0 0 0.75rem 0', maxWidth: '850px' }}>
                    {profileUser.headline || 'Student at ConnectMitraa | Passionate Software Builder & Peer Learner'}
                  </p>

                  {/* University, Location, Connections & Rating Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building style={{ width: '0.95rem', height: '0.95rem', color: '#4f46e5' }} />
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{profileUser.college || 'Engineering College'}</span>
                      {profileUser.branch && <span>• {profileUser.branch}</span>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin style={{ width: '0.95rem', height: '0.95rem', color: '#ef4444' }} />
                      <span>{profileUser.location || 'India'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users style={{ width: '0.95rem', height: '0.95rem', color: '#0284c7' }} />
                      <span style={{ fontWeight: 600, color: '#0284c7' }}>{userConnectionsCount + 14} connections</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Star style={{ width: '0.95rem', height: '0.95rem', fill: '#f59e0b', color: '#f59e0b' }} />
                      <span style={{ fontWeight: 700, color: '#b45309' }}>{profileUser.rating || '4.8'}</span>
                      <span>({profileUser.completed_classes || 12} peer sessions)</span>
                    </div>
                  </div>
                </div>

                {/* Social & Coding Links Badges Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid #f1f5f9'
                  }}
                >
                  {profileUser.github_url && (
                    <a
                      href={profileUser.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Github style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>GitHub</span>
                    </a>
                  )}

                  {profileUser.linkedin_url && (
                    <a
                      href={profileUser.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#0a66c2',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Linkedin style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {profileUser.leetcode_url && (
                    <a
                      href={profileUser.leetcode_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#f59e0b',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Code style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>LeetCode</span>
                    </a>
                  )}

                  {profileUser.portfolio_url && (
                    <a
                      href={profileUser.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Globe style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>Portfolio</span>
                    </a>
                  )}

                  {profileUser.email && (
                    <a
                      href={`mailto:${profileUser.email}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Mail style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* NAUKRI RESUME & CAREER PREFERENCES CARD               */}
            {/* ===================================================== */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText style={{ width: '1.2rem', height: '1.2rem' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Resume &amp; Career Highlights
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                      Verified ATS Standard Resume &amp; Placement Target
                    </p>
                  </div>
                </div>

                {effectiveIsOwner && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveEditTab('resume');
                      handleOpenEditModal();
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#4f46e5',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Edit3 style={{ width: '0.85rem', height: '0.85rem' }} />
                    Update Resume
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                {/* Resume Download / View Pill Card */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}
                    >
                      PDF
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {profileUser.resume_name || `${profileUser.full_name.replace(/\s+/g, '_')}_Resume.pdf`}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                        Updated recently • 184 KB • ATS Verified
                      </p>
                    </div>
                  </div>

                  {profileUser.resume_url ? (
                    <a
                      href={profileUser.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{
                        padding: '0.45rem 0.85rem',
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        flexShrink: 0
                      }}
                    >
                      <Download style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>Download</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>No URL uploaded</span>
                  )}
                </div>

                {/* Placement / Career Preferences Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.78rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>TARGET ROLE</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>
                      {profileUser.target_role || 'Full Stack Engineer / SDE-1'}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>LOCATIONS</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>
                      {profileUser.preferred_locations || 'Bengaluru, Hyderabad, Remote'}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>AVAILABILITY</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>
                      {profileUser.availability || 'Immediate / 2026 Batch'}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.625rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>JOB TYPE</span>
                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>
                      {profileUser.job_type || 'Full-time & Internship'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* LEETCODE & GITHUB CODING HEATMAP & STATS              */}
            {/* ===================================================== */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '6px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Flame style={{ width: '1.2rem', height: '1.2rem' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Coding Activity &amp; Peer Contributions
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                      LeetCode practice streak, solved peer doubts &amp; code commits
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
                    <Flame style={{ width: '0.85rem', height: '0.85rem' }} />
                    🔥 19 Day Streak
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ color: '#059669' }}>368 Total Sessions in 2025</span>
                </div>
              </div>

              {/* LeetCode stats breakdown cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>EASY SOLVED</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>142</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>MEDIUM SOLVED</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>98</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>HARD SOLVED</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>26</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 700 }}>DOUBTS RESOLVED</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                    {userDoubts.length + 38}
                  </p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>CLASSES CONDUCTED</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                    {userClasses.length || 4}
                  </p>
                </div>
              </div>

              {/* 52-Week Contribution Grid Heatmap */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  overflowX: 'auto'
                }}
              >
                {/* Month labels */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.6875rem',
                    color: '#64748b',
                    marginBottom: '0.4rem',
                    minWidth: '650px',
                    paddingLeft: '1.5rem'
                  }}
                >
                  {monthLabels.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div style={{ display: 'flex', gap: '3px', minWidth: '650px' }}>
                  {Array.from({ length: heatmapWeeks }).map((_, wIdx) => (
                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {Array.from({ length: daysPerWeek }).map((_, dIdx) => {
                        const level = getContributionLevel(wIdx, dIdx);
                        const colors = ['#e2e8f0', '#86efac', '#22c55e', '#15803d'];
                        return (
                          <div
                            key={dIdx}
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '2px',
                              backgroundColor: colors[level]
                            }}
                            title={`Activity level ${level} on week ${wIdx + 1}, day ${dIdx + 1}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.35rem',
                    fontSize: '0.6875rem',
                    color: '#64748b',
                    marginTop: '0.5rem'
                  }}
                >
                  <span>Less</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#e2e8f0' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#86efac' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#22c55e' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#15803d' }} />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* SECTION TABS (Interactive Jump to Content)            */}
            {/* ===================================================== */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '0.25rem',
                overflowX: 'auto'
              }}
            >
              {[
                { id: 'overview', label: '📌 Overview & Bio' },
                { id: 'projects', label: `🚀 Projects (${profileUser.projects?.length || 0})` },
                { id: 'experience', label: `💼 Experience (${profileUser.experience?.length || 0})` },
                { id: 'education', label: `🎓 Education (${profileUser.education?.length || 0})` },
                { id: 'achievements', label: `🏆 Honors (${profileUser.achievements?.length || 0})` },
                { id: 'skills', label: `🎯 Skills & Endorsements` },
                { id: 'activity', label: `💬 Activity (${userPosts.length + userDoubts.length})` }
              ].map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  onClick={() => setActiveTab(tabItem.id)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: activeTab === tabItem.id ? 700 : 500,
                    backgroundColor: activeTab === tabItem.id ? '#ffffff' : 'transparent',
                    color: activeTab === tabItem.id ? '#4f46e5' : '#64748b',
                    border: activeTab === tabItem.id ? '1px solid #cbd5e1' : '1px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === tabItem.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            {/* ===================================================== */}
            {/* TAB CONTENT: 1. OVERVIEW & ABOUT ME                   */}
            {/* ===================================================== */}
            {(activeTab === 'overview' || activeTab === 'all') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    About Me &amp; Professional Summary
                  </h2>
                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('basic');
                        handleOpenEditModal();
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#4f46e5',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Edit Bio
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {profileUser.bio ||
                    'Motivated computer science undergrad passionate about building robust, distributed backend architectures and responsive user interfaces. Active peer collaborator on ConnectMitraa.'}
                </p>
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 2. FEATURED PROJECTS (GitHub Pinned)     */}
            {/* ===================================================== */}
            {(activeTab === 'projects' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Featured Projects &amp; Open Source Repositories
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                      Pinned portfolio repositories with source code &amp; live deployments
                    </p>
                  </div>

                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('projects');
                        handleOpenEditModal();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                      Add Project
                    </button>
                  )}
                </div>

                {(!profileUser.projects || profileUser.projects.length === 0) ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                    No featured projects added yet.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                    {profileUser.projects.map((proj) => (
                      <div
                        key={proj.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          padding: '1.125rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.625rem',
                          transition: 'box-shadow 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Code style={{ width: '1rem', height: '1rem', color: '#4f46e5' }} />
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                              {proj.title}
                            </h3>
                          </div>
                          <span
                            style={{
                              padding: '0.15rem 0.45rem',
                              backgroundColor: '#e2e8f0',
                              color: '#475569',
                              borderRadius: '9999px',
                              fontSize: '0.6875rem',
                              fontWeight: 600
                            }}
                          >
                            Public Repo
                          </span>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                          {proj.description}
                        </p>

                        {/* Tech Stack Chips */}
                        {proj.tech_stack && proj.tech_stack.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {proj.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                style={{
                                  padding: '0.15rem 0.5rem',
                                  backgroundColor: '#e0e7ff',
                                  color: '#3730a3',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Project Links Footer */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: '0.625rem',
                            borderTop: '1px solid #e2e8f0',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#f59e0b', color: '#f59e0b' }} />
                              38
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Layers style={{ width: '0.75rem', height: '0.75rem' }} />
                              12 forks
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {proj.github_url && (
                              <a
                                href={proj.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#0f172a',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Github style={{ width: '0.85rem', height: '0.85rem' }} />
                                <span>Code</span>
                              </a>
                            )}
                            {proj.live_url && (
                              <a
                                href={proj.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#4f46e5',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                                <span>Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 3. EXPERIENCE & LEADERSHIP (LinkedIn)    */}
            {/* ===================================================== */}
            {(activeTab === 'experience' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Experience &amp; Internships
                  </h2>

                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('experience');
                        handleOpenEditModal();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                      Add Experience
                    </button>
                  )}
                </div>

                {(!profileUser.experience || profileUser.experience.length === 0) ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                    No internship or leadership experience added yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {profileUser.experience.map((exp) => (
                      <div key={exp.id} style={{ display: 'flex', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Briefcase style={{ width: '1.2rem', height: '1.2rem' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {exp.role}
                          </h3>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4f46e5', margin: '0.15rem 0' }}>
                            {exp.company}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                            {exp.duration} • {exp.location || 'Remote'}
                          </p>
                          {exp.description && (
                            <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 4. EDUCATION & ACADEMICS (LinkedIn)      */}
            {/* ===================================================== */}
            {(activeTab === 'education' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Education &amp; Academic Background
                  </h2>

                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('education');
                        handleOpenEditModal();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                      Add Education
                    </button>
                  )}
                </div>

                {(!profileUser.education || profileUser.education.length === 0) ? (
                  <div style={{ display: 'flex', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GraduationCap style={{ width: '1.2rem', height: '1.2rem' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {profileUser.branch || 'Computer Science & Engineering'}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#4f46e5', fontWeight: 600, margin: '0.15rem 0' }}>
                        {profileUser.college || 'Engineering Institute'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                        2022 - 2026 • Undergraduate Student
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {profileUser.education.map((edu) => (
                      <div key={edu.id} style={{ display: 'flex', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <GraduationCap style={{ width: '1.2rem', height: '1.2rem' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {edu.degree}
                          </h3>
                          <p style={{ fontSize: '0.8125rem', color: '#4f46e5', fontWeight: 600, margin: '0.15rem 0' }}>
                            {edu.college}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                            {edu.duration} {edu.grade && `• ${edu.grade}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 5. HONORS & ACHIEVEMENTS                 */}
            {/* ===================================================== */}
            {(activeTab === 'achievements' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Honors, Hackathons &amp; Certifications
                  </h2>

                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('achievements');
                        handleOpenEditModal();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                      Add Honor
                    </button>
                  )}
                </div>

                {(!profileUser.achievements || profileUser.achievements.length === 0) ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                    No honors or certifications added yet.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.875rem' }}>
                    {profileUser.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          padding: '1rem',
                          display: 'flex',
                          gap: '0.75rem'
                        }}
                      >
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '8px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Trophy style={{ width: '1.1rem', height: '1.1rem' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {ach.title}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0.35rem 0' }}>
                            {ach.issuer} • {ach.date}
                          </p>
                          {ach.description && (
                            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4, margin: 0 }}>
                              {ach.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 6. SKILLS & PEER ENDORSEMENTS            */}
            {/* ===================================================== */}
            {(activeTab === 'skills' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Technical Skills &amp; Peer Endorsements
                  </h2>

                  {effectiveIsOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditTab('skills');
                        handleOpenEditModal();
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#4f46e5',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Edit Skills
                    </button>
                  )}
                </div>

                {/* Core Technical Skills with Endorsement Pill Buttons */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Core Technical Stack
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {profileUser.skills && profileUser.skills.length > 0 ? (
                      profileUser.skills.map((skill) => {
                        const currentEndorsements = 12 + (endorsedSkills[skill] || 0);
                        return (
                          <div
                            key={skill}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.4rem 0.75rem',
                              backgroundColor: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '0.8125rem'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{skill}</span>
                            <span
                              style={{
                                padding: '0.1rem 0.35rem',
                                backgroundColor: '#e2e8f0',
                                color: '#475569',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: 700
                              }}
                            >
                              {currentEndorsements}
                            </span>
                            {!effectiveIsOwner && (
                              <button
                                type="button"
                                onClick={() => handleEndorse(skill)}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  color: '#4f46e5',
                                  cursor: 'pointer',
                                  padding: 0,
                                  fontSize: '0.7rem',
                                  fontWeight: 700
                                }}
                                title={`Endorse ${profileUser.full_name.split(' ')[0]} for ${skill}`}
                              >
                                + Endorse
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>No skills listed.</p>
                    )}
                  </div>
                </div>

                {/* Can Teach / Mentoring Subjects */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Can Teach / Peer Mentoring Subjects
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {profileUser.subjects && profileUser.subjects.length > 0 ? (
                      profileUser.subjects.map((subj) => (
                        <span
                          key={subj}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: 600
                          }}
                        >
                          👨‍🏫 {subj}
                        </span>
                      ))
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>None specified.</p>
                    )}
                  </div>
                </div>

                {/* Wants to Learn / Learning Target Topics */}
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Currently Learning &amp; Target Topics
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {profileUser.wants_to_learn && profileUser.wants_to_learn.length > 0 ? (
                      profileUser.wants_to_learn.map((topic) => (
                        <span
                          key={topic}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#eef2ff',
                            border: '1px solid #c7d2fe',
                            color: '#3730a3',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: 600
                          }}
                        >
                          🎯 {topic}
                        </span>
                      ))
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>None specified.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB CONTENT: 7. RECENT ACTIVITY & POSTS (LinkedIn)    */}
            {/* ===================================================== */}
            {(activeTab === 'activity' || activeTab === 'overview') && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    StudyLoop Platform Activity &amp; Posts
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {userPosts.length + userDoubts.length} contributions
                  </span>
                </div>

                {userPosts.length === 0 && userDoubts.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                    No recent public posts or doubts shared yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          padding: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}
                          >
                            {post.post_type || 'Feed Post'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {new Date(post.created_date || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                          {post.content}
                        </p>
                        {post.code_snippet && (
                          <pre
                            style={{
                              backgroundColor: '#0f172a',
                              color: '#f8fafc',
                              padding: '0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              overflowX: 'auto',
                              margin: '0.5rem 0'
                            }}
                          >
                            {post.code_snippet}
                          </pre>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <span>❤️ {post.likes || 0} likes</span>
                          <span>💬 {post.comments_count || 0} comments</span>
                        </div>
                      </div>
                    ))}

                    {userDoubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          padding: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            DOUBT: {doubt.subject}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {new Date(doubt.created_date || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                          {doubt.topic && `${doubt.topic}: `}
                          {doubt.question}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                          <span>💬 {doubt.replies_count || 0} replies</span>
                          <span style={{ color: doubt.status === 'resolved' ? '#059669' : '#d97706', fontWeight: 600 }}>
                            {doubt.status === 'resolved' ? '✓ Resolved' : 'Open for peer discussion'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MULTI-TAB SECTIONAL EDIT MODAL                         */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div
            className="modal-content"
            style={{
              maxWidth: '56rem',
              width: '95%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 style={{ width: '1.25rem', height: '1.25rem', color: '#4f46e5' }} />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Edit Portfolio &amp; Profile Sections
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* Modal Body with Sidebar Tabs */}
            <div style={{ display: 'flex', flex: 1, minHeight: '440px', overflow: 'hidden' }}>
              {/* Left Sub-tabs */}
              <div
                style={{
                  width: '210px',
                  backgroundColor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                {[
                  { id: 'basic', label: '👤 Basic Info' },
                  { id: 'resume', label: '📄 Resume & Placement' },
                  { id: 'social', label: '🌐 Social & LeetCode' },
                  { id: 'projects', label: '🚀 Projects' },
                  { id: 'experience', label: '💼 Experience' },
                  { id: 'education', label: '🎓 Education' },
                  { id: 'achievements', label: '🏆 Honors' },
                  { id: 'skills', label: '🎯 Skills & Teaching' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveEditTab(item.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: activeEditTab === item.id ? 700 : 500,
                      backgroundColor: activeEditTab === item.id ? '#ffffff' : 'transparent',
                      color: activeEditTab === item.id ? '#4f46e5' : '#475569',
                      border: activeEditTab === item.id ? '1px solid #cbd5e1' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Right Tab Form Body */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#ffffff' }}>
                {/* 1. BASIC INFO */}
                {activeEditTab === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        className="input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Hemadri Kaligiri"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Professional Headline *</label>
                      <input
                        type="text"
                        className="input"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Pre-final Year CS Undergrad @ VIT Chennai | Full Stack Engineer"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="label">College / Institute *</label>
                        <input
                          type="text"
                          className="input"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. VIT Chennai"
                        />
                      </div>
                      <div>
                        <label className="label">Branch / Department</label>
                        <input
                          type="text"
                          className="input"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="e.g. Computer Science & Engineering"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="label">Year of Study</label>
                        <select className="select" value={year} onChange={(e) => setYear(e.target.value)}>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Alumni">Alumni / Graduate</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Location</label>
                        <input
                          type="text"
                          className="input"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Chennai, India"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">About Me / Bio</label>
                      <textarea
                        className="textarea"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share your interests, background, and what peer topics you love discussing..."
                      />
                    </div>
                  </div>
                )}

                {/* 2. RESUME & CAREER (NAUKRI) */}
                {activeEditTab === 'resume' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="label">Resume Direct Download URL (PDF or Drive link)</label>
                      <input
                        type="url"
                        className="input"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or raw PDF url"
                      />
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Provide a public direct link to your PDF resume so peers and recruiters can download it.
                      </span>
                    </div>

                    <div>
                      <label className="label">Resume Display Filename</label>
                      <input
                        type="text"
                        className="input"
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        placeholder="e.g. Hemadri_Kaligiri_SDE_Resume.pdf"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="label">Target Role</label>
                        <input
                          type="text"
                          className="input"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="e.g. Full Stack Engineer / SDE-1"
                        />
                      </div>
                      <div>
                        <label className="label">Preferred Locations</label>
                        <input
                          type="text"
                          className="input"
                          value={preferredLocations}
                          onChange={(e) => setPreferredLocations(e.target.value)}
                          placeholder="e.g. Bengaluru, Hyderabad, Remote"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="label">Availability</label>
                        <input
                          type="text"
                          className="input"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          placeholder="e.g. Immediate / 2026 Batch"
                        />
                      </div>
                      <div>
                        <label className="label">Employment Type</label>
                        <input
                          type="text"
                          className="input"
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          placeholder="e.g. Full-time & Internship"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SOCIAL & CODING LINKS */}
                {activeEditTab === 'social' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="label">GitHub Profile URL</label>
                      <input
                        type="url"
                        className="input"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="label">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        className="input"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="label">LeetCode Profile URL</label>
                      <input
                        type="url"
                        className="input"
                        value={leetcodeUrl}
                        onChange={(e) => setLeetcodeUrl(e.target.value)}
                        placeholder="https://leetcode.com/username"
                      />
                    </div>

                    <div>
                      <label className="label">Portfolio Website URL</label>
                      <input
                        type="url"
                        className="input"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourname.dev"
                      />
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS */}
                {activeEditTab === 'projects' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Add New Project</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Project Title (e.g. Distributed Key-Value Store)"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        />
                        <textarea
                          className="textarea"
                          rows={2}
                          placeholder="Project Description & Architecture..."
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="Tech Stack (comma-separated, e.g. Java, Spring Boot, React, Kafka)"
                          value={newProject.techStack}
                          onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="url"
                            className="input"
                            placeholder="GitHub Repo URL"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          />
                          <input
                            type="url"
                            className="input"
                            placeholder="Live Demo URL"
                            value={newProject.liveUrl}
                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Add to Projects List
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Existing Projects ({projectsList.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {projectsList.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.title}</span>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.1rem 0' }}>{p.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setProjectsList(projectsList.filter((_, i) => i !== idx))}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. EXPERIENCE */}
                {activeEditTab === 'experience' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Add Work / Leadership Experience</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="Role / Title (e.g. Software Engineer Intern)"
                            value={newExp.role}
                            onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Company / Organization (e.g. AWS)"
                            value={newExp.company}
                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="Duration (e.g. May 2025 - Jul 2025)"
                            value={newExp.duration}
                            onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Location (e.g. Bengaluru, India)"
                            value={newExp.location}
                            onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                          />
                        </div>
                        <textarea
                          className="textarea"
                          rows={2}
                          placeholder="Responsibilities and contributions..."
                          value={newExp.description}
                          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Add Experience
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Existing Experience ({experienceList.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {experienceList.map((e, idx) => (
                          <div
                            key={e.id || idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{e.role} @ {e.company}</span>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.1rem 0' }}>{e.duration}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExperienceList(experienceList.filter((_, i) => i !== idx))}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. EDUCATION */}
                {activeEditTab === 'education' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Add Education</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Degree (e.g. B.Tech in Computer Science)"
                          value={newEdu.degree}
                          onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="College / University (e.g. VIT Chennai)"
                          value={newEdu.college}
                          onChange={(e) => setNewEdu({ ...newEdu, college: e.target.value })}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="Duration (e.g. 2022 - 2026)"
                            value={newEdu.duration}
                            onChange={(e) => setNewEdu({ ...newEdu, duration: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Grade / CGPA (e.g. CGPA: 8.9 / 10.0)"
                            value={newEdu.grade}
                            onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Add Education
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Existing Education ({educationList.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {educationList.map((ed, idx) => (
                          <div
                            key={ed.id || idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{ed.degree}</span>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.1rem 0' }}>{ed.college} ({ed.duration})</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. ACHIEVEMENTS & HONORS */}
                {activeEditTab === 'achievements' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Add Honor or Certification</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Honor Title (e.g. Smart India Hackathon Finalist)"
                          value={newAch.title}
                          onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="Issuer (e.g. AICTE / LeetCode)"
                            value={newAch.issuer}
                            onChange={(e) => setNewAch({ ...newAch, issuer: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Year / Date (e.g. 2025)"
                            value={newAch.date}
                            onChange={(e) => setNewAch({ ...newAch, date: e.target.value })}
                          />
                        </div>
                        <textarea
                          className="textarea"
                          rows={2}
                          placeholder="Brief description of the award or contest..."
                          value={newAch.description}
                          onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={handleAddAchievement}
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Add Honor
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Existing Honors ({achievementsList.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {achievementsList.map((a, idx) => (
                          <div
                            key={a.id || idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{a.title}</span>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.1rem 0' }}>{a.issuer} • {a.date}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAchievementsList(achievementsList.filter((_, i) => i !== idx))}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. SKILLS */}
                {activeEditTab === 'skills' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="label">Technical Skills (comma-separated)</label>
                      <textarea
                        className="textarea"
                        rows={3}
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Java, Spring Boot, React, Data Structures, WebSockets, Docker, Kafka"
                      />
                    </div>

                    <div>
                      <label className="label">Subjects I Can Teach Peers (comma-separated)</label>
                      <textarea
                        className="textarea"
                        rows={2}
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                        placeholder="e.g. Object Oriented Programming, System Design, DSA"
                      />
                    </div>

                    <div>
                      <label className="label">Topics I Want to Learn (comma-separated)</label>
                      <textarea
                        className="textarea"
                        rows={2}
                        value={wantsToLearn}
                        onChange={(e) => setWantsToLearn(e.target.value)}
                        placeholder="e.g. Distributed Systems, Kubernetes, Rust, eBPF"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                backgroundColor: '#ffffff'
              }}
            >
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Save style={{ width: '0.95rem', height: '0.95rem' }} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
