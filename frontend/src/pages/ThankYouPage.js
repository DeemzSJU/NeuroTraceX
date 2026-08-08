import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSessionContext } from '../context/SessionContext';
import participantService from '../services/participantService';
import Loader from '../components/common/Loader';

function ThankYouPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessionId } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [session2Available, setSession2Available] = useState(false);

  useEffect(() => {
    let timerId = null;

    async function fetchProgress() {
      if (user?.id) {
        try {
          const progress = await participantService.getProgress(user.id);
          if (progress.has_consented) {
            const tr = progress.time_remaining_seconds;
            if (tr !== null && tr > 0) {
              setTimeRemaining(tr);
              setSession2Available(false);

              timerId = setInterval(() => {
                setTimeRemaining((prev) => {
                  if (prev <= 1) {
                    clearInterval(timerId);
                    setSession2Available(true);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            } else {
              setSession2Available(true);
              setTimeRemaining(0);
            }
          }
        } catch (err) {
          console.error("Failed to load progress in thank you page:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchProgress();

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [user]);

  const handleBeginSession2 = () => {
    if (sessionId) {
      navigate(`/session2/${sessionId}`);
    }
  };

  const formatCountdown = (totalSeconds) => {
    if (totalSeconds === null) return "Calculating...";
    if (totalSeconds <= 0) return "Ready";
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  if (loading) {
    return (
      <div className="page" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <Loader text="Loading your session progress..." />
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>

        {/* Success icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="10" stroke="var(--color-success)" strokeWidth="1.5" fill="var(--color-success-subtle)"/>
            <path d="M8 12l3 3 5-5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '0.5rem' }}>Session 1 Complete</h1>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
            Your responses have been recorded. Thank you for your participation.
          </p>
        </div>

        <div className="card--glass stagger-children" style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {/* Status info */}
          <div style={{ borderLeft: '2px solid var(--color-success)', paddingLeft: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: '0.3rem' }}>
              Part 1 Complete
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              You have completed the cognitive profile assessment, watched the video stimulus, and provided your recall statements.
            </p>
          </div>

          <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: '0.3rem' }}>
              Part 2 Availability
            </h4>
            {session2Available ? (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Delayed recall is now <strong style={{ color: 'var(--color-success)' }}>unlocked</strong>. You can begin the final part of the study.
              </p>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Delayed recall is scheduled 48 hours after Session 1. Remaining time:{" "}
                <strong style={{
                  color: 'var(--color-warning)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)'
                }}>
                  {formatCountdown(timeRemaining)}
                </strong>
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {session2Available ? (
          <button
            className="btn btn--gold-shimmer btn--large"
            onClick={handleBeginSession2}
            style={{ width: '100%', marginBottom: '2.5rem' }}
          >
            Begin Session 2
          </button>
        ) : (
          <div style={{
            marginTop: '2rem', textAlign: 'center',
            padding: '1rem',
            borderTop: '1px solid var(--color-border-subtle)',
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', margin: 0 }}>
              You will receive an email reminder when the countdown finishes. You can safely close this tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThankYouPage;
