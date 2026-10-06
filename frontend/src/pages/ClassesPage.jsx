import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { LiveClassRoom } from './LiveClassRoom';

export const ClassesPage = () => {
  const { user, classes, createClass, joinClass, activeClassRoom, enterClassRoom, leaveClassRoom, showToast } = useApp();
  const [tab, setTab] = useState('all'); // 'all' | 'my'
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

  const filteredClasses = tab === 'all'
    ? classes
    : classes.filter((c) => c.creator_id === user.id || c.is_user_joined);

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

      {/* Tabs */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          All Classes
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'my' ? 'active' : ''}`}
          onClick={() => setTab('my')}
        >
          My Classes
        </button>
      </div>

      {/* Classes Grid */}
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
