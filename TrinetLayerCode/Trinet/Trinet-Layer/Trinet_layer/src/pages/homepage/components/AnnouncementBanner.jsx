import React from 'react';

const AnnouncementBanner = () => {
  const message = "🔔 New Features Available! Log in now to explore TrinetLayer.";

  return (
    <div className="announcement-banner">
      <div className="announcement-track">
        <span className="announcement-text">{message}</span>
        <span className="announcement-spacer">•</span>
        <span className="announcement-text">{message}</span>
        <span className="announcement-spacer">•</span>
        <span className="announcement-text">{message}</span>
        <span className="announcement-spacer">•</span>
      </div>
      
      <style>{`
        .announcement-banner {
          width: 100%;
          background: linear-gradient(90deg, rgba(0, 234, 255, 0.08) 0%, rgba(0, 180, 216, 0.12) 50%, rgba(0, 234, 255, 0.08) 100%);
          border-top: 1px solid rgba(0, 234, 255, 0.15);
          border-bottom: 1px solid rgba(0, 234, 255, 0.15);
          padding: 6px 0;
          overflow: hidden;
          position: relative;
        }
        
        .announcement-banner::before,
        .announcement-banner::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
        }
        
        .announcement-banner::before {
          left: 0;
          background: linear-gradient(90deg, rgba(13, 17, 23, 1) 0%, rgba(13, 17, 23, 0) 100%);
        }
        
        .announcement-banner::after {
          right: 0;
          background: linear-gradient(90deg, rgba(13, 17, 23, 0) 0%, rgba(13, 17, 23, 1) 100%);
        }
        
        .announcement-track {
          display: flex;
          align-items: center;
          gap: 32px;
          animation: scrollAnnouncement 12s linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
        
        .announcement-text {
          font-size: 12px;
          font-weight: 500;
          color: #00eaff;
          letter-spacing: 0.2px;
          text-shadow: 0 0 8px rgba(0, 234, 255, 0.25);
        }
        
        .announcement-spacer {
          color: rgba(0, 234, 255, 0.4);
          font-size: 14px;
        }
        
        @keyframes scrollAnnouncement {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .announcement-banner:hover .announcement-track {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .announcement-text {
            font-size: 11px;
          }
          
          .announcement-banner {
            padding: 6px 0;
          }
          
          .announcement-track {
            gap: 24px;
            animation-duration: 10s;
          }
        }
        
        @media (max-width: 480px) {
          .announcement-text {
            font-size: 10px;
          }
          
          .announcement-track {
            gap: 20px;
            animation-duration: 8s;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBanner;
