
export const stripHtml = (html: string): string => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  } catch (e) {
    // Fallback for environments where DOMParser might not be available or for invalid HTML
    // This is a very basic fallback.
    return html.replace(/<[^>]*>?/gm, '');
  }
};

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th'; // for 4th to 20th
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

export const formatDateTimeRange = (startTimeStamp?: number | null): string => {
  if (typeof startTimeStamp !== 'number' || isNaN(startTimeStamp)) {
    return 'Date not available';
  }

  // Assuming timestamp is in seconds, convert to milliseconds
  const startDate = new Date(startTimeStamp * 1000);
  if (isNaN(startDate.getTime())) {
    console.warn("Invalid start_time timestamp encountered: " + startTimeStamp);
    return 'Invalid date format';
  }

  const month = startDate.toLocaleDateString(undefined, { month: 'long' });
  const day = startDate.getDate();
  const dayWithSuffix = String(day) + getOrdinalSuffix(day);
  
  let hours = startDate.getHours();
  const minutes = startDate.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  let timeString;
  if (minutes === 0) {
    timeString = String(hours) + ampm;
  } else {
    const minutesStr = minutes < 10 ? '0' + minutes : String(minutes);
    timeString = hours + ':' + minutesStr + ampm;
  }
  
  const formattedString = month + ' ' + dayWithSuffix + ' at ' + timeString;
  
  return formattedString;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};
