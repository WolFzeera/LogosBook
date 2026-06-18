/**
 * ============================================================
 * API SERVICE UNIFICADO — LOGOS BOOK
 * Agrega resultados de 3 fontes de domínio público:
 *   1. Gutendex (Project Gutenberg) — 70.000+ livros, SEM FILTROS
 *   2. Open Library (archive.org)   — milhões de títulos
 *   3. Internet Archive             — coleções digitalizadas
 * ============================================================
 */

const GUTENDEX_API    = 'https://gutendex.com/books/';
const OPENLIBRARY_API = 'https://openlibrary.org';
const ARCHIVE_API     = 'https://archive.org/advancedsearch.php';

// ─────────────────────────────────────────────────────────────
// MOCKS — Fallback quando todas as APIs falham
// ─────────────────────────────────────────────────────────────
const MOCK_BOOKS = [
  {
    id: 'gutendex-84',
    title: 'Frankenstein; Or, The Modern Prometheus',
    authors: [{ name: 'Mary Wollstonecraft Shelley' }],
    coverUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
    formats: { 'text/plain; charset=utf-8': 'mock://frankenstein' },
    subjects: ['Horror', 'Science Fiction', 'Gothic'],
    source: 'gutendex',
    download_count: 5000
  },
  {
    id: 'gutendex-345',
    title: 'Dracula',
    authors: [{ name: 'Bram Stoker' }],
    coverUrl: 'https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg',
    formats: { 'text/plain; charset=utf-8': 'mock://dracula' },
    subjects: ['Vampires', 'Horror', 'Gothic'],
    source: 'gutendex',
    download_count: 4500
  },
  {
    id: 'gutendex-11',
    title: "Alice's Adventures in Wonderland",
    authors: [{ name: 'Lewis Carroll' }],
    coverUrl: 'https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg',
    formats: { 'text/plain; charset=utf-8': 'mock://alice' },
    subjects: ['Fantasy', 'Children', 'Classics'],
    source: 'gutendex',
    download_count: 6000
  }
];

const MOCK_TEXTS = {
  frankenstein: `Frankenstein; or, The Modern Prometheus.
By Mary Wollstonecraft Shelley.

Letter 1. To Mrs. Saville, England.
St. Petersburgh, Dec. 11th, 17—.

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.`,

  dracula: `Dracula.
By Bram Stoker.

CHAPTER I. Jonathan Harker's Journal.

3 May. Bistritz.—Left Munich at 8:30 P.M. on 1st May, arriving at Vienna early next morning. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.

The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.`,

  alice: `Alice's Adventures in Wonderland.
By Lewis Carroll.

CHAPTER I. Down the Rabbit-Hole.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.`
};

// ─────────────────────────────────────────────────────────────
// NORMALIZADORES
// ─────────────────────────────────────────────────────────────

function normalizeGutendex(book) {
  const coverUrl =
    book.formats?.['image/jpeg'] ||
    book.formats?.['image/jpg']  ||
    book.formats?.['image/png']  || null;

  return {
    id: `gutendex-${book.id}`,
    _gutendexId: book.id,
    title: book.title,
    authors: book.authors || [],
    coverUrl,
    formats: book.formats || {},
    subjects: book.subjects || [],
    source: 'gutendex',
    download_count: book.download_count || 0
  };
}

function normalizeOpenLibrary(doc) {
  const coverId = doc.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const authors = (doc.author_name || []).map(name => ({ name }));
  const olKey = doc.key;
  const iaId = doc.ia && doc.ia[0];

  return {
    id: `openlibrary-${olKey?.replace(/\//g, '_')}`,
    _olKey: olKey,
    _iaId: iaId || null,
    title: doc.title,
    authors,
    coverUrl,
    formats: {
      'text/html': iaId
        ? `https://archive.org/stream/${iaId}`
        : `${OPENLIBRARY_API}${olKey}`,
      '_readUrl': iaId
        ? `https://archive.org/stream/${iaId}`
        : `${OPENLIBRARY_API}${olKey}`
    },
    subjects: doc.subject ? doc.subject.slice(0, 5) : [],
    source: 'openlibrary',
    download_count: doc.edition_count || 1
  };
}

function normalizeArchive(item) {
  const identifier = item.identifier;
  const coverUrl = `https://archive.org/services/img/${identifier}`;
  const authors = item.creator
    ? (Array.isArray(item.creator) ? item.creator : [item.creator]).map(name => ({ name }))
    : [];

  return {
    id: `archive-${identifier}`,
    _iaId: identifier,
    title: item.title || 'Título Desconhecido',
    authors,
    coverUrl,
    formats: {
      'text/plain': `https://archive.org/stream/${identifier}/${identifier}_djvu.txt`,
      'text/html':  `https://archive.org/stream/${identifier}`,
      '_readUrl':   `https://archive.org/stream/${identifier}`
    },
    subjects: item.subject
      ? (Array.isArray(item.subject) ? item.subject.slice(0, 5) : [item.subject])
      : [],
    source: 'archive',
    download_count: parseInt(item.downloads || 0)
  };
}

// ─────────────────────────────────────────────────────────────
// BUSCADORES INDIVIDUAIS
// ─────────────────────────────────────────────────────────────

/**
 * Gutendex — TODOS os 70k+ livros, SEM filtro de download mínimo.
 * Ordena por popularidade por padrão.
 */
async function fetchFromGutendex(query, page) {
  let url;
  if (query) {
    url = `${GUTENDEX_API}?page=${page}&search=${encodeURIComponent(query)}`;
  } else {
    // Sem query: busca o catálogo inteiro ordenado por popularidade
    url = `${GUTENDEX_API}?page=${page}&sort=popular`;
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Gutendex HTTP ${res.status}`);
  const data = await res.json();

  const results = (data.results || []).map(normalizeGutendex);
  const totalCount = data.count || 0;
  const hasMore = !!data.next; // Gutendex retorna "next" URL enquanto houver mais páginas

  return { results, totalCount, hasMore };
}

async function fetchFromOpenLibrary(query, page) {
  const q = query || 'classics public domain';
  const offset = (page - 1) * 10;
  const url = `${OPENLIBRARY_API}/search.json?q=${encodeURIComponent(q)}&fields=key,title,author_name,cover_i,subject,edition_count,ia&limit=10&offset=${offset}&has_fulltext=true`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'LogosBook/1.0 (github.com/WolFzeera/LogosBook)' },
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`Open Library HTTP ${res.status}`);
  const data = await res.json();

  const results = (data.docs || [])
    .filter(d => d.title)
    .map(normalizeOpenLibrary);

  return { results, totalCount: data.numFound || 0, hasMore: (offset + 10) < (data.numFound || 0) };
}

async function fetchFromArchive(query, page) {
  const q = query
    ? `(${query}) AND mediatype:texts AND !subject:(periodical)`
    : `mediatype:texts AND subject:(literature OR romance OR novela OR poesia) AND !subject:(periodical)`;

  const rows  = 10;
  const start = (page - 1) * rows;
  const url   = `${ARCHIVE_API}?q=${encodeURIComponent(q)}&fl[]=identifier,title,creator,subject,downloads&sort[]=downloads+desc&rows=${rows}&start=${start}&output=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Archive HTTP ${res.status}`);
  const data = await res.json();

  const docs  = (data.response?.docs) || [];
  const total = data.response?.numFound || 0;
  const results = docs.filter(i => i.title && i.identifier).map(normalizeArchive);

  return { results, totalCount: total, hasMore: (start + rows) < total };
}

// ─────────────────────────────────────────────────────────────
// BUSCA UNIFICADA — usada pelo Catalog
// ─────────────────────────────────────────────────────────────

/**
 * Busca em paralelo nas 3 APIs e retorna resultados intercalados.
 * Retorna: { results[], totalCount, hasMore, sources[] }
 */
export async function fetchBooks(query = '', page = 1) {
  const [gutRes, olRes, archRes] = await Promise.allSettled([
    fetchFromGutendex(query, page),
    fetchFromOpenLibrary(query, page),
    fetchFromArchive(query, page)
  ]);

  const gut  = gutRes.status  === 'fulfilled' ? gutRes.value  : { results: [], totalCount: 0, hasMore: false };
  const ol   = olRes.status   === 'fulfilled' ? olRes.value   : { results: [], totalCount: 0, hasMore: false };
  const arch = archRes.status === 'fulfilled' ? archRes.value : { results: [], totalCount: 0, hasMore: false };

  if (gutRes.status  === 'rejected') console.warn('[Gutendex] Falhou:', gutRes.reason?.message);
  if (olRes.status   === 'rejected') console.warn('[Open Library] Falhou:', olRes.reason?.message);
  if (archRes.status === 'rejected') console.warn('[Archive] Falhou:', archRes.reason?.message);

  // Intercala para variedade visual
  const combined = interleave(gut.results, ol.results, arch.results);

  // Deduplicação por título
  const seen = new Set();
  const unique = combined.filter(book => {
    const key = book.title.trim().toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length === 0) {
    console.warn('[API] Todas as fontes falharam. Usando mocks locais.');
    return { results: MOCK_BOOKS, totalCount: MOCK_BOOKS.length, hasMore: false, sources: [] };
  }

  // Total principal vem do Gutendex (mais completo)
  const totalCount = gut.totalCount || (ol.totalCount + arch.totalCount);
  const hasMore    = gut.hasMore || ol.hasMore || arch.hasMore;

  const sources = [
    gut.results.length  > 0 ? 'Gutenberg'    : null,
    ol.results.length   > 0 ? 'Open Library' : null,
    arch.results.length > 0 ? 'Archive.org'  : null
  ].filter(Boolean);

  return { results: unique, totalCount, hasMore, sources };
}

function interleave(...arrays) {
  const result = [];
  const maxLen = Math.max(...arrays.map(a => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (arr[i] !== undefined) result.push(arr[i]);
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// BUSCA POR ID (para reload direto via hash)
// ─────────────────────────────────────────────────────────────

export async function fetchBookById(compositeId) {
  if (!compositeId) return MOCK_BOOKS[0];

  const mock = MOCK_BOOKS.find(b => b.id === compositeId);
  if (mock) return mock;

  if (compositeId.startsWith('gutendex-')) {
    const numId = compositeId.replace('gutendex-', '');
    try {
      const res = await fetch(`${GUTENDEX_API}${numId}`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return normalizeGutendex(await res.json());
    } catch (e) { console.warn('fetchBookById Gutendex falhou', e); }
  }

  if (compositeId.startsWith('openlibrary-')) {
    const olKey = compositeId.replace('openlibrary-', '').replace(/_/g, '/');
    try {
      const res = await fetch(`${OPENLIBRARY_API}${olKey}.json`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        const doc = await res.json();
        return {
          id: compositeId,
          title: doc.title,
          authors: (doc.authors || []).map(a => ({ name: a.key })),
          coverUrl: null,
          formats: { 'text/html': `${OPENLIBRARY_API}${olKey}` },
          subjects: (doc.subjects || []).slice(0, 5),
          source: 'openlibrary',
          download_count: 1
        };
      }
    } catch (e) { console.warn('fetchBookById OL falhou', e); }
  }

  if (compositeId.startsWith('archive-')) {
    const iaId = compositeId.replace('archive-', '');
    try {
      const res = await fetch(`https://archive.org/metadata/${iaId}`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        const meta = await res.json();
        return normalizeArchive({ identifier: iaId, ...meta.metadata });
      }
    } catch (e) { console.warn('fetchBookById Archive falhou', e); }
  }

  return MOCK_BOOKS[0];
}

// ─────────────────────────────────────────────────────────────
// CONTEÚDO DO LIVRO (TEXTO)
// ─────────────────────────────────────────────────────────────

export async function fetchBookContent(formats) {
  const candidates = [
    formats['text/plain; charset=utf-8'],
    formats['text/plain'],
    formats['text/plain; charset=us-ascii'],
    formats['text/html; charset=utf-8'],
    formats['text/html']
  ].filter(Boolean);

  if (candidates.length === 0) throw new Error('Nenhum formato de leitura compatível disponível.');

  // Mocks internos
  for (const url of candidates) {
    if (url?.startsWith('mock://')) {
      const key = url.replace('mock://', '');
      if (MOCK_TEXTS[key]) return MOCK_TEXTS[key];
    }
  }

  // Proxies anti-CORS
  const proxies = [
    (url) => url,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://r.jina.ai/${url}`
  ];

  for (const url of candidates) {
    if (!url || url.startsWith('mock://') || url.includes('mode/2up') || url.includes('openlibrary.org/works/')) continue;

    for (const proxyFn of proxies) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 9000);
        const response = await fetch(proxyFn(url), { signal: controller.signal });
        clearTimeout(tid);

        if (!response.ok) continue;
        const text = await response.text();
        if (text && text.trim().length > 500) return cleanGutenbergText(text);
      } catch (err) {
        console.warn(`Proxy falhou:`, err?.message);
      }
    }
  }

  console.warn('Todos os proxies falharam. Usando demonstração local.');
  return MOCK_TEXTS.frankenstein;
}

function cleanGutenbergText(text) {
  let clean = text;

  if (clean.includes('<html') || clean.includes('<body')) {
    clean = clean
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  }

  const startIdx = clean.search(/\*\*\* START OF THE PROJECT GUTENBERG|### START OF THE PROJECT/i);
  if (startIdx !== -1) {
    const endHdr = clean.indexOf('***', startIdx + 30);
    clean = endHdr !== -1 ? clean.slice(endHdr + 3) : clean.slice(startIdx);
  }

  const endIdx = clean.search(/\*\*\* END OF THE PROJECT GUTENBERG|### END OF THE PROJECT/i);
  if (endIdx !== -1) clean = clean.slice(0, endIdx);

  return clean.trim();
}

// ─────────────────────────────────────────────────────────────
// TRADUÇÃO — MyMemory API
// ─────────────────────────────────────────────────────────────

export async function translateTextToPt(text) {
  if (!text?.trim()) return '';

  const paragraphs = text.split('\n\n');

  const translateChunk = async (chunk) => {
    const trimmed = chunk.trim();
    if (!trimmed) return '';
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|pt`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.responseData?.translatedText) return data.responseData.translatedText;
      }
    } catch (e) { console.error('Erro de tradução:', e); }
    return trimmed;
  };

  const translateParagraph = async (para) => {
    const trimmedPara = para.trim();
    if (!trimmedPara) return '';

    // If paragraph is within MyMemory limits, translate as single piece
    if (trimmedPara.length <= 800) {
      return await translateChunk(trimmedPara);
    }

    // Otherwise split paragraph into chunks of ~800 chars
    const chunkSize = 800;
    const chunks = trimmedPara.match(new RegExp(`.{1,${chunkSize}}(\\s|$)|.{1,${chunkSize}}`, 'g')) || [trimmedPara];
    const chunkResults = await Promise.all(chunks.map(translateChunk));
    return chunkResults.join(' ');
  };

  try {
    const results = await Promise.all(paragraphs.map(translateParagraph));
    return results.join('\n\n');
  } catch (err) {
    console.error('Falha geral de tradução:', err);
    return text;
  }
}
