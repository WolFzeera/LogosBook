import { StorageModule } from './storage.js';

/**
 * Módulo de Controle de Leitura e Prevenção de Corrupção de Layout.
 */
export class BookReader {
  constructor() {
    this.book = null;
    this.rawText = '';
    this.pages = [];
    this.currentPageIndex = 0;
    
    // Configurações do Leitor (Sincronizadas com o StorageModule)
    this.fontSizeRem = StorageModule.getFontSize(1.1);
    this.theme = StorageModule.getTheme('dark');
    this.translationCache = {};

    this.onPageChange = null;
  }

  /**
   * Inicializa o leitor e divide as páginas.
   */
  loadBook(book, rawText) {
    this.book = book;
    this.rawText = rawText;
    this.translationCache = {};

    // Reconstrói as páginas baseadas no tamanho atual da fonte
    this.rebuildPages();

    // Recupera progresso da página
    const savedPageIndex = StorageModule.getBookProgress(book.id, 0);
    this.currentPageIndex = Math.min(savedPageIndex, this.pages.length - 1);
  }

  /**
   * Divide o texto em páginas de forma inteligente, ajustando o limite
   * de caracteres conforme o tamanho da fonte para evitar overflow/transbordo.
   */
  rebuildPages() {
    if (!this.rawText) return;

    // Tamanho base de caracteres por página: 1800.
    // Quanto maior a fonte, menos caracteres cabem na página.
    // Reduzimos o tamanho do bloco proporcionalmente à fonte.
    const baseLimit = 1800;
    const targetLength = Math.max(600, Math.round(baseLimit / this.fontSizeRem));

    const cleanText = this.rawText.replace(/\r/g, '');
    const paragraphs = cleanText.split(/\n\n+/);
    
    const newPages = [];
    let currentChunk = [];
    let currentLength = 0;

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      currentChunk.push(trimmed);
      currentLength += trimmed.length;

      if (currentLength >= targetLength) {
        newPages.push(currentChunk.join('\n\n'));
        currentChunk = [];
        currentLength = 0;
      }
    }

    if (currentChunk.length > 0) {
      newPages.push(currentChunk.join('\n\n'));
    }

    if (newPages.length === 0) {
      newPages.push(cleanText || 'O conteúdo desta obra está indisponível.');
    }

    this.pages = newPages;
  }

  /**
   * Altera a fonte rem, salvando-a e recalculando os limites de página
   * sem perder a posição do texto atual.
   */
  changeFontSize(step) {
    const previousFontSize = this.fontSizeRem;
    this.fontSizeRem = Math.max(0.8, Math.min(2.2, this.fontSizeRem + step));
    
    // Salva no localStorage
    StorageModule.setFontSize(this.fontSizeRem);

    if (this.pages.length > 0) {
      // 1. Calcula o offset aproximado em caracteres da página atual
      let charOffset = 0;
      for (let i = 0; i < this.currentPageIndex; i++) {
        charOffset += this.pages[i].length + 2; // +2 pelo separador de parágrafos
      }

      // 2. Reconstrói as páginas com os novos limites
      this.rebuildPages();

      // 3. Localiza qual a nova página correspondente ao offset original
      let acc = 0;
      let newIdx = 0;
      for (let i = 0; i < this.pages.length; i++) {
        acc += this.pages[i].length + 2;
        if (acc >= charOffset) {
          newIdx = i;
          break;
        }
      }

      this.currentPageIndex = Math.min(newIdx, this.pages.length - 1);
      StorageModule.setBookProgress(this.book.id, this.currentPageIndex);
    }

    return this.fontSizeRem;
  }

  /**
   * Altera o tema oftalmológico.
   */
  setTheme(themeName) {
    this.theme = themeName;
    StorageModule.setTheme(themeName);
    return this.theme;
  }

  getCurrentPageText() {
    return this.pages[this.currentPageIndex] || '';
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      StorageModule.setBookProgress(this.book.id, this.currentPageIndex);
      if (this.onPageChange) this.onPageChange(this.currentPageIndex);
      return true;
    }
    return false;
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      StorageModule.setBookProgress(this.book.id, this.currentPageIndex);
      if (this.onPageChange) this.onPageChange(this.currentPageIndex);
      return true;
    }
    return false;
  }

  getProgressString() {
    if (this.pages.length <= 1) return '0%';
    const percent = Math.round((this.currentPageIndex / (this.pages.length - 1)) * 100);
    return `${percent}%`;
  }

  /**
   * Utilitário para escutar swipes horizontais no Mobile.
   */
  setupSwipeGestures(element, onPrev, onNext) {
    let startX = 0;
    let startY = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      // Detecta swipe horizontal significativo e ignora arrastes verticais grandes
      if (Math.abs(diffX) > 60 && Math.abs(diffY) < 40) {
        if (diffX > 0) {
          onPrev();
        } else {
          onNext();
        }
      }
    }, { passive: true });
  }
}
