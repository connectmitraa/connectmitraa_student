import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Search,
  Send,
  CheckCircle,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';

export const ChatPage = ({ navigate, currentRoute }) => {
  const { user, allUsers, messages, sendMessage } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize selectedUser from URL params or currentRoute
  useEffect(() => {
    const searchStr = currentRoute && currentRoute.includes('?')
      ? currentRoute.substring(currentRoute.indexOf('?'))
      : window.location.search;
    const params = new URLSearchParams(searchStr);
    const targetId = params.get('user');
    const targetName = params.get('name');

    if (targetId) {
      const found = allUsers.find((u) => u.id === targetId);
      if (found) {
        setSelectedUser(found);
      } else if (targetName) {
        setSelectedUser({ id: targetId, full_name: decodeURIComponent(targetName), college: 'Student' });
      }
    } else if (!selectedUser) {
      // Default to first other user
      const defaultUser = allUsers.find((u) => u.id !== user.id);
      if (defaultUser) setSelectedUser(defaultUser);
    }
  }, [currentRoute, allUsers, user.id]);

  // Scroll to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  // Aggregate conversations list with latest message
  const conversationList = allUsers
    .filter((u) => u.id !== user.id)
    .map((other) => {
      const userMsgs = messages.filter(
        (m) =>
          (m.sender_id === user.id && m.receiver_id === other.id) ||
          (m.sender_id === other.id && m.receiver_id === user.id)
      );
      const lastMsg = userMsgs[userMsgs.length - 1];
      return {
        ...other,
        lastMessage: lastMsg ? lastMsg.content : 'Start a peer conversation',
        lastTime: lastMsg ? new Date(lastMsg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      };
    })
    .filter((c) =>
      !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.college?.toLowerCase().includes(search.toLowerCase())
    );

  // Active messages between current user and selectedUser
  const activeMessages = selectedUser
    ? messages.filter(
        (m) =>
          (m.sender_id === user.id && m.receiver_id === selectedUser.id) ||
          (m.sender_id === selectedUser.id && m.receiver_id === user.id)
      )
    : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;
    sendMessage(selectedUser.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="page-container full" style={{ height: 'calc(100vh - 2rem)', display: 'flex', padding: '1rem' }}>
      <div className="card" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Chat list column */}
        <div
          style={{
            width: '320px',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Search Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
              Messages
            </h2>
            <div style={{ position: 'relative' }}>
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
                style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversationList.map((chat) => {
              const isSelected = selectedUser?.id === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedUser(chat);
                    if (navigate) {
                      navigate(`/Chat?user=${chat.id}&name=${encodeURIComponent(chat.full_name)}`);
                    }
                  }}
                  style={{
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--secondary)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <div className="avatar-circle" style={{ flexShrink: 0 }}>
                    {(chat.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                          {chat.full_name}
                        </span>
                        {chat.is_verified_mentor && (
                          <CheckCircle style={{ width: '0.8rem', height: '0.8rem', color: 'var(--accent)' }} />
                        )}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                        {chat.lastTime}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--muted-foreground)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '0.125rem'
                      }}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        {selectedUser ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
            {/* Chat Header */}
            <div
              style={{
                padding: '0.875rem 1.25rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => navigate?.(`/Profile?user=${selectedUser.id}`)}
                title={`View ${selectedUser.full_name}'s profile`}
              >
                <div className="avatar-circle">
                  {(selectedUser.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      {selectedUser.full_name}
                    </h3>
                    {selectedUser.is_verified_mentor && (
                      <CheckCircle style={{ width: '0.9rem', height: '0.9rem', color: 'var(--accent)' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: '#10b981' }}></span>
                    <span>Online • {selectedUser.college || 'Peer Student'}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => navigate?.(`/Profile?user=${selectedUser.id}`)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeMessages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--muted-foreground)' }}>
                  <MessageSquare style={{ width: '2.5rem', height: '2.5rem', opacity: 0.3, margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.875rem' }}>No messages yet.</p>
                  <p style={{ fontSize: '0.75rem' }}>Say hello to start peer learning!</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMine = msg.sender_id === user.id;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: isMine ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                          backgroundColor: isMine ? 'var(--primary)' : '#ffffff',
                          color: isMine ? '#ffffff' : 'var(--foreground)',
                          boxShadow: 'var(--shadow-sm)',
                          border: isMine ? 'none' : '1px solid var(--border)',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {msg.content}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '0.2rem', padding: '0 0.25rem' }}>
                        {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '0.875rem 1.25rem',
                backgroundColor: '#ffffff',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                className="input"
                placeholder={`Message ${selectedUser.full_name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <Send style={{ width: '1rem', height: '1rem' }} />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
            Select a student to chat
          </div>
        )}
      </div>
    </div>
  );
};
