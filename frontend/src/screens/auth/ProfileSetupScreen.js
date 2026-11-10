import { useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import { getBatchYears, INDIAN_STATES_AND_UTS } from '../../utils/constants';
import GlassCard, { glassCardEffects } from '../../components/GlassCard';
import ThemedAlert from '../../components/ThemedAlert';

const ROW_H = 56;

function GlassField({ children, style }) {
  return (
    <GlassCard {...glassCardEffects} radius={22} style={style} contentStyle={styles.fieldContent}>
      {children}
    </GlassCard>
  );
}

export default function ProfileSetupScreen({ onBack, onComplete, demoMode = false }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [batchYear, setBatchYear] = useState(() => String(new Date().getFullYear()));
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorDialog, setErrorDialog] = useState(null);
  const batchYears = getBatchYears();
  const selectedOptions =
    openDropdown === 'state' ? INDIAN_STATES_AND_UTS : batchYears;
  const selectedValue = openDropdown === 'state' ? state : batchYear;
  const selectedIndex = Math.max(0, selectedOptions.indexOf(selectedValue));
  const canContinue = demoMode || (name.trim().length > 0 && state.length > 0);

  function selectOption(option) {
    if (openDropdown === 'state') {
      setState(option);
    } else {
      setBatchYear(option);
    }
    setOpenDropdown(null);
  }

  async function handleComplete() {
    if (!canContinue || isSaving) {
      return;
    }
    Keyboard.dismiss();
    setIsSaving(true);
    try {
      await onComplete?.({ name: name.trim(), state, batchYear });
    } catch (error) {
      setErrorDialog({ title: 'Unable to save profile', message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <LinearGradient
      colors={['#A8E5FD', '#B7F1FD', '#C4FDF3', '#C6FDEC', '#C5FCEE']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screen}
    >
      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 58 },
        ]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <GlassCard
          {...glassCardEffects}
          radius={32}
          style={styles.card}
          contentStyle={styles.cardContent}
        >
          <Text style={styles.heading}>Details</Text>

          <Text style={styles.label}>Name</Text>
          <GlassField style={styles.fieldGap}>
            <TextInput
              accessibilityLabel="Name"
              autoCapitalize="words"
              autoComplete="name"
              onChangeText={setName}
              returnKeyType="done"
              selectionColor="#009DC5"
              style={styles.input}
              value={name}
            />
          </GlassField>

          <Text style={styles.label}>State</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`State: ${state || 'Select state'}`}
            accessibilityHint="Opens the state and union territory list"
            onPress={() => setOpenDropdown('state')}
            style={styles.fieldGap}
          >
            <GlassField>
              <Text style={[styles.valueText, !state && styles.placeholder]} numberOfLines={1}>
                {state || 'Select state'}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#100568" />
            </GlassField>
          </Pressable>

          <Text style={styles.label}>Batch Year</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Batch year: ${batchYear}`}
            accessibilityHint="Opens the available batch years"
            onPress={() => setOpenDropdown('year')}
            style={styles.fieldGap}
          >
            <GlassField>
              <Text style={styles.valueText}>{batchYear}</Text>
              <Ionicons name="chevron-down" size={24} color="#100568" />
            </GlassField>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Get start"
            accessibilityState={{ disabled: !canContinue || isSaving }}
            disabled={!canContinue || isSaving}
            onPress={handleComplete}
            style={({ pressed }) => [
              styles.buttonShadow,
              pressed && canContinue && !isSaving && styles.buttonPressed,
              (!canContinue || isSaving) && styles.buttonDisabled,
            ]}
          >
            <View style={styles.buttonBorder}>
              <LinearGradient
                colors={['#0A9BE8', '#2FD3D0', '#4FE4BA']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
                  style={styles.gloss}
                  pointerEvents="none"
                />
                <Text style={styles.buttonText}>{isSaving ? 'Saving…' : 'Get Start'}</Text>
              </LinearGradient>
            </View>
          </Pressable>
        </GlassCard>
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={[styles.backButton, { top: Math.max(insets.top + 68, 92) }]}
      >
        <Feather name="arrow-left" size={34} color="#100568" />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setOpenDropdown(null)}
        transparent
        visible={openDropdown !== null}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close options"
            onPress={() => setOpenDropdown(null)}
            style={styles.modalBackdrop}
          />
          <View style={[styles.sheetWrap, { marginBottom: insets.bottom + 12 }]}>
            <GlassCard {...glassCardEffects} radius={30} contentStyle={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {openDropdown === 'state' ? 'Select state' : 'Select batch year'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close options"
                  hitSlop={12}
                  onPress={() => setOpenDropdown(null)}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={22} color="#100568" />
                </Pressable>
              </View>
              <FlatList
                data={selectedOptions}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.list}
                initialScrollIndex={Math.max(0, selectedIndex - 2)}
                getItemLayout={(_, index) => ({ length: ROW_H, offset: ROW_H * index, index })}
                renderItem={({ item }) => {
                  const isSelected = item === selectedValue;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => selectOption(item)}
                      style={[styles.option, isSelected && styles.selectedOption]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[styles.optionText, isSelected && styles.selectedOptionText]}
                      >
                        {item}
                      </Text>
                      {isSelected && <Feather name="check" size={22} color="#13A98B" />}
                    </Pressable>
                  );
                }}
              />
            </GlassCard>
          </View>
        </View>
      </Modal>
      <ThemedAlert
        visible={errorDialog !== null}
        title={errorDialog?.title}
        message={errorDialog?.message}
        actions={[{ label: 'OK', variant: 'primary', onPress: () => setErrorDialog(null) }]}
        onRequestClose={() => setErrorDialog(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card: { width: '100%' },
  cardContent: { padding: 24 },
  heading: {
    color: '#100568',
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 14,
  },
  label: {
    color: '#254D91',
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 8,
  },
  fieldGap: { marginBottom: 16 },
  fieldContent: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    minHeight: 50,
    padding: 0,
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
  },
  valueText: {
    flex: 1,
    marginRight: 10,
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
  },
  placeholder: {
    color: '#5A7FC4',
    fontFamily: typography.fontFamily.regular,
  },
  buttonShadow: {
    borderRadius: 999,
    backgroundColor: '#0086A8',
    shadowColor: '#005B78',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
    elevation: 7,
    marginTop: 8,
  },
  buttonBorder: {
    overflow: 'hidden',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  buttonDisabled: { opacity: 0.55 },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontFamily: typography.fontFamily.semiBold,
  },
  buttonPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    elevation: 3,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16,5,104,0.28)',
  },
  sheetWrap: { marginHorizontal: 12, maxHeight: '72%' },
  sheet: {
    padding: 18,
    backgroundColor: 'rgba(238,252,253,0.55)',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  sheetTitle: {
    color: '#100568',
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(160,210,245,0.45)',
  },
  list: { flexGrow: 0 },
  option: {
    height: ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  selectedOption: {
    backgroundColor: 'rgba(79,228,186,0.28)',
    borderWidth: 1.5,
    borderColor: '#19D3D3',
  },
  optionText: {
    flex: 1,
    marginRight: 10,
    color: '#5778A4',
    fontSize: 17,
    fontFamily: typography.fontFamily.regular,
  },
  selectedOptionText: {
    color: '#100568',
    fontFamily: typography.fontFamily.semiBold,
  },
});
