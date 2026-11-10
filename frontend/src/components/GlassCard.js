import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export const theme = {
  bg: ['#8CD3E5', '#B0F3E0'],
  navy: '#100568',
  muted: '#5778A4',
  blue: '#009DC5',
  mint: '#4FE4BA',
  teal: '#17C9B2',
  accent: ['#009DC5', '#4FE4BA'],
  font: {
    regular: 'Inter-Regular',
    semi: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  margin: 24,
  gap: 16,
  pad: 22,
};

export const glassCardEffects = {
  strokeWidth: 1,
  blurIntensity: 25,
  surfaceOpacity: 0,
  fillOpacity: 0.15,
  strokeOpacity: 1,
  innerGlowOpacity: 0.5,
  innerGlowSize: 10,
  innerGlowSpread: 4,
  radialOpacity: 0,
};

export default function GlassCard({
  children,
  style,
  contentStyle,
  radius = 26,
  strokeWidth = 5,
  blurIntensity = 40,
  surfaceOpacity = 0.4,
  fillOpacity = 0,
  strokeOpacity = 1,
  innerGlowOpacity = 0,
  innerGlowSize = 44,
  innerGlowSpread = 4,
  radialOpacity = 1,
}) {
  return (
    <View style={[styles.shadow, { borderRadius: radius }, style]}>
      <View
        style={[
          styles.clip,
          {
            borderRadius: radius,
            backgroundColor: `rgba(255,255,255,${fillOpacity})`,
          },
        ]}
      >
        <BlurView
          intensity={blurIntensity}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[
            `rgba(255,255,255,${surfaceOpacity})`,
            `rgba(255,255,255,${surfaceOpacity / 2})`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Svg
          pointerEvents="none"
          preserveAspectRatio="none"
          style={[StyleSheet.absoluteFill, { opacity: radialOpacity }]}
          viewBox="0 0 100 100"
        >
          <Defs>
            <RadialGradient id="glassCardRadialFill" cx="50%" cy="50%" r="72%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect width="100" height="100" fill="url(#glassCardRadialFill)" />
        </Svg>
        <LinearGradient
          colors={[`rgba(255,255,255,${innerGlowOpacity})`, 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.innerGlowTop, { height: innerGlowSize }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(255,255,255,0)', `rgba(255,255,255,${innerGlowOpacity})`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.innerGlowBottom, { height: innerGlowSize }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[`rgba(255,255,255,${innerGlowOpacity})`, 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.innerGlowLeft, { width: innerGlowSize }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(255,255,255,0)', `rgba(255,255,255,${innerGlowOpacity})`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.innerGlowRight, { width: innerGlowSize }]}
          pointerEvents="none"
        />
        <View
          pointerEvents="none"
          style={[
            styles.innerGlowSpread,
            {
              borderRadius: Math.max(radius - innerGlowSpread, 0),
              borderWidth: innerGlowSpread,
              borderColor: `rgba(255,255,255,${innerGlowOpacity})`,
            },
          ]}
        />
        <View style={contentStyle}>{children}</View>
        <View
          pointerEvents="none"
          style={[
            styles.innerStroke,
            {
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: `rgba(255,255,255,${strokeOpacity})`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: { width: 4, height: 4 },
    elevation: 4,
  },
  clip: {
    overflow: 'hidden',
  },
  innerStroke: {
    ...StyleSheet.absoluteFillObject,
  },
  innerGlowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  innerGlowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  innerGlowLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  innerGlowRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  innerGlowSpread: {
    ...StyleSheet.absoluteFillObject,
  },
});
