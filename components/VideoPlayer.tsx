import React from 'react';

// Cloudinary embed player URL
const CLOUDINARY_PLAYER_URL = 'https://player.cloudinary.com/embed/?cloud_name=ducrwqhit&public_id=20m2_whprjl';

export const VideoPlayer: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      overflow: 'hidden',
    }}>
      <iframe
        src={CLOUDINARY_PLAYER_URL}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        title="20m2 Video Player"
      />
    </div>
  );
};
