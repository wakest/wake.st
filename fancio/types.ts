
export interface Place {
  id?: string; // Some Gancio instances might not have all fields
  name: string;
  locality?: string;
  country?: string;
  latitude?: number; // Changed from string to number
  longitude?: number; // Changed from string to number
  osm_id?: string;
  osm_type?: string;
  address?: string; // Common field, though not in all Gancio versions
}

export interface Organizer {
  name: string;
  url?: string;
}

export interface GancioEvent {
  id: string;
  name?: string | null; // Make name optional as title might be used
  title?: string | null; // Add optional title field
  description: string; // HTML content
  start_time: number; // Changed from string to number for Unix timestamp
  end_time?: number | null; // Changed from string to number for Unix timestamp, can be null
  place: Place | string | null; // Place can be an object, a string (name only), or null
  image?: string | { url?: string; [key: string]: any; } | null; // Image can be string or object with url
  url?: string | null; // Link to event details
  tags?: string[];
  organizer?: Organizer;
}

export interface GancioInstanceConfig { // Added export
  id: string;
  name: string;
  apiUrl: string;
  baseUrl: string;
  country: string;
}