
import React from 'react';
import { GancioEvent, Place } from '../types';
import { formatDateTimeRange } from '../utils/helpers';

type Theme = 'dark' | 'light' | 'dusk' | 'grape';
type ImageLayoutStyle = 'small' | 'full' | 'text-only';
type BackgroundEffectMode = 'squint' | 'color';

interface EventCardProps {
  event: GancioEvent;
  instanceBaseUrl: string;
  onOpenDetail: (event: GancioEvent) => void;
  theme: Theme;
  imageLayoutStyle: ImageLayoutStyle;
  backgroundEffectMode: BackgroundEffectMode;
}

const LocationPinIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 " + className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CalendarDaysIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 " + className}>
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
</svg>
);


const EventCard: React.FC<EventCardProps> = ({ event, instanceBaseUrl, onOpenDetail, theme, imageLayoutStyle, backgroundEffectMode }) => {
  let processedImageUrl: string | null = null;
  let rawImageUrlSource: string | undefined | null = null;

  if (typeof event.image === 'string') {
    rawImageUrlSource = event.image;
  } else if (event.image && typeof event.image === 'object' && typeof event.image.url === 'string') {
    rawImageUrlSource = event.image.url;
  }

  if (rawImageUrlSource && rawImageUrlSource.trim() !== '') {
    let pathForUrlConstructor = rawImageUrlSource.trim();
    if (!pathForUrlConstructor.startsWith('/') &&
        !pathForUrlConstructor.startsWith('http://') &&
        !pathForUrlConstructor.startsWith('https://') &&
        !pathForUrlConstructor.startsWith('data:')) {
      pathForUrlConstructor = 'media/' + pathForUrlConstructor;
    }
    try {
      const url = new URL(pathForUrlConstructor, instanceBaseUrl);
      if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'data:') {
        processedImageUrl = url.href;
      } else {
        console.warn("Skipping image with non-http(s)/data protocol: " + url.href + " from source " + pathForUrlConstructor + " and base " + instanceBaseUrl);
      }
    } catch (error) {
      console.warn("Could not construct valid image URL from path: \"" + pathForUrlConstructor + "\" with base: \"" + instanceBaseUrl + "\". Error: " + error);
      processedImageUrl = null;
    }
  }

  const eventTitle = event.name || event.title || 'Untitled Event';
  const imageAltText = event.name || event.title || 'Event image';

  const getPlaceName = (place: Place | string | null): string => {
    if (!place) return 'Online or TBD';
    if (typeof place === 'string') return place;
    return "" + place.name + (place.locality ? ", " + place.locality : '');
  };

  const showBgEffect = backgroundEffectMode === 'squint';
  
  let cardBaseClasses = '';
  let textPrimaryClasses = '';
  let textSecondaryClasses = '';
  let iconColorClasses = '';
  let buttonClasses = '';
  let focusRingClass = '';
  let textContentBgClass = ''; 
  
  if (theme === 'dark') {
    cardBaseClasses = "bg-[#141414] border-transparent hover:border-white";
    textContentBgClass = "bg-[#141414]";
    textPrimaryClasses = 'text-white';
    textSecondaryClasses = 'text-gray-300';
    iconColorClasses = 'text-white';
    buttonClasses = 'bg-gray-700 hover:bg-white text-white hover:text-black border border-gray-500 hover:border-white';
    focusRingClass = 'focus:ring-white';
  } else if (theme === 'light') {
    cardBaseClasses = "bg-white border-gray-300 hover:border-black shadow-lg";
    textContentBgClass = "bg-white";
    buttonClasses = 'bg-white hover:bg-gray-800 text-black hover:text-white border-transparent';
    focusRingClass = 'focus:ring-black';

    if (showBgEffect && processedImageUrl) { 
      textPrimaryClasses = 'text-white';
      textSecondaryClasses = 'text-gray-300';
      iconColorClasses = 'text-white';
    } else {
      textPrimaryClasses = 'text-black';
      textSecondaryClasses = 'text-gray-700';
      iconColorClasses = 'text-black';
    }
  } else if (theme === 'grape') {
    cardBaseClasses = "bg-violet-800 border-transparent hover:border-transparent"; 
    textContentBgClass = "bg-violet-800";
    textPrimaryClasses = 'text-white';
    textSecondaryClasses = 'text-violet-200';
    iconColorClasses = 'text-purple-300';
    buttonClasses = 'bg-purple-600 hover:bg-purple-700 text-white border-transparent';
    focusRingClass = 'focus:ring-purple-400';
  } else if (theme === 'dusk') { 
    cardBaseClasses = "bg-slate-800 border-transparent"; 
    textContentBgClass = "bg-slate-800";
    textPrimaryClasses = 'text-white';
    textSecondaryClasses = 'text-white';
    iconColorClasses = 'text-white';
    buttonClasses = 'bg-slate-600 hover:bg-blue-500 text-white border border-slate-500 hover:border-blue-500';
    focusRingClass = 'focus:ring-blue-500';
  }

  const cardRootDynamicClasses = 'break-inside-avoid-column mb-8';
  
  const renderTextContent = (isFullLayoutTextContainer: boolean = false) => {
    let textContentPaddingClasses = '';
    if (isFullLayoutTextContainer) {
      textContentPaddingClasses = ''; // Full layout text container handles its own padding (p-6 on its parent)
    } else if (imageLayoutStyle === 'small' && processedImageUrl) {
      if (showBgEffect) { // Squint mode for Small layout
        textContentPaddingClasses = 'px-6 pb-6 pt-10'; // pt-10 to compensate for negative margin
      } else { // Color mode for Small layout (no squint) - text should not overlap
        textContentPaddingClasses = 'p-6'; // Standard padding, text flows below image
      }
    } else { // Small without image, or Text Only
      textContentPaddingClasses = 'p-6';
    }

    let heightClass = '';
    // For h-auto cards, text content area should grow.
    // Specifically for 'small' without image or 'text-only', this ensures the text area can expand.
    if (!isFullLayoutTextContainer) {
       if ((imageLayoutStyle === 'small' && !processedImageUrl) || imageLayoutStyle === 'text-only') {
         heightClass = 'flex-grow'; 
       }
    }
    
    const textContentDivClasses = [
        'relative', 'z-10', 'flex', 'flex-col', 'flex-grow', 'overflow-hidden',
        textContentPaddingClasses,
        heightClass
    ].join(' ');

    return (
      <div className={textContentDivClasses}> 
        <h3 className={"text-2xl font-semibold mb-2 " + textPrimaryClasses + " line-clamp-3"}>{eventTitle}</h3>

        <div className={"flex items-center text-sm mb-3 " + textSecondaryClasses}>
          <CalendarDaysIcon className={"mr-2 flex-shrink-0 " + iconColorClasses} />
          <span>{formatDateTimeRange(event.start_time)}</span>
        </div>

        {event.place && (
          <div className={"flex items-center text-sm mb-1 " + textSecondaryClasses}>
            <LocationPinIcon className={"mr-2 flex-shrink-0 " + iconColorClasses} />
            <span className="line-clamp-1">{getPlaceName(event.place)}</span>
          </div>
        )}
        
        <div className="flex-grow"></div> 

        {event.url && (
          <div className="mt-auto pt-4 flex-shrink-0"> 
            <div
              className={"inline-block text-center w-full border font-medium py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out " + buttonClasses}
              onClick={(e) => e.stopPropagation()} 
            >
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              View Details
            </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootButtonClasses = [
    'rounded-xl', 'overflow-hidden', 'transition-all', 'duration-300', 'cursor-pointer',
    'text-left', 'w-full', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-transparent',
    'focus:ring-opacity-75',
    cardBaseClasses,
    focusRingClass,
    cardRootDynamicClasses,
    'h-auto', // All cards are h-auto now
    'relative', 'flex', 'flex-col'
  ].join(' ');

  return (
    <button
      onClick={() => onOpenDetail(event)}
      className={rootButtonClasses}
      aria-label={"View details for " + eventTitle}
    >
      {imageLayoutStyle === 'full' && (
        <React.Fragment>
          {processedImageUrl && (
            <div className="relative w-full h-auto flex-shrink-0 z-10"> {/* Ensure non-blurred image is on top */}
              <img
                src={processedImageUrl}
                alt={imageAltText}
                className="w-full h-auto object-cover" // Natural height for image
              />
            </div>
          )}
          
          {/* Text content container for Full view */}
          <div className={
            "relative p-6 flex-grow flex flex-col " +
            // Apply theme-specific background only if Squint is OFF or no image for Squint
            ((processedImageUrl && showBgEffect) ? '' : textContentBgClass) 
          }>
            {/* Blurred background for text area in Squint mode */}
            {showBgEffect && processedImageUrl && (
              <img
                src={processedImageUrl}
                alt="" // Decorative
                className="absolute inset-0 w-full h-full object-cover z-0 filter blur-xl brightness-75"
                aria-hidden="true"
              />
            )}
            {renderTextContent(true)} {/* isFullLayoutTextContainer = true */}
          </div>
        </React.Fragment>
      )}

      {imageLayoutStyle === 'small' && (
        <React.Fragment>
          {/* Full card blurred background for Squint mode */}
          {processedImageUrl && showBgEffect && ( 
            <img
              src={processedImageUrl}
              alt="" // Decorative
              className="absolute inset-0 w-full h-full object-cover z-0 filter blur-xl brightness-75"
              aria-hidden="true"
            />
          )}
          {/* The small image itself */}
          {processedImageUrl && ( 
            <div className="relative w-full h-48 flex-shrink-0 z-10"> {/* Image has z-10 */}
              <img
                src={processedImageUrl}
                alt={imageAltText}
                className={"w-full h-full object-cover " + 
                           (showBgEffect ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]' : '')}
              />
            </div>
          )}
          {/* Container for text content */}
          <div className={
            "relative flex-grow flex flex-col overflow-hidden z-10 " + // Text container also z-10 to be above full-card blur
             // Negative margin only for small+image+squint to pull text over image
            ( (imageLayoutStyle === 'small' && processedImageUrl && showBgEffect) ? 'mt-[-2.5rem]' : '' ) + 
             // Text area background: transparent if full-card blur is shown (Squint mode), otherwise theme-specific
            ( (processedImageUrl && showBgEffect) ? '' : textContentBgClass)
          }>
             {renderTextContent()}
          </div>
        </React.Fragment>
      )}

      {imageLayoutStyle === 'text-only' && (
        <React.Fragment>
          {/* Full card blurred background for Squint mode */}
          {processedImageUrl && showBgEffect && (
            <img
              src={processedImageUrl}
              alt="" // Decorative
              className="absolute inset-0 w-full h-full object-cover z-0 filter blur-xl brightness-75"
              aria-hidden="true"
            />
          )}
          {/* Text content container for Text Only view */}
          <div className={
            "h-full flex flex-col flex-grow " + // flex-grow for h-auto card
             // Text area background: transparent if full-card blur is shown, otherwise theme-specific
            ((processedImageUrl && showBgEffect) ? '' : textContentBgClass)
          }>
            {renderTextContent()}
          </div>
        </React.Fragment>
      )}
    </button>
  );
};

export default EventCard;
