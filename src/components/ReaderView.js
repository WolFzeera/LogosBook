import { fetchBookContent, translateTextToPt } from '../api.js';
import { StorageModule } from '../storage.js';

export class ReaderView {
  constructor(appContainer, bookReader, speechController, onClose) {
    this.container = appContainer;
    this.reader = bookReader;
    this.tts = speechController;
    this.onClose = onClose;
    
    this.isLoading = false;
    this.isTranslated = false;
    this.translating = false;
    this.errorMessage = '';
  }

  /**
   * Abre o leitor de livros para o livro especificado.
   */
  async open(book) {
    this.isLoading = true;
    this.isTranslated = false;
    this.errorMessage = '';
    this.render();

    try {
      const content = await fetchBookContent(book.formats);
      this.reader.loadBook(book, content);
      this.isLoading = false;
      this.render();
      this.applyThemeAndFont();
      this.setupTTSVoices();
      
      // Vincula gestos de Swipe na página do livro (Mobile-friendly)
      const pageEl = document.getElementById('book-page-text');
      if (pageEl) {
        this.reader.setupSwipeGestures(
          pageEl,
          () => this.navigatePage(-1),
          () => this.navigatePage(1)
        );
      }
    } catch (err) {
      console.error(err);
      this.isLoading = false;
      this.errorMessage = err.message || 'Erro ao obter conteúdo do livro.';
      this.render();
    }
  }

  /**
   * Renderiza a interface do Reader com estética Retrô/Arcade (Bits Coloridos).
   */
  render() {
    if (this.isLoading) {
      this.container.innerHTML = `
        <div class="reader-loading-screen pixel-layout">
          <div class="spinner pixel-spinner"></div>
          <p class="blink">CARREGANDO DADOS...</p>
          <span class="loading-subtitle">> LENDO SETORES DE MEMÓRIA</span>
        </div>
      `;
      return;
    }

    if (this.errorMessage) {
      this.container.innerHTML = `
        <div class="reader-error-screen pixel-layout">
          <div class="error-badge">ERRO_CORS</div>
          <h2>FALHA NO CARREGAMENTO</h2>
          <p>${this.errorMessage}</p>
          <div class="error-actions">
            <button class="btn btn-primary btn-pixel" id="btn-reader-close-error">VOLTAR AO MENU</button>
          </div>
        </div>
      `;
      document.getElementById('btn-reader-close-error').addEventListener('click', () => this.onClose());
      return;
    }

    const book = this.reader.book;
    if (!book) return;

    const currentText = this.isTranslated 
      ? (this.reader.translationCache[this.reader.currentPageIndex] || 'TRADUZINDO CONTEÚDO DA PÁGINA...') 
      : this.reader.getCurrentPageText();

    const authorNames = book.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || 'Autor Desconhecido';

    this.container.innerHTML = `
      <div class="reader-container pixel-layout" id="reader-layout">
        
        <!-- Header Arcade -->
        <header class="reader-header">
          <button class="btn-close-reader btn-pixel-sm" id="btn-close-reader" title="Voltar ao Menu">ESC</button>
          <div class="reader-header-meta">
            <h2 class="reader-book-title">${this.escape(book.title)}</h2>
            <span class="reader-book-author">> AUTOR: ${this.escape(authorNames)}</span>
          </div>
          <div class="reader-progress-bubble" id="progress-indicator">
            LIDO: ${this.reader.getProgressString()}
          </div>
        </header>

        <div class="reader-main-content">
          <!-- Sidebar de Controles Retro (Bits Coloridos) -->
          <aside class="reader-sidebar">
            <div class="sidebar-section">
              <h4 class="sidebar-title">[01] TEMA DE COR</h4>
              <div class="theme-toggles">
                <button class="theme-btn theme-light-btn" data-theme="light" title="Tema GameBoy"></button>
                <button class="theme-btn theme-sepia-btn" data-theme="sepia" title="Terminal Âmbar"></button>
                <button class="theme-btn theme-dark-btn" data-theme="dark" title="Cyber Neon"></button>
              </div>
              
              <h4 class="sidebar-title" style="margin-top: 8px;">[02] TAMANHO DA FONTE</h4>
              <div class="font-resizers">
                <button class="font-btn" id="btn-font-decrease" title="Diminuir Fonte">A-</button>
                <span class="font-indicator" id="font-size-text">${Math.round(this.reader.fontSizeRem * 100)}%</span>
                <button class="font-btn" id="btn-font-increase" title="Aumentar Fonte">A+</button>
              </div>
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-section">
              <h4 class="sidebar-title">[03] TRADUÇÃO</h4>
              <button class="btn btn-full btn-pixel ${this.isTranslated ? 'btn-translated' : ''}" id="btn-translate-page">
                ${this.translating ? 'TRADUZINDO...' : (this.isTranslated ? 'VER ORIGINAL' : 'TRADUZIR PT-BR')}
              </button>
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-section">
              <h4 class="sidebar-title">[04] DECODIFICADOR DE VOZ</h4>
              
              <div class="tts-voice-wrapper">
                <label for="tts-voice-select">CHIP DE VOZ</label>
                <select id="tts-voice-select" class="tts-select"></select>
              </div>

              <div class="tts-range-group">
                <div class="range-header">
                  <label for="tts-rate-range">VELOCIDADE</label>
                  <span id="rate-value">${this.tts.rate.toFixed(1)}x</span>
                </div>
                <input type="range" id="tts-rate-range" min="0.5" max="2" step="0.1" value="${this.tts.rate}">
              </div>

              <div class="tts-range-group">
                <div class="range-header">
                  <label for="tts-pitch-range">TOM</label>
                  <span id="pitch-value">${this.tts.pitch.toFixed(1)}</span>
                </div>
                <input type="range" id="tts-pitch-range" min="0.5" max="2" step="0.1" value="${this.tts.pitch}">
              </div>

              <div class="tts-player-controls">
                <button class="player-btn btn-pixel-sm" id="tts-play-btn" title="Narrar Página">PLAY</button>
                <button class="player-btn btn-pixel-sm" id="tts-stop-btn" title="Silenciar Áudio" disabled>PARAR</button>
              </div>
            </div>
          </aside>

          <!-- Livro / Janela de Leitura -->
          <article class="reader-book-view">
            <div class="book-page-wrapper">
              <div class="book-page" id="book-page-text">
                ${this.formatTextHtml(currentText)}
              </div>
            </div>
          </article>
        </div>

        <!-- Rodapé Retro -->
        <footer class="reader-footer">
          <div class="reader-footer-inner">
            <button class="btn-nav btn-pixel-sm" id="btn-prev-page" ${this.reader.currentPageIndex === 0 ? 'disabled' : ''}>ANTERIOR</button>
            <span class="page-numbers" id="page-numbers-text">
              PÁGINA ${this.reader.currentPageIndex + 1} DE ${this.reader.pages.length}
            </span>
            <button class="btn-nav btn-pixel-sm" id="btn-next-page" ${this.reader.currentPageIndex === this.reader.pages.length - 1 ? 'disabled' : ''}>PRÓXIMA</button>
          </div>
          <div class="reader-progress-bar-container">
            <div class="reader-progress-bar-fill" id="progress-bar-fill" style="width: ${this.reader.getProgressString()};"></div>
          </div>
        </footer>

      </div>
    `;

    this.bindEvents();
    this.applyThemeAndFont();
    this.updatePlayerUI();
  }

  bindEvents() {
    // Retornar ao Menu
    document.getElementById('btn-close-reader').addEventListener('click', () => {
      this.tts.stop();
      this.onClose();
    });

    // Botões de Navegação
    document.getElementById('btn-prev-page').addEventListener('click', () => this.navigatePage(-1));
    document.getElementById('btn-next-page').addEventListener('click', () => this.navigatePage(1));

    // Controles de Temas
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedTheme = btn.dataset.theme;
        this.reader.setTheme(selectedTheme);
        this.applyThemeAndFont();
      });
    });

    // Controles de Fonte
    document.getElementById('btn-font-decrease').addEventListener('click', () => {
      this.reader.changeFontSize(-0.15);
      this.applyThemeAndFont();
      this.rebindSwipe();
    });
    
    document.getElementById('btn-font-increase').addEventListener('click', () => {
      this.reader.changeFontSize(0.15);
      this.applyThemeAndFont();
      this.rebindSwipe();
    });

    // Tradução
    document.getElementById('btn-translate-page').addEventListener('click', () => this.toggleTranslation());

    // Vozes e Sliders
    const voiceSelect = document.getElementById('tts-voice-select');
    voiceSelect.addEventListener('change', (e) => {
      this.tts.selectVoice(e.target.value);
    });

    const rateRange = document.getElementById('tts-rate-range');
    const rateVal = document.getElementById('rate-value');
    rateRange.addEventListener('input', (e) => {
      const v = e.target.value;
      rateVal.textContent = `${parseFloat(v).toFixed(1)}x`;
      this.tts.setRate(v);
    });

    const pitchRange = document.getElementById('tts-pitch-range');
    const pitchVal = document.getElementById('pitch-value');
    pitchRange.addEventListener('input', (e) => {
      const v = e.target.value;
      pitchVal.textContent = parseFloat(v).toFixed(1);
      this.tts.setPitch(v);
    });

    // Botões de Reprodução
    const playBtn = document.getElementById('tts-play-btn');
    const stopBtn = document.getElementById('tts-stop-btn');

    playBtn.addEventListener('click', () => {
      if (this.tts.isPlaying) {
        if (this.tts.isPaused) {
          this.tts.resume();
        } else {
          this.tts.pause();
        }
      } else {
        const textToSpeak = document.getElementById('book-page-text').innerText;
        const lang = this.isTranslated ? 'pt-BR' : 'en-US';
        this.tts.speak(textToSpeak, lang);
      }
    });

    stopBtn.addEventListener('click', () => {
      this.tts.stop();
    });

    this.tts.onStateChange = (state) => {
      this.updatePlayerUI(state);
    };

    this.reader.onPageChange = () => {
      this.tts.stop();
      this.isTranslated = false;
      this.render();
    };
  }

  rebindSwipe() {
    const pageEl = document.getElementById('book-page-text');
    if (pageEl) {
      this.reader.setupSwipeGestures(
        pageEl,
        () => this.navigatePage(-1),
        () => this.navigatePage(1)
      );
    }
  }

  navigatePage(direction) {
    const pageEl = document.getElementById('book-page-text');
    if (!pageEl) return;

    const animationClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
    pageEl.classList.add(animationClass);

    setTimeout(() => {
      let success = false;
      if (direction > 0) {
        success = this.reader.nextPage();
      } else {
        success = this.reader.prevPage();
      }

      if (!success) {
        pageEl.classList.remove(animationClass);
      }
    }, 220);
  }

  async toggleTranslation() {
    if (this.translating) return;

    if (this.isTranslated) {
      this.isTranslated = false;
      this.render();
      return;
    }

    const pageIdx = this.reader.currentPageIndex;
    const cached = this.reader.translationCache[pageIdx];

    if (cached) {
      this.isTranslated = true;
      this.render();
      return;
    }

    this.translating = true;
    const translateBtn = document.getElementById('btn-translate-page');
    if (translateBtn) {
      translateBtn.textContent = 'DECODIFICANDO...';
      translateBtn.classList.add('translating');
    }

    try {
      const originalText = this.reader.getCurrentPageText();
      const translated = await translateTextToPt(originalText);
      this.reader.translationCache[pageIdx] = translated;
      this.isTranslated = true;
    } catch (e) {
      alert('ERRO DE PROTOCOLO: FALHA NA TRADUÇÃO.');
    } finally {
      this.translating = false;
      this.render();
    }
  }

  setupTTSVoices() {
    const voiceSelect = document.getElementById('tts-voice-select');
    if (!voiceSelect) return;

    voiceSelect.innerHTML = '';
    const voices = this.tts.getAvailableVoices();
    
    if (voices.length === 0) {
      voiceSelect.innerHTML = '<option value="">ERRO NO CHIP DE VOZ</option>';
      return;
    }

    const sorted = [...voices].sort((a, b) => {
      const aPt = a.lang.startsWith('pt');
      const bPt = b.lang.startsWith('pt');
      if (aPt && !bPt) return -1;
      if (!aPt && bPt) return 1;
      return a.name.localeCompare(b.name);
    });

    sorted.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name.substring(0, 16)} (${voice.lang})`;
      
      if (voice.name === this.tts.selectedVoiceName) {
        option.selected = true;
      }
      voiceSelect.appendChild(option);
    });
  }

  applyThemeAndFont() {
    const layout = document.getElementById('reader-layout');
    if (!layout) return;

    layout.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
    layout.classList.add(`theme-${this.reader.theme}`);

    layout.style.setProperty('--reader-font-size', `${this.reader.fontSizeRem}rem`);
    
    const fontText = document.getElementById('font-size-text');
    if (fontText) {
      fontText.textContent = `${Math.round(this.reader.fontSizeRem * 100)}%`;
    }

    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
      if (btn.dataset.theme === this.reader.theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updatePlayerUI(state) {
    const playBtn = document.getElementById('tts-play-btn');
    const stopBtn = document.getElementById('tts-stop-btn');
    const pageEl = document.getElementById('book-page-text');

    if (!playBtn || !stopBtn) return;

    const playStatus = state || { isPlaying: this.tts.isPlaying, isPaused: this.tts.isPaused };

    if (playStatus.isPlaying) {
      stopBtn.disabled = false;
      if (playStatus.isPaused) {
        playBtn.textContent = 'PLAY';
        playBtn.classList.remove('blink');
        pageEl?.classList.remove('voice-reading-active');
      } else {
        playBtn.textContent = 'PAUSAR';
        playBtn.classList.add('blink');
        pageEl?.classList.add('voice-reading-active');
      }
    } else {
      playBtn.textContent = 'PLAY';
      playBtn.classList.remove('blink');
      stopBtn.disabled = true;
      pageEl?.classList.remove('voice-reading-active');
    }
  }

  formatTextHtml(text) {
    if (!text) return '';
    return text
      .split('\n\n')
      .map(para => `<p>${this.escape(para.trim())}</p>`)
      .join('');
  }

  escape(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
