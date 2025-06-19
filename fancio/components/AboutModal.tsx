
import React from 'react';
import { GancioInstanceConfig } from '../types'; // Assuming GancioInstanceConfig is in types.ts

type Theme = 'dark' | 'light' | 'dusk' | 'grape';

interface AboutModalProps {
  instances: GancioInstanceConfig[];
  theme: Theme;
  onClose: () => void;
}

const XMarkIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AboutModal: React.FC<AboutModalProps> = ({ instances, theme, onClose }) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  let overlayBgClass = '';
  let modalBgClass = 'bg-white border-gray-300';
  let modalContainerClasses = 'rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative border';
  let textPrimaryClass = 'text-black';
  let textSecondaryClass = 'text-gray-700';
  let linkClass = 'text-black hover:text-gray-700 font-medium'; 
  let sectionTitleClass = 'text-xl font-semibold mb-2';
  let closeButtonClass = 'text-gray-600 hover:text-black bg-transparent';
  let countryHeadingClass = 'text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1'; 

  if (theme === 'dark') {
    overlayBgClass = 'bg-black bg-opacity-80';
    modalBgClass = 'bg-black border-gray-700';
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-gray-300';
    linkClass = 'text-white hover:opacity-80 font-medium'; 
    sectionTitleClass = `text-xl font-semibold mb-2 ${textPrimaryClass}`;
    closeButtonClass = 'text-gray-400 hover:text-white bg-transparent';
    countryHeadingClass = 'text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1'; 
  } else if (theme === 'light') {
    overlayBgClass = 'bg-gray-900 bg-opacity-70';
    // modalBgClass, textPrimaryClass, textSecondaryClass, sectionTitleClass, countryHeadingClass use defaults
    // linkClass is already set for light theme's monochrome style
  } else if (theme === 'grape') {
    overlayBgClass = 'bg-black bg-opacity-70';
    modalBgClass = 'bg-violet-900 border-violet-700';
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-violet-200';
    linkClass = 'text-purple-300 hover:text-purple-200 font-medium';
    sectionTitleClass = `text-xl font-semibold mb-2 ${textPrimaryClass}`;
    closeButtonClass = 'text-violet-300 hover:text-purple-300 bg-transparent';
    countryHeadingClass = 'text-sm font-semibold uppercase tracking-wider text-violet-300 mb-1'; 
  } else if (theme === 'dusk') {
    overlayBgClass = 'bg-slate-900/80 backdrop-blur-sm';
    modalBgClass = 'bg-slate-800 border-transparent'; // Assuming border is handled by modalContainerClasses or specific Dusk modal style
    textPrimaryClass = 'text-white';
    textSecondaryClass = 'text-slate-300';
    linkClass = 'text-white hover:opacity-80 font-medium'; 
    sectionTitleClass = `text-xl font-semibold mb-2 ${textPrimaryClass}`;
    closeButtonClass = 'text-white opacity-90 hover:opacity-80 bg-transparent';
    countryHeadingClass = 'text-sm font-semibold uppercase tracking-wider text-slate-400 mb-1'; 
  }

  const groupedInstancesByCountry = instances.reduce((acc, instance) => {
    if (!acc[instance.country]) {
      acc[instance.country] = [];
    }
    acc[instance.country].push(instance);
    return acc;
  }, {} as Record<string, GancioInstanceConfig[]>);

  const sortedCountryNames = Object.keys(groupedInstancesByCountry).sort((a, b) => a.localeCompare(b));

  const sortedInstances = sortedCountryNames.reduce((acc, country) => {
    acc[country] = groupedInstancesByCountry[country].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, GancioInstanceConfig[]>);


  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${overlayBgClass}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className={`${modalContainerClasses} ${modalBgClass}`}
        onClick={stopPropagation}
      >
        <button 
          onClick={onClose} 
          className={`absolute top-4 right-4 z-20 p-1 rounded-full ${closeButtonClass}`}
          aria-label="Close about information"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <div className={`pt-4 px-6 pb-6 space-y-4 overflow-y-auto ${textSecondaryClass}`}> 
          <h2 id="about-modal-title" className="sr-only"> 
            About
          </h2>
          <section>
            <h3 className={sectionTitleClass}>Community event lists we source from</h3>
            <div className="text-sm md:columns-2 md:gap-x-6 lg:gap-x-8 pt-px">
              {Object.entries(sortedInstances).map(([country, instancesInCountry]) => (
                <div key={country} className="mb-3 pt-3 break-inside-avoid-column"> 
                  <p className={countryHeadingClass}>{country}</p>
                  <ul className="list-disc list-inside ml-2">
                    {instancesInCountry.map(instance => (
                      <li key={instance.id} className="mb-1">
                        <span className={textPrimaryClass}>{instance.name}: </span>
                        <a 
                          href={instance.baseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={linkClass}
                        >
                          {instance.baseUrl.replace(/^(https?:\/\/)/, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className={sectionTitleClass}>This is the fediverse</h3>
            <p>
              This viewer helps you explore events listed on various Gancio instances. 
              Gancio is open-source software that allows communities to create and manage their own event platforms.
            </p>
            <p className="mt-2">
              <a href="https://gancio.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Learn more about Gancio at gancio.org
              </a>
            </p>
          </section>

          <section>
            <h3 className={sectionTitleClass}>Community event maps</h3> 
            <ul className="list-disc list-inside">
              <li>
                <a href="https://autistici.org/void/balotta" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  «𝖛𝖔𝔦𝔡 balotta»
                </a>
                {' by '}
                <a href="https://post.lurk.org/@grafton9" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  @grafton9
                </a>
                {' shows venues listed on '}
                <a href="https://balotta.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  balotta.org
                </a>.
              </li>
              <li>
                <a href="https://vousrevoir.be" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  «vous revoir»
                </a>
                {' by '}
                <a href="https://surlaterre.org/@simon" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  @simon
                </a>
                {' shows events listed across both Mobilizon & Gancio servers around the world plotted onto a map.'}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
