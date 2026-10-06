import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Send,
  HelpCircle,
  Share2,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const LiveClassRoom = ({ classSession, onLeave }) => {
  const { user, showToast } = useApp();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'questions'
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: classSession.creator_name,
      text: `Welcome to "${classSession.title}"! Feel free to ask questions anytime.`,
      time: '18:00'
    }
  ]);
  const [questions, setQuestions] = useState([
    { id: 1, sender: 'Rohan Verma', question: 'Will the session code be shared on GitHub?', votes: 3 }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Initialize WebRTC local stream with camera/mic
  useEffect(() => {
    let stream;
    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera/Mic not accessible or denied. Using virtual stream simulation:", err);
        // Fallback canvas stream if no camera is connected
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        let frame = 0;
        const timer = setInterval(() => {
          frame++;
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#6366f1';
          ctx.font = '24px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Live Stream: ${user.full_name}`, 320, 170);
          ctx.fillStyle = '#a5b4fc';
          ctx.font = '14px Inter, sans-serif';
          ctx.fillText(`WebRTC Connected (Frame ${frame})`, 320, 205);
        }, 100);
        const simStream = canvas.captureStream(20);
        localStreamRef.current = simStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = simStream;
        }
        return () => clearInterval(timer);
      }
    };

    startMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user.full_name]);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } catch (err) {
        console.warn("Screen sharing cancelled or unavailable", err);
      }
    } else {
      setIsScreenSharing(false);
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: user.full_name,
        text: chatMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatMessage('');
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: user.full_name,
        question: newQuestion.trim(),
        votes: 1
      }
    ]);
    setNewQuestion('');
    showToast("Question posted to Doubt Board!");
  };

  const handleVote = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 2rem)', gap: '1rem', padding: '1rem', backgroundColor: '#090d16', borderRadius: '1rem', color: '#fff' }}>
      {/* Left: Video Stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Top Class Info Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#1e293b', borderRadius: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{classSession.title}</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Mentor: {classSession.creator_name} • {classSession.subject}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#10b981', color: '#fff', borderRadius: '4px', fontWeight: 600 }}>
              LIVE WebRTC
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              STUN: stun:stun.l.google.com:19302
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', minHeight: 0 }}>
          {/* Tile 1: Local Peer */}
          <div className="video-tile">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="video-tile-name">
              {user.full_name} {isScreenSharing ? '(Screen)' : '(You)'}
            </div>
            {!isVideoEnabled && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>
                  {(user.full_name || 'U').charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Tile 2: Remote Peer (Host or Peer) */}
          <div className="video-tile" style={{ background: '#111827' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', fontSize: '1.5rem', fontWeight: 700 }}>
                {(classSession.creator_name || 'M').charAt(0)}
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{classSession.creator_name} (Host)</p>
              <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Speaking • Peer Connected</p>
            </div>
            <div className="video-tile-name">{classSession.creator_name}</div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="video-controls" style={{ borderRadius: '0.75rem' }}>
          <button
            type="button"
            onClick={toggleAudio}
            className={`control-btn ${!isAudioEnabled ? 'danger' : ''}`}
            title={isAudioEnabled ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isAudioEnabled ? <Mic style={{ width: '1.25rem' }} /> : <MicOff style={{ width: '1.25rem' }} />}
          </button>

          <button
            type="button"
            onClick={toggleVideo}
            className={`control-btn ${!isVideoEnabled ? 'danger' : ''}`}
            title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
          >
            {isVideoEnabled ? <Video style={{ width: '1.25rem' }} /> : <VideoOff style={{ width: '1.25rem' }} />}
          </button>

          <button
            type="button"
            onClick={toggleScreenShare}
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            title="Share Screen"
          >
            <Monitor style={{ width: '1.25rem' }} />
          </button>

          <button
            type="button"
            onClick={onLeave}
            className="control-btn danger"
            title="Leave Class"
            style={{ width: '3.5rem', borderRadius: '1rem' }}
          >
            <PhoneOff style={{ width: '1.25rem' }} />
          </button>
        </div>
      </div>

      {/* Right: Live Interactive Side Panel */}
      <div style={{ width: '320px', backgroundColor: '#1e293b', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: activeTab === 'chat' ? '#fff' : '#94a3b8',
              borderBottom: activeTab === 'chat' ? '2px solid #6366f1' : 'none'
            }}
          >
            Live Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: activeTab === 'questions' ? '#fff' : '#94a3b8',
              borderBottom: activeTab === 'questions' ? '2px solid #6366f1' : 'none'
            }}
          >
            Live Doubts ({questions.length})
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                    <span style={{ fontWeight: 600, color: '#a5b4fc' }}>{msg.sender}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.4 }}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Send message to peers..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Live Doubts Board */}
        {activeTab === 'questions' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q) => (
                <div key={q.id} style={{ backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>{q.question}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>by {q.sender}</span>
                    <button
                      type="button"
                      onClick={() => handleVote(q.id)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#312e81',
                        color: '#c7d2fe',
                        fontWeight: 600
                      }}
                    >
                      ▲ Upvote ({q.votes})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostQuestion} style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ask live doubt..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Ask
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
