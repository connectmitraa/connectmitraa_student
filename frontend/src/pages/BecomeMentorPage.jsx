import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Upload,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BecomeMentorPage = ({ navigate }) => {
  const { user, mentorApplications, submitMentorApplication } = useApp();

  const [college, setCollege] = useState(user.college || '');
  const [branch, setBranch] = useState(user.branch || '');
  const [year, setYear] = useState(user.year || '3rd Year');
  const [skills, setSkills] = useState((user.skills || []).join(', '));
  const [subjects, setSubjects] = useState((user.subjects || []).join(', '));
  const [teachingExperience, setTeachingExperience] = useState(
    'Have mentored classmates and juniors in core programming concepts.'
  );
  const [githubUrl, setGithubUrl] = useState(user.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolio_url || '');
  const [resumeFile, setResumeFile] = useState('student_resume.pdf');
  const [idCardFile, setIdCardFile] = useState('student_id_card.png');

  // Check if current user already has an application
  const existingApp = mentorApplications.find((a) => a.user_id === user.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!college.trim() || !skills.trim()) return;
    submitMentorApplication({
      college: college.trim(),
      branch: branch.trim(),
      year,
      skills: skills.trim(),
      subjects: subjects.trim(),
      teaching_experience: teachingExperience.trim(),
      github_url: githubUrl.trim(),
      portfolio_url: portfolioUrl.trim(),
      resume_file: resumeFile,
      student_id_file: idCardFile
    });
  };

  if (user.is_verified_mentor) {
    return (
      <div className="page-container" style={{ maxWidth: '44rem' }}>
        <div className="card">
          <div className="card-content" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '9999px',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              <CheckCircle style={{ width: '2rem', height: '2rem' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>
              You are a Verified Mentor!
            </h2>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem', maxWidth: '28rem', margin: '0.5rem auto 1.5rem auto' }}>
              Your profile carries the verified green checkmark badge. You can schedule public, private, and paid peer classes.
            </p>
            <button
              type="button"
              onClick={() => navigate('/Classes')}
              className="btn btn-primary"
            >
              Create a Class
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '44rem' }}>
      {/* Banner matching exact studentconnect design */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(79, 70, 229, 0.04))'
        }}
      >
        <div className="card-content" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)' }}>
              Verification Process
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Submit your details and documents. Our admin team will review and verify your profile. Once approved, you'll get a green verified tick and can create paid classes.
            </p>
          </div>
        </div>
      </div>

      {/* Existing application notification */}
      {existingApp && existingApp.status === 'pending' && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            backgroundColor: '#fffbeb',
            borderColor: '#fef3c7'
          }}
        >
          <div className="card-content" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#b45309' }}>
                Application Under Review
              </p>
              <p style={{ fontSize: '0.75rem', color: '#d97706' }}>
                You have an active pending application. You can inspect or approve it anytime in the Admin Panel tab!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-outline btn-sm"
              style={{ marginLeft: 'auto', borderColor: '#f59e0b', color: '#b45309' }}
            >
              Open in Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* Application Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="label">College *</label>
              <input
                type="text"
                className="input"
                placeholder="Your college name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Branch</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Computer Science"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Year of Study</label>
            <select
              className="select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          <div>
            <label className="label">Skills You Can Teach * (comma separated)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Java, Python, Spring Boot, DSA"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Subjects / Topics You Can Cover</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. OOP, Web Development, Algorithms"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Teaching / Mentoring Experience</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Describe your previous peer mentoring or tutoring experience..."
              value={teachingExperience}
              onChange={(e) => setTeachingExperience(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="label">GitHub Profile URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Portfolio or LinkedIn URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://yourportfolio.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Document Upload Simulation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="label">Resume / CV (PDF)</label>
              <div
                style={{
                  border: '1.5px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--secondary)'
                }}
              >
                <FileText style={{ width: '1.5rem', height: '1.5rem', color: 'var(--muted-foreground)', margin: '0 auto 0.25rem auto' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{resumeFile}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Uploaded ✓</span>
              </div>
            </div>

            <div>
              <label className="label">Student ID Card (Proof)</label>
              <div
                style={{
                  border: '1.5px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--secondary)'
                }}
              >
                <Upload style={{ width: '1.5rem', height: '1.5rem', color: 'var(--muted-foreground)', margin: '0 auto 0.25rem auto' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{idCardFile}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Uploaded ✓</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.625rem' }}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
