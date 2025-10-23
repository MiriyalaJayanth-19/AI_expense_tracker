import Voice from '@react-native-voice/voice';
import { Platform, PermissionsAndroid } from 'react-native';

class VoiceService {
  constructor() {
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;

    // Bind event handlers
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  /**
   * Request microphone permission
   * @returns {Promise<boolean>}
   */
  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'AI Expense Tracker needs access to your microphone to record expenses via voice.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permissions automatically
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  /**
   * Start listening for voice input
   * @param {string} locale - Language locale (e.g., 'en-US', 'hi-IN', 'es-ES')
   * @param {Function} onResult - Callback for results
   * @param {Function} onError - Callback for errors
   */
  async startListening(locale = 'en-US', onResult, onError) {
    try {
      // Check permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      // Set callbacks
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;

      // Start voice recognition
      await Voice.start(locale);
      this.isListening = true;

      console.log(`Voice recognition started with locale: ${locale}`);
    } catch (error) {
      console.error('Start listening error:', error);
      this.isListening = false;
      if (onError) onError(error);
    }
  }

  /**
   * Stop listening
   */
  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
      console.log('Voice recognition stopped');
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  }

  /**
   * Cancel listening
   */
  async cancelListening() {
    try {
      await Voice.cancel();
      this.isListening = false;
      console.log('Voice recognition cancelled');
    } catch (error) {
      console.error('Cancel listening error:', error);
    }
  }

  /**
   * Destroy voice instance
   */
  async destroy() {
    try {
      await Voice.destroy();
      this.isListening = false;
      this.onResultCallback = null;
      this.onErrorCallback = null;
    } catch (error) {
      console.error('Destroy voice error:', error);
    }
  }

  /**
   * Get available languages
   * @returns {Promise<Array<string>>}
   */
  async getAvailableLanguages() {
    try {
      const languages = await Voice.getSupportedLocales();
      return languages || [];
    } catch (error) {
      console.error('Get languages error:', error);
      return [];
    }
  }

  // Event handlers
  onSpeechStart(e) {
    console.log('Speech started', e);
  }

  onSpeechEnd(e) {
    console.log('Speech ended', e);
    this.isListening = false;
  }

  onSpeechResults(e) {
    console.log('Speech results', e);
    if (e.value && e.value.length > 0 && this.onResultCallback) {
      this.onResultCallback(e.value[0]);
    }
  }

  onSpeechError(e) {
    console.error('Speech error', e);
    this.isListening = false;
    if (this.onErrorCallback) {
      this.onErrorCallback(e.error);
    }
  }

  /**
   * Check if currently listening
   * @returns {boolean}
   */
  getIsListening() {
    return this.isListening;
  }
}

export default new VoiceService();

// Popular language locales for reference
export const POPULAR_LOCALES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
];
