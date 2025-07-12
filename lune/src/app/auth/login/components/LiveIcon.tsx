'use client';

import { useEffect } from 'react';

const LiveIcon = () => {
  useEffect(() => {
    // لود وب‌کامپوننت lottie-player
    import('@lottiefiles/lottie-player');
  }, []);

  // درون همین JSX، HTML مناسب برای lottie-player رو به عنوان رشته بفرست
  return (
    <div
      className="w-[700px] h-[700px]"
      dangerouslySetInnerHTML={{
        __html: `
          <lottie-player
            src="/animations/Animation.json"
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

export default LiveIcon;
