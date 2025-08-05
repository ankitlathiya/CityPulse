import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {searchEvents as fetchEvents} from '../bridge/api';
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

const HomeScreen = ({navigation}) => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchEvents = async () => {
    if (!keyword.trim() || !city.trim()) {
      Alert.alert(localization.getString('error'), localization.getString('pleaseEnterBoth'));
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      // Use Ticketmaster API
      const results = await fetchEvents({keyword, city});
      // Map API results to expected format for rendering
      const mapped = results.map(ev => ({
        id: ev.id,
        name: ev.name,
        date: ev.dates?.start?.localDate,
        venue: ev._embedded?.venues?.[0]?.name,
        image: ev.images?.[0]?.url,
        ...ev,
      }));
      setEvents(mapped);
    } catch (error) {
      Alert.alert(localization.getString('error'), localization.getString('failedToFetchEvents'));
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({item}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', {event: item})}>
      <Image
        source={{uri: item.images?.[0]?.url || item.image}}
        style={styles.eventImage}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventDate}>
          {formatDate(item.dates?.start?.localDate || item.date)}
        </Text>
        <Text style={styles.eventVenue}>
          {item._embedded?.venues?.[0]?.name}
          {item._embedded?.venues?.[0]?.city?.name
            ? `, ${item._embedded.venues[0].city.name}`
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{localization.getString('appName')}</Text>
        <Text style={styles.headerSubtitle}>{localization.getString('appSubtitle')}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.headerButtonText}>{localization.getString('favorites')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.headerButtonText}>{localization.getString('profile')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: 24}} />
      {/* Search Section */}
      <View style={styles.searchCard}>
        <TextInput
          style={styles.input}
          placeholder={localization.getString('enterKeyword')}
          value={keyword}
          onChangeText={setKeyword}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder={localization.getString('enterCity')}
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchEvents}
          disabled={loading}>
          <Text style={styles.searchButtonText}>
            {loading ? localization.getString('searching') : localization.getString('searchEvents')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {!keyword.trim() || !city.trim()
                  ? localization.getString('searchPrompt')
                  : searched
                  ? localization.formatString('noEventsFound', {keyword, city})
                  : localization.getString('enterKeywordCity')}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 5,
  },
  headerButton: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  searchButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsList: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e1e5e9',
  },
  eventInfo: {
    padding: 18,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  eventDate: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  eventVenue: {
    fontSize: 14,
    color: '#718096',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: I18nManager.isRTL ? 'right' : 'center',
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});

export default HomeScreen;
