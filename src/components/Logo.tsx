interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="LifeOn66 - Hol Life Coaching"
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0`}
      />
      {showText && (
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
          LifeOn66
        </span>
      )}
    </div>
  );
}
