import {useState, useEffect} from 'react';
import {getFavorites, addFavorite, removeFavorite, isFavorite} from './storage';
import {I18nManager} from 'react-native';
import localization from '../localization';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const add = async event => {
    await addFavorite(event);
    setFavorites(await getFavorites());
  };

  const remove = async eventId => {
    await removeFavorite(eventId);
    setFavorites(await getFavorites());
  };

  const check = async eventId => {
    return await isFavorite(eventId);
  };

  return {favorites, add, remove, check};
}

export function useLanguage() {
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  const toggleLanguage = () => {
    const newIsRTL = !isRTL;
    I18nManager.forceRTL(newIsRTL);
    setIsRTL(newIsRTL);

    // Update the localization system
    localization.setLanguage(newIsRTL ? 'ar' : 'en');
  };

  return {isRTL, toggleLanguage};
}
