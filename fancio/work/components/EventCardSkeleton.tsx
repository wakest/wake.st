
import React from 'react';

type Theme = 'dark' | 'light' | 'dusk' | 'grape'; 
type ImageLayoutStyle = 'small' | 'full' | 'text-only';
type BackgroundEffectMode = 'squint' | 'color';

interface EventCardSkeletonProps {
  theme: Theme;
  imageLayoutStyle: ImageLayoutStyle;
  backgroundEffectMode: BackgroundEffectMode;
}

const EventCardSkeleton: React.FC<EventCardSkeletonProps> = ({ theme, imageLayoutStyle, backgroundEffectMode }) => {
  let cardContainerClasses = ''; // Will include bg
  let placeholderBg = ''; 
  let imagePlaceholderDivBorderClasses = ''; // For border-b of image placeholder

  if (theme === 'dark') {
    cardContainerClasses = 'bg-[#141414]'; 
    placeholderBg = 'bg-[#3b3b3b]'; 
    imagePlaceholderDivBorderClasses = 'border-b border-[#3b3b3b]'; 
  } else if (theme === 'light') {
    cardContainerClasses = 'bg-white'; // No border class for the card itself
    placeholderBg = 'bg-gray-200';
    imagePlaceholderDivBorderClasses = 'border-b border-transparent'; // Image placeholder bottom border transparent
  } else if (theme === 'grape') { 
    cardContainerClasses = 'bg-violet-800'; 
    placeholderBg = 'bg-violet-700';
    imagePlaceholderDivBorderClasses = 'border-b border-violet-700';
  } else if (theme === 'dusk') { 
    cardContainerClasses = 'bg-slate-800'; 
    placeholderBg = 'bg-slate-700';
    imagePlaceholderDivBorderClasses = 'border-b border-slate-700';
  }

  const imagePlaceholderDivClasses = [
    `w-full h-48 animate-pulse ${placeholderBg}`, // Background for the image area
    imagePlaceholderDivBorderClasses, // Contains border-b and its color
    // Apply fade if Small layout and Squint mode, for ALL themes
    (imageLayoutStyle === 'small' && backgroundEffectMode === 'squint') ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]' : ''
  ].join(' ');

  return (
    <div className={`rounded-xl overflow-hidden flex flex-col h-full ${cardContainerClasses} break-inside-avoid-column mb-8`}>
      {(imageLayoutStyle === 'small' || imageLayoutStyle === 'full') && (
        <div className={imagePlaceholderDivClasses}></div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className={`h-7 rounded w-3/4 mb-3 animate-pulse ${placeholderBg}`}></div> 
        
        <div className="flex items-center mb-3">
          <div className={`h-5 w-5 rounded mr-2 animate-pulse ${placeholderBg}`}></div>
          <div className={`h-5 rounded w-1/2 animate-pulse ${placeholderBg}`}></div>
        </div>

        <div className="flex items-center">
          <div className={`h-5 w-5 rounded mr-2 animate-pulse ${placeholderBg}`}></div>
          <div className={`h-5 rounded w-2/3 animate-pulse ${placeholderBg}`}></div>
        </div>
        
      </div>
    </div>
  );
};

export default EventCardSkeleton;