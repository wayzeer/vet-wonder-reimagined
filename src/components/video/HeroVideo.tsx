import { useState, useEffect, memo } from 'react';

// Good video segments to start from (in seconds)
// Skip first 35s (intro has weird visuals)
const VIDEO_START_POINTS = [35, 60, 90, 120, 150, 180];

function getRandomStartPoint(): number {
  const randomIndex = Math.floor(Math.random() * VIDEO_START_POINTS.length);
  return VIDEO_START_POINTS[randomIndex];
}

export const HeroVideo = memo(function HeroVideo() {
  const [startTime] = useState(() => getRandomStartPoint());
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Delay loading the iframe slightly for better initial page performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const videoUrl = `https://www.youtube.com/embed/iucW5evsuLE?autoplay=1&mute=1&loop=1&playlist=iucW5evsuLE&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&start=${startTime}&playsinline=1&disablekb=1&fs=0`;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Placeholder gradient while video loads */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-orange-100 to-amber-50 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Container to crop YouTube UI on mobile */}
      <div className="absolute inset-[-100px] md:inset-0 overflow-hidden">
        {shouldLoad && (
          <iframe
            className={`absolute top-1/2 left-1/2 w-[200%] h-[200%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 scale-[1.2] md:scale-[1.3] transition-opacity duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={videoUrl}
            title="Happy pets video background"
            allow="autoplay; encrypted-media"
            onLoad={() => setIsLoaded(true)}
            style={{
              pointerEvents: 'none',
              border: 'none',
            }}
          />
        )}
      </div>

      {/* Diagonal Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent"
        style={{
          WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  );
});
