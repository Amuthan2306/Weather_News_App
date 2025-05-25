import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {setWeather} from '../slices/weatherSlice';
import {setHeadlines} from '../slices/newsSlice';

export const getWeatherMood = temp => {
  if (temp <= 10) return 'depressing';
  if (temp >= 30) return 'fear';
  return 'happy';
};

export const fetchWeather = async (unit, dispatch) => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Location permission denied');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const unit = 'metric';
          const apiKey = 'b287c83e39b3709a9bfb9ca8c9ef9ab7';

          const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
          const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

          const [currentRes, forecastRes] = await Promise.all([
            fetch(weatherURL),
            fetch(forecastURL),
          ]);

          if (!currentRes.ok || !forecastRes.ok) {
            throw new Error('Failed to fetch weather or forecast data');
          }

          const current = await currentRes.json();
          const forecast = await forecastRes.json();

          dispatch(setWeather({current, forecast}));
        } catch (err) {
          console.error('Weather fetch error:', err);
        }
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  } catch (error) {
    console.error('Location fetch setup error:', error);
  }
};

export const fetchNews = async (category, mood, dispatch) => {
  try {
    const apiKey = 'b50feb9a7d804096a8559c15bfcfa758';
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    const filteredArticles = data.articles.filter(article => {
      const title = article.title.toLowerCase();
      return mood === 'depressing'
        ? title.includes('death') ||
            title.includes('crisis') ||
            title.includes('problem')
        : mood === 'fear'
        ? title.includes('attack') ||
          title.includes('threat') ||
          title.includes('scare')
        : title.includes('win') ||
          title.includes('happy') ||
          title.includes('success');
    });

    dispatch(setHeadlines(filteredArticles));
  } catch (err) {
    console.error('News fetch error:', err);
  }
};
