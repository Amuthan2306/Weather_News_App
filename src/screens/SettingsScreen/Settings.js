import React from 'react';
import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUnit} from '../../slices/weatherSlice';
import {setCategory} from '../../slices/newsSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const unit = useSelector(state => state.weather.unit);
  const category = useSelector(state => state.news.category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌡 Temperature Unit</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Celsius</Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={val =>
              dispatch(setUnit(val ? 'imperial' : 'metric'))
            }
            trackColor={{false: '#ccc', true: '#007aff'}}
            thumbColor={unit === 'imperial' ? '#007aff' : '#f4f3f4'}
          />
          <Text style={styles.label}>Fahrenheit</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📰 News Category</Text>
        <View style={styles.categoryContainer}>
          {['general', 'business', 'technology', 'sports'].map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categorySelected,
              ]}
              onPress={() => dispatch(setCategory(cat))}>
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextSelected,
                ]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f4f8',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e6ed',
    marginRight: 10,
    marginBottom: 10,
  },
  categorySelected: {
    backgroundColor: '#007aff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;
