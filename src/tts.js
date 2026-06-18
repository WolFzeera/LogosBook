import { StorageModule } from './storage.js';

/**
 * Controlador de Síntese de Voz (TTS) com Arquitetura de Fila Resiliente
 * Resolve o bug crônico do Chrome que silencia vozes longas após 15 segundos.
 */
export class SpeechController {
  constructor() {
    this.synth = window.speechSynthesis;
    
    // Configurações do Narrador (Carregadas do StorageModule)
    this.selectedVoiceName = StorageModule.getVoiceName();
    this.rate = StorageModule.getVoiceRate(1.0);
    this.pitch = StorageModule.getVoicePitch(1.0);
    
    // Fila de Execução Sequencial
    this.sentenceQueue = [];
    this.currentSentenceIndex = 0;
    this.activeUtterance = null;
    this.voices = [];

    // Estados do Player
    this.isPlaying = false;
    this.isPaused = false;
    this.currentLanguage = 'en-US';

    // Callbacks da Interface
    this.onStateChange = null;

    this.initVoices();
    if (this.synth) {
      if (typeof this.synth.addEventListener === 'function') {
        this.synth.addEventListener('voiceschanged', () => this.initVoices());
      } else {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  /**
   * Carrega vozes do sistema
   */
  initVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    return this.voices;
  }

  /**
   * Retorna lista de vozes disponíveis
   */
  getAvailableVoices() {
    const list = this.voices.length > 0 ? this.voices : this.initVoices();
    return list.map(v => ({
      name: v.name,
      lang: v.lang,
      voiceObj: v
    }));
  }

  /**
   * Divide o texto em frases curtas baseando-se em pontuações (. ! ?)
   * Limpa caracteres indesejados.
   */
  splitIntoSentences(text) {
    if (!text) return [];

    // Limpa marcações e espaços extras
    const cleanText = text
      .replace(/[_#*~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Divide por pontuações finais mantendo a pontuação na frase (?<=[.!?])
    // Fallback simples caso o motor regex do navegador não suporte lookbehind positivo
    let sentences = [];
    try {
      sentences = cleanText.split(/(?<=[.!?])\s+/);
    } catch {
      // Fallback sem lookbehind
      sentences = cleanText.split(/[.!?]+\s+/);
    }

    // Filtra frases vazias ou muito pequenas, e subdivide frases gigantes (> 150 chars) por vírgulas ou quebras
    const finalQueue = [];
    for (let s of sentences) {
      s = s.trim();
      if (!s) continue;

      if (s.length > 150) {
        // Divide por vírgula ou ponto e vírgula se for muito longa
        const subParts = s.split(/[,;]+/);
        for (let part of subParts) {
          part = part.trim();
          if (part.length > 3) finalQueue.push(part);
        }
      } else {
        finalQueue.push(s);
      }
    }

    return finalQueue;
  }

  /**
   * Inicializa a reprodução da Fila de Sentenças
   */
  speak(text, lang = 'en-US') {
    if (!this.synth) return;

    this.stop(); // Cancela falas anteriores

    this.currentLanguage = lang;
    this.sentenceQueue = this.splitIntoSentences(text);
    this.currentSentenceIndex = 0;

    if (this.sentenceQueue.length === 0) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.notifyState();

    this.speakNext();
  }

  /**
   * Reproduz a sentença atual da fila
   */
  speakNext() {
    if (!this.isPlaying) return;

    // Fim da fila
    if (this.currentSentenceIndex >= this.sentenceQueue.length) {
      this.stop();
      return;
    }

    const sentence = this.sentenceQueue[this.currentSentenceIndex];
    
    // Ignora sentenças vazias
    if (!sentence || sentence.trim().length === 0) {
      this.currentSentenceIndex++;
      this.speakNext();
      return;
    }

    this.activeUtterance = new SpeechSynthesisUtterance(sentence);
    this.activeUtterance.rate = this.rate;
    this.activeUtterance.pitch = this.pitch;

    // Configura a voz selecionada
    const available = this.getAvailableVoices();
    let selectedVoice = available.find(v => v.name === this.selectedVoiceName)?.voiceObj;

    if (!selectedVoice) {
      // Escolha inteligente de voz com base no idioma da leitura
      const prefix = this.currentLanguage.split('-')[0].toLowerCase();
      selectedVoice = available.find(v => v.lang.toLowerCase().startsWith(prefix))?.voiceObj;
    }

    if (selectedVoice) {
      this.activeUtterance.voice = selectedVoice;
    } else {
      this.activeUtterance.lang = this.currentLanguage;
    }

    // Callbacks do utterance
    this.activeUtterance.onend = () => {
      this.currentSentenceIndex++;
      this.speakNext();
    };

    this.activeUtterance.onerror = (e) => {
      // Ignora interrupções normais por cancelamento voluntário
      if (e.error !== 'interrupted') {
        console.error('Erro na sentença TTS:', e);
        this.currentSentenceIndex++;
        this.speakNext();
      }
    };

    this.synth.speak(this.activeUtterance);
  }

  /**
   * Pausa a narração
   */
  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  /**
   * Retoma a narração
   */
  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  /**
   * Para completamente e zera a fila
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.sentenceQueue = [];
      this.currentSentenceIndex = 0;
      this.activeUtterance = null;
      this.notifyState();
    }
  }

  setRate(value) {
    this.rate = parseFloat(value);
    StorageModule.setVoiceRate(this.rate);
    this.rebootCurrentSentence();
  }

  setPitch(value) {
    this.pitch = parseFloat(value);
    StorageModule.setVoicePitch(this.pitch);
    this.rebootCurrentSentence();
  }

  selectVoice(name) {
    this.selectedVoiceName = name;
    StorageModule.setVoiceName(name);
    this.rebootCurrentSentence();
  }

  /**
   * Reinicia a frase atual com os novos parâmetros sem zerar a fila.
   */
  rebootCurrentSentence() {
    if (this.isPlaying && this.synth) {
      this.synth.cancel();
      this.speakNext();
    }
  }

  notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused
      });
    }
  }
}
