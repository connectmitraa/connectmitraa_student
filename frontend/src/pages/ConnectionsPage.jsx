import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  MessageSquare,
  CheckCircle,
  UserPlus,
  Check,
  X
} from 'lucide-react';

export const ConnectionsPage = ({ navigate }) => {
  const {
    user,
    allUsers,
    connections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection
  } = useApp();

  const [tab, setTab] = useState('my'); // 'my' | 'pending' | 'discover'
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');

  // Established connections where current user is requester or receiver
  const myConnections = connections
    .filter((c) => c.status === 'accepted' && (c.requester_id === user.id || c.receiver_id === user.id))
    .map((c) => {
      const isReq = c.requester_id === user.id;
      const otherId = isReq ? c.receiver_id : c.requester_id;
      const otherUser = allUsers.find((u) => u.id === otherId) || {
        id: otherId,
        full_name: isReq ? c.receiver_name : c.requester_name,
        college: 'Student',
        branch: '',
        skills: []
      };
      return { connId: c.id, ...otherUser };
    });

  // Pending incoming requests
  const pendingRequests = connections.filter(
    (c) => c.status === 'pending' && c.receiver_id === user.id
  );

  // Sent pending requests
  const sentPendingIds = connections
    .filter((c) => c.status === 'pending' && c.requester_id === user.id)
    .map((c) => c.receiver_id);

  const connectedIds = myConnections.map((c) => c.id);

  // Discoverable students (excluding current user)
  const colleges = ['All', ...new Set(allUsers.filter((u) => u.college).map((u) => u.college))];

  const discoverStudents = allUsers.filter((u) => {
    if (u.id === user.id) return false;
    const matchesSearch =
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.college?.toLowerCase().includes(search.toLowerCase()) ||
      u.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCollege = collegeFilter === 'All' || u.college === collegeFilter;
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="page-container wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Connections</h1>
          <p className="page-description">Connect with peers across colleges to collaborate</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${tab === 'my' ? 'active' : ''}`}
          onClick={() => setTab('my')}
        >
          My Connections ({myConnections.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'pending' ? 'active' : ''}`}
          onClick={() => setTab('pending')}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'discover' ? 'active' : ''}`}
          onClick={() => setTab('discover')}
        >
          Discover
        </button>
      </div>

      {/* TAB 1: MY CONNECTIONS */}
      {tab === 'my' && (
        <div>
          {myConnections.length === 0 ? (
            <div className="card">
              <div className="card-content" style={{ padding: '3rem', textAlign: 'center' }}>
                <Users style={{ width: '3rem', height: '3rem', color: 'var(--muted-foreground)', opacity: 0.3, margin: '0 auto 0.75rem auto' }} />
                <p style={{ color: 'var(--muted-foreground)' }}>
                  No connections yet. Discover students to connect with!
                </p>
                <button
                  type="button"
                  onClick={() => setTab('discover')}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Discover Students
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {myConnections.map((conn) => (
                <div key={conn.id} className="card">
                  <div className="card-content" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                      onClick={() => navigate(`/Profile?user=${conn.id}`)}
                      title={`View ${conn.full_name}'s profile`}
                    >
                      <div className="avatar-circle">
                        {(conn.full_name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                            {conn.full_name}
                          </span>
                          {conn.is_verified_mentor && (
                            <CheckCircle style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent)' }} />
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          {conn.college || 'Peer Student'} • {conn.branch}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/Chat?user=${conn.id}&name=${encodeURIComponent(conn.full_name)}`)}
                      className="btn btn-outline btn-sm"
                      title="Direct Chat"
                    >
                      <MessageSquare style={{ width: '0.875rem', height: '0.875rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENDING REQUESTS */}
      {tab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pendingRequests.length === 0 ? (
            <div className="card">
              <div className="card-content" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>No pending connection requests</p>
              </div>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div key={req.id} className="card">
                <div className="card-content" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                    onClick={() => navigate(`/Profile?user=${req.requester_id}`)}
                    title={`View ${req.requester_name}'s profile`}
                  >
                    <div className="avatar-circle">
                      {(req.requester_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                        {req.requester_name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        Sent connection request
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => acceptConnection(req.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Check style={{ width: '0.875rem', height: '0.875rem' }} />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectConnection(req.id)}
                      className="btn btn-outline btn-sm"
                    >
                      <X style={{ width: '0.875rem', height: '0.875rem' }} />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: DISCOVER STUDENTS */}
      {tab === 'discover' && (
        <div>
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1rem',
                  height: '1rem',
                  color: 'var(--muted-foreground)'
                }}
              />
              <input
                type="text"
                className="input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search students by name, skill, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              {colleges.map((col) => (
                <option key={col} value={col}>
                  {col === 'All' ? 'All Colleges' : col}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {discoverStudents.map((student) => {
              const isConnected = connectedIds.includes(student.id);
              const isPending = sentPendingIds.includes(student.id);
              const incomingRequest = pendingRequests.find((r) => r.requester_id === student.id);

              return (
                <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-content" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', cursor: 'pointer' }}
                      onClick={() => navigate(`/Profile?user=${student.id}`)}
                      title={`View ${student.full_name}'s profile`}
                    >
                      <div className="avatar-circle">
                        {(student.full_name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                            {student.full_name}
                          </span>
                          {student.is_verified_mentor && (
                            <CheckCircle style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent)' }} />
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          {student.college} • {student.branch}
                        </p>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    {student.skills && student.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                        {student.skills.map((skill) => (
                          <span key={skill} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                      {isConnected ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/Chat?user=${student.id}&name=${encodeURIComponent(student.full_name)}`)}
                          className="btn btn-outline btn-sm"
                          style={{ width: '100%' }}
                        >
                          <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
                          Message
                        </button>
                      ) : incomingRequest ? (
                        <button
                          type="button"
                          onClick={() => acceptConnection(incomingRequest.id)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', backgroundColor: '#10b981' }}
                        >
                          <Check style={{ width: '0.85rem', height: '0.85rem' }} />
                          Accept Request
                        </button>
                      ) : isPending ? (
                        <button
                          type="button"
                          disabled
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%' }}
                        >
                          Requested
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendConnectionRequest(student.id)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                        >
                          <UserPlus style={{ width: '0.85rem', height: '0.85rem' }} />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
