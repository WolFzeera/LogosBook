import { fetchBooks } from '../api.js';

export class Catalog {
  constructor(appContainer, onBookSelect) {
    this.container = appContainer;
    this.onBookSelect = onBookSelect;

    this.books = [];
    this.featuredBook = null;
    this.query = '';
    this.page = 1;
    this.totalCount = 0;
    this.loading = false;
    this.activeGenre = '';

    this.genres = [
      { key: 'filosofia', label: 'FILOSOFIA' },
      { key: 'romance',   label: 'ROMANCE'   },
      { key: 'poesia',    label: 'POESIA'     },
      { key: 'historia',  label: 'HISTÓRIA'   },
      { key: 'contos',    label: 'CONTOS'     },
      { key: 'ciencia',   label: 'CIÊNCIA'    },
      { key: 'drama',     label: 'DRAMA'      },
      { key: 'aventura',  label: 'AVENTURA'   },
      { key: 'misterio',  label: 'MISTÉRIO'   }
    ];

    this.debounceTimeout = null;
  }

  render() {
    this.container.innerHTML = `
      <header class="hero pixel-layout">
        <div class="hero-inner">
          <div class="hero-meta">
            <div class="brand-badge pixel-badge">LOGOS_BOOK.EXE</div>
            <h1 class="title pixel-title">BIBLIOTECA RETRO</h1>
            <p class="tagline">// CLÁSSICOS DO DOMÍNIO PÚBLICO EM ALTA RESOLUÇÃO DE BITS.</p>
            
            <div class="search-wrap">
              <span class="search-icon">></span>
              <input id="search-input" class="search pixel-search" type="search"
                placeholder="BUSCAR TÍTULOS, AUTORES..." aria-label="Buscar Catálogo">
            </div>
            
            <div class="genres-wrapper">
              <div class="pills" id="genres-pills" role="tablist"></div>
            </div>
          </div>
          <div class="hero-cover-wrap">
            <div class="hero-cover pixel-cover" id="featured-card">
              <div class="featured-placeholder">CARREGANDO DADOS EM DESTAQUE...</div>
            </div>
          </div>
        </div>
      </header>

      <main class="grid-section">
        <div class="section-header">
          <h2 class="section-title pixel-subtitle" id="catalog-title">BANCO DE DADOS POPULAR</h2>
          <div class="pagination-controls" id="pagination-controls"></div>
        </div>
        <div class="source-badge" id="source-badge" style="display:none"></div>
        <div class="grid" id="catalog-grid" role="list"></div>
        <div class="pagination-controls-bottom" id="pagination-controls-bottom"></div>
      </main>
    `;

    this.initElements();
    this.bindEvents();
    this.renderGenres();
    this.loadCatalog();
  }

  initElements() {
    this.searchInput      = document.getElementById('search-input');
    this.genresPills      = document.getElementById('genres-pills');
    this.featuredCard     = document.getElementById('featured-card');
    this.catalogGrid      = document.getElementById('catalog-grid');
    this.catalogTitle     = document.getElementById('catalog-title');
    this.sourceBadgeEl    = document.getElementById('source-badge');
    this.paginationControls = document.getElementById('pagination-controls');
    this.paginationControlsBottom = document.getElementById('pagination-controls-bottom');
  }

  bindEvents() {
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.query = e.target.value.trim();
        this.genresPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        this.activeGenre = '';
        this.page = 1;
        this.loadCatalog();
      }, 500);
    });

    let isDown = false, startX, scrollLeft;
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
      this.genresPills.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  renderGenres() {
    this.genresPills.innerHTML = '';

    const allPill = document.createElement('button');
    allPill.className = 'pill active';
    allPill.textContent = 'TODOS';
    allPill.addEventListener('click', () => this.selectGenre(allPill, ''));
    this.genresPills.appendChild(allPill);

    this.genres.forEach(g => {
      const b = document.createElement('button');
      b.className = 'pill';
      b.textContent = g.label;
      b.dataset.key = g.key;
      b.addEventListener('click', () => this.selectGenre(b, g.key));
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
    this.updateTitle();
    this.showSkeletons();
    
    // Rola de volta para o topo da lista de livros ao mudar de página
    const mainSection = document.querySelector('.grid-section');
    if (mainSection && this.page > 1) {
      mainSection.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const searchTerm = this.query || this.activeGenre || '';
      const data = await fetchBooks(searchTerm, this.page);

      this.books = data.results || [];
      this.totalCount = data.totalCount || data.count || 0;

      this.renderBooksGrid();
      this.renderPagination();
      this.updateSourceBadge(data.sources || []);

      if (this.page === 1 && this.books.length > 0 && !this.query) {
        this.setFeatured(this.books[0]);
      }
    } catch (err) {
      console.error('[Catalog] Erro ao carregar:', err);
      this.renderErrorState();
    } finally {
      this.loading = false;
    }
  }

  updateTitle() {
    if (!this.catalogTitle) return;
    if (this.query) {
      this.catalogTitle.textContent = `BUSCA: "${this.query.toUpperCase()}"`;
    } else if (this.activeGenre) {
      const g = this.genres.find(x => x.key === this.activeGenre);
      this.catalogTitle.textContent = g ? `SETOR: ${g.label}` : 'BANCO DE DADOS';
    } else {
      this.catalogTitle.textContent = 'BANCO DE DADOS TOTAL';
    }
  }

  updateSourceBadge(sources) {
    if (!this.sourceBadgeEl) return;
    if (sources && sources.length > 0) {
      this.sourceBadgeEl.textContent = `FONTES ATIVAS: ${sources.join(' + ')}`;
      this.sourceBadgeEl.style.display = 'block';
    } else {
      this.sourceBadgeEl.style.display = 'none';
    }
  }

  showSkeletons() {
    this.catalogGrid.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('div');
      s.className = 'card skeleton skeleton-auto';
      this.catalogGrid.appendChild(s);
    }
  }

  renderBooksGrid() {
    this.catalogGrid.innerHTML = '';

    if (this.books.length === 0) {
      this.catalogGrid.innerHTML = `
        <div class="empty-state">
          <p>> NENHUM DADO ENCONTRADO PARA ESTE TERMO.</p>
          <p style="font-size:8px;margin-top:12px;color:var(--text-muted)">Tente outra busca ou selecione um gênero diferente.</p>
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

    const imgUrl = book.coverUrl;

    if (imgUrl) {
      const img = document.createElement('img');
      img.className = 'cover';
      img.loading = 'lazy';
      img.alt = `Capa: ${book.title}`;
      img.src = imgUrl;
      img.onerror = () => { img.replaceWith(this.makeFallbackCover(book.title)); };
      c.appendChild(img);
    } else {
      c.appendChild(this.makeFallbackCover(book.title));
    }

    const meta = document.createElement('div');
    meta.className = 'meta';
    const authorNames = book.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || 'Autor Desconhecido';
    meta.innerHTML = `
      <div class="meta-source">${this.getSourceLabel(book.source)}</div>
      <div class="meta-title">${this.escape(book.title)}</div>
      <div class="meta-sub">> ${this.escape(authorNames)}</div>
    `;
    c.appendChild(meta);

    c.addEventListener('click', () => this.onBookSelect(book));
    c.addEventListener('keydown', e => { if (e.key === 'Enter') this.onBookSelect(book); });

    return c;
  }

  makeFallbackCover(title) {
    const fallback = document.createElement('div');
    fallback.className = 'css-cover';
    fallback.innerHTML = `<div class="title">${this.escape(title)}</div>`;
    return fallback;
  }

  getSourceLabel(source) {
    return { gutendex: '[GUTENBERG]', openlibrary: '[OPEN LIB]', archive: '[ARCHIVE]' }[source] || '[???]';
  }

  setFeatured(book) {
    this.featuredBook = book;
    this.featuredCard.innerHTML = '';

    const imgUrl = book.coverUrl;
    let coverHtml = imgUrl
      ? `<img class="cover-img" src="${imgUrl}" alt="Em Destaque: ${this.escape(book.title)}" onerror="this.style.display='none'">`
      : `<div class="css-cover featured-fallback"><div class="title">${this.escape(book.title)}</div></div>`;

    const authorNames = book.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || 'Autor Desconhecido';

    this.featuredCard.innerHTML = `
      ${coverHtml}
      <div class="featured-overlay">
        <div class="featured-tag">> SELEÇÃO DO SISTEMA ${this.getSourceLabel(book.source)}</div>
        <h3 class="featured-title">${this.escape(book.title)}</h3>
        <p class="featured-author">por ${this.escape(authorNames)}</p>
        <button class="btn btn-primary btn-pixel" id="btn-read-featured">INICIAR LEITURA</button>
      </div>
    `;

    document.getElementById('btn-read-featured')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onBookSelect(book);
    });
  }

  renderPagination() {
    this.paginationControls.innerHTML = '';
    this.paginationControlsBottom.innerHTML = '';

    if (!this.totalCount || (this.totalCount <= this.books.length && this.page === 1)) {
      return;
    }

    const booksPerPage = 30; // Média de livros por página das APIs combinadas
    const totalPages = Math.max(1, Math.ceil(this.totalCount / booksPerPage));

    const createControlsHTML = (container) => {
      container.innerHTML = '';

      const prevBtn = document.createElement('button');
      prevBtn.className = `btn btn-outline btn-pixel-sm ${this.page === 1 ? 'disabled' : ''}`;
      prevBtn.textContent = 'ANTERIOR';
      prevBtn.disabled = this.page === 1;
      prevBtn.addEventListener('click', () => {
        if (this.page > 1) {
          this.page--;
          this.loadCatalog();
        }
      });
      container.appendChild(prevBtn);

      const info = document.createElement('span');
      info.className = 'page-info';
      info.textContent = `SETOR ${this.page}/${totalPages}`;
      container.appendChild(info);

      const nextBtn = document.createElement('button');
      nextBtn.className = `btn btn-outline btn-pixel-sm ${this.page === totalPages ? 'disabled' : ''}`;
      nextBtn.textContent = 'PRÓXIMO';
      nextBtn.disabled = this.page === totalPages;
      nextBtn.addEventListener('click', () => {
        if (this.page < totalPages) {
          this.page++;
          this.loadCatalog();
        }
      });
      container.appendChild(nextBtn);
    };

    createControlsHTML(this.paginationControls);
    createControlsHTML(this.paginationControlsBottom);
  }

  renderErrorState() {
    this.catalogGrid.innerHTML = `
      <div class="error-container pixel-card">
        <div class="error-icon">⚡</div>
        <p class="error-message">TIMEOUT DE CONEXÃO: SERVIDOR EXTERNO SEM RESPOSTA.</p>
        <button class="btn btn-primary btn-pixel" id="btn-retry-catalog">REINICIAR CONSOLE</button>
      </div>
    `;
    this.featuredCard.innerHTML = `<div class="featured-placeholder error">ERRO_DE_API</div>`;
    document.getElementById('btn-retry-catalog')?.addEventListener('click', () => this.loadCatalog());
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
