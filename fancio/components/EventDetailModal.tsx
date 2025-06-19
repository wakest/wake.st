
import React, { useState, useEffect } from 'react';
import { GancioEvent, Place, Organizer } from '../types';
import { formatDateTimeRange, stripHtml } from '../utils/helpers';

type Theme = 'dark' | 'light' | 'dusk' | 'grape';
type ImageLayoutStyle = 'small' | 'full' | 'text-only';
type BackgroundEffectMode = 'squint' | 'color';

interface EventDetailModalProps {
  event: GancioEvent;
  instanceBaseUrl: string;
  onClose: () => void;
  onTagClick: (tag: string) => void;
  onLocationClick: (locationName: string) => void;
  onDateClick: (dateString: string) => void;
  theme: Theme;
  imageLayoutStyle: ImageLayoutStyle;
  backgroundEffectMode: BackgroundEffectMode;
  sourceInstanceName: string;
}

const LocationPinIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CalendarDaysIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
</svg>
);

const XMarkIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"w-6 h-6 " + (className || '')}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MapIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
  </svg>
);

// "my_location" (Crosshair) Icon - for Address
const LocationCityIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
     <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

const WorldIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);


const normalizeTag = (tagStr: string): string => {
  if (!tagStr) return '';
  return tagStr.replace(/^#+/, '');
};


const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, instanceBaseUrl, onClose, onTagClick, onLocationClick, onDateClick, theme, imageLayoutStyle, backgroundEffectMode, sourceInstanceName }) => {
  const [modalImageLoadError, setModalImageLoadError] = useState(false);
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
      pathForUrlConstructor = "media/" + pathForUrlConstructor;
    }
    try {
      const url = new URL(pathForUrlConstructor, instanceBaseUrl);
      if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'data:') {
        processedImageUrl = url.href;
      }
    } catch (error) { /* silent */ }
  }

  const [imageLayoutConfig, setImageLayoutConfig] = useState<{ mode: 'side' | 'top'; determined: boolean }>({
    mode: 'side',
    determined: false,
  });

  useEffect(() => {
    setModalImageLoadError(false); // Reset error state when event/image changes
    setImageLayoutConfig({ mode: 'side', determined: false });

    if (processedImageUrl && imageLayoutStyle !== 'text-only') {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        setImageLayoutConfig({
          mode: aspectRatio > 1 ? 'top' : 'side',
          determined: true,
        });
      };
      img.onerror = () => {
        // If image metadata fails to load (e.g. 404 before onError on img tag fires)
        // Treat as error for layout purposes too.
        setModalImageLoadError(true);
        setImageLayoutConfig({ mode: 'side', determined: true });
      };
      img.src = processedImageUrl;
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setImageLayoutConfig({ mode: 'side', determined: true });
    }
  }, [processedImageUrl, imageLayoutStyle, event.id]);


  const eventTitle = event.name || event.title || 'Untitled Event';
  const imageAltText = event.name || event.title || 'Event image';

  const getPlaceName = (place: Place | string | null): string => {
    if (!place) return 'Online or TBD';
    if (typeof place === 'string') return place;
    const namePart = place.name || '';
    const localityPart = place.locality || '';
    const countryPart = place.country || '';

    let parts = [namePart, localityPart, countryPart].filter(Boolean);
    return parts.join(', ');
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  let overlayBgClass = '';
  let modalContainerBaseClasses = 'rounded-xl shadow-2xl max-h-[90vh] flex flex-col relative overflow-hidden border border-2';
  let modalWidthClass = '';
  let modalThemeSpecificStyles = '';

  let contentSuperWrapperBgClass = '';
  let textPrimaryClass = '';
  let textSecondaryClass = '';
  let textMutedClass = '';
  let textMutedHoverClass = '';
  let iconColorClass = '';
  let closeButtonBgClass = '';
  let imagePlaceholderTextClass = '';
  let imageContainerBgClass = '';
  let tagBgClass = '';
  let tagHoverClass = '';
  let linkButtonClasses = '';
  let proseClasses = '';
  let linkInProseClass = '';
  let interactiveTextClass = '';
  let organizerLinkClass = '';

  const showBgEffect = backgroundEffectMode === 'squint';
  const imagePresentAndNotErrored = processedImageUrl && !modalImageLoadError;


  if (imageLayoutStyle !== 'text-only' && imageLayoutConfig.mode === 'top' && imageLayoutConfig.determined) {
    modalWidthClass = 'w-3/5 max-w-4xl';
  } else {
    modalWidthClass = 'w-full max-w-4xl';
  }

  if (theme === 'dark') {
    overlayBgClass = 'bg-black bg-opacity-80';
    modalThemeSpecificStyles = 'bg-black border-[#3b3b3b]';
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-gray-300';
    textMutedClass = 'text-gray-400';
    textMutedHoverClass = 'hover:text-white';
    iconColorClass = 'text-white';
    closeButtonBgClass = 'bg-transparent';
    imagePlaceholderTextClass = 'text-gray-500';
    imageContainerBgClass = 'bg-black';
    tagBgClass = 'bg-gray-500/20 text-gray-300';
    tagHoverClass = 'hover:bg-gray-400/20';
    linkButtonClasses = 'bg-white hover:bg-gray-200 text-black';
    proseClasses = 'prose-invert';
    linkInProseClass = 'text-white hover:opacity-80 font-medium';
    interactiveTextClass = 'hover:text-white';
    organizerLinkClass = 'text-white hover:opacity-80';
    contentSuperWrapperBgClass = (showBgEffect && imagePresentAndNotErrored) ? 'bg-transparent' : 'bg-black';
  } else if (theme === 'light') {
    overlayBgClass = 'bg-gray-900 bg-opacity-70';
    modalThemeSpecificStyles = 'bg-white border-gray-300';
    closeButtonBgClass = 'bg-transparent';
    imagePlaceholderTextClass = 'text-gray-400';
    imageContainerBgClass = 'bg-gray-100';
    linkButtonClasses = 'bg-black hover:bg-gray-800 text-white';
    contentSuperWrapperBgClass = (showBgEffect && imagePresentAndNotErrored) ? 'bg-transparent' : 'bg-white';

    if (showBgEffect && imagePresentAndNotErrored) {
      textPrimaryClass = 'text-white';
      textSecondaryClass = 'text-gray-300';
      iconColorClass = 'text-white';
      textMutedClass = 'text-gray-400';
      textMutedHoverClass = 'hover:text-white';
      tagBgClass = 'bg-gray-500/20 text-gray-300';
      tagHoverClass = 'hover:bg-gray-400/20';
      proseClasses = 'prose-invert';
      linkInProseClass = 'text-white hover:opacity-80 font-medium';
      interactiveTextClass = 'hover:text-white';
      organizerLinkClass = 'text-white hover:opacity-80';
    } else {
      textPrimaryClass = 'text-black';
      textSecondaryClass = 'text-gray-700';
      iconColorClass = 'text-black';
      textMutedClass = 'text-gray-600';
      textMutedHoverClass = 'hover:text-black';
      tagBgClass = 'bg-gray-500/20 text-gray-700';
      tagHoverClass = 'hover:bg-gray-600/20';
      proseClasses = '';
      linkInProseClass = 'text-black hover:text-gray-700 font-medium';
      interactiveTextClass = 'hover:text-black';
      organizerLinkClass = 'text-black hover:text-gray-700';
    }
  } else if (theme === 'grape') {
    overlayBgClass = 'bg-black bg-opacity-70';
    modalThemeSpecificStyles = 'bg-violet-900 border-violet-700';
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-violet-200';
    textMutedClass = 'text-violet-300';
    textMutedHoverClass = 'hover:text-purple-300';
    iconColorClass = 'text-purple-300';
    closeButtonBgClass = 'bg-transparent';
    imagePlaceholderTextClass = 'text-violet-400';
    imageContainerBgClass = 'bg-violet-950';
    tagBgClass = 'bg-purple-400/20 text-violet-100';
    tagHoverClass = 'hover:bg-purple-300/20';
    linkButtonClasses = 'bg-purple-600 hover:bg-purple-700 text-white';
    proseClasses = 'prose-invert';
    linkInProseClass = 'text-purple-300 hover:text-purple-200 font-medium';
    interactiveTextClass = 'hover:text-purple-300';
    organizerLinkClass = textPrimaryClass + ' hover:text-purple-200';
    contentSuperWrapperBgClass = (showBgEffect && imagePresentAndNotErrored) ? 'bg-transparent' : 'bg-violet-900';
  } else if (theme === 'dusk') {
    overlayBgClass = 'bg-slate-900/80 backdrop-blur-sm';
    modalThemeSpecificStyles = 'bg-slate-800 border-slate-500';
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-white';
    textMutedClass = 'text-white opacity-90';
    textMutedHoverClass = 'hover:opacity-80';
    iconColorClass = 'text-white';
    closeButtonBgClass = 'bg-transparent';
    imagePlaceholderTextClass = 'text-white opacity-75';
    imageContainerBgClass = 'bg-transparent md:bg-slate-900/40';
    tagBgClass = 'bg-slate-400/20 text-white';
    tagHoverClass = 'hover:bg-slate-300/20';
    linkButtonClasses = 'bg-blue-600 hover:bg-blue-500 text-white';
    proseClasses = 'prose-invert prose-p:text-white prose-strong:text-white prose-headings:text-white prose-a:text-white prose-blockquote:text-white prose-ul:text-white prose-ol:text-white prose-li:text-white prose-code:text-white';
    linkInProseClass = 'text-white hover:opacity-80 font-medium';
    interactiveTextClass = 'text-white hover:opacity-80';
    organizerLinkClass = 'text-white hover:opacity-80';
    contentSuperWrapperBgClass = (showBgEffect && imagePresentAndNotErrored) ? 'bg-transparent' : 'bg-slate-800';
  }

  const finalModalContainerClasses = [modalContainerBaseClasses, modalWidthClass, modalThemeSpecificStyles].join(' ');

  const cleanDescription = event.description ? stripHtml(event.description).trim() : "";
  const directEventLink = event.url || `${instanceBaseUrl}/event/${event.id}`;
  const displayEventLinkText = directEventLink.replace(/^(https?:\/\/)/, '');


  const placeNameString = getPlaceName(event.place);
  const eventAddress = (typeof event.place === 'object' && event.place && (event.place as Place).address)
    ? (event.place as Place).address
    : null;

  const fullFormattedDateTime = formatDateTimeRange(event.start_time);
  const datePartForClick = fullFormattedDateTime.includes(' at ') ? fullFormattedDateTime.split(' at ')[0] : fullFormattedDateTime;
  const isDateValid = fullFormattedDateTime !== 'Date not available' && fullFormattedDateTime !== 'Invalid date format';

  const hasLatLon = typeof event.place === 'object' && event.place &&
                    typeof (event.place as Place).latitude === 'number' &&
                    typeof (event.place as Place).longitude === 'number';

  const osmUrl = hasLatLon
    ? 'https://www.openstreetmap.org/directions?from=&to=' + (event.place as Place).latitude + '%2C' + (event.place as Place).longitude + '#map=17/' + (event.place as Place).latitude + '/' + (event.place as Place).longitude
    : '';

  const mainContentFlexDirection =
    imageLayoutStyle !== 'text-only' && imageLayoutConfig.mode === 'top' && imageLayoutConfig.determined
      ? 'flex-col'
      : 'flex-col md:flex-row';

  let baseImageSectionContainerClasses = "relative flex-shrink-0 flex items-center justify-center overflow-hidden " + imageContainerBgClass;
  let imageSectionContainerClasses = baseImageSectionContainerClasses;
  let imgTagClasses = "transform scale-[1.015]";
  let textSectionContainerClasses = "flex flex-col p-6 overflow-y-auto relative";

  if (imageLayoutStyle === 'text-only') {
    imageSectionContainerClasses += ' hidden';
    textSectionContainerClasses += ' w-full';
  } else if (imageLayoutConfig.determined) {
    if (imageLayoutConfig.mode === 'top') {
      imageSectionContainerClasses += ' w-full h-auto rounded-t-xl';
      imgTagClasses += ' w-full h-auto object-cover rounded-t-xl';
      textSectionContainerClasses += ' w-full';
    } else {
      imageSectionContainerClasses += ' md:w-5/12 lg:w-4/12 rounded-t-xl md:rounded-l-xl md:rounded-r-none md:rounded-t-none';
      imgTagClasses += ' object-contain max-w-full max-h-[80vh] md:max-h-full w-auto h-auto rounded-t-xl md:rounded-l-xl md:rounded-r-none md:rounded-t-none';
      textSectionContainerClasses += ' flex-grow';
    }
  } else if (processedImageUrl) {
    imageSectionContainerClasses += " md:w-5/12 lg:w-4/12 h-64 md:h-auto rounded-t-xl md:rounded-l-xl md:rounded-r-none md:rounded-t-none animate-pulse " + (theme === 'dark' || theme === 'dusk' || theme === 'grape' ? 'bg-gray-700/50' : 'bg-gray-300/50');
    textSectionContainerClasses += ' flex-grow';
  } else {
     imageSectionContainerClasses += ' md:w-5/12 lg:w-4/12 h-48 md:h-full rounded-t-xl md:rounded-l-xl md:rounded-r-none md:rounded-t-none';
     textSectionContainerClasses += ' flex-grow';
  }


  return (
    <div
      className={"fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 " + overlayBgClass}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div
        className={finalModalContainerClasses}
        onClick={stopPropagation}
      >
        {imagePresentAndNotErrored && (
          <img
            src={processedImageUrl!}
            alt=""
            className={"absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 " + (
              showBgEffect
                ? 'opacity-100 filter blur-xl brightness-75'
                : 'opacity-0 filter blur-none pointer-events-none invisible'
            )}
            aria-hidden="true"
          />
        )}
        <div className={"relative z-10 w-full h-full flex flex-col overflow-hidden " + contentSuperWrapperBgClass}>
          <button
            onClick={onClose}
            className={"absolute top-3 right-3 z-20 p-1 rounded-full " + textMutedClass + " " + textMutedHoverClass + " " + closeButtonBgClass}
            aria-label="Close event details"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>

          <div className={"flex flex-grow overflow-hidden " + mainContentFlexDirection}>
            {imageLayoutStyle !== 'text-only' && (
              <div className={imageSectionContainerClasses}>
                {processedImageUrl ? (
                  imageLayoutConfig.determined ? (
                    !modalImageLoadError ? (
                      <img
                        src={processedImageUrl}
                        alt=""
                        className={imgTagClasses}
                        onError={() => setModalImageLoadError(true)}
                      />
                    ) : (
                      <div className={"w-full h-full flex items-center justify-center p-4 text-center " + imagePlaceholderTextClass + " " + imageContainerBgClass}>
                        {imageAltText}
                      </div>
                    )
                  ) : (
                    null
                  )
                ) : (
                  imageLayoutConfig.determined && (
                    <div className={"w-full h-full flex items-center justify-center " + imagePlaceholderTextClass}>
                      No image available
                    </div>
                  )
                )}
              </div>
            )}

            <div className={textSectionContainerClasses}>
              <div className="relative z-10 flex flex-col space-y-4 flex-grow">
                <h2 id="event-detail-title" className={"text-3xl font-bold " + textPrimaryClass}>{eventTitle}</h2>

                <div className={"flex items-center " + textSecondaryClass}>
                  <CalendarDaysIcon className={"mr-2 flex-shrink-0 " + iconColorClass} />
                  {isDateValid ? (
                    <button
                      onClick={() => onDateClick(datePartForClick)}
                      className={"text-left text-sm cursor-pointer transition-colors duration-150 " + interactiveTextClass}
                      aria-label={"Search for events on " + datePartForClick}
                    >
                      {fullFormattedDateTime}
                    </button>
                  ) : (
                    <span className="text-sm">{fullFormattedDateTime}</span>
                  )}
                </div>

                {event.place && (
                  <div className={"flex items-center " + textSecondaryClass}>
                    <LocationPinIcon className={"mr-2 flex-shrink-0 " + iconColorClass} />
                    {placeNameString !== 'Online or TBD' ? (
                      <button
                        onClick={() => onLocationClick(placeNameString)}
                        className={"text-left text-sm cursor-pointer transition-colors duration-150 " + interactiveTextClass}
                        aria-label={"Search for events at " + placeNameString}
                      >
                        {placeNameString}
                      </button>
                    ) : (
                      <span className="text-sm">{placeNameString}</span>
                    )}
                  </div>
                )}

                {eventAddress && (
                  <div className={"flex items-center " + textSecondaryClass}>
                    <LocationCityIcon className={"mr-2 flex-shrink-0 " + iconColorClass} />
                    <span className="text-sm">{eventAddress}</span>
                  </div>
                )}

                {hasLatLon && (
                  <div className={"flex items-center " + textSecondaryClass}>
                    <MapIcon className={"mr-2 flex-shrink-0 " + iconColorClass} />
                    <a
                      href={osmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={"text-sm cursor-pointer " + interactiveTextClass + " transition-colors duration-150"}
                      aria-label="Open location in OpenStreetMap"
                    >
                      Open in map
                    </a>
                  </div>
                )}

                {event.organizer && event.organizer.name && (
                    <div className={"text-sm " + textMutedClass}>
                        Organized by: {event.organizer.url ?
                        <a href={event.organizer.url} target="_blank" rel="noopener noreferrer" className={organizerLinkClass}>{event.organizer.name}</a>
                        : event.organizer.name}
                    </div>
                )}

                <div className={"text-base leading-relaxed " + textSecondaryClass}>
                  {cleanDescription
                    ? <div className={"prose prose-sm max-w-none " + proseClasses} dangerouslySetInnerHTML={{ __html: event.description }} />
                    : (
                        <a
                          href={directEventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center group ${linkInProseClass}`}
                          aria-label={`View event details on ${displayEventLinkText.split('/')[0]}`}
                        >
                          <WorldIcon className={`mr-2 h-5 w-5 ${iconColorClass}`} />
                          <span className="truncate">{displayEventLinkText}</span>
                        </a>
                      )
                  }
                </div>


                {event.tags && event.tags.length > 0 && (
                  <div className="pt-2">
                    {event.tags.map(rawTag => {
                      const normalizedTag = normalizeTag(rawTag);
                      if (!normalizedTag) return null;
                      return (
                        <button
                          key={rawTag}
                          onClick={() => onTagClick(normalizedTag)}
                          className={"inline-block text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors duration-150 " + tagBgClass + " " + tagHoverClass}
                          aria-label={"Search for events tagged with " + normalizedTag}
                        >
                          {"#" + normalizedTag}
                        </button>
                      );
                    })}
                  </div>
                )}

                {event.url && (
                  <div className="mt-auto pt-4">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={"inline-block text-center w-full font-medium py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out " + linkButtonClasses}
                    >
                      View Original Event
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
