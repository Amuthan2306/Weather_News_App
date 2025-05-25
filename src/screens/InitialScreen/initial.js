import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const InitialScreen = () => {
  const navigation = useNavigation();

  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Animate text after logo
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          delay: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => navigation.navigate('Main'), 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007aff" />

      <Animated.Image
        source={require('../../assets/weather.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{scale: logoScale}],
          },
        ]}
      />

      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textOpacity,
            transform: [{translateY: textTranslateY}],
          },
        ]}>
        Weather News
      </Animated.Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
  text: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginTop: 25,
    letterSpacing: 1.2,
  },
});

export default InitialScreen;
