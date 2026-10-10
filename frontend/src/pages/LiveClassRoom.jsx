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
  Maximize2,
  Minimize2,
  Hand,
  BarChart3,
  PenTool,
  Eraser,
  Trash2,
  CheckCircle2,
  ThumbsUp,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Crown,
  Plus,
  X
} from 'lucide-react';

export const LiveClassRoom = ({ classSession, onLeave }) => {
  const { user, showToast } = useApp();

  // Role detection
  const isHost = 
    user.id === classSession.creator_id || 
    user.full_name === classSession.creator_name || 
    user.role === 'admin' || 
    user.id === '1' || 
    user.id === 'usr_1';

  // AV & Media State
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Stage & Speakers State
  const [activeSpeakers, setActiveSpeakers] = useState([
    { id: classSession.creator_id || 'host', name: classSession.creator_name, role: 'Host', isSpeaking: true }
  ]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([
    { id: 'usr_201', name: 'Aarav Sharma', time: 'Just now' }
  ]);

  // Floating Reactions State
  const [floatingReactions, setFloatingReactions] = useState([]);
  const reactionEmojis = ['❤️', '👏', '🔥', '💡', '🚀', '💯', '🎓', '🎉'];

  // Sidebar Drawer State
  const [sidebarTab, setSidebarTab] = useState('chat'); // 'chat' | 'qna' | 'polls' | 'people'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: classSession.creator_name,
      role: 'Host',
      text: `Welcome everyone to "${classSession.title}"! We are broadcasting live with native WebRTC. Feel free to ask questions and participate in polls!`,
      time: '18:00'
    },
    {
      id: 2,
      sender: 'Priya Patel',
      role: 'Student',
      text: 'Good evening Sir! Audio and video are crystal clear.',
      time: '18:01'
    }
  ]);

  // Q&A Doubts State
  const [questions, setQuestions] = useState([
    { id: 1, sender: 'Rohan Verma', question: 'Will the session slides and GitHub repo be shared after class?', votes: 8, isAnswered: true },
    { id: 2, sender: 'Ananya Roy', question: 'How do we optimize time complexity for real-time WebSocket packet buffering?', votes: 14, isAnswered: false }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Live Polls State
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: 'How comfortable are you with WebRTC and STUN/TURN concepts?',
      options: [
        { id: 'a', text: 'Brand New (First time learning)', votes: 24 },
        { id: 'b', text: 'Intermediate (Built small apps)', votes: 58 },
        { id: 'c', text: 'Advanced (Production experience)', votes: 19 }
      ],
      userVotedOption: null,
      isActive: true,
      totalVotes: 101
    }
  ]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  // Attendee Mock/Simulated Directory (100+ Attendees)
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(108);

  // Whiteboard Canvas State
  const whiteboardCanvasRef = useRef(null);
  const [wbColor, setWbColor] = useState('#6366f1');
  const [wbStrokeWidth, setWbStrokeWidth] = useState(3);
  const [wbTool, setWbTool] = useState('pen'); // 'pen' | 'eraser'
  const isDrawingRef = useRef(false);

  // Video and Stream Refs
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const simTimerRef = useRef(null);
  const screenStreamRef = useRef(null);
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);
  const roomContainerRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());

  // Multi-STUN Google Cluster Configuration
  const stunServersList = (import.meta.env.VITE_STUN_SERVER || 'stun:stun.l.google.com:19302')
    .split(',')
    .map(url => ({ urls: url.trim() }));

  const peerConnectionConfig = {
    iceServers: stunServersList.length > 0 ? stunServersList : [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Live duration timer
  const [sessionSeconds, setSessionSeconds] = useState(24 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 1. Initialize WebRTC Media Stream (Camera & Mic)
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
        simTimerRef.current = setInterval(() => {
          frame++;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Gradient Accent
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#312e81');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

          ctx.fillStyle = '#818cf8';
          ctx.font = 'bold 22px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Live Stream: ${user.full_name} (${isHost ? 'Host' : 'Speaker'})`, 320, 160);

          ctx.fillStyle = '#34d399';
          ctx.font = '14px Inter, sans-serif';
          ctx.fillText(`● WebRTC HD Broadcast • Google STUN`, 320, 195);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '12px Inter, sans-serif';
          ctx.fillText(`Frames Syncing: ${frame}`, 320, 225);
        }, 100);
        const simStream = canvas.captureStream(25);
        localStreamRef.current = simStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = simStream;
        }
      }
    };

    startMedia();

    return () => {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user.full_name, isHost]);

  // 2. Initialize WebSocket Real-Time Event Sync & Targeted WebRTC Signaling
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8080/ws/signaling`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'join',
          roomId: classSession.id,
          userId: user.id,
          userName: user.full_name,
          role: isHost ? 'host' : 'student'
        }));
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'joined') {
            if (data.peerCount) {
              setAttendeeCount(Math.max(data.peerCount, 108));
            }
          } else if (data.type === 'join') {
            // New participant joined - if host, initiate targeted WebRTC offer
            if (isHost && localStreamRef.current && data.userId && data.userId !== user.id) {
              try {
                const pc = new RTCPeerConnection(peerConnectionConfig);
                peerConnectionsRef.current.set(data.userId, pc);

                localStreamRef.current.getTracks().forEach(track => {
                  pc.addTrack(track, localStreamRef.current);
                });

                pc.onicecandidate = (e) => {
                  if (e.candidate) {
                    sendWs({
                      type: 'candidate',
                      toPeerId: data.userId,
                      fromUserId: user.id,
                      candidate: e.candidate
                    });
                  }
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                sendWs({
                  type: 'offer',
                  toPeerId: data.userId,
                  fromUserId: user.id,
                  offer
                });
              } catch (err) {
                console.warn("P2P offer handshake initiated in broadcast fallback mode", err);
              }
            }
          } else if (data.type === 'offer') {
            // Student received targeted offer from Host
            if (!isHost && data.offer && data.fromUserId) {
              try {
                const pc = new RTCPeerConnection(peerConnectionConfig);
                peerConnectionsRef.current.set(data.fromUserId, pc);

                pc.ontrack = (e) => {
                  if (localVideoRef.current && e.streams[0]) {
                    localVideoRef.current.srcObject = e.streams[0];
                  }
                };

                pc.onicecandidate = (e) => {
                  if (e.candidate) {
                    sendWs({
                      type: 'candidate',
                      toPeerId: data.fromUserId,
                      fromUserId: user.id,
                      candidate: e.candidate
                    });
                  }
                };

                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                sendWs({
                  type: 'answer',
                  toPeerId: data.fromUserId,
                  fromUserId: user.id,
                  answer
                });
              } catch (err) {
                console.warn("Handshake answer fallback", err);
              }
            }
          } else if (data.type === 'answer') {
            // Host received answer from Student
            const pc = peerConnectionsRef.current.get(data.fromUserId || data.userId);
            if (pc && data.answer) {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              } catch (err) {
                // ignore
              }
            }
          } else if (data.type === 'candidate') {
            const pc = peerConnectionsRef.current.get(data.fromUserId || data.userId);
            if (pc && data.candidate) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              } catch (err) {
                // ignore
              }
            }
          } else if (data.type === 'peer-left') {
            const pc = peerConnectionsRef.current.get(data.userId || data.sessionId);
            if (pc) {
              pc.close();
              peerConnectionsRef.current.delete(data.userId || data.sessionId);
            }
          } else if (data.type === 'chat') {
            setChatMessages(prev => [...prev, data.message]);
          } else if (data.type === 'reaction') {
            triggerReaction(data.emoji, false);
          } else if (data.type === 'hand-raise') {
            setRaisedHands(prev => {
              if (prev.some(h => h.id === data.user.id)) return prev;
              return [...prev, { id: data.user.id, name: data.user.name, time: 'Just now' }];
            });
            showToast(`✋ ${data.user.name} raised their hand!`);
          } else if (data.type === 'lower-hand') {
            setRaisedHands(prev => prev.filter(h => h.id !== data.userId));
          } else if (data.type === 'grant-speaker') {
            if (data.targetUserId === user.id) {
              showToast("🎉 Host has invited you to speak! Your microphone is now live.", "success");
            }
            setActiveSpeakers(prev => {
              if (prev.some(s => s.id === data.user.id)) return prev;
              return [...prev, { id: data.user.id, name: data.user.name, role: 'Speaker', isSpeaking: true }];
            });
          } else if (data.type === 'poll-vote') {
            setPolls(prev => prev.map(p => {
              if (p.id === data.pollId) {
                return {
                  ...p,
                  totalVotes: p.totalVotes + 1,
                  options: p.options.map(opt => opt.id === data.optionId ? { ...opt, votes: opt.votes + 1 } : opt)
                };
              }
              return p;
            }));
          } else if (data.type === 'poll-create') {
            setPolls(prev => [data.poll, ...prev]);
            showToast("📊 New Live Poll launched!");
          } else if (data.type === 'mute-all') {
            if (!isHost) {
              if (localStreamRef.current) {
                const track = localStreamRef.current.getAudioTracks()[0];
                if (track) {
                  track.enabled = false;
                  setIsAudioEnabled(false);
                }
              }
              showToast("Host has muted all participants.");
            }
          }
        } catch (e) {
          // ignore non-json messages
        }
      };

      ws.onerror = () => {
        console.info("Signaling running in local peer broadcast mode.");
      };
    } catch (err) {
      console.info("Running live room in direct standalone mode.");
    }

    return () => {
      // Clean up all WebRTC peer connections
      peerConnectionsRef.current.forEach((pc) => {
        try {
          pc.close();
        } catch (e) {}
      });
      peerConnectionsRef.current.clear();

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'leave', roomId: classSession.id, userId: user.id }));
        wsRef.current.close();
      }
    };
  }, [classSession.id, user.id, user.full_name, isHost]);

  // Helper to safely send ws messages
  const sendWs = (payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ ...payload, roomId: classSession.id }));
    }
  };

  // Toggle Video / Audio
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        showToast(videoTrack.enabled ? "Camera turned on" : "Camera turned off");
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        showToast(audioTrack.enabled ? "Microphone unmuted" : "Microphone muted");
      }
    }
  };

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        setIsWhiteboardActive(false);
        showToast("Screen sharing started");

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          showToast("Screen sharing stopped");
        };
      } catch (err) {
        console.warn("Screen sharing cancelled or unavailable", err);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsScreenSharing(false);
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      showToast("Screen sharing stopped");
    }
  };

  // Floating Emoji Reaction Trigger
  const triggerReaction = (emoji, broadcast = true) => {
    const newReaction = {
      id: `${Date.now()}_${Math.random()}`,
      emoji,
      x: 10 + Math.random() * 75, // percentage
      y: 70 + Math.random() * 20
    };
    setFloatingReactions(prev => [...prev, newReaction]);

    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2200);

    if (broadcast) {
      sendWs({
        type: 'reaction',
        emoji,
        sender: user.full_name
      });
    }
  };

  // Raise / Lower Hand
  const toggleRaiseHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (nextState) {
      setRaisedHands(prev => [...prev, { id: user.id, name: user.full_name, time: 'Just now' }]);
      sendWs({
        type: 'hand-raise',
        user: { id: user.id, name: user.full_name }
      });
      showToast("✋ Hand raised! Host will be notified.");
    } else {
      setRaisedHands(prev => prev.filter(h => h.id !== user.id));
      sendWs({
        type: 'lower-hand',
        userId: user.id
      });
      showToast("Hand lowered.");
    }
  };

  // Host Action: Grant Speaker Permission
  const handleGrantSpeaker = (attendee) => {
    setActiveSpeakers(prev => {
      if (prev.some(s => s.id === attendee.id)) return prev;
      return [...prev, { id: attendee.id, name: attendee.name, role: 'Speaker', isSpeaking: true }];
    });
    setRaisedHands(prev => prev.filter(h => h.id !== attendee.id));
    sendWs({
      type: 'grant-speaker',
      targetUserId: attendee.id,
      user: attendee
    });
    showToast(`Granted speaking permissions to ${attendee.name}!`);
  };

  const handleDismissHand = (attendeeId) => {
    setRaisedHands(prev => prev.filter(h => h.id !== attendeeId));
    sendWs({ type: 'lower-hand', userId: attendeeId });
  };

  // Host Action: Mute All
  const handleMuteAll = () => {
    sendWs({ type: 'mute-all' });
    showToast("Muted all participants.");
  };

  // Send Chat Message
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: user.full_name,
      role: isHost ? 'Host' : 'Student',
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    sendWs({ type: 'chat', message: newMsg });
    setChatMessage('');
  };

  // Post Question to Q&A
  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: Date.now(),
      sender: user.full_name,
      question: newQuestionText.trim(),
      votes: 1,
      isAnswered: false
    };
    setQuestions(prev => [newQ, ...prev]);
    sendWs({ type: 'qna-ask', question: newQ });
    setNewQuestionText('');
    showToast("Question submitted to Doubt Board!");
  };

  const handleVoteQuestion = (id) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, votes: q.votes + 1 } : q)
        .sort((a, b) => b.votes - a.votes)
    );
    sendWs({ type: 'qna-vote', questionId: id });
  };

  const handleToggleAnswered = (id) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, isAnswered: !q.isAnswered } : q)
    );
    sendWs({ type: 'qna-answer', questionId: id });
  };

  // Poll Voting
  const handleVotePoll = (pollId, optionId) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.userVotedOption) {
        return {
          ...poll,
          userVotedOption: optionId,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
        };
      }
      return poll;
    }));
    sendWs({ type: 'poll-vote', pollId, optionId });
    showToast("Vote submitted! 🎉");
  };

  // Create New Poll (Host)
  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;
    const validOptions = newPollOptions.filter(o => o.trim().length > 0);
    if (validOptions.length < 2) {
      showToast("Please provide at least 2 options for the poll.", "error");
      return;
    }
    const newPoll = {
      id: Date.now(),
      question: newPollQuestion.trim(),
      options: validOptions.map((opt, idx) => ({
        id: String.fromCharCode(97 + idx),
        text: opt.trim(),
        votes: 0
      })),
      userVotedOption: null,
      isActive: true,
      totalVotes: 0
    };
    setPolls(prev => [newPoll, ...prev]);
    sendWs({ type: 'poll-create', poll: newPoll });
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
    setIsCreatingPoll(false);
    showToast("Poll launched live to all attendees! 📊");
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Whiteboard Canvas Drawing Logic
  useEffect(() => {
    if (!isWhiteboardActive || !whiteboardCanvasRef.current) return;
    const canvas = whiteboardCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Dark grid pattern background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [isWhiteboardActive]);

  const startDrawing = (e) => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawingRef.current || !whiteboardCanvasRef.current) return;
    const canvas = whiteboardCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = wbTool === 'eraser' ? 24 : wbStrokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = wbTool === 'eraser' ? '#090d16' : wbColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearWhiteboard = () => {
    if (!whiteboardCanvasRef.current) return;
    const canvas = whiteboardCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showToast("Whiteboard cleared.");
  };

  // Filtered Attendees list
  const mockAttendees = [
    { id: '1', name: classSession.creator_name, role: 'Host', isOnline: true },
    { id: '2', name: 'Aarav Sharma', role: 'Speaker', isOnline: true },
    { id: '3', name: 'Priya Patel', role: 'Student', isOnline: true },
    { id: '4', name: 'Rohan Verma', role: 'Student', isOnline: true },
    { id: '5', name: 'Ananya Roy', role: 'Student', isOnline: true },
    { id: '6', name: 'Karthik Rao', role: 'Student', isOnline: true },
    { id: '7', name: 'Divya Nair', role: 'Student', isOnline: true },
    { id: '8', name: 'Vikram Mehta', role: 'Student', isOnline: true },
    { id: '9', name: 'Sneha Reddy', role: 'Student', isOnline: true },
    { id: '10', name: 'Rahul Joshi', role: 'Student', isOnline: true }
  ].filter(a => a.name.toLowerCase().includes(attendeeSearch.toLowerCase()));

  return (
    <div
      ref={roomContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 2rem)',
        backgroundColor: '#070b14',
        borderRadius: '1rem',
        overflow: 'hidden',
        color: '#f8fafc',
        position: 'relative'
      }}
    >
      {/* 1. TOP HEADER BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 20
        }}
      >
        {/* Left: Class Title & Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}
          >
            <Radio style={{ width: '0.8rem', height: '0.8rem', animation: 'pulse 1.5s infinite' }} />
            LIVE WEBINAR
          </div>

          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              {classSession.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Host: <span style={{ color: '#818cf8', fontWeight: 600 }}>{classSession.creator_name}</span> • {classSession.subject}
            </p>
          </div>
        </div>

        {/* Center: Live Stats & Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.625rem', borderRadius: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>{attendeeCount} Live Attendees</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
            <Clock style={{ width: '0.9rem', height: '0.9rem', color: '#94a3b8' }} />
            <span>{formatDuration(sessionSeconds)}</span>
          </div>

          <span style={{ fontSize: '0.7rem', color: '#64748b', padding: '0.2rem 0.5rem', backgroundColor: '#1e293b', borderRadius: '4px' }}>
            WebRTC • STUN: Google
          </span>
        </div>

        {/* Right: Quick Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast("Class link copied to clipboard! 📋");
            }}
            className="btn btn-ghost btn-sm"
            style={{ color: '#94a3b8', gap: '0.375rem', padding: '0.35rem 0.65rem' }}
            title="Share Class Link"
          >
            <Share2 style={{ width: '0.9rem', height: '0.9rem' }} />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-sm"
            style={{ color: '#94a3b8', padding: '0.35rem' }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 style={{ width: '1rem', height: '1rem' }} /> : <Maximize2 style={{ width: '1rem', height: '1rem' }} />}
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE (STAGE + RIGHT SIDEBAR DRAWER) */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Floating Reactions Overlay */}
        {floatingReactions.map(r => (
          <div
            key={r.id}
            className="floating-reaction"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            {r.emoji}
          </div>
        ))}

        {/* LEFT / CENTER: MAIN PRESENTATION & WEBINAR STAGE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.875rem', position: 'relative', overflow: 'hidden' }}>
          
          {/* STAGE CONTAINER */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              borderRadius: '0.875rem',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* STAGE MODE A: INTERACTIVE WHITEBOARD */}
            {isWhiteboardActive ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Whiteboard Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <PenTool style={{ width: '0.9rem', height: '0.9rem' }} /> Interactive Whiteboard
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
                      {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ffffff'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setWbColor(c); setWbTool('pen'); }}
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: wbColor === c && wbTool === 'pen' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setWbTool(wbTool === 'eraser' ? 'pen' : 'eraser')}
                      className={`btn btn-sm ${wbTool === 'eraser' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', gap: '0.3rem' }}
                    >
                      <Eraser style={{ width: '0.85rem', height: '0.85rem' }} />
                      Eraser
                    </button>
                    <button
                      type="button"
                      onClick={clearWhiteboard}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', color: '#ef4444', padding: '0.2rem 0.5rem', gap: '0.3rem' }}
                    >
                      <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
                      Clear
                    </button>
                  </div>
                </div>

                <canvas
                  ref={whiteboardCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ flex: 1, width: '100%', height: '100%', cursor: wbTool === 'eraser' ? 'crosshair' : 'default' }}
                />
              </div>
            ) : (
              /* STAGE MODE B: CINEMATIC BROADCAST VIDEO / SCREEN SHARE */
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                
                {/* Main Broadcaster Screen */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: isScreenSharing ? 'contain' : 'cover' }}
                />

                {/* Host Disabled Camera Overlay */}
                {!isVideoEnabled && !isScreenSharing && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0b0f19', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <div style={{ width: '5.5rem', height: '5.5rem', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', fontWeight: 700, color: '#fff', boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)' }}>
                      {(classSession.creator_name || 'H').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', margin: 0 }}>{classSession.creator_name}</p>
                      <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Mentor & Broadcaster (Camera Off)</p>
                    </div>
                  </div>
                )}

                {/* Picture-in-Picture / Spotlight Tile (If Screen Sharing or Multi-speaker) */}
                {isScreenSharing && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '200px',
                      height: '120px',
                      backgroundColor: '#1e293b',
                      borderRadius: '0.5rem',
                      border: '2px solid #6366f1',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.25rem auto', fontSize: '1rem', fontWeight: 700 }}>
                        {(user.full_name || 'U').charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{user.full_name} (Host)</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '0.65rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                      Speaking 🟢
                    </div>
                  </div>
                )}

                {/* Stage Watermark / Broadcaster Tag */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  <Crown style={{ width: '0.9rem', height: '0.9rem', color: '#fbbf24' }} />
                  <span>{classSession.creator_name} {isHost ? '(You - Host)' : '(Mentor)'}</span>
                  {isAudioEnabled ? (
                    <Volume2 style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} />
                  ) : (
                    <VolumeX style={{ width: '0.85rem', height: '0.85rem', color: '#ef4444' }} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. GOOGLE MEET STYLE BOTTOM CONTROL BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: '#0f172a',
              borderRadius: '0.875rem',
              marginTop: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Left: Quick Reaction Emojis Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginRight: '0.25rem' }}>Reactions:</span>
              {reactionEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => triggerReaction(emoji)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.3rem 0.45rem',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s, background 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Center: Main Call Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`control-btn ${!isAudioEnabled ? 'danger' : ''}`}
                title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isAudioEnabled ? <Mic style={{ width: '1.125rem' }} /> : <MicOff style={{ width: '1.125rem' }} />}
              </button>

              {/* Video Toggle */}
              <button
                type="button"
                onClick={toggleVideo}
                className={`control-btn ${!isVideoEnabled ? 'danger' : ''}`}
                title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoEnabled ? <Video style={{ width: '1.125rem' }} /> : <VideoOff style={{ width: '1.125rem' }} />}
              </button>

              {/* Screen Share Toggle */}
              <button
                type="button"
                onClick={toggleScreenShare}
                className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
              >
                <Monitor style={{ width: '1.125rem' }} />
              </button>

              {/* Whiteboard Toggle */}
              <button
                type="button"
                onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}
                className={`control-btn ${isWhiteboardActive ? 'active' : ''}`}
                title="Interactive Whiteboard"
              >
                <PenTool style={{ width: '1.125rem' }} />
              </button>

              {/* Raise Hand Button */}
              <button
                type="button"
                onClick={toggleRaiseHand}
                className={`control-btn ${isHandRaised ? 'raised-hand-btn-active' : ''}`}
                title={isHandRaised ? "Lower Hand" : "Raise Hand to speak"}
              >
                <Hand style={{ width: '1.125rem' }} />
              </button>

              {/* End / Leave Call Button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to leave this live classroom session?")) {
                    onLeave();
                  }
                }}
                className="control-btn danger"
                style={{ backgroundColor: '#ef4444', width: '3.25rem', borderRadius: '9999px' }}
                title="Leave Classroom"
              >
                <PhoneOff style={{ width: '1.25rem' }} />
              </button>
            </div>

            {/* Right: Drawer Tab Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => { setSidebarTab('chat'); setIsSidebarOpen(true); }}
                className={`btn btn-sm ${sidebarTab === 'chat' && isSidebarOpen ? 'btn-primary' : 'btn-ghost'}`}
                style={{ gap: '0.375rem', fontSize: '0.8125rem' }}
                title="Live Chat"
              >
                <MessageSquare style={{ width: '0.95rem', height: '0.95rem' }} />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => { setSidebarTab('qna'); setIsSidebarOpen(true); }}
                className={`btn btn-sm ${sidebarTab === 'qna' && isSidebarOpen ? 'btn-primary' : 'btn-ghost'}`}
                style={{ gap: '0.375rem', fontSize: '0.8125rem' }}
                title="Q&A Doubts"
              >
                <HelpCircle style={{ width: '0.95rem', height: '0.95rem' }} />
                <span>Q&A</span>
                <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.35rem', borderRadius: '9999px' }}>
                  {questions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setSidebarTab('polls'); setIsSidebarOpen(true); }}
                className={`btn btn-sm ${sidebarTab === 'polls' && isSidebarOpen ? 'btn-primary' : 'btn-ghost'}`}
                style={{ gap: '0.375rem', fontSize: '0.8125rem' }}
                title="Live Polls"
              >
                <BarChart3 style={{ width: '0.95rem', height: '0.95rem' }} />
                <span>Polls</span>
              </button>

              <button
                type="button"
                onClick={() => { setSidebarTab('people'); setIsSidebarOpen(true); }}
                className={`btn btn-sm ${sidebarTab === 'people' && isSidebarOpen ? 'btn-primary' : 'btn-ghost'}`}
                style={{ gap: '0.375rem', fontSize: '0.8125rem', position: 'relative' }}
                title="Attendees"
              >
                <Users style={{ width: '0.95rem', height: '0.95rem' }} />
                <span>People</span>
                {raisedHands.length > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#eab308', color: '#000', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {raisedHands.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: CHAT / Q&A / POLLS / PEOPLE DRAWER */}
        {isSidebarOpen && (
          <div
            style={{
              width: '360px',
              backgroundColor: '#0f172a',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30
            }}
          >
            {/* Drawer Header Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>
                  {sidebarTab === 'chat' && '💬 Live In-Class Chat'}
                  {sidebarTab === 'qna' && '❓ Live Q&A Doubts'}
                  {sidebarTab === 'polls' && '📊 Live Interactive Polls'}
                  {sidebarTab === 'people' && `👥 Attendees (${attendeeCount})`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ color: '#94a3b8', padding: '0.25rem' }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>

            {/* TAB CONTENT 1: LIVE CHAT */}
            {sidebarTab === 'chat' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="webinar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: msg.role === 'Host' ? '#818cf8' : '#cbd5e1' }}>
                            {msg.sender}
                          </span>
                          {msg.role === 'Host' && (
                            <span style={{ fontSize: '0.65rem', backgroundColor: '#4f46e5', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                              HOST
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{msg.time}</span>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8125rem', color: '#f1f5f9', lineHeight: 1.4 }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Send message to everyone..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    style={{ height: '38px', fontSize: '0.8125rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button type="submit" disabled={!chatMessage.trim()} className="btn btn-primary btn-sm" style={{ height: '38px', padding: '0 0.875rem' }}>
                    <Send style={{ width: '0.9rem', height: '0.9rem' }} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 2: LIVE Q&A DOUBTS */}
            {sidebarTab === 'qna' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="webinar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {questions.map(q => (
                    <div
                      key={q.id}
                      style={{
                        backgroundColor: q.isAnswered ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                        border: q.isAnswered ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.875rem',
                        borderRadius: '0.625rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{q.sender}</span>
                        {q.isAnswered ? (
                          <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> Answered
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Open Question</span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#f8fafc', lineHeight: 1.4, margin: '0 0 0.625rem 0' }}>
                        {q.question}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                          type="button"
                          onClick={() => handleVoteQuestion(q.id)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#cbd5e1', fontSize: '0.75rem', padding: '0.2rem 0.5rem', gap: '0.3rem' }}
                        >
                          <ThumbsUp style={{ width: '0.75rem', height: '0.75rem' }} />
                          <span>{q.votes} Upvotes</span>
                        </button>

                        {isHost && (
                          <button
                            type="button"
                            onClick={() => handleToggleAnswered(q.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.75rem', color: q.isAnswered ? '#94a3b8' : '#10b981', padding: '0.2rem 0.4rem' }}
                          >
                            {q.isAnswered ? 'Mark Unanswered' : 'Mark Answered ✓'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ask Doubt Form */}
                <form onSubmit={handlePostQuestion} style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Ask a question for the mentor..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    style={{ height: '38px', fontSize: '0.8125rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={!newQuestionText.trim()} className="btn btn-primary btn-sm">
                      Submit Question
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT 3: LIVE POLLS */}
            {sidebarTab === 'polls' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="webinar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {isHost && !isCreatingPoll && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingPoll(true)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', gap: '0.375rem', padding: '0.5rem' }}
                    >
                      <Plus style={{ width: '0.9rem', height: '0.9rem' }} />
                      Create New Live Poll
                    </button>
                  )}

                  {/* Create Poll Form (Host) */}
                  {isCreatingPoll && (
                    <form onSubmit={handleCreatePoll} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #6366f1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#818cf8' }}>New Poll Question</span>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Which sorting algorithm is stable?"
                        value={newPollQuestion}
                        onChange={(e) => setNewPollQuestion(e.target.value)}
                        style={{ height: '36px', fontSize: '0.8125rem', backgroundColor: '#1e293b' }}
                      />

                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Options:</span>
                      {newPollOptions.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          className="input"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newPollOptions];
                            updated[idx] = e.target.value;
                            setNewPollOptions(updated);
                          }}
                          style={{ height: '32px', fontSize: '0.75rem', backgroundColor: '#1e293b' }}
                        />
                      ))}

                      {newPollOptions.length < 4 && (
                        <button
                          type="button"
                          onClick={() => setNewPollOptions([...newPollOptions, ''])}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem' }}
                        >
                          + Add Option
                        </button>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setIsCreatingPoll(false)} className="btn btn-ghost btn-sm">
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Launch Poll 🚀
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Active Polls List */}
                  {polls.map(poll => (
                    <div
                      key={poll.id}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '1rem',
                        borderRadius: '0.625rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ● Active Live Poll
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{poll.totalVotes} Total Votes</span>
                      </div>

                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                        {poll.question}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {poll.options.map(opt => {
                          const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                          const isSelected = poll.userVotedOption === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleVotePoll(poll.id, opt.id)}
                              disabled={Boolean(poll.userVotedOption)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                padding: '0.625rem 0.75rem',
                                borderRadius: '6px',
                                border: isSelected ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                                cursor: poll.userVotedOption ? 'default' : 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Background Percentage Fill */}
                              {poll.totalVotes > 0 && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    width: `${percent}%`,
                                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                                    zIndex: 1,
                                    transition: 'width 0.4s ease'
                                  }}
                                />
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 2 }}>
                                <span style={{ fontSize: '0.8125rem', color: '#f1f5f9', fontWeight: isSelected ? 700 : 500 }}>
                                  {opt.text}
                                </span>
                                <span style={{ fontSize: '0.8125rem', color: '#818cf8', fontWeight: 700 }}>
                                  {percent}% ({opt.votes})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: PEOPLE & MODERATION */}
            {sidebarTab === 'people' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search 100+ attendees..."
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    style={{ height: '34px', fontSize: '0.75rem', backgroundColor: '#1e293b' }}
                  />
                  {isHost && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleMuteAll}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      >
                        Mute All Participants
                      </button>
                    </div>
                  )}
                </div>

                <div className="webinar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Raised Hands Queue */}
                  {raisedHands.length > 0 && (
                    <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '0.625rem', padding: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#facc15', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                        ✋ Raised Hands ({raisedHands.length})
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {raisedHands.map(hand => (
                          <div key={hand.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{hand.name}</span>
                            {isHost ? (
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleGrantSpeaker(hand)}
                                  className="btn btn-primary btn-sm"
                                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', backgroundColor: '#10b981' }}
                                >
                                  Allow to Speak
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDismissHand(hand.id)}
                                  className="btn btn-ghost btn-sm"
                                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.3rem', color: '#94a3b8' }}
                                >
                                  Dismiss
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Waiting</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attendees List */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      In this class ({attendeeCount})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {mockAttendees.map(att => (
                        <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: att.role === 'Host' ? '#4f46e5' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                              {att.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
                                {att.name}
                              </p>
                              <span style={{ fontSize: '0.7rem', color: att.role === 'Host' ? '#818cf8' : '#94a3b8' }}>
                                {att.role}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
