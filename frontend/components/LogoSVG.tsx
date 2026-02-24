interface LogoSVGProps {
  width?: number;
  height?: number;
  variant?: 'mark' | 'full';
  className?: string;
}

export default function LogoSVG({ 
  width = 36, 
  height = 36, 
  variant = 'mark',
  className = '' 
}: LogoSVGProps) {
  
  if (variant === 'mark') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F6BFF" />
            <stop offset="100%" stopColor="#00D1FF" />
          </linearGradient>
        </defs>
        
        {/* Hexagon */}
        <path
          d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
          fill="url(#logoGradient)"
          opacity="0.15"
          stroke="url(#logoGradient)"
          strokeWidth="2"
        />
        
        {/* Stylized A with arrow */}
        <path
          d="M50 30 L65 60 L58 60 L55 52 L45 52 L42 60 L35 60 L50 30 Z M50 40 L47 48 L53 48 L50 40 Z"
          fill="url(#logoGradient)"
        />
        
        {/* Arrow pointing up */}
        <path
          d="M50 25 L55 32 L52 32 L52 38 L48 38 L48 32 L45 32 Z"
          fill="url(#logoGradient)"
        />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2F6BFF" />
          <stop offset="100%" stopColor="#00D1FF" />
        </linearGradient>
      </defs>
      
      {/* Hexagon mark */}
      <path
        d="M50 10 L80 27.5 L80 72.5 L50 90 L20 72.5 L20 27.5 Z"
        fill="url(#logoGradientFull)"
        opacity="0.15"
        stroke="url(#logoGradientFull)"
        strokeWidth="2"
      />
      
      {/* Stylized A with arrow */}
      <path
        d="M50 30 L62 58 L57 58 L55 52 L45 52 L43 58 L38 58 L50 30 Z M50 38 L48 46 L52 46 L50 38 Z"
        fill="url(#logoGradientFull)"
      />
      
      {/* Arrow pointing up */}
      <path
        d="M50 26 L54 31 L52 31 L52 36 L48 36 L48 31 L46 31 Z"
        fill="url(#logoGradientFull)"
      />
      
      {/* AgentPay text */}
      <text
        x="105"
        y="60"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="#E6E9EF"
        letterSpacing="-0.5"
      >
        AgentPay
      </text>
    </svg>
  );
}
