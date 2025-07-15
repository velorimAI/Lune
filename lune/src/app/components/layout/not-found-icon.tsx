'use client';

import { useEffect } from 'react';

const NotFoundIcon = () => {
  useEffect(() => {
    import('@lottiefiles/lottie-player');
  }, []);


  return (
    <div
      className="w-[600px] h-[600px]"
      dangerouslySetInnerHTML={{
        __html: `
          <lottie-player
            src="/animations/car-crash.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style="width: 100%; height: 100%;"
          ></lottie-player>
        `,
      }}
    />
  );
};

export default NotFoundIcon;
