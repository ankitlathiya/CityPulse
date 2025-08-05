// Ticketmaster API logic for event search
// Use environment variable for API key in production
const API_KEY = process.env.TICKETMASTER_API_KEY || 'BHDCzSpBXEAHEXAQus6mHCUZcKZWrFfT';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const EVENT_DETAIL_URL = 'https://app.ticketmaster.com/discovery/v2/events';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export async function searchEvents({keyword, city}) {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&keyword=${encodeURIComponent(
      keyword,
    )}&city=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data._embedded && data._embedded.events) {
      return data._embedded.events.map(ev => ({
        ...ev,
        date: formatDate(ev.dates?.start?.localDate),
      }));
    }
    return [];
  } catch (error) {
    console.error('Ticketmaster API error:', error);
    throw error;
  }
}

export async function getEventDetails(id) {
  try {
    const url = `${EVENT_DETAIL_URL}/${id}?apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ticketmaster Event Details API error:', error);
    throw error;
  }
}
