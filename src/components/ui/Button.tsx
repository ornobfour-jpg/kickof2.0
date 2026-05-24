import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-heading uppercase italic transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-brand-green text-white hover:bg-brand-light': variant === 'primary',
            'bg-zinc-200 text-zinc-950 hover:bg-zinc-300': variant === 'secondary',
            'border-4 border-brand-green text-brand-green hover:bg-brand-green hover:text-white': variant === 'outline',
            'hover:bg-brand-green/10 text-zinc-950 hover:text-brand-green': variant === 'ghost',
            'bg-zinc-950 text-white hover:bg-zinc-800': variant === 'danger',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-8 text-base tracking-widest': size === 'md',
            'h-14 px-10 text-lg tracking-widest': size === 'lg',
            'w-full': fullWidth
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
