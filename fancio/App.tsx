
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GancioEvent } from './types';
import { fetchEvents } from './services/gancioService';
import EventCard from './components/EventCard';
import EventDetailModal from './components/EventDetailModal';
import EventCardSkeleton from './components/EventCardSkeleton';
import AboutModal from './components/AboutModal'; // Import new AboutModal
import ThemePieIcon from './components/ThemePieIcon'; // Import new ThemePieIcon
import { formatDateTimeRange } from './utils/helpers'; 

interface GancioInstanceConfig {
  id: string;
  name: string;
  apiUrl: string;
  baseUrl:string;
  country: string; 
}

const PREDEFINED_INSTANCES: GancioInstanceConfig[] = [
  {
    id: 'berlin_askapunk',
    name: 'Berlin',
    apiUrl: 'https://berlin.askapunk.de/api/events/',
    baseUrl: 'https://berlin.askapunk.de',
    country: 'Germany'
  },
  {
    id: 'bcn_convoca_la',
    name: 'Barcelona',
    apiUrl: 'https://bcn.convoca.la/api/events/',
    baseUrl: 'https://bcn.convoca.la',
    country: 'Spain'
  },
  {
    id: 'montreal_askapunk',
    name: 'Montreal',
    apiUrl: 'https://montreal.askapunk.net/api/events/',
    baseUrl: 'https://montreal.askapunk.net',
    country: 'Canada'
  },
  {
    id: 'torino_gancio_cisti',
    name: 'Torino',
    apiUrl: 'https://gancio.cisti.org/api/events/',
    baseUrl: 'https://gancio.cisti.org',
    country: 'Italy'
  },
  {
    id: 'bonn_jetzt',
    name: 'Bonn',
    apiUrl: 'https://bonn.jetzt/api/events/',
    baseUrl: 'https://bonn.jetzt',
    country: 'Germany'
  },
  {
    id: 'roma_convoca_la',
    name: 'Rome',
    apiUrl: 'https://roma.convoca.la/api/events/',
    baseUrl: 'https://roma.convoca.la',
    country: 'Italy'
  },
  {
    id: 'ljubljana_koledar_kompot',
    name: 'Ljubljana',
    apiUrl: 'https://koledar.kompot.si/api/events/',
    baseUrl: 'https://koledar.kompot.si',
    country: 'Slovenia'
  },
  {
    id: 'buenos_aires_vagancio_pirata',
    name: 'Buenos Aires',
    apiUrl: 'https://vagancio.partidopirata.com.ar/api/events/',
    baseUrl: 'https://vagancio.partidopirata.com.ar',
    country: 'Argentina'
  },
  {
    id: 'chicago_askapunk',
    name: 'Chicago',
    apiUrl: 'https://chicago.askapunk.net/api/events/',
    baseUrl: 'https://chicago.askapunk.net',
    country: 'USA'
  },
  {
    id: 'rhine_askapunk',
    name: 'Rheinland',
    apiUrl: 'https://rhine.askapunk.de/api/events/',
    baseUrl: 'https://rhine.askapunk.de',
    country: 'Germany'
  },
  {
    id: 'melbourne_askapunk',
    name: 'Melbourne',
    apiUrl: 'https://melbourne.askapunk.net/api/events/',
    baseUrl: 'https://melbourne.askapunk.net',
    country: 'Australia'
  },
  {
    id: 'philly_askapunk',
    name: 'Philly',
    apiUrl: 'https://philly.askapunk.net/api/events/',
    baseUrl: 'https://philly.askapunk.net',
    country: 'USA'
  },
  {
    id: 'toronto_askapunk',
    name: 'Toronto',
    apiUrl: 'https://toronto.askapunk.net/api/events/',
    baseUrl: 'https://toronto.askapunk.net',
    country: 'Canada'
  },
  {
    id: 'buffalo_askapunk',
    name: 'Buffalo',
    apiUrl: 'https://buffalo.askapunk.net/api/events/',
    baseUrl: 'https://buffalo.askapunk.net',
    country: 'USA'
  },
  {
    id: 'ottawa_askapunk',
    name: 'Ottawa',
    apiUrl: 'https://ottawa.askapunk.net/api/events/',
    baseUrl: 'https://ottawa.askapunk.net',
    country: 'Canada'
  },
  {
    id: 'hattiesburg_askapunk',
    name: 'Hattiesburg',
    apiUrl: 'https://hattiesburg.askapunk.net/api/events/',
    baseUrl: 'https://hattiesburg.askapunk.net',
    country: 'USA'
  },
  {
    id: 'bologna_balotta',
    name: 'Bologna',
    apiUrl: 'https://balotta.org/api/events/',
    baseUrl: 'https://balotta.org',
    country: 'Italy'
  },
  {
    id: 'castello_convoca_la',
    name: 'Castellò',
    apiUrl: 'https://castello.convoca.la/api/events/',
    baseUrl: 'https://castello.convoca.la',
    country: 'Spain'
  },
  {
    id: 'madrid_mad_convoca_la',
    name: 'Madrid',
    apiUrl: 'https://mad.convoca.la/api/events/',
    baseUrl: 'https://mad.convoca.la',
    country: 'Spain'
  },
  {
    id: 'mallorca_convoca_la',
    name: 'Mallorca',
    apiUrl: 'https://mallorca.convoca.la/api/events/',
    baseUrl: 'https://mallorca.convoca.la',
    country: 'Spain'
  },
  {
    id: 'girona_tramuntana_convoca_la',
    name: 'Girona',
    apiUrl: 'https://tramuntana.convoca.la/api/events/',
    baseUrl: 'https://tramuntana.convoca.la',
    country: 'Spain'
  },
  {
    id: 'zaragoza_zgz_convoca_la',
    name: 'Zaragoza',
    apiUrl: 'https://zgz.convoca.la/api/events/',
    baseUrl: 'https://zgz.convoca.la',
    country: 'Spain'
  },
  {
    id: 'karlsruhe_keepkarlsruheboring',
    name: 'Karlsruhe',
    apiUrl: 'https://keepkarlsruheboring.org/api/events/',
    baseUrl: 'https://keepkarlsruheboring.org',
    country: 'Germany'
  },
  {
    id: 'milano_puntello_org',
    name: 'Milano',
    apiUrl: 'https://puntello.org/api/events/',
    baseUrl: 'https://puntello.org',
    country: 'Italy'
  },
  {
    id: 'florence_lapunta_org',
    name: 'Florence',
    apiUrl: 'https://lapunta.org/api/events/',
    baseUrl: 'https://lapunta.org',
    country: 'Italy'
  },
  {
    id: 'tucson_timeline_info',
    name: 'Tucson',
    apiUrl: 'https://tucsontimeline.info/api/events/',
    baseUrl: 'https://tucsontimeline.info',
    country: 'USA'
  },
  {
    id: 'valencia_calendari_cc',
    name: 'València',
    apiUrl: 'https://calendari.cc/api/events/',
    baseUrl: 'https://calendari.cc',
    country: 'Spain'
  },
  {
    id: 'ibaizabal_lubakiagenda_net',
    name: 'Ibaizabal',
    apiUrl: 'https://www.lubakiagenda.net/api/events/',
    baseUrl: 'https://www.lubakiagenda.net',
    country: 'Spain'
  },
  {
    id: 'prague_nolog_cz',
    name: 'Prague',
    apiUrl: 'https://akce.nolog.cz/api/events/',
    baseUrl: 'https://akce.nolog.cz',
    country: 'Czechia'
  },
  {
    id: 'campinas_eventos_lhc_net_br',
    name: 'Campinas',
    apiUrl: 'https://eventos.lhc.net.br/api/events/',
    baseUrl: 'https://eventos.lhc.net.br',
    country: 'Brazil'
  },
  {
    id: 'lisbon_eventos_coletivos_org',
    name: 'Lisbon',
    apiUrl: 'https://eventos.coletivos.org/api/events/',
    baseUrl: 'https://eventos.coletivos.org',
    country: 'Portugal'
  },
  {
    id: 'lulea_events_campus_ltu_se',
    name: 'Luleå',
    apiUrl: 'https://events.campus.ltu.se/api/events/',
    baseUrl: 'https://events.campus.ltu.se',
    country: 'Sweden'
  },
  {
    id: 'bogota_autonoma_red',
    name: 'Bogotá',
    apiUrl: 'https://autonoma.red/api/events/',
    baseUrl: 'https://autonoma.red',
    country: 'Colombia'
  },
  {
    id: 'minneapolis_layerzero',
    name: 'Minneapolis',
    apiUrl: 'https://calendar.layerze.ro/api/events',
    baseUrl: 'https://calendar.layerze.ro',
    country: 'USA'
  },
  {
    id: 'rouen_agenda_rouen_luttes_org',
    name: 'Rouen',
    apiUrl: 'https://agenda.rouen-luttes.org/api/events/',
    baseUrl: 'https://agenda.rouen-luttes.org',
    country: 'France'
  },
  {
    id: 'salt_lake_thebeehive_events',
    name: 'Salt Lake',
    apiUrl: 'https://thebeehive.events/api/events/',
    baseUrl: 'https://thebeehive.events',
    country: 'USA'
  },
  {
    id: 'dresden_beer',
    name: 'Dresden',
    apiUrl: 'https://dresden.beer/api/events/',
    baseUrl: 'https://dresden.beer',
    country: 'Germany'
  },
  {
    id: 'palermo_scruscio',
    name: 'Palermo',
    apiUrl: 'https://scruscio.org/api/events/',
    baseUrl: 'https://scruscio.org',
    country: 'Italy'
  },
  {
    id: 'seattle_t4t_city',
    name: 'Seattle',
    apiUrl: 'https://t4t.city/api/events/',
    baseUrl: 'https://t4t.city',
    country: 'USA'
  },
  {
    id: 'bristol_gancio_thebristol_social',
    name: 'Bristol',
    apiUrl: 'https://gancio.thebristol.social/api/events/',
    baseUrl: 'https://gancio.thebristol.social',
    country: 'UK'
  },
  {
    id: 'perth_perthshire_events',
    name: 'Perth',
    apiUrl: 'https://perthshire.events/api/events/',
    baseUrl: 'https://perthshire.events',
    country: 'UK'
  },
  {
    id: 'santurtzi_lakelogaztetxea',
    name: 'Santurtzi',
    apiUrl: 'https://lakelogaztetxea.net/api/events/',
    baseUrl: 'https://lakelogaztetxea.net',
    country: 'Spain'
  },
  {
    id: 'albuquerque_burquefun',
    name: 'Albuquerque',
    apiUrl: 'https://burque.fun/api/events/',
    baseUrl: 'https://burque.fun',
    country: 'USA'
  },
  {
    id: 'kassel_events_social',
    name: 'Kassel',
    apiUrl: 'https://events.kassel.social/api/events/',
    baseUrl: 'https://events.kassel.social',
    country: 'Germany'
  },
  {
    id: 'alt_maestrat_femcomboi',
    name: 'Alt Maestrat',
    apiUrl: 'https://femcomboi.org/api/events',
    baseUrl: 'https://femcomboi.org',
    country: 'Spain'
  },
  {
    id: 'verona_rebaltela',
    name: 'Verona',
    apiUrl: 'https://rebaltela.org/api/events',
    baseUrl: 'https://rebaltela.org',
    country: 'Italy'
  },
  {
    id: 'cosenza_camifa',
    name: 'Cosenza',
    apiUrl: 'https://camifa.net/api/events/',
    baseUrl: 'https://camifa.net',
    country: 'Italy'
  }
];

const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 " + (className || '')}>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const XClearIcon: React.FC<{className?: string, onClick: () => void}> = ({ className, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={"p-1 rounded-full focus:outline-none focus:ring-1 " + (className || '')}
    aria-label="Clear search"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);


type Theme = 'dark' | 'light' | 'dusk' | 'grape';
type ImageLayoutStyle = 'small' | 'full' | 'text-only';
type BackgroundEffectMode = 'squint' | 'color';

// Theme configurations for pie icons
const themePieConfigs: { name: Theme; displayName: string; colors: [string, string] }[] = [
  { name: 'dark', displayName: 'Dark', colors: ['#000000', '#141414'] }, // Black, Search field bg
  { name: 'light', displayName: 'Light', colors: ['#d1d5db', '#FFFFFF'] }, // Gray-300, White
  { name: 'dusk', displayName: 'Dusk', colors: ['#1e293b', '#334155'] }, // Slate-800 (bg), Slate-700 (unselected button)
  { name: 'grape', displayName: 'Grape', colors: ['#9333ea', '#4c1d95'] }, // Purple-600 (selected button), Violet-900 (bg)
];


const App: React.FC = () => {
  const [selectedInstance, setSelectedInstance] = useState<GancioInstanceConfig>(PREDEFINED_INSTANCES[0]);
  const [events, setEvents] = useState<GancioEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleEvents, setVisibleEvents] = useState<number>(9);

  const [selectedEventDetail, setSelectedEventDetail] = useState<GancioEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false); 

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const oneSetOfTabsWidthRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);


  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('gancioViewerTheme') as Theme) || 'dusk');
  const [imageLayoutStyle, setImageLayoutStyle] = useState<ImageLayoutStyle>(() => (localStorage.getItem('gancioViewerImageLayoutStyle') as ImageLayoutStyle) || 'small');
  const [backgroundEffectMode, setBackgroundEffectMode] = useState<BackgroundEffectMode>(() => (localStorage.getItem('gancioViewerBackgroundEffectMode') as BackgroundEffectMode) || 'squint');
  
  const [isInstanceDropdownOpen, setIsInstanceDropdownOpen] = useState<boolean>(false);
  const instanceDropdownRef = useRef<HTMLDivElement>(null);
  
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Tailwind 'sm' breakpoint
    };
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  useEffect(() => {
    document.body.classList.remove('dark-theme', 'light-theme', 'dusk-theme', 'grape-theme'); 
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('gancioViewerTheme', theme);

    document.body.style.textShadow = '';
    document.body.style.background = ''; 

    if (theme === 'dark') {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#FFFFFF';
    } else if (theme === 'light') {
      document.body.style.backgroundColor = '#F3F4F6'; 
      document.body.style.color = '#111827'; 
    } else if (theme === 'grape') { 
      document.body.style.backgroundColor = '#4c1d95'; 
      document.body.style.color = '#f3f4f6'; 
    } else if (theme === 'dusk') { 
      document.body.style.backgroundColor = '#0f172a'; // slate-900
      document.body.style.color = '#FFFFFF'; 
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gancioViewerImageLayoutStyle', imageLayoutStyle);
  }, [imageLayoutStyle]);

  useEffect(() => {
    localStorage.setItem('gancioViewerBackgroundEffectMode', backgroundEffectMode);
  }, [backgroundEffectMode]);


  useEffect(() => {
    const loadEvents = async () => {
      if (!selectedInstance) return;
      setLoading(true);
      setError(null);
      setEvents([]); // Always clear events to show skeletons
      setVisibleEvents(9);
      try {
        const fetchedEvents = await fetchEvents(selectedInstance.apiUrl);
        const sortedEvents = fetchedEvents.sort((a, b) => {
          const timeA = typeof a.start_time === 'number' ? a.start_time : 0;
          const timeB = typeof b.start_time === 'number' ? b.start_time : 0;
          if (timeA !== timeB) {
            return timeA - timeB;
          }
          
          const idA = String(a.id || '');
          const idB = String(b.id || '');
          if (idA !== idB) {
            return idA.localeCompare(idB);
          }
          
          const nameA = String(a.name || a.title || '');
          const nameB = String(b.name || b.title || '');
          return nameA.localeCompare(nameB);
        });
        setEvents(sortedEvents);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [selectedInstance]);

  useEffect(() => {
    if (isSmallScreen || !scrollContainerRef.current || PREDEFINED_INSTANCES.length === 0) return;

    const calculateWidth = () => {
      let totalWidth = 0;
      const tabElements = scrollContainerRef.current?.querySelectorAll('button[data-instance-set="0"]');
      if (tabElements && tabElements.length > 0) {
        tabElements.forEach((tab, index) => {
          totalWidth += (tab as HTMLElement).offsetWidth;
          if (index < tabElements.length - 1) {
            totalWidth += 8; 
          }
        });
        oneSetOfTabsWidthRef.current = totalWidth;
        if (scrollContainerRef.current && oneSetOfTabsWidthRef.current > 0) {
          isProgrammaticScrollRef.current = true;
          scrollContainerRef.current.scrollLeft = oneSetOfTabsWidthRef.current;
          requestAnimationFrame(() => {
            isProgrammaticScrollRef.current = false;
          });
        }
      }
    };
    const initTimeout = setTimeout(calculateWidth, 100); 
    return () => clearTimeout(initTimeout);
  }, [PREDEFINED_INSTANCES.length, isSmallScreen]); 

  const handleScroll = useCallback(() => {
    if (isSmallScreen || isProgrammaticScrollRef.current || !scrollContainerRef.current || oneSetOfTabsWidthRef.current === 0) return;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = window.setTimeout(() => {
      const { scrollLeft } = scrollContainerRef.current!;
      const oneSetWidth = oneSetOfTabsWidthRef.current;
      const threshold = Math.min(50, oneSetWidth * 0.1); 

      if (scrollLeft < threshold) {
        isProgrammaticScrollRef.current = true;
        scrollContainerRef.current!.scrollLeft += oneSetWidth;
        requestAnimationFrame(() => { isProgrammaticScrollRef.current = false; });
      } else if (scrollLeft >= (2 * oneSetWidth) - threshold) {
        isProgrammaticScrollRef.current = true;
        scrollContainerRef.current!.scrollLeft -= oneSetWidth;
        requestAnimationFrame(() => { isProgrammaticScrollRef.current = false; });
      }
    }, 100); 
  }, [isSmallScreen]);

  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!isSmallScreen && scroller) {
      scroller.addEventListener('scroll', handleScroll);
      return () => {
        scroller.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }
  }, [handleScroll, isSmallScreen]);


  const scrollToSelectedTab = useCallback((instanceId: string) => {
    if (isSmallScreen || !scrollContainerRef.current) return;
  
    const tabElement = scrollContainerRef.current.querySelector("button[data-instance-id=\"" + instanceId + "\"][data-instance-set=\"1\"]") as HTMLElement;
    
    if (tabElement) {
      const container = scrollContainerRef.current;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
  
      isProgrammaticScrollRef.current = true;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500); 
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const handleHeaderTabNavigation = (event: KeyboardEvent) => {
      if (isDetailModalOpen || isAboutModalOpen) {
        return;
      }
  
      if (searchInputRef.current && document.activeElement === searchInputRef.current) {
        return;
      }
  
      const targetElement = event.target as HTMLElement;
      if (!isSettingsOpen &&
          (targetElement.tagName === 'INPUT' ||
           targetElement.tagName === 'TEXTAREA' ||
           targetElement.tagName === 'SELECT' ||
           targetElement.isContentEditable)) {
        return;
      }
  
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const currentIndex = PREDEFINED_INSTANCES.findIndex(inst => inst.id === selectedInstance.id);
        if (currentIndex === -1) return;
  
        let newIndex;
        if (event.key === 'ArrowLeft') {
          newIndex = (currentIndex - 1 + PREDEFINED_INSTANCES.length) % PREDEFINED_INSTANCES.length;
        } else { 
          newIndex = (currentIndex + 1) % PREDEFINED_INSTANCES.length;
        }
        
        const newInstance = PREDEFINED_INSTANCES[newIndex];
        setSelectedInstance(newInstance);
        scrollToSelectedTab(newInstance.id);
      }
    };
  
    window.addEventListener('keydown', handleHeaderTabNavigation);
    return () => {
      window.removeEventListener('keydown', handleHeaderTabNavigation);
    };
  }, [selectedInstance, isDetailModalOpen, isAboutModalOpen, isSettingsOpen, scrollToSelectedTab]);


  const handleOpenDetailModal = useCallback((event: GancioEvent) => {
    setSelectedEventDetail(event);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedEventDetail(null), 300);
  }, []);

  const handleCloseAboutModal = useCallback(() => { 
    setIsAboutModalOpen(false);
  }, []);

  const handleTagSearch = useCallback((tag: string) => {
    setSearchTerm(tag);
    handleCloseDetailModal();
    setIsSettingsOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [handleCloseDetailModal]);

  const handleLocationSearch = useCallback((locationName: string) => {
    setSearchTerm(locationName);
    handleCloseDetailModal();
    setIsSettingsOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [handleCloseDetailModal]);

  const handleDateSearch = useCallback((dateString: string) => {
    setSearchTerm(dateString);
    handleCloseDetailModal();
    setIsSettingsOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [handleCloseDetailModal]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const searchTermLower = searchTerm.toLowerCase();
      const eventFormattedFullDate = formatDateTimeRange(event.start_time);
      const eventDatePart = eventFormattedFullDate.includes(' at ') ? eventFormattedFullDate.split(' at ')[0] : eventFormattedFullDate;
      const eventDatePartLower = eventDatePart.toLowerCase();

      return (
        (event.name?.toLowerCase() || '').includes(searchTermLower) ||
        (event.title?.toLowerCase() || '').includes(searchTermLower) ||
        (event.description?.toLowerCase() || '').includes(searchTermLower) ||
        (typeof event.place === 'string' && event.place.toLowerCase().includes(searchTermLower)) ||
        (typeof event.place === 'object' && event.place?.name?.toLowerCase().includes(searchTermLower)) ||
        (typeof event.place === 'object' && event.place?.locality?.toLowerCase().includes(searchTermLower)) ||
        (typeof event.place === 'object' && event.place?.country?.toLowerCase().includes(searchTermLower)) ||
        (event.tags?.some(tag => tag.toLowerCase().includes(searchTermLower))) ||
        (eventDatePartLower.includes(searchTermLower)) 
      );
    });
  }, [events, searchTerm]);

 useEffect(() => {
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDetailModalOpen) handleCloseDetailModal();
        if (isAboutModalOpen) handleCloseAboutModal();
        return;
      }

      if (isDetailModalOpen && selectedEventDetail && filteredEvents.length > 0) {
        let currentIndex = filteredEvents.findIndex(e => e.id === selectedEventDetail.id);
        
        if (currentIndex === -1) return; 

        let newIndex = currentIndex;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          newIndex = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          newIndex = (currentIndex + 1) % filteredEvents.length;
        }

        if (newIndex !== currentIndex) {
          setSelectedEventDetail(filteredEvents[newIndex]);
        }
      }
    };

    if (isDetailModalOpen || isAboutModalOpen) {
      document.addEventListener('keydown', handleKeyboardNavigation);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [isDetailModalOpen, isAboutModalOpen, handleCloseDetailModal, handleCloseAboutModal, selectedEventDetail, filteredEvents]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (instanceDropdownRef.current && !instanceDropdownRef.current.contains(event.target as Node)) {
        setIsInstanceDropdownOpen(false);
      }
    };
    if (isInstanceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInstanceDropdownOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        const targetElement = event.target as HTMLElement;
        if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA' || targetElement.tagName === 'SELECT' || targetElement.isContentEditable) {
          return; 
        }
        event.preventDefault();
        setIsSettingsOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0); 
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);


  const loadMoreEvents = () => setVisibleEvents(prev => prev + 9);

  const tabButtonBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out border flex-shrink-0";
  
  let tabButtonActiveClasses = '';
  let tabButtonInactiveClasses = '';
  let settingsPanelClasses = '';
  let settingsLabelClasses = '';
  let settingsValueTextClass = '';
  let fadeGradient = '';
  let footerTextClass = '';
  let footerLinkClass = '';
  let settingsToggleColor = '';
  let dropdownButtonClasses = '';
  let dropdownMenuClasses = '';
  let dropdownItemClasses = '';
  let dropdownItemActiveClasses = '';
  let searchInputClassesGeneral = ''; 
  let aboutButtonColor = '';
  let searchIconColorClass = '';
  let dropdownArrowColorClass = '';
  
  if (theme === 'dark') {
    tabButtonActiveClasses = 'bg-[#3b3b3b] text-white border-transparent';
    tabButtonInactiveClasses = 'bg-[#141414] text-white border-transparent hover:bg-[#3b3b3b]';
    settingsPanelClasses = 'bg-black border border-gray-700'; 
    settingsLabelClasses = 'text-white font-semibold'; 
    settingsValueTextClass = 'text-white font-semibold';
    fadeGradient = 'from-black';
    footerTextClass = 'text-gray-400';
    footerLinkClass = 'text-white hover:opacity-80'; 
    settingsToggleColor = 'text-white';
    searchIconColorClass = 'text-gray-400';
    dropdownArrowColorClass = searchIconColorClass;
    searchInputClassesGeneral = 'bg-[#141414] border border-transparent text-white placeholder-gray-500 focus:outline-none focus:border-white';
    dropdownButtonClasses = "bg-[#141414] border border-transparent text-white placeholder-gray-500 focus:outline-none focus:border-white hover:border-white";
    dropdownMenuClasses = 'bg-black border-transparent';
    dropdownItemClasses = 'text-gray-300 hover:bg-[#141414] hover:text-white';
    dropdownItemActiveClasses = 'bg-[#141414] text-white'; 
    aboutButtonColor = 'text-gray-400 hover:text-white';
  } else if (theme === 'light') {
    tabButtonActiveClasses = 'bg-gray-300 text-black border-transparent';
    tabButtonInactiveClasses = 'bg-gray-200 text-black border-transparent hover:bg-gray-300';
    settingsPanelClasses = 'bg-gray-100 border border-gray-300'; 
    settingsLabelClasses = 'text-black font-semibold'; 
    settingsValueTextClass = 'text-black font-semibold';
    fadeGradient = 'from-gray-100'; 
    footerTextClass = 'text-gray-600';
    footerLinkClass = 'text-black hover:text-gray-700'; 
    settingsToggleColor = 'text-black';
    searchIconColorClass = 'text-gray-500';
    dropdownArrowColorClass = searchIconColorClass;
    searchInputClassesGeneral = 'bg-gray-200 border border-transparent text-black placeholder-gray-500 focus:outline-none focus:border-black'; 
    dropdownButtonClasses = searchInputClassesGeneral + ' hover:bg-gray-300'; 
    dropdownMenuClasses = 'bg-gray-200 border-gray-300';
    dropdownItemClasses = 'text-gray-700 hover:bg-gray-100 hover:text-black'; 
    dropdownItemActiveClasses = 'bg-gray-300 text-black'; 
    aboutButtonColor = 'text-gray-500 hover:text-black';
  } else if (theme === 'grape') { 
    tabButtonActiveClasses = 'bg-violet-700 text-white border-transparent';
    tabButtonInactiveClasses = 'bg-violet-800 text-violet-100 border-transparent hover:border-transparent hover:bg-violet-700';
    settingsPanelClasses = 'bg-violet-900 border border-violet-700'; 
    settingsLabelClasses = 'text-purple-300 font-semibold'; 
    settingsValueTextClass = 'text-purple-300 font-semibold';
    fadeGradient = 'from-violet-900';
    footerTextClass = 'text-violet-300';
    footerLinkClass = 'text-purple-300 hover:text-purple-200'; 
    settingsToggleColor = 'text-gray-100';
    searchIconColorClass = 'text-violet-300';
    dropdownArrowColorClass = searchIconColorClass;
    searchInputClassesGeneral = 'bg-violet-800 border border-transparent text-white placeholder-violet-300 focus:outline-none focus:border-purple-500';
    dropdownButtonClasses = searchInputClassesGeneral + ' hover:border-transparent';
    dropdownMenuClasses = 'bg-violet-900 border-transparent';
    dropdownItemClasses = 'text-violet-200 hover:bg-violet-800 hover:text-purple-300';
    dropdownItemActiveClasses = 'bg-violet-800 text-purple-300';
    aboutButtonColor = 'text-violet-300 hover:text-purple-300';
  } else if (theme === 'dusk') { 
    tabButtonActiveClasses = 'bg-slate-500 text-white border-transparent shadow-md'; 
    tabButtonInactiveClasses = 'bg-slate-700 text-white border-transparent hover:bg-slate-500 hover:border-transparent';
    settingsPanelClasses = 'bg-transparent border border-slate-700 shadow-lg'; 
    settingsLabelClasses = 'text-white font-semibold'; 
    settingsValueTextClass = 'text-white font-semibold';
    fadeGradient = 'from-slate-900'; 
    footerTextClass = 'text-white';
    footerLinkClass = 'text-white hover:opacity-80'; 
    settingsToggleColor = 'text-white';
    searchIconColorClass = 'text-gray-400';
    dropdownArrowColorClass = searchIconColorClass;
    searchInputClassesGeneral = 
      'bg-slate-700 border border-transparent text-white placeholder-white placeholder-opacity-75 focus:outline-none';
    dropdownButtonClasses = 'bg-slate-700 border border-transparent text-white placeholder-white placeholder-opacity-75 hover:bg-slate-500 hover:border-transparent focus:outline-none';
    dropdownMenuClasses = 'bg-slate-800 border-transparent shadow-lg';
    dropdownItemClasses = 'text-white hover:bg-slate-500'; 
    dropdownItemActiveClasses = 'bg-slate-500 text-white'; 
    aboutButtonColor = 'text-white opacity-75 hover:opacity-100';
  }


  const settingsButtonSharedBase = "px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out border";

  const groupedInstancesByCountry = PREDEFINED_INSTANCES.reduce((acc, instance) => {
    if (!acc[instance.country]) {
      acc[instance.country] = [];
    }
    acc[instance.country].push(instance);
    return acc;
  }, {} as Record<string, GancioInstanceConfig[]>);

  const sortedCountryNames = Object.keys(groupedInstancesByCountry).sort((a, b) => a.localeCompare(b));

  const sortedInstancesForDropdown = sortedCountryNames.reduce((acc, country) => {
    acc[country] = groupedInstancesByCountry[country].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, GancioInstanceConfig[]>);

  const isSquintMode = backgroundEffectMode === 'squint';
  const toggleBackgroundEffectMode = (enableSquint: boolean) => {
    setBackgroundEffectMode(enableSquint ? 'squint' : 'color');
  };


  const renderContent = () => {
    const gridContainerClasses = 'lg:columns-3 md:columns-2 columns-1 gap-x-8';
    
    if (loading && events.length === 0) {
      return (
        <div className={gridContainerClasses}>
          {Array.from({ length: 9 }).map((_, index) => (
             <EventCardSkeleton 
                key={"skeleton-" + index} 
                theme={theme} 
                imageLayoutStyle={imageLayoutStyle} 
                backgroundEffectMode={backgroundEffectMode} 
              />
          ))}
        </div>
      );
    }
    
    let errorClasses = '';
    let textMutedClasses = '';
    if (theme === 'dark') {
      errorClasses = 'text-white border-white bg-red-900 bg-opacity-30';
      textMutedClasses = 'text-gray-300';
    } else if (theme === 'light') {
      errorClasses = 'text-gray-800 border-gray-400 bg-red-100'; 
      textMutedClasses = 'text-gray-600';
    } else if (theme === 'grape') { 
      errorClasses = 'text-red-100 border-red-300 bg-red-800 bg-opacity-50'; 
      textMutedClasses = 'text-violet-200';
    } else if (theme === 'dusk') { 
      errorClasses = 'text-white border-red-500 bg-red-700/30'; 
      textMutedClasses = 'text-white opacity-90'; 
    }


    if (error) {
      let displayError = error;
      if (error.toLowerCase().includes("failed to fetch") || error.toLowerCase().includes("networkerror")) {
        displayError = error + ". This might be due to network connectivity issues or Cross-Origin Resource Sharing (CORS) restrictions by the API provider. Please check your internet connection. If the problem persists, the API service might be temporarily unavailable or not configured for web browser access.";
      }
      return <div className={"text-center py-10 p-4 rounded-md mx-auto max-w-2xl border " + errorClasses} role="alert"><strong>Error:</strong> {displayError}</div>;
    }
    if (filteredEvents.length === 0 && searchTerm) {
      return (
        <div className={"text-center py-10 " + textMutedClasses}>
          <p className="mb-4">No events found matching your search criteria for {selectedInstance.name}.</p>
          <button
            onClick={() => setSearchTerm('')}
            className={tabButtonBaseClasses + " " + tabButtonInactiveClasses + " focus:outline-none"}
            aria-label="Clear search"
          >
            Clear Search
          </button>
        </div>
      );
    }
    if (filteredEvents.length === 0 && !searchTerm && !loading) {
      return <div className={"text-center py-10 " + textMutedClasses}>No events available at the moment from {selectedInstance.name}. Please try again later or select a different instance.</div>;
    }
    if (filteredEvents.length > 0) {
      return (
        <React.Fragment>
          <div className={gridContainerClasses}>
            {filteredEvents.slice(0, visibleEvents).map(event => (
                <EventCard
                  key={selectedInstance.id + "-" + event.id}
                  event={event}
                  instanceBaseUrl={selectedInstance.baseUrl}
                  onOpenDetail={handleOpenDetailModal}
                  theme={theme}
                  imageLayoutStyle={imageLayoutStyle}
                  backgroundEffectMode={backgroundEffectMode}
                />
            ))}
          </div>
          {visibleEvents < filteredEvents.length && (
            <div className="mt-10 text-center">
              <button
                onClick={loadMoreEvents}
                className={tabButtonBaseClasses + " " + tabButtonInactiveClasses + " focus:outline-none"}
                aria-label="Load more events"
              >
                Load More Events
              </button>
            </div>
          )}
        </React.Fragment>
      );
    }
    return null;
  };

  interface RenderedTabConfig extends GancioInstanceConfig {
    originalId: string;
    key: string;
    setIndex: number;
  }
  
  const renderedTabs: RenderedTabConfig[] = useMemo(() => {
    if (PREDEFINED_INSTANCES.length === 0) return [];
    if (isSmallScreen) {
      return PREDEFINED_INSTANCES.map((instance, index) => ({ ...instance, originalId: instance.id, key: instance.id + "-set0-" + index, setIndex: 0 }));
    }
    return [
      ...PREDEFINED_INSTANCES.map((instance, index) => ({ ...instance, originalId: instance.id, key: instance.id + "-set0-" + index, setIndex: 0 })),
      ...PREDEFINED_INSTANCES.map((instance, index) => ({ ...instance, originalId: instance.id, key: instance.id + "-set1-" + index, setIndex: 1 })),
      ...PREDEFINED_INSTANCES.map((instance, index) => ({ ...instance, originalId: instance.id, key: instance.id + "-set2-" + index, setIndex: 2 }))
    ];
  }, [isSmallScreen, PREDEFINED_INSTANCES]);


  const headerContainerClasses = (theme === 'dusk' || theme === 'dark') ? 'text-white' : 
    (theme === 'grape') ? 'text-gray-100' :
    'text-black'; // light


  return (
    <div className={"container mx-auto p-4 md:p-8 " + headerContainerClasses}>
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => {
            const newSettingsOpenState = !isSettingsOpen;
            setIsSettingsOpen(newSettingsOpenState);
            if (!newSettingsOpenState) { 
              setIsInstanceDropdownOpen(false); 
            }
          }}
          className={"text-4xl select-none transition-all duration-200 ease-in-out hover:blur-sm " + settingsToggleColor}
          aria-label="Toggle settings"
          aria-expanded={isSettingsOpen}
        >
          ⁂
        </button>
        
        <div className="relative sm:flex-1 min-w-0"> 
          {!isSmallScreen && <div className={"absolute left-0 top-0 bottom-0 z-10 w-8 h-full bg-gradient-to-r " + fadeGradient + " to-transparent pointer-events-none"}></div>}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {renderedTabs.map(instance => (
              <button
                key={instance.key}
                onClick={() => {
                  const original = PREDEFINED_INSTANCES.find(i => i.id === instance.originalId);
                  if (original) setSelectedInstance(original);
                }}
                className={tabButtonBaseClasses + " " + (selectedInstance.id === instance.originalId ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                aria-pressed={selectedInstance.id === instance.originalId}
                data-instance-set={instance.setIndex}
                data-instance-id={instance.originalId} // Added for precise DOM selection
              >
                {instance.name}
              </button>
            ))}
          </div>
          {!isSmallScreen && <div className={"absolute right-0 top-0 bottom-0 z-10 w-8 h-full bg-gradient-to-l " + fadeGradient + " to-transparent pointer-events-none"}></div>}
        </div>
      </div>

      <div
        className={"transition-all duration-300 ease-in-out " + (isSettingsOpen && isInstanceDropdownOpen ? 'overflow-visible' : 'overflow-hidden') + " mb-6 " + (isSettingsOpen ? 'max-h-[50rem] opacity-100' : 'max-h-0 opacity-0')} 
      >
        <div className={"p-4 rounded-xl " + settingsPanelClasses + " flex flex-col md:flex-row md:gap-6 relative"}> 
          <div className="flex flex-col md:w-3/5 space-y-4"> {/* Applied space-y-4 */}
            <div>
              <label htmlFor="search-events" className={"block text-sm font-medium mb-1 " + settingsLabelClasses}>
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className={searchIconColorClass} />
                </div>
                <input
                  id="search-events"
                  ref={searchInputRef}
                  type="search"
                  placeholder="Enter event title, venue or hashtag"
                  className={"w-full pl-10 pr-10 py-2 rounded-lg transition-colors " + searchInputClassesGeneral}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-describedby="search-helper-text"
                />
                 {searchTerm.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <XClearIcon
                      onClick={() => setSearchTerm('')}
                      className={
                        theme === 'dark' ? "text-gray-400 hover:text-white focus:ring-white" :
                        theme === 'light' ? "text-gray-500 hover:text-black focus:ring-black" :
                        theme === 'grape' ? "text-violet-300 hover:text-purple-300 focus:ring-purple-300" :
                        "text-white hover:opacity-80 focus:ring-blue-400" // Dusk
                      }
                    />
                  </div>
                )}
                <p id="search-helper-text" className="sr-only">Enter keywords to filter the list of events.</p>
              </div>
            </div>
            
            <div className="relative" ref={instanceDropdownRef}> {/* No bottom margin here, space-y-4 on parent handles it */}
              <label htmlFor="instance-select-button" className={"block text-sm font-medium mb-1 " + settingsLabelClasses}>
                Select Instance
              </label>
              <button
                id="instance-select-button"
                type="button"
                onClick={() => setIsInstanceDropdownOpen(!isInstanceDropdownOpen)}
                className={"w-full px-3 py-2 text-left rounded-lg transition-colors flex justify-between items-center " + dropdownButtonClasses}
                aria-haspopup="listbox"
                aria-expanded={isInstanceDropdownOpen}
              >
                <span className="truncate">
                  {selectedInstance.name} - {selectedInstance.baseUrl.replace(/^(https?:\/\/)/, '')}
                </span>
                <svg 
                  className={"w-5 h-5 transition-transform duration-200 " + 
                             (isInstanceDropdownOpen ? 'transform rotate-180 ' : '') + 
                             dropdownArrowColorClass} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isInstanceDropdownOpen && (
                <div
                  className={"absolute z-40 mt-1 w-full rounded-md max-h-60 overflow-auto border " + dropdownMenuClasses + " focus:outline-none"} 
                  role="listbox"
                  aria-labelledby="instance-select-button"
                >
                  {Object.entries(sortedInstancesForDropdown).map(([country, instancesInCountry]) => (
                    <React.Fragment key={country}>
                      <div className={"px-4 py-2 text-xs font-semibold uppercase tracking-wider " + settingsLabelClasses + " pointer-events-none"}>
                        {country}
                      </div>
                      {instancesInCountry.map((instance) => (
                        <button
                          key={instance.id}
                          onClick={() => {
                            setSelectedInstance(instance);
                            setIsInstanceDropdownOpen(false);
                          }}
                          className={"block w-full text-left px-4 py-2 text-sm truncate " + (
                            selectedInstance.id === instance.id ? dropdownItemActiveClasses : dropdownItemClasses
                          )}
                          role="option"
                          aria-selected={selectedInstance.id === instance.id}
                        >
                          {instance.name} - {instance.baseUrl.replace(/^(https?:\/\/)/, '')}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-col md:w-2/5 mt-4 md:mt-0 space-y-4"> {/* Applied space-y-4 */}
            <div>
              <label className={"block text-sm font-medium mb-1 " + settingsLabelClasses}>Theme Selection</label>
              <div className="flex space-x-2 flex-wrap gap-y-2">
                {themePieConfigs.map(config => (
                  <button
                    key={config.name}
                    onClick={() => setTheme(config.name)}
                    className={"focus:outline-none " + 
                      (theme === config.name
                        ? "rounded-full border-2 border-white p-0.5" 
                        : "rounded-full border-2 border-transparent p-0.5" 
                      )
                    }
                    aria-label={"Select " + config.displayName + " theme"}
                    aria-pressed={theme === config.name}
                  >
                    <ThemePieIcon colors={config.colors} sizeClassName="w-8 h-8" />
                  </button>
                ))}
              </div>
            </div>
            <div> 
              <label className={"block text-sm font-medium mb-1 " + settingsLabelClasses}>Image Layout</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setImageLayoutStyle('small')}
                  className={settingsButtonSharedBase + " " + (imageLayoutStyle === 'small' ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                >
                  Small
                </button>
                <button
                  onClick={() => setImageLayoutStyle('full')}
                  className={settingsButtonSharedBase + " " + (imageLayoutStyle === 'full' ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                >
                  Full
                </button>
                <button
                  onClick={() => setImageLayoutStyle('text-only')}
                  className={settingsButtonSharedBase + " " + (imageLayoutStyle === 'text-only' ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                >
                  Text Only
                </button>
              </div>
            </div>
             <div>
              <label className={"block text-sm font-medium mb-1 " + settingsLabelClasses}>
                Background
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleBackgroundEffectMode(true)}
                  className={settingsButtonSharedBase + " " + (isSquintMode ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                  aria-pressed={isSquintMode}
                >
                  Squint
                </button>
                <button
                  onClick={() => toggleBackgroundEffectMode(false)}
                  className={settingsButtonSharedBase + " " + (!isSquintMode ? tabButtonActiveClasses : tabButtonInactiveClasses)}
                  aria-pressed={!isSquintMode}
                >
                  Color
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className={"absolute bottom-3 right-3 p-2 rounded-full transition-colors duration-150 " + aboutButtonColor + " focus:outline-none focus:ring-1 " + (
              theme === 'dark' ? 'focus:ring-white' : 
              theme === 'light' ? 'focus:ring-black' :
              theme === 'grape' ? 'focus:ring-purple-300' :
              theme === 'dusk' ? 'focus:ring-blue-400' : 
              'focus:ring-blue-400'
            ) + " text-lg font-bold w-8 h-8 flex items-center justify-center"}
            aria-label="Open About Information"
          >
            ?
          </button>

        </div>
      </div>

      {renderContent()}

      <div className={"mt-12 rounded-xl " + settingsPanelClasses}>
        <footer className={"text-center py-6"}>
          <p className={"text-sm " + footerTextClass}>
            This is <a href="https://jointhefediverse.net" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>the fediverse ⁂</a>
            {' - events listed by the community on servers running '}
            <a href="https://gancio.org" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Gancio</a>.
          </p>
        </footer>
      </div>

      {isDetailModalOpen && selectedEventDetail && (
        <EventDetailModal
          event={selectedEventDetail}
          instanceBaseUrl={selectedInstance.baseUrl}
          onClose={handleCloseDetailModal}
          onTagClick={handleTagSearch}
          onLocationClick={handleLocationSearch}
          onDateClick={handleDateSearch}
          theme={theme}
          imageLayoutStyle={imageLayoutStyle}
          backgroundEffectMode={backgroundEffectMode}
          sourceInstanceName={selectedInstance.name}
        />
      )}

      {isAboutModalOpen && (
        <AboutModal
          instances={PREDEFINED_INSTANCES}
          theme={theme}
          onClose={handleCloseAboutModal}
        />
      )}
    </div>
  );
};

export default App;
