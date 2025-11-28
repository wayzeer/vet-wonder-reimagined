interface SectionDividerProps {
  variant?: "wave" | "diagonal" | "curve";
  flip?: boolean;
  className?: string;
}

export const SectionDivider = ({ variant = "wave", flip = false, className = "" }: SectionDividerProps) => {
  const wavePathRotated = flip
    ? "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,106.7C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    : "M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,74.7C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

  const diagonalPath = flip
    ? "M0,0 L1440,100 L1440,0 Z"
    : "M0,100 L1440,0 L1440,320 L0,320 Z";

  const curvePath = flip
    ? "M0,160L60,138.7C120,117,240,75,360,74.7C480,75,600,117,720,128C840,139,960,117,1080,96C1200,75,1320,53,1380,42.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    : "M0,160L60,181.3C120,203,240,245,360,245.3C480,245,600,203,720,192C840,181,960,203,1080,224C1200,245,1320,267,1380,277.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

  const paths = {
    wave: wavePathRotated,
    diagonal: diagonalPath,
    curve: curvePath,
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-20 md:h-24"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d={paths[variant]}
        />
      </svg>
    </div>
  );
};
