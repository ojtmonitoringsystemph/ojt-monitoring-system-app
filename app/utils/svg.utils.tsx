import React from 'react';

interface SvgIconProps {
  path: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Creates an SVG icon component from a path string
 * @param path - The SVG path data
 * @param className - Additional CSS classes to apply
 * @param size - The size of the icon (sm: 16px, md: 24px, lg: 32px)
 * @returns A React component that renders the SVG icon
 */
export const createSvgIcon = ({ path, className = '', size = 'md' }: SvgIconProps) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <svg 
      className={`${sizeMap[size]} ${className}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d={path} 
      />
    </svg>
  );
};

// Common medical/clinic SVG paths
export const HOSPITAL_ICON_PATH = "M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16M9 21V9h6v12M12 12v3m-3 0h6";
export const MEDICAL_CROSS_PATH = "M12 4v16m8-8H4";
export const STETHOSCOPE_ICON_PATH = "M6 8v5a6 6 0 0012 0V8m-6 9v3m-4-3a4 4 0 008 0"; 