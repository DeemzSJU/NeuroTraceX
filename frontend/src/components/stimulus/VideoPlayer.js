import React, { useRef, useState } from 'react';

/**
 * VideoPlayer Component
 * Custom HTML5 video player with seeking disabled to enforce uninterrupted viewing protocol.
 *
 * @param {Object} props
 * @param {string} props.src - video file URL/path
 * @param {string} [props.poster] - optional video thumbnail image URL
 * @param {Function} [props.onPlay] - playback start callback
 * @param {Function} [props.onEnded] - playback completion callback
 */
export function VideoPlayer({ src, poster, onPlay, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayClick = () => {
    if (videoRef.current && !isPlaying && !hasEnded) {
      videoRef.current.play();
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setProgress(100);
    if (onEnded) onEnded();
  };

  return (
    <div className="card text-center" style={{ padding: '1.5rem', background: 'var(--color-bg-card)' }}>
      {/* Video Container (16:9 aspect ratio) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#000',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          boxShadow: isPlaying ? '0 0 30px rgba(99, 102, 241, 0.25)' : 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onPlay={handleVideoPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          controlsList="nodownload no-seeking"
          disablePictureInPicture
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        >
          Your browser does not support video playback.
        </video>

        {/* Play Overlay Button */}
        {!isPlaying && !hasEnded && (
          <div
            onClick={handlePlayClick}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              backgroundColor: 'rgba(10, 10, 15, 0.7)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-500))',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
              }}
            >
              <span style={{ fontSize: '2rem', color: '#fff', marginLeft: '4px' }}>▶</span>
            </div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 'var(--text-lg)' }}>
              Click to Start Video
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
              Ensure your audio is turned on and video is in full view.
            </p>
          </div>
        )}

        {/* End State Overlay */}
        {hasEnded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              backgroundColor: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.2)',
                border: '2px solid var(--color-text-success)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontSize: '1.75rem', color: 'var(--color-text-success)' }}>✓</span>
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 'var(--text-xl)' }}>
              Video Complete
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
              You may now proceed to the recall questions.
            </p>
          </div>
        )}
      </div>

      {/* Non-interactive progress indicator */}
      {(isPlaying || hasEnded) && (
        <div style={{ width: '100%', marginBottom: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
              marginBottom: '0.35rem',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <span>{isPlaying ? '🎬 Watching...' : '✓ Complete'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-accent-400))',
                transition: 'width 0.2s linear',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
