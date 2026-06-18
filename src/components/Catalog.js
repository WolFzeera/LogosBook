import { fetchBooks } from '../api.js';

export class Catalog {
  constructor(appContainer, onBookSelect) {
    this.container = appContainer;
    this.onBookSelect = onBookSelect;
    this.books = [];
    this.featuredBook = null;
    this.query = '';
    this.page = 1;
    this.loading = false;
    this.activeGenre = '';

    this.genres = [
      { key: 'philosophy', label: 'PHILOSOPHY' },
      { key: 'fiction', label: 'FICTION' },
      { key: 'poetry', label: 'POETRY' },
      { key: 'history', label: 'HISTORY' },
      { key: 'romance', label: 'ROMANCE' },
      { key: 'science', label: 'SCIENCE' },
      { key: 'drama', label: 'DRAMA' }
    ];

    this.debounceTimeout = null;
  }

  /**
   * Renderiza a casca estrutural do catálogo no estilo Retro Arcade (Bits Coloridos).
   */
  render() {
    this.container.innerHTML = `
      <header class="hero pixel-layout">
        <div class="hero-inner">
          <div class="hero-meta">
            <div class="brand-badge pixel-badge">LOGOS_BOOK.EXE</div>
            <h1 class="title pixel-title">RETRO LIBRARY</h1>
            <p class="tagline">// RETRIEVE CLASSICS IN HIGH RESOLUTION BITS.</p>
            
            <div class="search-wrap">
              <span class="search-icon">></span>
              <input id="search-input" class="search pixel-search" type="search" placeholder="SEARCH TITLES, AUTHORS..." aria-label="Search Catalog">
            </div>
            
            <div class="genres-wrapper">
              <div class="pills" id="genres-pills" role="tablist"></div>
            </div>
          </div>
          <div class="hero-cover-wrap">
            <div class="hero-cover pixel-cover" id="featured-card">
              <div class="featured-placeholder">BUFFERING FEATURED DATA...</div>
            </div>
          </div>
        </div>
      </header>

      <main class="grid-section">
        <div class="section-header">
          <h2 class="section-title pixel-subtitle" id="catalog-title">POPULAR DATABASE</h2>
          <div class="pagination-controls" id="pagination-controls"></div>
        </div>
        <div class="grid" id="catalog-grid" role="list"></div>
      </main>
    `;

    this.initElements();
    this.bindEvents();
    this.renderGenres();
    this.loadCatalog();
  }

  initElements() {
    this.searchInput = document.getElementById('search-input');
    this.genresPills = document.getElementById('genres-pills');
    this.featuredCard = document.getElementById('featured-card');
    this.catalogGrid = document.getElementById('catalog-grid');
    this.catalogTitle = document.getElementById('catalog-title');
    this.paginationControls = document.getElementById('pagination-controls');
  }

  bindEvents() {
    // Busca com debounce
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.query = e.target.value.trim();
        this.page = 1;
        this.activeGenre = '';
        
        const pills = this.genresPills.querySelectorAll('.pill');
        pills.forEach(p => p.classList.remove('active'));

        this.loadCatalog();
      }, 500);
    });

    // Touch dragging para as pills
    let isDown = false;
    let startX;
    let scrollLeft;
    this.genresPills.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.pageX - this.genresPills.offsetLeft;
      scrollLeft = this.genresPills.scrollLeft;
      this.genresPills.style.cursor = 'grabbing';
    });
    window.addEventListener('pointerup', () => {
      isDown = false;
      if (this.genresPills) this.genresPills.style.cursor = 'grab';
    });
    this.genresPills.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.genresPills.offsetLeft;
      const walk = (x - startX) * 1.5;
      this.genresPills.scrollLeft = scrollLeft - walk;
    });
  }

  renderGenres() {
    this.genresPills.innerHTML = '';
    
    // Pill padrão "ALL"
    const allPill = document.createElement('button');
    allPill.className = 'pill active';
    allPill.textContent = 'ALL';
    allPill.addEventListener('click', () => {
      this.selectGenre(allPill, '');
    });
    this.genresPills.appendChild(allPill);

    this.genres.forEach(g => {
      const b = document.createElement('button');
      b.className = 'pill';
      b.textContent = g.label;
      b.dataset.key = g.key;
      b.addEventListener('click', () => {
        this.selectGenre(b, g.key);
      });
      this.genresPills.appendChild(b);
    });
  }

  selectGenre(pillElement, genreKey) {
    this.genresPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pillElement.classList.add('active');
    
    this.activeGenre = genreKey;
    this.query = '';
    this.searchInput.value = '';
    this.page = 1;
    this.loadCatalog();
  }

  async loadCatalog() {
    this.loading = true;
    this.showSkeletons();
    
    if (this.query) {
      this.catalogTitle.textContent = `QUERY: "${this.query.toUpperCase()}"`;
    } else if (this.activeGenre) {
      const g = this.genres.find(x => x.key === this.activeGenre);
      this.catalogTitle.textContent = g ? `SECTOR: ${g.label}` : 'DATABANK';
    } else {
      this.catalogTitle.textContent = 'POPULAR DATABASE';
    }

    try {
      const searchTerm = this.query || this.activeGenre || 'classics';
      const data = await fetchBooks(searchTerm, this.page);
      
      this.books = data.results || [];
      this.loading = false;
      this.renderBooksGrid();
      this.renderPagination(data.count);

      if (this.page === 1 && this.books.length > 0 && !this.query) {
        this.setFeatured(this.books[0]);
      }
    } catch (err) {
      this.loading = false;
      this.renderErrorState();
    }
  }

  showSkeletons() {
    this.catalogGrid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.className = 'card skeleton';
      this.catalogGrid.appendChild(s);
    }
  }

  renderBooksGrid() {
    this.catalogGrid.innerHTML = '';
    
    if (this.books.length === 0) {
      this.catalogGrid.innerHTML = `
        <div class="empty-state">
          <p>> NO DATA FOUND FOR THIS TERM.</p>
        </div>
      `;
      return;
    }

    this.books.forEach(book => {
      const card = this.createCard(book);
      this.catalogGrid.appendChild(card);
    });
  }

  createCard(book) {
    const c = document.createElement('div');
    c.className = 'card pixel-card';
    c.tabIndex = 0;

    const imgUrl = book.formats['image/jpeg'] || book.formats['image/jpg'] || book.formats['image/png'];
    
    if (imgUrl) {
      const img = document.createElement('img');
      img.className = 'cover';
      img.loading = 'lazy';
      img.alt = `Book cover: ${book.title}`;
      img.src = imgUrl;
      c.appendChild(img);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'css-cover';
      fallback.innerHTML = `<div class="title">${this.escape(book.title)}</div>`;
      c.appendChild(fallback);
    }

    const meta = document.createElement('div');
    meta.className = 'meta';
    
    const authorNames = book.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || 'Unknown Author';
    
    meta.innerHTML = `
      <div class="meta-title">${this.escape(book.title)}</div>
      <div class="meta-sub">> ${this.escape(authorNames)}</div>
    `;
    c.appendChild(meta);

    c.addEventListener('click', () => this.onBookSelect(book));
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.onBookSelect(book);
    });

    return c;
  }

  setFeatured(book) {
    this.featuredBook = book;
    this.featuredCard.innerHTML = '';
    
    const imgUrl = book.formats['image/jpeg'] || book.formats['image/jpg'] || book.formats['image/png'];
    
    let coverHtml = '';
    if (imgUrl) {
      coverHtml = `<img class="cover-img" src="${imgUrl}" alt="Featured: ${this.escape(book.title)}">`;
    } else {
      coverHtml = `<div class="css-cover featured-fallback"><div class="title">${this.escape(book.title)}</div></div>`;
    }

    const authorNames = book.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || 'Unknown Author';

    this.featuredCard.innerHTML = `
      ${coverHtml}
      <div class="featured-overlay">
        <div class="featured-tag">> SYS_PICK</div>
        <h3 class="featured-title">${this.escape(book.title)}</h3>
        <p class="featured-author">by ${this.escape(authorNames)}</p>
        <button class="btn btn-primary btn-pixel" id="btn-read-featured">BOOT_READER</button>
      </div>
    `;

    document.getElementById('btn-read-featured').addEventListener('click', (e) => {
      e.stopPropagation();
      this.onBookSelect(book);
    });
  }

  renderPagination(totalCount) {
    this.paginationControls.innerHTML = '';
    if (!totalCount || totalCount <= 32) return;

    const totalPages = Math.min(Math.ceil(totalCount / 32), 15);
    
    const prevBtn = document.createElement('button');
    prevBtn.className = `btn btn-outline btn-pixel-sm ${this.page === 1 ? 'disabled' : ''}`;
    prevBtn.textContent = 'PREV';
    prevBtn.disabled = this.page === 1;
    prevBtn.addEventListener('click', () => {
      if (this.page > 1) {
        this.page--;
        this.loadCatalog();
      }
    });
    this.paginationControls.appendChild(prevBtn);

    const info = document.createElement('span');
    info.className = 'page-info';
    info.textContent = `SECTOR ${this.page}/${totalPages}`;
    this.paginationControls.appendChild(info);

    const nextBtn = document.createElement('button');
    nextBtn.className = `btn btn-outline btn-pixel-sm ${this.page === totalPages ? 'disabled' : ''}`;
    nextBtn.textContent = 'NEXT';
    nextBtn.disabled = this.page === totalPages;
    nextBtn.addEventListener('click', () => {
      if (this.page < totalPages) {
        this.page++;
        this.loadCatalog();
      }
    });
    this.paginationControls.appendChild(nextBtn);
  }

  renderErrorState() {
    this.catalogGrid.innerHTML = `
      <div class="error-container pixel-card">
        <div class="error-icon">⚡</div>
        <p class="error-message">CONNECTION TIMEOUT: EXTERNAL SERVER NOT RESPONDING.</p>
        <button class="btn btn-primary btn-pixel" id="btn-retry-catalog">REBOOT CONSOLE</button>
      </div>
    `;
    this.featuredCard.innerHTML = `<div class="featured-placeholder error">API_ERROR</div>`;

    document.getElementById('btn-retry-catalog').addEventListener('click', () => {
      this.loadCatalog();
    });
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
