import { useMemo } from 'react';

interface UserAvatarProps {
  username: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ username, color, size = 'md', className = '' }: UserAvatarProps) {
  const initials = useMemo(() => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [username]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}