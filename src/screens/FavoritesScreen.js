import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  I18nManager,
} from 'react-native';
import {useFavorites} from '../bridge/hooks';
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

const FavoritesScreen = ({navigation}) => {
  const {favorites, remove} = useFavorites();

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetails', {event: item})}>
      <Image
        source={{uri: item.image || (item.images && item.images[0]?.url)}}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>
          {formatDate(item.date || item.dates?.start?.localDate)}
        </Text>
        <Text style={styles.venue}>
          {item.venue || item._embedded?.venues?.[0]?.name}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => remove(item.id)}>
          <Text style={styles.removeButtonText}>
            {localization.getString('remove')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {localization.getString('noFavorites')}
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fa', padding: 16},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#667eea',
    textAlign: 'center',
  },
  listContent: {paddingBottom: 40},
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {width: '100%', height: 140, backgroundColor: '#eee'},
  info: {padding: 16},
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  date: {
    fontSize: 14,
    color: '#667eea',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  venue: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  removeButton: {
    backgroundColor: '#e53e3e',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButtonText: {color: '#fff', fontWeight: 'bold'},
  empty: {
    textAlign: I18nManager.isRTL ? 'right' : 'center',
    color: '#718096',
    marginTop: 40,
    fontSize: 16,
  },
});

export default FavoritesScreen;
