
import { GancioEvent, Organizer, Place } from '../types';

// Helper function to robustly extract image path
const extractImagePath = (imageData: any): string | { url: string } | null => {
  if (!imageData) return null;

  let pathDataToProcess = imageData;

  // If it's an array, try to process the first item
  if (Array.isArray(imageData) && imageData.length > 0) {
    pathDataToProcess = imageData[0];
  } else if (Array.isArray(imageData) && imageData.length === 0) {
    return null; // Empty array
  }

  if (typeof pathDataToProcess === 'string') {
    return pathDataToProcess.trim() !== "" ? pathDataToProcess.trim() : null;
  }

  if (pathDataToProcess && typeof pathDataToProcess === 'object') {
    if (typeof pathDataToProcess.url === 'string' && pathDataToProcess.url.trim() !== "") {
      // If it's already an object with url, and url is a string path, return as is.
      // Or if it's an object { url: string } from array processing.
      return { url: pathDataToProcess.url.trim() };
    }
    if (typeof pathDataToProcess.path === 'string' && pathDataToProcess.path.trim() !== "") {
      return { url: pathDataToProcess.path.trim() }; // Standardize to {url: ...}
    }
  }
  return null;
};


export const fetchEvents = async (apiUrl: string): Promise<GancioEvent[]> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request to ${apiUrl} failed with status ${response.status}`);
    }
    const data = await response.json();

    const extractDescription = (dataObject: any): string => {
      if (!dataObject || typeof dataObject !== 'object') return "";

      const fieldsToCheck = [
        'description', 'Description', 'DESCRIPTION',
        'summary', 'Summary', 'SUMMARY',
        'content', 'Content', 'CONTENT'
      ];

      for (const field of fieldsToCheck) {
        if (typeof dataObject[field] === 'string' && dataObject[field].trim() !== "") {
          return dataObject[field];
        }
      }
      return "";
    };

    if (Array.isArray(data)) {
      if (data.length > 0 && data[0] && typeof data[0].id === 'string' && typeof data[0].data === 'object' && data[0].data !== null) {
        // Structure like [{id: "...", data: {event_details...}}] (e.g., calendari.cc)
        return data
          .map((item: any): GancioEvent | null => {
            if (!item || typeof item.id !== 'string' || typeof item.data !== 'object' || item.data === null) {
              console.warn('Skipping malformed event item (missing id or data object):', item);
              return null;
            }
            const eventData = item.data as { [key: string]: any };

            if (typeof eventData.start_datetime !== 'number') {
              console.warn(`Event item (id: ${item.id}) from ${apiUrl} is missing a valid numeric 'start_datetime'. Skipping.`, eventData);
              return null;
            }

            const description = extractDescription(eventData);
            // Prioritize 'media' field, then 'image'
            const image = extractImagePath(eventData.media || eventData.image);

            const mappedEvent: GancioEvent = {
              id: item.id,
              name: eventData.name || eventData.title || null,
              title: eventData.title || eventData.name || null,
              description: description,
              start_time: eventData.start_datetime,
              end_time: typeof eventData.end_datetime === 'number' ? eventData.end_datetime : null,
              place: eventData.place !== undefined ? eventData.place as Place | string : null,
              image: image,
              url: typeof eventData.url === 'string' ? eventData.url : null,
              tags: Array.isArray(eventData.tags) ? eventData.tags : undefined,
              organizer: typeof eventData.organizer === 'object' && eventData.organizer !== null ? eventData.organizer as Organizer : undefined,
            };
            return mappedEvent;
          })
          .filter(event => event !== null) as GancioEvent[];
      } else {
        // Assume it's a flat array of GancioEvent-like objects
        return data.map((event: any) => ({
            id: event.id || String(Math.random() + Date.now()), // Ensure ID exists and is unique
            name: event.name || event.title || null,
            title: event.title || event.name || null,
            description: extractDescription(event),
            start_time: typeof event.start_datetime === 'number' ? event.start_datetime : (typeof event.start_time === 'number' ? event.start_time : 0),
            end_time: typeof event.end_datetime === 'number' ? event.end_datetime : (typeof event.end_time === 'number' ? event.end_time : null),
            place: event.place !== undefined ? event.place as Place | string : null,
            image: extractImagePath(event.media || event.image), // Prioritize 'media'
            url: typeof event.url === 'string' ? event.url : null,
            tags: Array.isArray(event.tags) ? event.tags : undefined,
            organizer: typeof event.organizer === 'object' && event.organizer !== null ? event.organizer as Organizer : undefined,
        })).filter(event => event.start_time > 0) as GancioEvent[];
      }
    } else if (data && data.events && Array.isArray(data.events)) {
        // Structure like { events: [{event_details...}] }
        return data.events.map((event: any) => ({
            id: event.id || String(Math.random() + Date.now()),
            name: event.name || event.title || null,
            title: event.title || event.name || null,
            description: extractDescription(event),
            start_time: typeof event.start_datetime === 'number' ? event.start_datetime : (typeof event.start_time === 'number' ? event.start_time : 0),
            end_time: typeof event.end_datetime === 'number' ? event.end_datetime : (typeof event.end_time === 'number' ? event.end_time : null),
            place: event.place !== undefined ? event.place as Place | string : null,
            image: extractImagePath(event.media || event.image), // Prioritize 'media'
            url: typeof event.url === 'string' ? event.url : null,
            tags: Array.isArray(event.tags) ? event.tags : undefined,
            organizer: typeof event.organizer === 'object' && event.organizer !== null ? event.organizer as Organizer : undefined,
        })).filter(event => event.start_time > 0) as GancioEvent[];
    }
    
    // Fallback for deeply nested structures or object of arrays
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const allEvents: GancioEvent[] = [];
        Object.values(data).forEach((value: any) => {
            if (Array.isArray(value)) { // If a property of the object is an array of events
                value.forEach((event: any) => {
                    if (typeof event === 'object' && event !== null && (event.id || event.start_datetime || event.start_time)) {
                        allEvents.push({
                            id: event.id || String(Math.random() + Date.now()),
                            name: event.name || event.title || null,
                            title: event.title || event.name || null,
                            description: extractDescription(event),
                            start_time: typeof event.start_datetime === 'number' ? event.start_datetime : (typeof event.start_time === 'number' ? event.start_time : 0),
                            end_time: typeof event.end_datetime === 'number' ? event.end_datetime : (typeof event.end_time === 'number' ? event.end_time : null),
                            place: event.place !== undefined ? event.place as Place | string : null,
                            image: extractImagePath(event.media || event.image), // Prioritize 'media'
                            url: typeof event.url === 'string' ? event.url : null,
                            tags: Array.isArray(event.tags) ? event.tags : undefined,
                            organizer: typeof event.organizer === 'object' && event.organizer !== null ? event.organizer as Organizer : undefined,
                        });
                    }
                });
            }
        });
        if (allEvents.length > 0) return allEvents.filter(event => event.start_time > 0);
    }

    console.warn(`API response from ${apiUrl} was not in a recognized array format or known object structure of events:`, data);
    return [];
  } catch (error) {
    console.error(`Failed to fetch events from ${apiUrl}:`, error);
    if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
        throw new Error(`NetworkError: Failed to fetch events from ${apiUrl}. This could be due to CORS restrictions or network issues.`);
    }
    throw error;
  }
};
