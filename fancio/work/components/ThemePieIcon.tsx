import React from 'react';

interface ThemePieIconProps {
  colors: [string, string]; // Hex colors for the two pie segments
  sizeClassName?: string; // e.g., 'w-8 h-8'
}

const ThemePieIcon: React.FC<ThemePieIconProps> = ({ colors, sizeClassName = 'w-8 h-8' }) => {
  // Path for the left semicircle: M16,0 (move to top center) A16,16 (arc rx,ry) 0 (x-axis-rotation) 0 (large-arc-flag) 0 (sweep-flag) 16,32 (end point - bottom center) Z (close path)
  const leftHalfPath = "M16,0 A16,16 0 0,0 16,32Z";
  // Path for the right semicircle: M16,0 (move to top center) A16,16 (arc rx,ry) 0 (x-axis-rotation) 0 (large-arc-flag) 1 (sweep-flag) 16,32 (end point - bottom center) Z (close path)
  const rightHalfPath = "M16,0 A16,16 0 0,1 16,32Z";

  return (
    <div className={sizeClassName + " rounded-full overflow-hidden"}>
      <svg 
        viewBox="0 0 32 32" 
        className="w-full h-full block" 
        aria-hidden="true" 
      >
        <path d={leftHalfPath} fill={colors[0]} />
        <path d={rightHalfPath} fill={colors[1]} />
      </svg>
    </div>
  );
};

export default ThemePieIcon;