/**
 * Central de Persistência e Sincronização com o localStorage (StorageModule).
 */
export const StorageModule = {
  /**
   * Recupera um valor do localStorage com fallback.
   */
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      
      // Tenta fazer o parse caso seja JSON
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    } catch (e) {
      console.error('Erro ao ler do localStorage:', e);
      return defaultValue;
    }
  },

  /**
   * Salva um valor no localStorage.
   */
  set(key, value) {
    try {
      const valStr = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, valStr);
    } catch (e) {
      console.error('Erro ao escrever no localStorage:', e);
    }
  },

  /**
   * Configurações de Estado do Leitor
   */
  getTheme(fallback = 'dark') {
    return this.get('logosbook_theme', fallback);
  },

  setTheme(theme) {
    this.set('logosbook_theme', theme);
  },

  getFontSize(fallback = 1.1) {
    return parseFloat(this.get('logosbook_fontsize', fallback));
  },

  setFontSize(size) {
    this.set('logosbook_fontsize', size);
  },

  /**
   * Configurações de Estado do TTS (Speech Synthesis)
   */
  getVoiceName(fallback = '') {
    return this.get('logosbook_voice_name', fallback);
  },

  setVoiceName(name) {
    this.set('logosbook_voice_name', name);
  },

  getVoiceRate(fallback = 1.0) {
    return parseFloat(this.get('logosbook_voice_rate', fallback));
  },

  setVoiceRate(rate) {
    this.set('logosbook_voice_rate', rate);
  },

  getVoicePitch(fallback = 1.0) {
    return parseFloat(this.get('logosbook_voice_pitch', fallback));
  },

  setVoicePitch(pitch) {
    this.set('logosbook_voice_pitch', pitch);
  },

  /**
   * Progresso do Livro (Página lida)
   */
  getBookProgress(bookId, fallback = 0) {
    return parseInt(this.get(`logosbook_progress_${bookId}`, fallback), 10);
  },

  setBookProgress(bookId, pageIndex) {
    this.set(`logosbook_progress_${bookId}`, pageIndex);
  }
};
