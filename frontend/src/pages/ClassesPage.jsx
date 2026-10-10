import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Video,
  CheckCircle,
  Share2,
  X,
  Sparkles,
  Search,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { LiveClassRoom } from './LiveClassRoom';

export const ClassesPage = ({ navigate, currentRoute }) => {
  const { user, classes, createClass, joinClass, activeClassRoom, enterClassRoom, leaveClassRoom, showToast } = useApp();
  const [tab, setTab] = useState('all'); // 'all' | 'my'
  const [scheduleFilter, setScheduleFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'past'
  const [pricingFilter, setPricingFilter] = useState('all'); // 'all' | 'free' | 'paid'
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [sortBy, setSortBy] = useState('soonest'); // 'soonest' | 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('18:00');
  const [duration, setDuration] = useState('60');
  const [maxParticipants, setMaxParticipants] = useState('30');
  const [classType, setClassType] = useState('public');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('49');
  const [skillExchange, setSkillExchange] = useState(true);

  // Check URL query for shared class
  useEffect(() => {
    const searchStr = currentRoute && currentRoute.includes('?')
      ? currentRoute.substring(currentRoute.indexOf('?'))
      : window.location.search;
    const params = new URLSearchParams(searchStr);
    const targetClassId = params.get('class');
    if (targetClassId) {
      const found = classes.find((c) => c.id === targetClassId);
      if (found) {
        setSearchQuery(found.title);
        showToast(`Showing shared class: "${found.title}"`);
      }
    }
  }, [currentRoute, classes]);

  if (activeClassRoom) {
    return <LiveClassRoom classSession={activeClassRoom} onLeave={leaveClassRoom} />;
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !scheduledDate) return;
    createClass({
      title: title.trim(),
      subject: subject.trim(),
      topic: topic.trim(),
      description: description.trim(),
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      duration,
      max_participants: maxParticipants,
      class_type: classType,
      is_paid: isPaid,
      price: isPaid ? price : 0,
      skill_exchange: skillExchange
    });
    setIsCreateModalOpen(false);
    setTitle('');
    setSubject('');
    setTopic('');
    setDescription('');
  };

  const handleShare = (cls) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/Classes?class=${cls.id}`);
      showToast("Class link copied to clipboard!");
    } else {
      showToast("Class link ready to share!");
    }
  };

  const uniqueSubjects = Array.from(
    new Set(classes.map((c) => c.subject).filter(Boolean))
  ).sort();

  const isAnyFilterActive =
    scheduleFilter !== 'all' ||
    pricingFilter !== 'all' ||
    subjectFilter !== 'all' ||
    typeFilter !== 'all' ||
    sortBy !== 'soonest';

  const resetAllFilters = () => {
    setScheduleFilter('all');
    setPricingFilter('all');
    setSubjectFilter('all');
    setTypeFilter('all');
    setSortBy('soonest');
    setSearchQuery('');
  };

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const nowMs = now.getTime();

  const filteredClasses = classes
    .filter((c) => {
      // 1. Tab check
      if (tab === 'my' && !(c.creator_id === user.id || c.is_user_joined)) {
        return false;
      }

      // 2. Schedule filter
      if (scheduleFilter !== 'all') {
        const classDateStr = c.scheduled_date;
        const classTimeStr = c.scheduled_time || '00:00';
        const classDateTime = new Date(`${classDateStr}T${classTimeStr}`).getTime();

        if (scheduleFilter === 'today') {
          if (classDateStr !== todayStr) return false;
        } else if (scheduleFilter === 'week') {
          const diffMs = classDateTime - nowMs;
          if (diffMs < 0 || diffMs > 7 * 86400000) return false;
        } else if (scheduleFilter === 'month') {
          const diffMs = classDateTime - nowMs;
          if (diffMs < 0 || diffMs > 30 * 86400000) return false;
        } else if (scheduleFilter === 'past') {
          if (classDateTime >= nowMs) return false;
        }
      }

      // 3. Pricing filter
      if (pricingFilter === 'free' && c.is_paid) return false;
      if (pricingFilter === 'paid' && !c.is_paid) return false;

      // 4. Subject filter
      if (subjectFilter !== 'all' && c.subject !== subjectFilter) return false;

      // 5. Type filter
      if (typeFilter !== 'all' && c.class_type !== typeFilter) return false;

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = c.title?.toLowerCase().includes(q);
        const inSubj = c.subject?.toLowerCase().includes(q);
        const inTopic = c.topic?.toLowerCase().includes(q);
        const inCreator = c.creator_name?.toLowerCase().includes(q);
        if (!inTitle && !inSubj && !inTopic && !inCreator) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.participants_count || 0) - (a.participants_count || 0);
      }
      const timeA = new Date(`${a.scheduled_date}T${a.scheduled_time || '00:00'}`).getTime();
      const timeB = new Date(`${b.scheduled_date}T${b.scheduled_time || '00:00'}`).getTime();
      return timeA - timeB;
    });

  return (
    <div className="page-container wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-description">Learn from peers, teach what you know</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Create Class
        </button>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="tabs-header" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`tab-btn ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All Classes ({classes.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            My Classes ({classes.filter((c) => c.creator_id === user.id || c.is_user_joined).length})
          </button>
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
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
            placeholder="Search classes by title, topic, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* LinkedIn-Style Filter Bar */}
      <div className="filter-bar">
        {/* Schedule Filter */}
        <div className="filter-select-wrapper">
          <select
            className={`filter-select ${scheduleFilter !== 'all' ? 'active' : ''}`}
            value={scheduleFilter}
            onChange={(e) => setScheduleFilter(e.target.value)}
            aria-label="Filter by schedule"
          >
            <option value="all">📅 Schedule: All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="past">Past Classes</option>
          </select>
          <ChevronDown className="filter-select-icon" />
        </div>

        {/* Pricing Filter */}
        <div className="filter-select-wrapper">
          <select
            className={`filter-select ${pricingFilter !== 'all' ? 'active' : ''}`}
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value)}
            aria-label="Filter by price"
          >
            <option value="all">💰 Pricing: All</option>
            <option value="free">Free / Skill Exchange</option>
            <option value="paid">Paid Only</option>
          </select>
          <ChevronDown className="filter-select-icon" />
        </div>

        {/* Subject Filter */}
        <div className="filter-select-wrapper">
          <select
            className={`filter-select ${subjectFilter !== 'all' ? 'active' : ''}`}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            aria-label="Filter by subject"
          >
            <option value="all">📚 Subject: All</option>
            {uniqueSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <ChevronDown className="filter-select-icon" />
        </div>

        {/* Type Filter Chip */}
        <button
          type="button"
          className={`filter-chip ${typeFilter === 'public' ? 'active' : ''}`}
          onClick={() => setTypeFilter(typeFilter === 'public' ? 'all' : 'public')}
          title="Filter public classes"
        >
          Public
        </button>
        <button
          type="button"
          className={`filter-chip ${typeFilter === 'private' ? 'active' : ''}`}
          onClick={() => setTypeFilter(typeFilter === 'private' ? 'all' : 'private')}
          title="Filter private 1-on-1 classes"
        >
          Private
        </button>

        {/* Sort Selector */}
        <div className="filter-select-wrapper" style={{ marginLeft: 'auto' }}>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort classes"
          >
            <option value="soonest">Sort: Starting Soonest</option>
            <option value="popular">Sort: Most Enrolled</option>
          </select>
          <ChevronDown className="filter-select-icon" />
        </div>

        {/* Reset Button */}
        {isAnyFilterActive && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={resetAllFilters}
            title="Reset all filters"
          >
            <RotateCcw style={{ width: '0.75rem', height: '0.75rem' }} />
            Reset
          </button>
        )}
      </div>

      {/* Classes Grid or Empty State */}
      {filteredClasses.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            <GraduationCap style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
              No classes found matching your criteria
            </p>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
              Try adjusting your schedule, price, or subject filters, or create your own peer class!
            </p>
            {(isAnyFilterActive || searchQuery || tab !== 'all') && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  resetAllFilters();
                  setTab('all');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', margin: '0 auto' }}
              >
                <RotateCcw style={{ width: '0.85rem', height: '0.85rem' }} />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredClasses.map((cls) => {
          const isCreator = cls.creator_id === user.id;
          const isJoined = cls.is_user_joined || isCreator;

          return (
            <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-content" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header tags */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-secondary">{cls.subject}</span>
                  {cls.is_paid ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#fef3c7',
                        color: '#b45309',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      <IndianRupee style={{ width: '0.75rem', height: '0.75rem' }} />
                      {cls.price}
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      Free
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.375rem', lineHeight: 1.3 }}>
                  {cls.title}
                </h3>
                {cls.topic && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
                    Topic: {cls.topic}
                  </p>
                )}
                {cls.description && (
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--foreground)',
                      lineHeight: 1.4,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {cls.description}
                  </p>
                )}

                {/* Host Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: 'auto', marginBottom: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div className="avatar-circle" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                    {(cls.creator_name || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--foreground)' }}>
                        {cls.creator_name}
                      </span>
                      {cls.creator_verified && (
                        <CheckCircle style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent)' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Peer Instructor</span>
                  </div>
                </div>

                {/* Meta details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{cls.scheduled_date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{cls.scheduled_time} ({cls.duration}m)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Users style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{cls.participants_count || 1} / {cls.max_participants} seats</span>
                  </div>
                  <div>
                    <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                      {cls.class_type === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {!isJoined ? (
                    <button
                      type="button"
                      onClick={() => joinClass(cls.id)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      {cls.class_type === 'private' ? 'Request Join' : 'Join Class'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}
                    >
                      Joined ✓
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => enterClassRoom(cls)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <Video style={{ width: '0.85rem', height: '0.85rem' }} />
                    {isCreator ? 'Start Class' : 'Enter Live'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(cls)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.375rem 0.5rem' }}
                    title="Share class"
                  >
                    <Share2 style={{ width: '0.85rem', height: '0.85rem' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* Create Class Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '34rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create a Class</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="modal-close"
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="label">Class Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Java OOP Masterclass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Subject *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Object Oriented Programming"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Topic</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Design Patterns"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Briefly describe what peers will learn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Scheduled Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Scheduled Time</label>
                  <input
                    type="time"
                    className="input"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="input"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Max Participants</label>
                  <input
                    type="number"
                    className="input"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                  <input
                    type="radio"
                    name="classType"
                    checked={classType === 'public'}
                    onChange={() => setClassType('public')}
                  />
                  Public (Anyone can join)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                  <input
                    type="radio"
                    name="classType"
                    checked={classType === 'private'}
                    onChange={() => setClassType('private')}
                  />
                  Private (Request only)
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                  />
                  Paid Class
                </label>
                {isPaid && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>₹</span>
                    <input
                      type="number"
                      className="input"
                      style={{ width: '80px', padding: '0.25rem 0.5rem' }}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', marginLeft: 'auto' }}>
                  <input
                    type="checkbox"
                    checked={skillExchange}
                    onChange={(e) => setSkillExchange(e.target.checked)}
                  />
                  Skill Exchange Allowed
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!title.trim() || !subject.trim()}
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
