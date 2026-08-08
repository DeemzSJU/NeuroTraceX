import React, { useRef, useState, useEffect } from 'react';

/**
 * VideoPlayer Component
 * Custom HTML5 video player with seeking disabled.
 * Supports play/pause, volume controls, and time display.
 *
 * @param {Object} props
 * @param {string} props.src - video file URL/path
 * @param {string} [props.poster] - optional video thumbnail image URL
 * @param {Function} [props.onPlay] - playback start callback
 * @param {Function} [props.onEnded] - playback completion callback
 */
export function VideoPlayer({ src, poster, onPlay, onEnded }) {
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current && !hasEnded) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (!hasStarted) {
      setHasStarted(true);
      if (onPlay) onPlay();
    }
    triggerControlsFade();
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowControls(true); // Keep controls visible when paused
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setProgress(100);
    if (onEnded) onEnded();
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const triggerControlsFade = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 2500);
  };

  const formatVideoTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onMouseMove={triggerControlsFade}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Video Container (16:9) */}
      <div 
        onClick={handlePlayClick}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%',
          backgroundColor: '#000',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          cursor: hasStarted && !hasEnded ? 'pointer' : 'default',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
          controlsList="nodownload no-seeking"
          disablePictureInPicture
          playsInline
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'contain',
          }}
        >
          Your browser does not support video playback.
        </video>

        {/* Start Play Overlay */}
        {!hasStarted && !hasEnded && (
          <div
            onClick={(e) => { e.stopPropagation(); handlePlayClick(); }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(9, 9, 11, 0.75)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            {/* Play icon */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--color-accent)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="currentColor"/>
              </svg>
            </div>
            <p style={{ color: '#fff', fontWeight: 500, fontSize: 'var(--text-base)', margin: 0 }}>
              Click to start video
            </p>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
              Ensure your audio is on.
            </p>
          </div>
        )}

        {/* Custom Controls Bar Overlay (shown on hover or when paused) */}
        {hasStarted && !hasEnded && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(17, 24, 39, 0.9))',
            padding: '1.5rem 1rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.25s ease-in-out',
            pointerEvents: showControls ? 'auto' : 'none',
            zIndex: 5,
          }}>
            {/* Play/Pause Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePlayClick(); }}
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: '0.25rem', outline: 'none',
              }}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                  <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
              )}
            </button>

            {/* Time display */}
            <span style={{
              color: '#fff', fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)', minWidth: '75px',
            }}>
              {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
            </span>

            {/* Progress track (non-interactive to disable seeking) */}
            <div style={{
              flex: 1, height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--color-accent)',
                borderRadius: 'var(--radius-full)',
              }} />
            </div>

            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: '0.25rem', outline: 'none',
              }}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Completed Overlay */}
        {hasEnded && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            zIndex: 10,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '0.75rem' }}>
              <circle cx="12" cy="12" r="10" stroke="var(--color-success)" strokeWidth="1.5" fill="none"/>
              <path d="M8 12l3 3 5-5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 'var(--text-lg)', margin: 0 }}>
              Video complete
            </p>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
              You may now proceed to the recall questions.
            </p>
          </div>
        )}
      </div>

      {/* Static under-video progress bar for double reinforcement */}
      {(hasStarted || hasEnded) && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '0.375rem',
            fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
          }}>
            <span>{isPlaying ? 'Playing' : hasEnded ? 'Complete' : 'Paused'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{
            width: '100%', height: '3px',
            background: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: hasEnded ? 'var(--color-success)' : 'var(--color-accent)',
              transition: 'width 0.2s linear',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
