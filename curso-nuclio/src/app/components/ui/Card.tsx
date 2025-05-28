'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 