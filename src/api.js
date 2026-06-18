/**
 * ============================================================
 * API SERVICE UNIFICADO — LOGOS BOOK
 * Agrega resultados de 3 fontes de domínio público:
 *   1. Gutendex (Project Gutenberg) — 70k+ livros com texto
 *   2. Open Library (archive.org)  — milhões de títulos
 *   3. Internet Archive            — coleções digitalizadas
 * ============================================================
 */

const GUTENDEX_API   = 'https://gutendex.com/books/';
const OPENLIBRARY_API = 'https://openlibrary.org';
const ARCHIVE_API    = 'https://archive.org/advancedsearch.php';

// Mínimo de downloads do Gutendex para garantir livro completo
const MIN_GUTENDEX_DOWNLOADS = 50;

// ─────────────────────────────────────────────────────────────
// MOCK BOOKS — Fallback completo quando tudo falha
// ─────────────────────────────────────────────────────────────
const MOCK_BOOKS = [
  {
    id: 'gutendex-99901',
    title: 'Frankenstein; Or, The Modern Prometheus',
    authors: [{ name: 'Mary Wollstonecraft Shelley' }],
    coverUrl: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
    formats: { 'text/plain; charset=utf-8': 'mock://frankenstein' },
    subjects: ['Horror', 'Science Fiction', 'Gothic'],
    source: 'gutendex',
    download_count: 5000
  },
  {
    id: 'gutendex-99902',
    title: 'Dracula',
    authors: [{ name: 'Bram Stoker' }],
    coverUrl: 'https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg',
    formats: { 'text/plain; charset=utf-8': 'mock://dracula' },
    subjects: ['Vampires', 'Horror', 'Gothic'],
    source: 'gutendex',
    download_count: 4500
  },
  {
    id: 'gutendex-99903',
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

Letter 1.
To Mrs. Saville, England.
St. Petersburgh, Dec. 11th, 17—.

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.

I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour.`,

  dracula: `Dracula.
By Bram Stoker.

CHAPTER I.
Jonathan Harker's Journal.

3 May. Bistritz.—Left Munich at 8:30 P.M. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.

The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.

We left in pretty good time, and came after nightfall to Klausenburg. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but made me thirsty.`,

  alice: `Alice's Adventures in Wonderland.
By Lewis Carroll.

CHAPTER I.
Down the Rabbit-Hole.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet.`
};

// ─────────────────────────────────────────────────────────────
// NORMALIZADORES — Convertem cada API para o formato padrão
// ─────────────────────────────────────────────────────────────

/**
 * Normaliza um resultado do Gutendex para o formato unificado.
 */
function normalizeGutendex(book) {
  const coverUrl =
    book.formats?.['image/jpeg'] ||
    book.formats?.['image/jpg'] ||
    book.formats?.['image/png'] || null;

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

/**
 * Normaliza um resultado do Open Library para o formato unificado.
 */
function normalizeOpenLibrary(doc) {
  const coverId = doc.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const authors = (doc.author_name || []).map(name => ({ name }));
  const olKey = doc.key; // ex: /works/OL82563W

  // Constrói URL de leitura no Internet Archive se disponível
  const iaId = doc.ia && doc.ia[0];
  const readUrl = iaId
    ? `https://archive.org/stream/${iaId}`
    : `https://openlibrary.org${olKey}`;

  return {
    id: `openlibrary-${olKey?.replace(/\//g, '_')}`,
    _olKey: olKey,
    _iaId: iaId || null,
    title: doc.title,
    authors,
    coverUrl,
    formats: {
      // URL de texto via Internet Archive se disponível
      'text/html': iaId
        ? `https://archive.org/stream/${iaId}#page/n0/mode/2up`
        : `${OPENLIBRARY_API}${olKey}`,
      '_readUrl': readUrl
    },
    subjects: doc.subject ? doc.subject.slice(0, 5) : [],
    source: 'openlibrary',
    download_count: doc.edition_count || 1
  };
}

/**
 * Normaliza um resultado do Internet Archive para o formato unificado.
 */
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
      'text/html': `https://archive.org/stream/${identifier}`,
      '_readUrl': `https://archive.org/stream/${identifier}`
    },
    subjects: item.subject
      ? (Array.isArray(item.subject) ? item.subject.slice(0, 5) : [item.subject])
      : [],
    source: 'archive',
    download_count: parseInt(item.downloads || 0)
  };
}

// ─────────────────────────────────────────────────────────────
// BUSCA POR API INDIVIDUAL
// ─────────────────────────────────────────────────────────────

async function fetchFromGutendex(query, page) {
  const url = query && query !== 'classicos'
    ? `${GUTENDEX_API}?page=${page}&sort=popular&search=${encodeURIComponent(query)}`
    : `${GUTENDEX_API}?page=${page}&sort=popular`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('Gutendex indisponível');
  const data = await res.json();

  return (data.results || [])
    .filter(b => (b.download_count || 0) >= MIN_GUTENDEX_DOWNLOADS)
    .map(normalizeGutendex);
}

async function fetchFromOpenLibrary(query, page) {
  const q = query && query !== 'classicos' ? query : 'classics public domain';
  const offset = (page - 1) * 10;

  const url = `${OPENLIBRARY_API}/search.json?q=${encodeURIComponent(q)}&fields=key,title,author_name,cover_i,subject,edition_count,ia,public_scan_b&limit=10&offset=${offset}&has_fulltext=true`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'LogosBook/1.0 (github.com/WolFzeera/LogosBook)' },
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error('Open Library indisponível');
  const data = await res.json();

  return (data.docs || [])
    .filter(d => d.title && d.edition_count && d.edition_count >= 2)
    .map(normalizeOpenLibrary);
}

async function fetchFromArchive(query, page) {
  const q = query && query !== 'classicos'
    ? `(${encodeURIComponent(query)}) AND mediatype:texts AND licenseurl:(http://creativecommons.org/licenses/publicdomain OR "") AND language:(Portuguese OR pt) AND !subject:(periodical)`
    : 'mediatype:texts AND language:(Portuguese OR pt) AND subject:(literature OR romance OR novela OR poesia) AND !subject:(periodical)';

  const rows = 10;
  const start = (page - 1) * rows;
  const url = `${ARCHIVE_API}?q=${q}&fl[]=identifier,title,creator,subject,downloads&sort[]=downloads+desc&rows=${rows}&start=${start}&output=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('Internet Archive indisponível');
  const data = await res.json();

  return ((data.response && data.response.docs) || [])
    .filter(item => item.title && item.identifier)
    .map(normalizeArchive);
}

// ─────────────────────────────────────────────────────────────
// BUSCA UNIFICADA PÚBLICA
// ─────────────────────────────────────────────────────────────

/**
 * Busca livros em todas as fontes disponíveis em paralelo.
 * Retorna resultados normalizados, deduplicados por título.
 */
export async function fetchBooks(query = '', page = 1) {
  // Executa as 3 buscas em paralelo; captura falhas individuais sem quebrar tudo
  const [gutendexResult, olResult, archiveResult] = await Promise.allSettled([
    fetchFromGutendex(query, page),
    fetchFromOpenLibrary(query, page),
    fetchFromArchive(query, page)
  ]);

  const gutendex = gutendexResult.status === 'fulfilled' ? gutendexResult.value : [];
  const ol = olResult.status === 'fulfilled' ? olResult.value : [];
  const archive = archiveResult.status === 'fulfilled' ? archiveResult.value : [];

  if (gutendexResult.status === 'rejected') console.warn('[Gutendex] Falhou:', gutendexResult.reason);
  if (olResult.status === 'rejected') console.warn('[Open Library] Falhou:', olResult.reason);
  if (archiveResult.status === 'rejected') console.warn('[Archive.org] Falhou:', archiveResult.reason);

  // Intercala resultados das 3 fontes para variedade visual
  const combined = interleave(gutendex, ol, archive);

  // Remove duplicatas por título normalizado
  const seen = new Set();
  const unique = combined.filter(book => {
    const key = book.title.trim().toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Se nenhuma API respondeu, usa os mocks de fallback
  if (unique.length === 0) {
    console.warn('[API] Todas as fontes falharam. Usando mocks locais.');
    return { count: MOCK_BOOKS.length, results: MOCK_BOOKS, sources: [] };
  }

  const sources = [
    gutendex.length > 0 ? 'Gutenberg' : null,
    ol.length > 0 ? 'Open Library' : null,
    archive.length > 0 ? 'Archive.org' : null
  ].filter(Boolean);

  return { count: unique.length, results: unique, sources };
}

/**
 * Intercala arrays de forma equilibrada para misturar fontes.
 */
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
// BUSCA DE LIVRO POR ID
// ─────────────────────────────────────────────────────────────

export async function fetchBookById(compositeId) {
  if (!compositeId) return null;

  // Verifica nos mocks
  const mock = MOCK_BOOKS.find(b => b.id === compositeId);
  if (mock) return mock;

  // Detecta a origem pelo prefixo do ID
  if (compositeId.startsWith('gutendex-')) {
    const numId = compositeId.replace('gutendex-', '');
    try {
      const res = await fetch(`${GUTENDEX_API}${numId}`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        return normalizeGutendex(data);
      }
    } catch (e) { console.warn('Erro ao buscar livro Gutendex por ID', e); }
  }

  if (compositeId.startsWith('openlibrary-')) {
    const olKey = compositeId.replace('openlibrary-', '').replace(/_/g, '/');
    try {
      const res = await fetch(`${OPENLIBRARY_API}${olKey}.json`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const doc = await res.json();
        // Normaliza o formato de volta para o padrão
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
    } catch (e) { console.warn('Erro ao buscar livro Open Library por ID', e); }
  }

  if (compositeId.startsWith('archive-')) {
    const iaId = compositeId.replace('archive-', '');
    try {
      const res = await fetch(`https://archive.org/metadata/${iaId}`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const meta = await res.json();
        return normalizeArchive({ identifier: iaId, ...meta.metadata });
      }
    } catch (e) { console.warn('Erro ao buscar livro Archive.org por ID', e); }
  }

  // Fallback para o primeiro mock
  return MOCK_BOOKS[0];
}

// ─────────────────────────────────────────────────────────────
// DOWNLOAD DO CONTEÚDO (TEXTO DO LIVRO)
// ─────────────────────────────────────────────────────────────

/**
 * Busca o conteúdo textual de um livro.
 * Suporta mocks internos, Gutendex, Open Library e Internet Archive.
 */
export async function fetchBookContent(formats) {
  const candidates = [
    formats['text/plain; charset=utf-8'],
    formats['text/plain'],
    formats['text/plain; charset=us-ascii'],
    formats['text/html; charset=utf-8'],
    formats['text/html']
  ].filter(Boolean);

  if (candidates.length === 0) {
    throw new Error('Nenhum formato de leitura compatível disponível.');
  }

  // Mock interno
  for (const url of candidates) {
    if (url && url.startsWith('mock://')) {
      const key = url.replace('mock://', '');
      if (MOCK_TEXTS[key]) return MOCK_TEXTS[key];
    }
  }

  // URLs reais com fallback via proxy anti-CORS
  const proxies = [
    (url) => url,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://r.jina.ai/${url}`
  ];

  for (const url of candidates) {
    if (!url || url.startsWith('mock://') || url.startsWith('https://openlibrary.org/works/') || url.includes('mode/2up')) continue;

    for (const proxyFn of proxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(proxyFn(url), { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) continue;
        const text = await response.text();
        if (text && text.trim().length > 500) {
          return cleanGutenbergText(text);
        }
      } catch (err) {
        console.warn(`Falha ao carregar conteúdo:`, err?.message || err);
      }
    }
  }

  console.warn('Falha geral. Carregando demonstração local.');
  return MOCK_TEXTS.frankenstein;
}

/**
 * Limpa cabeçalhos/rodapés do Project Gutenberg.
 */
function cleanGutenbergText(text) {
  let clean = text;

  // Remove HTML tags básico
  if (clean.includes('<html') || clean.includes('<body')) {
    clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<[^>]+>/g, ' ');
    clean = clean.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  }

  // Remove cabeçalho Gutenberg
  const startIndex = clean.search(/\*\*\* START OF THE PROJECT GUTENBERG|### START OF THE PROJECT/i);
  if (startIndex !== -1) {
    const endHeaderIndex = clean.indexOf('***', startIndex + 30);
    if (endHeaderIndex !== -1) {
      clean = clean.slice(endHeaderIndex + 3);
    } else {
      clean = clean.slice(startIndex);
    }
  }

  // Remove rodapé Gutenberg
  const endIndex = clean.search(/\*\*\* END OF THE PROJECT GUTENBERG|### END OF THE PROJECT/i);
  if (endIndex !== -1) {
    clean = clean.slice(0, endIndex);
  }

  return clean.trim();
}

// ─────────────────────────────────────────────────────────────
// TRADUÇÃO — MyMemory API (PT)
// ─────────────────────────────────────────────────────────────

/**
 * Traduz texto para português usando a MyMemory Translation API.
 * Divide em blocos menores (max 800 chars) para respeitar os limites da API gratuita.
 */
export async function translateTextToPt(text) {
  if (!text || text.trim() === '') return '';

  const chunkSize = 800;
  const regex = new RegExp(`.{1,${chunkSize}}(\\s|$)|.{1,${chunkSize}}`, 'g');
  const chunks = text.match(regex) || [text];

  const translateChunk = async (chunk) => {
    const trimmed = chunk.trim();
    if (!trimmed) return '';
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|pt`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.responseData?.translatedText) {
          return data.responseData.translatedText;
        }
      }
    } catch (e) {
      console.error('Erro de tradução no bloco:', e);
    }
    return trimmed;
  };

  try {
    const results = await Promise.all(chunks.map(chunk => translateChunk(chunk)));
    return results.join(' ');
  } catch (err) {
    console.error('Falha geral de tradução:', err);
    return text;
  }
}
