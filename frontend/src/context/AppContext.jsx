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
import { authenticateAdmin, DEMO_ADMIN_CREDENTIALS } from '../services/supabaseAuth';

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

  const defaultRecycleBin = {
    deletedPosts: [],
    deletedDoubts: [],
    revokedMentors: [],
    cancelledClasses: []
  };

  const [recycleBin, setRecycleBin] = useState(() => {
    try {
      const saved = localStorage.getItem('studyloop_recycle_bin');
      return saved ? JSON.parse(saved) : defaultRecycleBin;
    } catch {
      return defaultRecycleBin;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeClassRoom, setActiveClassRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('studyloop_admin_auth') === 'true';
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('studyloop_recycle_bin', JSON.stringify(recycleBin));
  }, [recycleBin]);

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
    let target = null;
    if (roleOrId === 'student') {
      target = allUsers.find(u => u.id === 'usr_1') || allUsers.find(u => u.role === 'student');
      setIsAdminAuthenticated(false);
      localStorage.removeItem('studyloop_admin_auth');
    } else if (roleOrId === 'mentor' || roleOrId === 'usr_2') {
      target = allUsers.find(u => u.id === 'usr_2') || allUsers.find(u => u.is_verified_mentor);
      setIsAdminAuthenticated(false);
      localStorage.removeItem('studyloop_admin_auth');
    } else if (roleOrId === 'admin') {
      target = allUsers.find(u => u.id === 'usr_admin') || allUsers.find(u => u.role === 'admin');
      setIsAdminAuthenticated(true);
      localStorage.setItem('studyloop_admin_auth', 'true');
    } else {
      target = allUsers.find(u => u.id === roleOrId);
      if (target?.role === 'admin') {
        setIsAdminAuthenticated(true);
        localStorage.setItem('studyloop_admin_auth', 'true');
      } else {
        setIsAdminAuthenticated(false);
        localStorage.removeItem('studyloop_admin_auth');
      }
    }
    if (target) {
      setCurrentUserId(target.id);
      showToast(`Switched persona to ${target.full_name} (${(target.role || 'USER').toUpperCase()})`);
    }
  };

  const adminLogin = async (email, password) => {
    const res = await authenticateAdmin(email, password);
    if (res.success) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('studyloop_admin_auth', 'true');
      const adminUser = allUsers.find(u => u.id === 'usr_admin') || allUsers.find(u => u.role === 'admin');
      if (adminUser) {
        setCurrentUserId(adminUser.id);
      }
      showToast(res.mode === 'supabase' ? 'Supabase Admin verified!' : 'Admin Portal Unlocked!');
      return { success: true };
    } else {
      showToast(res.error || 'Admin verification failed', 'error');
      return { success: false, error: res.error };
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('studyloop_admin_auth');
    const studentUser = allUsers.find(u => u.id === 'usr_1') || allUsers[0];
    if (studentUser) {
      setCurrentUserId(studentUser.id);
    }
    showToast('Exited Admin Portal session');
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
    const postToDelete = posts.find(p => p.id === postId);
    if (postToDelete) {
      const archived = {
        ...postToDelete,
        deleted_at: new Date().toISOString(),
        expires_in_days: 30
      };
      setRecycleBin(prev => ({
        ...prev,
        deletedPosts: [archived, ...(prev.deletedPosts || []).filter(p => p.id !== postId)]
      }));
      setPosts(prev => prev.filter(p => p.id !== postId));
      showToast("Post moved to Recycle Bin (Retained for 30 days)");
    }
  };

  const restorePost = (postId) => {
    const postToRestore = (recycleBin.deletedPosts || []).find(p => p.id === postId);
    if (postToRestore) {
      const { deleted_at, expires_in_days, ...cleanPost } = postToRestore;
      setPosts(prev => [cleanPost, ...prev]);
      setRecycleBin(prev => ({
        ...prev,
        deletedPosts: (prev.deletedPosts || []).filter(p => p.id !== postId)
      }));
      showToast("Post restored to Community Feed! 🎉");
    }
  };

  const permanentDeletePost = (postId) => {
    setRecycleBin(prev => ({
      ...prev,
      deletedPosts: (prev.deletedPosts || []).filter(p => p.id !== postId)
    }));
    showToast("Post permanently purged.", "info");
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

  const markSolution = (doubtId, replyId) => {
    setDoubtReplies(prev => prev.map(r => {
      if (r.doubt_id === doubtId) {
        return { ...r, is_solution: r.id === replyId };
      }
      return r;
    }));
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, status: "resolved" } : d));
    showToast("Marked reply as accepted solution! 🎉");
  };

  const deleteDoubt = (doubtId) => {
    const doubtToDelete = doubts.find(d => d.id === doubtId);
    if (doubtToDelete) {
      const archived = {
        ...doubtToDelete,
        deleted_at: new Date().toISOString(),
        expires_in_days: 30
      };
      setRecycleBin(prev => ({
        ...prev,
        deletedDoubts: [archived, ...(prev.deletedDoubts || []).filter(d => d.id !== doubtId)]
      }));
      setDoubts(prev => prev.filter(d => d.id !== doubtId));
      showToast("Doubt moved to Recycle Bin (Retained for 30 days)");
    }
  };

  const restoreDoubt = (doubtId) => {
    const doubtToRestore = (recycleBin.deletedDoubts || []).find(d => d.id === doubtId);
    if (doubtToRestore) {
      const { deleted_at, expires_in_days, ...cleanDoubt } = doubtToRestore;
      setDoubts(prev => [cleanDoubt, ...prev]);
      setRecycleBin(prev => ({
        ...prev,
        deletedDoubts: (prev.deletedDoubts || []).filter(d => d.id !== doubtId)
      }));
      showToast("Doubt restored successfully! 🎉");
    }
  };

  const permanentDeleteDoubt = (doubtId) => {
    setRecycleBin(prev => ({
      ...prev,
      deletedDoubts: (prev.deletedDoubts || []).filter(d => d.id !== doubtId)
    }));
    showToast("Doubt permanently purged.", "info");
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

    // Check if connection already exists
    const existing = connections.find(c =>
      (c.requester_id === user.id && c.receiver_id === receiverId) ||
      (c.requester_id === receiverId && c.receiver_id === user.id)
    );

    if (existing) {
      if (existing.status === 'accepted') {
        showToast(`Already connected with ${receiver.full_name}!`, "info");
      } else if (existing.requester_id === receiverId && existing.status === 'pending') {
        acceptConnection(existing.id);
      } else {
        showToast(`Connection request to ${receiver.full_name} is already pending.`, "info");
      }
      return;
    }

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
    const target = allUsers.find(u => u.id === userId);
    if (target && target.is_verified_mentor) {
      revokeMentor(userId);
    } else {
      grantMentor(userId);
    }
  };

  const revokeMentor = (userId) => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, is_verified_mentor: false, is_mentor: false };
      }
      return u;
    }));
    const archived = {
      ...target,
      revoked_at: new Date().toISOString(),
      expires_in_days: 30
    };
    setRecycleBin(prev => ({
      ...prev,
      revokedMentors: [archived, ...(prev.revokedMentors || []).filter(m => m.id !== userId)]
    }));
    showToast(`${target.full_name}'s mentor status revoked & archived in Recycle Bin.`);
  };

  const grantMentor = (userId) => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, is_verified_mentor: true, is_mentor: true };
      }
      return u;
    }));
    setRecycleBin(prev => ({
      ...prev,
      revokedMentors: (prev.revokedMentors || []).filter(m => m.id !== userId)
    }));
    showToast(`${target.full_name} is now a Verified Mentor! ✓`);
  };

  const restoreRevokedMentor = (userId) => {
    grantMentor(userId);
  };

  const permanentDeleteRevokedMentor = (userId) => {
    setRecycleBin(prev => ({
      ...prev,
      revokedMentors: (prev.revokedMentors || []).filter(m => m.id !== userId)
    }));
    showToast("Archived record permanently purged.", "info");
  };

  const cancelClass = (classId) => {
    const target = classes.find(c => c.id === classId);
    if (!target) return;
    const archived = {
      ...target,
      cancelled_at: new Date().toISOString(),
      expires_in_days: 30
    };
    setRecycleBin(prev => ({
      ...prev,
      cancelledClasses: [archived, ...(prev.cancelledClasses || []).filter(c => c.id !== classId)]
    }));
    setClasses(prev => prev.filter(c => c.id !== classId));
    showToast("Class cancelled & archived in Recycle Bin.");
  };

  const restoreClass = (classId) => {
    const target = (recycleBin.cancelledClasses || []).find(c => c.id === classId);
    if (target) {
      const { cancelled_at, expires_in_days, ...cleanClass } = target;
      setClasses(prev => [cleanClass, ...prev]);
      setRecycleBin(prev => ({
        ...prev,
        cancelledClasses: (prev.cancelledClasses || []).filter(c => c.id !== classId)
      }));
      showToast("Class restored to Schedule! 🎉");
    }
  };

  const permanentDeleteClass = (classId) => {
    setRecycleBin(prev => ({
      ...prev,
      cancelledClasses: (prev.cancelledClasses || []).filter(c => c.id !== classId)
    }));
    showToast("Class record permanently purged.", "info");
  };

  const emptyRecycleBin = () => {
    setRecycleBin({
      deletedPosts: [],
      deletedDoubts: [],
      revokedMentors: [],
      cancelledClasses: []
    });
    showToast("Recycle Bin cleared completely.", "info");
  };


  const updateProfile = (profileData) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          ...profileData
        };
      }
      return u;
    }));
    showToast("Profile updated successfully!");
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
        recycleBin,
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
        restorePost,
        permanentDeletePost,
        createDoubt,
        replyDoubt,
        resolveDoubt,
        deleteDoubt,
        restoreDoubt,
        permanentDeleteDoubt,
        markSolution,
        createClass,
        joinClass,
        cancelClass,
        restoreClass,
        permanentDeleteClass,
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
        revokeMentor,
        grantMentor,
        restoreRevokedMentor,
        permanentDeleteRevokedMentor,
        emptyRecycleBin,
        updatePlatformSettings,
        updateProfile,
        isAdminAuthenticated,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
