import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUsers,
  initialPosts,
  initialComments,
  initialDoubts,
  initialDoubtReplies,
  initialClasses,
  initialConnections,
  initialMessages,
  initialMentorApplications,
  initialPlatformSettings
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial states from localStorage if available, otherwise default to mock data
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('studyloop_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('studyloop_current_user_id') || 'usr_1';
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('studyloop_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('studyloop_comments');
    return saved ? JSON.parse(saved) : initialComments;
  });

  const [doubts, setDoubts] = useState(() => {
    const saved = localStorage.getItem('studyloop_doubts');
    return saved ? JSON.parse(saved) : initialDoubts;
  });

  const [doubtReplies, setDoubtReplies] = useState(() => {
    const saved = localStorage.getItem('studyloop_doubt_replies');
    return saved ? JSON.parse(saved) : initialDoubtReplies;
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('studyloop_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('studyloop_connections');
    return saved ? JSON.parse(saved) : initialConnections;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('studyloop_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [mentorApplications, setMentorApplications] = useState(() => {
    const saved = localStorage.getItem('studyloop_mentor_apps');
    return saved ? JSON.parse(saved) : initialMentorApplications;
  });

  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem('studyloop_settings');
    return saved ? JSON.parse(saved) : initialPlatformSettings;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeClassRoom, setActiveClassRoom] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('studyloop_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('studyloop_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('studyloop_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('studyloop_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('studyloop_doubts', JSON.stringify(doubts));
  }, [doubts]);

  useEffect(() => {
    localStorage.setItem('studyloop_doubt_replies', JSON.stringify(doubtReplies));
  }, [doubtReplies]);

  useEffect(() => {
    localStorage.setItem('studyloop_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('studyloop_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('studyloop_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('studyloop_mentor_apps', JSON.stringify(mentorApplications));
  }, [mentorApplications]);

  useEffect(() => {
    localStorage.setItem('studyloop_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // Current active user object
  const user = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Switch role or specific user for testing
  const switchUser = (roleOrId) => {
    const target = allUsers.find(u => u.id === roleOrId || u.role === roleOrId);
    if (target) {
      setCurrentUserId(target.id);
      showToast(`Switched persona to ${target.full_name} (${target.role.toUpperCase()})`);
    }
  };

  const login = (email, password) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUserId(found.id);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${found.full_name}!`);
      return true;
    } else {
      // Auto-create or login with entered email
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'student',
        college: "Engineering College",
        branch: "Computer Science",
        year: "3rd Year",
        is_verified_mentor: false,
        is_mentor: false,
        rating: 5.0,
        completed_classes: 0,
        skills: ["Java", "React"],
        subjects: ["Computer Science"],
        bio: "Student on ConnectMitraa"
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUserId(newUser.id);
      setIsAuthModalOpen(false);
      showToast(`Welcome to ConnectMitraa, ${newUser.full_name}!`);
      return true;
    }
  };

  const signup = (userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      email: userData.email,
      full_name: userData.full_name || userData.email.split('@')[0],
      role: userData.role || 'student',
      college: userData.college || 'Engineering College',
      branch: userData.branch || 'Computer Science',
      year: '1st Year',
      is_verified_mentor: false,
      is_mentor: false,
      rating: 5.0,
      completed_classes: 0,
      skills: userData.skills ? userData.skills.split(',').map(s => s.trim()) : ["Java"],
      subjects: ["Computer Science"],
      bio: "Excited to learn collaboratively on ConnectMitraa!"
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome, ${newUser.full_name}`);
  };

  const logout = () => {
    // Default to student persona or open login modal
    showToast("Logged out successfully");
    setIsAuthModalOpen(true);
  };

  // POST ACTIONS
  const createPost = (postData) => {
    const newPost = {
      id: `post_${Date.now()}`,
      user_id: user.id,
      author_name: user.full_name,
      author_photo: user.profile_photo || "",
      author_college: user.college || "Student",
      author_verified: user.is_verified_mentor || false,
      post_type: postData.post_type || 'knowledge',
      content: postData.content,
      code_snippet: postData.code_snippet || "",
      likes: 0,
      liked_by: [],
      comments_count: 0,
      created_date: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
    showToast("Post published to community feed!");
  };

  const likePost = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = (p.liked_by || []).includes(user.id);
        const newLikedBy = isLiked
          ? (p.liked_by || []).filter(id => id !== user.id)
          : [...(p.liked_by || []), user.id];
        return {
          ...p,
          likes: newLikedBy.length,
          liked_by: newLikedBy
        };
      }
      return p;
    }));
  };

  const addComment = (postId, content) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      post_id: postId,
      user_id: user.id,
      author_name: user.full_name,
      author_photo: user.profile_photo || "",
      content,
      created_date: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
    showToast("Comment posted!");
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast("Post removed", "info");
  };

  // DOUBT ACTIONS
  const createDoubt = (doubtData) => {
    const newDbt = {
      id: `dbt_${Date.now()}`,
      user_id: user.id,
      author_name: user.full_name,
      author_photo: user.profile_photo || "",
      subject: doubtData.subject,
      topic: doubtData.topic || "",
      question: doubtData.question,
      code_snippet: doubtData.code_snippet || "",
      status: "open",
      replies_count: 0,
      created_date: new Date().toISOString()
    };
    setDoubts(prev => [newDbt, ...prev]);
    showToast("Doubt submitted! Peers will help soon.");
  };

  const replyDoubt = (doubtId, content) => {
    const newReply = {
      id: `drep_${Date.now()}`,
      doubt_id: doubtId,
      user_id: user.id,
      author_name: user.full_name,
      author_photo: user.profile_photo || "",
      content,
      is_solution: false,
      created_date: new Date().toISOString()
    };
    setDoubtReplies(prev => [...prev, newReply]);
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, replies_count: (d.replies_count || 0) + 1 } : d));
    showToast("Answer posted!");
  };

  const resolveDoubt = (doubtId) => {
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, status: "resolved" } : d));
    showToast("Doubt marked as resolved! 🎉");
  };

  const deleteDoubt = (doubtId) => {
    setDoubts(prev => prev.filter(d => d.id !== doubtId));
    showToast("Doubt removed", "info");
  };

  // CLASS ACTIONS
  const createClass = (classData) => {
    const newCls = {
      id: `cls_${Date.now()}`,
      creator_id: user.id,
      creator_name: user.full_name,
      creator_photo: user.profile_photo || "",
      creator_verified: user.is_verified_mentor || false,
      title: classData.title,
      subject: classData.subject,
      topic: classData.topic || "",
      description: classData.description || "",
      scheduled_date: classData.scheduled_date || new Date().toISOString().split('T')[0],
      scheduled_time: classData.scheduled_time || "18:00",
      duration: parseInt(classData.duration) || 60,
      max_participants: parseInt(classData.max_participants) || 50,
      participants_count: 1,
      class_type: classData.class_type || "public",
      is_paid: !!classData.is_paid,
      price: classData.is_paid ? parseInt(classData.price || 0) : 0,
      skill_exchange: !!classData.skill_exchange,
      status: "scheduled",
      meeting_link: `room_${Date.now()}`
    };
    setClasses(prev => [newCls, ...prev]);
    showToast("Class scheduled successfully!");
  };

  const joinClass = (classId) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          participants_count: (c.participants_count || 0) + 1,
          is_user_joined: true
        };
      }
      return c;
    }));
    showToast("You joined this class!");
  };

  const enterClassRoom = (cls) => {
    setActiveClassRoom(cls);
  };

  const leaveClassRoom = () => {
    setActiveClassRoom(null);
  };

  // CONNECTIONS ACTIONS
  const sendConnectionRequest = (receiverId) => {
    const receiver = allUsers.find(u => u.id === receiverId);
    if (!receiver) return;
    const newConn = {
      id: `conn_${Date.now()}`,
      requester_id: user.id,
      requester_name: user.full_name,
      requester_photo: user.profile_photo || "",
      receiver_id: receiver.id,
      receiver_name: receiver.full_name,
      receiver_photo: receiver.profile_photo || "",
      status: "pending",
      created_date: new Date().toISOString()
    };
    setConnections(prev => [...prev, newConn]);
    showToast(`Connection request sent to ${receiver.full_name}`);
  };

  const acceptConnection = (connId) => {
    setConnections(prev => prev.map(c => c.id === connId ? { ...c, status: "accepted" } : c));
    showToast("Connection accepted! You can now chat.");
  };

  const rejectConnection = (connId) => {
    setConnections(prev => prev.filter(c => c.id !== connId));
    showToast("Connection request declined", "info");
  };

  // CHAT ACTIONS
  const sendMessage = (receiverId, content) => {
    const receiver = allUsers.find(u => u.id === receiverId);
    if (!receiver || !content.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: user.id,
      sender_name: user.full_name,
      sender_photo: user.profile_photo || "",
      receiver_id: receiver.id,
      receiver_name: receiver.full_name,
      content: content.trim(),
      created_date: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // MENTOR APPLICATIONS ACTIONS
  const submitMentorApplication = (appData) => {
    const newApp = {
      id: `app_${Date.now()}`,
      user_id: user.id,
      applicant_name: user.full_name,
      applicant_email: user.email,
      college: appData.college,
      branch: appData.branch,
      year: appData.year,
      skills: appData.skills,
      subjects: appData.subjects,
      teaching_experience: appData.teaching_experience,
      github_url: appData.github_url || "",
      portfolio_url: appData.portfolio_url || "",
      resume_file: appData.resume_file || "resume.pdf",
      student_id_file: appData.student_id_file || "student_id.png",
      status: "pending",
      admin_notes: "",
      created_date: new Date().toISOString()
    };
    setMentorApplications(prev => [newApp, ...prev]);
    showToast("Mentor verification submitted! Admin team will review.");
  };

  const approveMentorApplication = (appId) => {
    const targetApp = mentorApplications.find(a => a.id === appId);
    if (!targetApp) return;

    setMentorApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "approved" } : a));
    // Verify student user
    setAllUsers(prev => prev.map(u => {
      if (u.id === targetApp.user_id) {
        return {
          ...u,
          is_verified_mentor: true,
          is_mentor: true,
          role: "mentor"
        };
      }
      return u;
    }));
    showToast(`Approved! ${targetApp.applicant_name} is now a Verified Mentor.`);
  };

  const rejectMentorApplication = (appId, notes) => {
    setMentorApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "rejected", admin_notes: notes } : a));
    showToast("Application rejected with notes", "info");
  };

  const toggleStudentVerification = (userId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.is_verified_mentor;
        return {
          ...u,
          is_verified_mentor: nextStatus,
          is_mentor: nextStatus
        };
      }
      return u;
    }));
    showToast("Student verification status toggled");
  };

  const updatePlatformSettings = (newSettings) => {
    setPlatformSettings(newSettings);
    showToast("Platform settings saved successfully!");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        posts,
        comments,
        doubts,
        doubtReplies,
        classes,
        connections,
        messages,
        mentorApplications,
        platformSettings,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        activeClassRoom,
        toast,
        showToast,
        switchUser,
        login,
        signup,
        logout,
        createPost,
        likePost,
        addComment,
        deletePost,
        createDoubt,
        replyDoubt,
        resolveDoubt,
        deleteDoubt,
        createClass,
        joinClass,
        enterClassRoom,
        leaveClassRoom,
        sendConnectionRequest,
        acceptConnection,
        rejectConnection,
        sendMessage,
        submitMentorApplication,
        approveMentorApplication,
        rejectMentorApplication,
        toggleStudentVerification,
        updatePlatformSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
