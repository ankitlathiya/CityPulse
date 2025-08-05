import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_EVENTS';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavorite(event) {
  const favorites = await getFavorites();
  const updated = [
    ...favorites,
    {
      ...event,
      date: formatDate(event.date || event.dates?.start?.localDate),
    },
  ];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function removeFavorite(eventId) {
  const favorites = await getFavorites();
  const updated = favorites.filter(e => e.id !== eventId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isFavorite(eventId) {
  const favorites = await getFavorites();
  return favorites.some(e => e.id === eventId);
}
