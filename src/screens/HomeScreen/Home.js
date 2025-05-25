import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchWeather, fetchNews, getWeatherMood} from '../../utils/api';

const formatDate = dateString => {
  const options = {weekday: 'long', month: 'short', day: 'numeric'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const unit = useSelector(state => state.weather.unit);
  const current = useSelector(state => state.weather.current);
  const forecast = useSelector(state => state.weather.forecast);
  const headlines = useSelector(state => state.news.headlines);
  const category = useSelector(state => state.news.category);

  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        await fetchWeather(unit, dispatch);
      } catch (err) {
        console.error('Weather fetch failed:', err);
        setError('Failed to load weather data');
      }
    };
    loadWeather();
  }, [unit]);

  useEffect(() => {
    const loadNews = async () => {
      if (!current) return;
      try {
        const mood = getWeatherMood(current.main.temp);
        await fetchNews(category, mood, dispatch);
      } catch (err) {
        console.error('News fetch failed:', err);
        setError('Failed to load news');
      }
    };
    loadNews();
  }, [current, category]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌤 Current Weather</Text>
        {current ? (
          <>
            <Text style={styles.infoText}>
              Temperature:{' '}
              <Text style={styles.highlight}>
                {current.main.temp}°{unit === 'metric' ? 'C' : 'F'}
              </Text>
            </Text>
            <Text style={styles.infoText}>
              Condition:{' '}
              <Text style={styles.highlight}>
                {current.weather[0].description}
              </Text>
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>Weather data not available.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 5-Day Forecast</Text>
        {forecast ? (
          forecast.list.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDate}>{formatDate(item.dt_txt)}</Text>
              <Text style={styles.forecastTemp}>
                {item.main.temp}°{unit === 'metric' ? 'C' : 'F'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>Forecast data not available.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📰 News Headlines</Text>
        {headlines.length === 0 ? (
          <Text style={styles.infoText}>
            No news articles available for this weather mood.
          </Text>
        ) : (
          headlines.map((item, index) => (
            <View key={index} style={styles.newsItem}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(item.url)}
                style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  highlight: {
    color: '#007aff',
    fontWeight: '600',
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  forecastDate: {
    fontSize: 16,
    color: '#333',
  },
  forecastTemp: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: '600',
  },
  newsItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  readMoreBtn: {
    backgroundColor: '#007aff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
