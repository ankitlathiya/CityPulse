import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {useFavorites} from '../bridge/hooks';
import {getEventDetails} from '../bridge/api';
import MapView, {Marker} from 'react-native-maps';
import localization from '../localization';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + (timeStr ? 'T' + timeStr : ''));
  return (
    date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    (timeStr
      ? ' at ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '')
  );
}

const EventDetailScreen = ({route, navigation}) => {
  const {event} = route.params;
  const {check, add, remove} = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [eventDetails, setEventDetails] = useState(event);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getEventDetails(event.id);
        if (isMounted) setEventDetails(details);
      } catch (e) {
        Alert.alert(
          localization.getString('error'),
          localization.getString('failedToLoadDetails'),
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [event.id]);

  useEffect(() => {
    check(event.id).then(setIsFav);
  }, [event.id]);

  const handleFavorite = async () => {
    if (isFav) {
      await remove(event.id);
      setIsFav(false);
    } else {
      await add(event);
      setIsFav(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
          }}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : (
        <>
          <Image
            source={{
              uri:
                (eventDetails.images && eventDetails.images[0]?.url) ||
                eventDetails.image ||
                undefined,
            }}
            style={styles.image}
          />
          <View style={styles.infoCard}>
            <Text style={styles.name}>{eventDetails.name}</Text>
            <Text style={styles.date}>
              {formatDateTime(
                eventDetails.dates?.start?.localDate,
                eventDetails.dates?.start?.localTime,
              )}
            </Text>
            {eventDetails._embedded?.venues?.[0] && (
              <View style={{marginBottom: 10}}>
                <Text style={styles.venue}>
                  {localization.getString('venue')}:{' '}
                  {eventDetails._embedded.venues[0].name}
                </Text>
                <Text style={styles.venueSub}>
                  {eventDetails._embedded.venues[0].address?.line1}
                </Text>
                <Text style={styles.venueSub}>
                  {eventDetails._embedded.venues[0].city?.name},{' '}
                  {eventDetails._embedded.venues[0].state?.name}{' '}
                  {eventDetails._embedded.venues[0].country?.name}
                </Text>
                {/* Map Preview */}
                {eventDetails._embedded.venues[0].location?.latitude && (
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: parseFloat(
                          eventDetails._embedded.venues[0].location.latitude,
                        ),
                        longitude: parseFloat(
                          eventDetails._embedded.venues[0].location.longitude,
                        ),
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      pointerEvents="none">
                      <Marker
                        coordinate={{
                          latitude: parseFloat(
                            eventDetails._embedded.venues[0].location.latitude,
                          ),
                          longitude: parseFloat(
                            eventDetails._embedded.venues[0].location.longitude,
                          ),
                        }}
                        title={eventDetails._embedded.venues[0].name}
                      />
                    </MapView>
                  </View>
                )}
              </View>
            )}
            {eventDetails.priceRanges &&
              eventDetails.priceRanges.length > 0 && (
                <Text style={styles.price}>
                  {localization.getString('price')}:{' '}
                  {eventDetails.priceRanges[0].min} -{' '}
                  {eventDetails.priceRanges[0].max}{' '}
                  {eventDetails.priceRanges[0].currency}
                </Text>
              )}
            {eventDetails.info && (
              <Text style={styles.infoText}>{eventDetails.info}</Text>
            )}
            {eventDetails.pleaseNote && (
              <Text style={styles.pleaseNote}>{eventDetails.pleaseNote}</Text>
            )}
            {eventDetails.url && (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => {
                  if (eventDetails.url) {
                    import('react-native').then(({Linking}) => {
                      Linking.openURL(eventDetails.url);
                    });
                  }
                }}>
                <Text style={styles.buyButtonText}>
                  {localization.getString('buyTickets')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.favButton} onPress={handleFavorite}>
              <Text style={styles.favButtonText}>
                {isFav
                  ? localization.getString('removeFromFavorites')
                  : localization.getString('addToFavorites')}
              </Text>
            </TouchableOpacity>
            {eventDetails._embedded?.attractions && (
              <View style={styles.attractionsBox}>
                <Text style={styles.attractionsHeader}>
                  {localization.getString('attractions')}:
                </Text>
                {eventDetails._embedded.attractions.map((attr, idx) => (
                  <Text key={attr.id || idx} style={styles.attractionName}>
                    {attr.name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fa'},
  image: {width: '100%', height: 220, backgroundColor: '#eee'},
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3748',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  date: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 6,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  venue: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 2,
    fontWeight: 'bold',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  venueSub: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  price: {
    fontSize: 16,
    color: '#38a169',
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  infoText: {
    marginTop: 10,
    color: '#444',
    fontSize: 15,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  pleaseNote: {
    marginTop: 10,
    color: '#e53e3e',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  buyButton: {
    backgroundColor: '#38a169',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  buyButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  favButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  favButtonText: {color: '#fff', fontWeight: 'bold'},
  attractionsBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    marginTop: 18,
  },
  attractionsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
    color: '#2d3748',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  attractionName: {
    fontSize: 15,
    color: '#444',
    marginLeft: 8,
    marginTop: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  mapContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },
  map: {flex: 1},
});

export default EventDetailScreen;
