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
  Sparkles
} from 'lucide-react';

export const DoubtsPage = () => {
  const { user, doubts, doubtReplies, createDoubt, replyDoubt, resolveDoubt } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);

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

  // If a doubt is selected for detail view:
  if (selectedDoubt) {
    return (
      <div className="page-container" style={{ maxWidth: '48rem' }}>
        <button
          type="button"
          onClick={() => setSelectedDoubtId(null)}
          className="btn btn-ghost"
          style={{ marginBottom: '1rem', paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
          Back to Doubts
        </button>

        {/* Doubt Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
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

            {selectedDoubt.status === 'open' && (
              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => resolveDoubt(selectedDoubt.id)}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  <CheckCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                  Mark as Resolved
                </button>
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
            {replies.map((reply) => (
              <div key={reply.id} className="card">
                <div className="card-content" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
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
                    {reply.is_solution && (
                      <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                        Accepted Solution
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Composer */}
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

      {/* Doubts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {doubts.map((doubt) => (
          <div
            key={doubt.id}
            className="card"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.1s' }}
            onClick={() => setSelectedDoubtId(doubt.id)}
          >
            <div className="card-content" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div className="avatar-circle">
                  {(doubt.author_name || 'S').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                      {doubt.author_name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {formatTimeAgo(doubt.created_date)}
                    </span>
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
        ))}
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
