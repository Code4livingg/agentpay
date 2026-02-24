import Image from 'next/image';

interface LogoProps {
  variant?: 'mark' | 'full';
  size?: number;
  className?: string;
}

export default function Logo({ variant = 'mark', size, className = '' }: LogoProps) {
  const src = variant === 'mark' ? '/logo-mark.png' : '/logo-full.png';
  
  // Default sizes based on variant
  const defaultSize = variant === 'mark' ? 36 : 200;
  const finalSize = size || defaultSize;
  
  // Calculate width/height based on variant
  const dimensions = variant === 'mark' 
    ? { width: finalSize, height: finalSize }
    : { width: finalSize, height: finalSize / 4 }; // Full logo is wider
  
  return (
    <Image
      src={src}
      alt="AgentPay"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority
    />
  );
}
