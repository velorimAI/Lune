'use client';

import { useEffect } from 'react';

const LiveIcon = () => {
  useEffect(() => {
    import('@lottiefiles/lottie-player');
  }, []);

  return (
    <div
      className="w-130 h-130"
      dangerouslySetInnerHTML={{
        __html: `
          <lottie-player
            src="/animations/Animation.json"
            background="transparent"
            speed="1"
            loop
            autoplay
           style={{ width: '100%', height: '100%' }}"
          ></lottie-player>
        `,
      }}
    />
  );
};

export default LiveIcon;
