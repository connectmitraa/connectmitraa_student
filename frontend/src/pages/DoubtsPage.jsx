import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Plus,
  CheckCircle,
  MessageSquare,
  Code2,
  X,
  Send,
  ArrowLeft,
  Sparkles,
  Search,
  Trash2,
  Check,
  ChevronDown,
  RotateCcw,
  Calendar,
  Lock
} from 'lucide-react';

export const DoubtsPage = ({ navigate }) => {
  const { user, doubts, doubtReplies, createDoubt, replyDoubt, resolveDoubt, reopenDoubt, markSolution, deleteDoubt } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);
  
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my' | 'open' | 'resolved'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '24h' | '7d' | '30d'
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [hasCodeFilter, setHasCodeFilter] = useState(false);
  const [unansweredFilter, setUnansweredFilter] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'most_replies'
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  // Reply State
  const [replyText, setReplyText] = useState('');

  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (!subject.trim() || !question.trim()) return;
    createDoubt({
      subject: subject.trim(),
      topic: topic.trim(),
      question: question.trim(),
      code_snippet: codeSnippet.trim()
    });
    setSubject('');
    setTopic('');
    setQuestion('');
    setCodeSnippet('');
    setIsCreateModalOpen(false);
  };

  const handleSendReply = (doubtId) => {
    if (!replyText.trim()) return;
    replyDoubt(doubtId, replyText.trim());
    setReplyText('');
  };

  const selectedDoubt = doubts.find((d) => d.id === selectedDoubtId);
  const replies = doubtReplies.filter((r) => r.doubt_id === selectedDoubtId);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Distinct subjects list for filtering
  const uniqueSubjects = Array.from(
    new Set(doubts.map((d) => d.subject).filter(Boolean))
  ).sort();

  // Tab counts
  const totalCount = doubts.length;
  const myDoubtsCount = doubts.filter((d) => d.user_id === user.id).length;
  const openCount = doubts.filter((d) => d.status === 'open').length;
  const resolvedCount = doubts.filter((d) => d.status === 'resolved').length;

  const isAnyFilterActive =
    dateFilter !== 'all' ||
    subjectFilter !== 'all' ||
    hasCodeFilter ||
    unansweredFilter ||
    sortBy !== 'newest';

  const resetAllFilters = () => {
    setDateFilter('all');
    setSubjectFilter('all');
    setHasCodeFilter(false);
    setUnansweredFilter(false);
    setSortBy('newest');
    setSearchQuery('');
  };

  // Filtered & Sorted doubts for the index list
  const filteredDoubts = doubts
    .filter((d) => {
      // 1. Tab check
      if (activeTab === 'my' && d.user_id !== user.id) return false;
      if (activeTab === 'open' && d.status !== 'open') return false;
      if (activeTab === 'resolved' && d.status !== 'resolved') return false;

      // 2. LinkedIn-style Date filter (past 24h, 7 days, 30 days)
      if (dateFilter !== 'all') {
        const doubtTime = new Date(d.created_date || d.createdAt || Date.now()).getTime();
        const diffMs = Date.now() - doubtTime;
        if (dateFilter === '24h' && diffMs > 24 * 60 * 60 * 1000) return false;
        if (dateFilter === '7d' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        if (dateFilter === '30d' && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
      }

      // 3. Subject filter
      if (subjectFilter !== 'all' && d.subject !== subjectFilter) {
        return false;
      }

      // 4. Has Code filter
      if (hasCodeFilter && !d.code_snippet) {
        return false;
      }

      // 5. Unanswered (needs answer) filter
      if (unansweredFilter && (d.replies_count || 0) > 0) {
        return false;
      }

      // 6. Search query
      const term = searchQuery.toLowerCase().trim();
      if (term) {
        const inSubject = d.subject?.toLowerCase().includes(term);
        const inTopic = d.topic?.toLowerCase().includes(term);
        const inQuestion = d.question?.toLowerCase().includes(term);
        const inAuthor = d.author_name?.toLowerCase().includes(term);
        if (!inSubject && !inTopic && !inQuestion && !inAuthor) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'most_replies') {
        return (b.replies_count || 0) - (a.replies_count || 0);
      }
      const timeA = new Date(a.created_date || a.createdAt || 0).getTime();
      const timeB = new Date(b.created_date || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  // If a doubt is selected for detail view:
  if (selectedDoubt) {
    const isAuthorOrAdmin = user.id === selectedDoubt.user_id || user.role === 'admin';

    return (
      <div className="page-container" style={{ maxWidth: '48rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setSelectedDoubtId(null)}
            className="btn btn-ghost"
            style={{ paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Back to Doubts
          </button>

          {isAuthorOrAdmin && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this doubt? It will be moved to Recycle Bin.')) {
                  deleteDoubt(selectedDoubt.id);
                  setSelectedDoubtId(null);
                }
              }}
              className="btn btn-outline btn-sm"
              style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              title="Delete doubt"
            >
              <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
              Delete Doubt
            </button>
          )}
        </div>

        {/* Doubt Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-content" style={{ padding: '1.5rem' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}
              onClick={() => navigate?.('/Profile?user=' + (selectedDoubt.user_id || 'usr_1'))}
              title={`View ${selectedDoubt.author_name}'s profile`}
            >
              <div className="avatar-circle">
                {selectedDoubt.author_photo ? (
                  <img src={selectedDoubt.author_photo} alt={selectedDoubt.author_name} />
                ) : (
                  (selectedDoubt.author_name || 'S').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                  {selectedDoubt.author_name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  {formatTimeAgo(selectedDoubt.created_date)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-secondary">{selectedDoubt.subject}</span>
              {selectedDoubt.topic && <span className="badge badge-outline">{selectedDoubt.topic}</span>}
              {selectedDoubt.status === 'resolved' ? (
                <span className="badge badge-success">
                  <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} /> Resolved
                </span>
              ) : (
                <span className="badge badge-outline">Open</span>
              )}
            </div>

            <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {selectedDoubt.question}
            </p>

            {selectedDoubt.code_snippet && (
              <pre
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--foreground)',
                  fontSize: '0.8125rem',
                  fontFamily: 'ui-monospace, monospace',
                  overflowX: 'auto',
                  border: '1px solid var(--border)'
                }}
              >
                {selectedDoubt.code_snippet}
              </pre>
            )}

            {isAuthorOrAdmin && (
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                {selectedDoubt.status === 'open' ? (
                  <button
                    type="button"
                    onClick={() => resolveDoubt(selectedDoubt.id)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <CheckCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                    Mark as Resolved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => reopenDoubt(selectedDoubt.id)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <RotateCcw style={{ width: '0.875rem', height: '0.875rem' }} />
                    Re-open Discussion
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Replies Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.75rem' }}>
            {replies.length} Replies
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {replies.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                No replies yet. Be the first to answer!
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="card">
                  <div className="card-content" style={{ padding: '1rem 1.25rem' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', cursor: 'pointer' }}
                      onClick={() => navigate?.('/Profile?user=' + (reply.user_id || 'usr_2'))}
                      title={`View ${reply.author_name}'s profile`}
                    >
                      <div className="avatar-circle" style={{ width: '1.875rem', height: '1.875rem', fontSize: '0.75rem' }}>
                        {(reply.author_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                          {reply.author_name}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                          {formatTimeAgo(reply.created_date)}
                        </p>
                      </div>
                      {reply.is_solution ? (
                        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                          Accepted Solution ✓
                        </span>
                      ) : (
                        user.id === selectedDoubt.user_id && selectedDoubt.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => markSolution(selectedDoubt.id, reply.id)}
                            className="btn btn-outline btn-sm"
                            style={{ marginLeft: 'auto', fontSize: '0.7rem', borderColor: '#10b981', color: '#059669', padding: '0.2rem 0.5rem' }}
                          >
                            <Check style={{ width: '0.75rem', height: '0.75rem' }} />
                            Accept as Solution
                          </button>
                        )
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply Composer or Resolved Banner */}
        {selectedDoubt.status === 'resolved' ? (
          <div
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--secondary)',
              border: '1px dashed var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 600, fontSize: '0.875rem' }}>
              <Lock style={{ width: '1rem', height: '1rem' }} />
              This discussion has been marked as Resolved
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
              New replies are closed because a solution has been found.
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="card-content" style={{ padding: '1rem 1.25rem' }}>
              <textarea
                className="textarea"
                rows={3}
                placeholder="Write your explanation or peer answer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ resize: 'none', marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleSendReply(selectedDoubt.id)}
                  disabled={!replyText.trim()}
                  className="btn btn-primary"
                >
                  <Send style={{ width: '0.875rem', height: '0.875rem' }} />
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Doubts Index List
  return (
    <div className="page-container" style={{ maxWidth: '48rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doubts</h1>
          <p className="page-description">Post a doubt and learn together</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          Post a Doubt
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="tabs-header" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Doubts ({myDoubtsCount})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Open ({openCount})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({resolvedCount})
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
            placeholder="Search doubts by subject, topic, or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* LinkedIn-Style Filter Bar */}
      <div className="filter-bar">
        {/* Date Filter */}
        <div className="filter-select-wrapper">
          <select
            className={`filter-select ${dateFilter !== 'all' ? 'active' : ''}`}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by date posted"
          >
            <option value="all">📅 Date Posted: All Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past Week</option>
            <option value="30d">Past Month</option>
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

        {/* Quick Filter Pill: Has Code */}
        <button
          type="button"
          className={`filter-chip ${hasCodeFilter ? 'active' : ''}`}
          onClick={() => setHasCodeFilter(!hasCodeFilter)}
          title="Filter doubts with code snippets"
        >
          <Code2 style={{ width: '0.85rem', height: '0.85rem' }} />
          Has Code
        </button>

        {/* Quick Filter Pill: Unanswered */}
        <button
          type="button"
          className={`filter-chip ${unansweredFilter ? 'active' : ''}`}
          onClick={() => setUnansweredFilter(!unansweredFilter)}
          title="Filter doubts with no replies yet"
        >
          <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
          Needs Answer
        </button>

        {/* Sort Selector */}
        <div className="filter-select-wrapper" style={{ marginLeft: 'auto' }}>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort doubts"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="most_replies">Sort: Most Discussed</option>
          </select>
          <ChevronDown className="filter-select-icon" />
        </div>

        {/* Reset button when any filter is active */}
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

      {/* Doubts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {filteredDoubts.length === 0 ? (
          <div className="card">
            <div className="card-content" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
              <HelpCircle style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                No doubts found matching your criteria
              </p>
              <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                Try adjusting your filters, searching for another topic, or post your question!
              </p>
              {(isAnyFilterActive || searchQuery || activeTab !== 'all') && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    resetAllFilters();
                    setActiveTab('all');
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
          filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.1s' }}
              onClick={() => setSelectedDoubtId(doubt.id)}
            >
              <div className="card-content" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div 
                    className="avatar-circle"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate?.('/Profile?user=' + (doubt.user_id || 'usr_1'));
                    }}
                    title={`View ${doubt.author_name}'s profile`}
                  >
                    {(doubt.author_name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span 
                          style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate?.('/Profile?user=' + (doubt.user_id || 'usr_1'));
                          }}
                          title={`View ${doubt.author_name}'s profile`}
                        >
                          {doubt.author_name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          {formatTimeAgo(doubt.created_date)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-secondary">{doubt.subject}</span>
                      {doubt.topic && <span className="badge badge-outline">{doubt.topic}</span>}
                      {doubt.status === 'resolved' && (
                        <span className="badge badge-success">
                          <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} /> Resolved
                        </span>
                      )}
                    </div>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--foreground)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {doubt.question}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
                      {doubt.replies_count || 0} replies
                    </span>
                    {doubt.code_snippet && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Code2 style={{ width: '0.85rem', height: '0.85rem' }} />
                        Has code
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

      {/* Post a Doubt Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '34rem' }}>
            <div className="modal-header">
              <h2 className="modal-title">Post a Doubt</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="modal-close"
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <form onSubmit={handlePostDoubt} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Subject *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Java, Python, DSA"
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
                    placeholder="e.g. OOP, Arrays"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Question *</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Describe your doubt in detail..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">Code Snippet (optional)</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Paste your code snippet here if needed..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8125rem' }}
                />
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
                  disabled={!subject.trim() || !question.trim()}
                >
                  Post Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
