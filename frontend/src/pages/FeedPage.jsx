import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  BookOpen,
  Lightbulb,
  Trophy,
  Link as LinkIcon,
  FolderGit2,
  CheckCircle,
  Heart,
  MessageSquare,
  Share2,
  Code2,
  Send,
  Sparkles
} from 'lucide-react';

export const FeedPage = () => {
  const { user, posts, comments, createPost, likePost, addComment, showToast } = useApp();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('knowledge');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const postTypes = [
    { value: 'question', label: 'Ask', icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50', style: { color: '#d97706', backgroundColor: '#fffbeb' } },
    { value: 'knowledge', label: 'Knowledge', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', style: { color: '#2563eb', backgroundColor: '#eff6ff' } },
    { value: 'tip', label: 'Tip', icon: Lightbulb, color: 'text-violet-600', bg: 'bg-violet-50', style: { color: '#7c3aed', backgroundColor: '#f5f3ff' } },
    { value: 'achievement', label: 'Achievement', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', style: { color: '#059669', backgroundColor: '#ecfdf5' } },
    { value: 'resource', label: 'Resource', icon: LinkIcon, color: 'text-cyan-600', bg: 'bg-cyan-50', style: { color: '#0891b2', backgroundColor: '#ecfeff' } },
    { value: 'project', label: 'Project', icon: FolderGit2, color: 'text-rose-600', bg: 'bg-rose-50', style: { color: '#e11d48', backgroundColor: '#fff1f2' } }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost({
      content: content.trim(),
      post_type: postType,
      code_snippet: codeSnippet.trim()
    });
    setContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/Home?post=' + post.id);
      showToast("Post link copied to clipboard!");
    } else {
      showToast("Post ready to share!");
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="page-container" style={{ maxWidth: '44rem' }}>
      {/* Create Post Box */}
      <div className="card" style={{ marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div className="card-content" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.875rem' }}>
            <div className="avatar-circle">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.full_name} />
              ) : (
                (user.full_name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                rows={3}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '0.9375rem',
                  lineHeight: '1.5',
                  color: 'var(--foreground)',
                  minHeight: '64px'
                }}
              />

              {/* Code Snippet Input (toggleable) */}
              {showCodeInput && (
                <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your code snippet here..."
                    rows={4}
                    style={{
                      width: '100%',
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.8125rem',
                      padding: '0.625rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--secondary)',
                      border: '1px solid var(--border)',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                {/* Category Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
                  {postTypes.map((t) => {
                    const Icon = t.icon;
                    const isSelected = postType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setPostType(t.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          transition: 'all 0.15s',
                          border: isSelected ? '1px solid currentColor' : '1px solid transparent',
                          ...(isSelected
                            ? t.style
                            : { color: 'var(--muted-foreground)', backgroundColor: 'transparent' })
                        }}
                      >
                        <Icon style={{ width: '0.85rem', height: '0.85rem' }} />
                        {t.label}
                      </button>
                    );
                  })}

                  {/* Toggle code box */}
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(!showCodeInput)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      color: showCodeInput ? 'var(--primary)' : 'var(--muted-foreground)',
                      backgroundColor: showCodeInput ? 'rgba(79, 70, 229, 0.1)' : 'transparent'
                    }}
                    title="Toggle code block"
                  >
                    <Code2 style={{ width: '0.85rem', height: '0.85rem' }} />
                    Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePostSubmit}
                  disabled={!content.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '9999px', padding: '0.375rem 1rem' }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((post) => {
          const typeMeta = postTypes.find((t) => t.value === post.post_type) || postTypes[1];
          const TypeIcon = typeMeta.icon;
          const isLiked = (post.liked_by || []).includes(user.id);
          const postComments = comments.filter((c) => c.post_id === post.id);
          const isCommentsOpen = !!expandedComments[post.id];

          return (
            <div key={post.id} className="card">
              <div className="card-content" style={{ padding: '1.25rem' }}>
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar-circle">
                      {post.author_photo ? (
                        <img src={post.author_photo} alt={post.author_name} />
                      ) : (
                        (post.author_name || 'S').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                          {post.author_name}
                        </span>
                        {post.author_verified && (
                          <CheckCircle style={{ width: '0.95rem', height: '0.95rem', color: 'var(--accent)' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', gap: '0.5rem' }}>
                        <span>{post.author_college || 'Student'}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.created_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Type Badge */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      ...typeMeta.style
                    }}
                  >
                    <TypeIcon style={{ width: '0.8rem', height: '0.8rem' }} />
                    {typeMeta.label}
                  </span>
                </div>

                {/* Post Content */}
                <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </p>

                {/* Code Snippet Box */}
                {post.code_snippet && (
                  <pre
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.875rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground)',
                      fontSize: '0.8125rem',
                      fontFamily: 'ui-monospace, monospace',
                      overflowX: 'auto',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {post.code_snippet}
                  </pre>
                )}

                {/* Post Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => likePost(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: isLiked ? '#ef4444' : 'inherit',
                      fontWeight: isLiked ? 600 : 500
                    }}
                  >
                    <Heart
                      style={{
                        width: '1rem',
                        height: '1rem',
                        fill: isLiked ? '#ef4444' : 'none'
                      }}
                    />
                    <span>{post.likes || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: isCommentsOpen ? 'var(--primary)' : 'inherit'
                    }}
                  >
                    <MessageSquare style={{ width: '1rem', height: '1rem' }} />
                    <span>{post.comments_count || postComments.length || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginLeft: 'auto' }}
                  >
                    <Share2 style={{ width: '1rem', height: '1rem' }} />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comment Section Thread */}
                {isCommentsOpen && (
                  <div
                    style={{
                      marginTop: '0.875rem',
                      paddingTop: '0.875rem',
                      borderTop: '1px dashed var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    {/* Add Comment Input */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        style={{ height: '36px', fontSize: '0.8125rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="btn btn-primary btn-sm"
                        style={{ height: '36px', padding: '0 0.875rem' }}
                      >
                        <Send style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                    </div>

                    {/* Existing Comments List */}
                    {postComments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          display: 'flex',
                          gap: '0.625rem',
                          backgroundColor: 'var(--secondary)',
                          padding: '0.625rem 0.875rem',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <div
                          className="avatar-circle"
                          style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.75rem' }}
                        >
                          {(comment.author_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                              {comment.author_name}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                              {formatTimeAgo(comment.created_date)}
                            </span>
                          </div>
                          <p style={{ color: 'var(--foreground)', marginTop: '0.125rem' }}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
