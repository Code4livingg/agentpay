interface LogoSVGProps {
  width?: number;
  height?: number;
  variant?: 'mark' | 'full' | 'mono';
  className?: string;
}

export default function LogoSVG({ 
  width = 48, 
  height = 48, 
  variant = 'mark',
  className = '' 
}: LogoSVGProps) {
  
  if (variant === 'mark') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D1FF" />
            <stop offset="100%" stopColor="#2F6BFF" />
          </linearGradient>
          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Hexagon outline */}
        <path
          d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Stylized A with gradient fill */}
        <path
          d="M70 130 L100 60 L130 130 L115 130 L110 115 L90 115 L85 130 Z M95 100 L100 85 L105 100 Z"
          fill="url(#logoGradient)"
          filter="url(#innerGlow)"
        />
        
        {/* Right-facing arrow */}
        <path
          d="M110 105 L145 105 L145 95 L110 95 L110 85 L160 100 L110 115 Z"
          fill="url(#logoGradient)"
          filter="url(#innerGlow)"
        />
      </svg>
    );
  }

  if (variant === 'mono') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Hexagon outline */}
        <path
          d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Stylized A */}
        <path
          d="M70 130 L100 60 L130 130 L115 130 L110 115 L90 115 L85 130 Z M95 100 L100 85 L105 100 Z"
          fill="currentColor"
        />
        
        {/* Right-facing arrow */}
        <path
          d="M110 105 L145 105 L145 95 L110 95 L110 85 L160 100 L110 115 Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D1FF" />
          <stop offset="100%" stopColor="#2F6BFF" />
        </linearGradient>
        <filter id="innerGlowFull">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Hexagon mark */}
      <path
        d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
        fill="none"
        stroke="url(#logoGradientFull)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Stylized A */}
      <path
        d="M70 130 L100 60 L130 130 L115 130 L110 115 L90 115 L85 130 Z M95 100 L100 85 L105 100 Z"
        fill="url(#logoGradientFull)"
        filter="url(#innerGlowFull)"
      />
      
      {/* Right-facing arrow */}
      <path
        d="M110 105 L145 105 L145 95 L110 95 L110 85 L160 100 L110 115 Z"
        fill="url(#logoGradientFull)"
        filter="url(#innerGlowFull)"
      />
      
      {/* AgentPay text */}
      <text
        x="210"
        y="120"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="48"
        fontWeight="700"
        fill="#E6E9EF"
        letterSpacing="-1"
      >
        AgentPay
      </text>
    </svg>
  );
}
