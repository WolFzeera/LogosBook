const GUTENDEX_API = 'https://gutendex.com/books/';

// Livros Mockados Locais para fallback de Rate Limit / Sem Conexão
const MOCK_BOOKS = [
  {
    id: 99901,
    title: "Frankenstein; Or, The Modern Prometheus",
    authors: [{ name: "Mary Wollstonecraft Shelley" }],
    formats: {
      "image/jpeg": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
      "text/plain; charset=utf-8": "mock://frankenstein"
    },
    subjects: ["Horror", "Science Fiction", "Gothic"],
    languages: ["en"]
  },
  {
    id: 99902,
    title: "Dracula",
    authors: [{ name: "Bram Stoker" }],
    formats: {
      "image/jpeg": "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",
      "text/plain; charset=utf-8": "mock://dracula"
    },
    subjects: ["Vampires", "Horror", "Gothic"],
    languages: ["en"]
  },
  {
    id: 99903,
    title: "Alice's Adventures in Wonderland",
    authors: [{ name: "Lewis Carroll" }],
    formats: {
      "image/jpeg": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",
      "text/plain; charset=utf-8": "mock://alice"
    },
    subjects: ["Fantasy", "Children", "Classics"],
    languages: ["en"]
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

I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.

Its productions and features may be without example, as the phenomena of the heavenly bodies undoubtedly are in those undiscovered solitudes. What may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their seeming eccentricities consistent for ever.

I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to vanquish all fear of danger or death and to induce me to commence this laborious voyage with the joy a child feels when he embarks in a little boat, with his holiday mates, on an expedition of discovery up his native river.`,

  dracula: `Dracula.
By Bram Stoker.

CHAPTER I.
Jonathan Harker's Journal.

3 May. Bistritz.—Left Munich at 8:30 P.M. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go far from the station, as we had arrived late and would start as near the correct time as possible.

The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.

We left in pretty good time, and came after nightfall to Klausenburg. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but made me thirsty. (Mem., get recipe for Mina. I asked the waiter, and he said it was called "paprika hendl," and that, as it was a national dish, I should be able to get it anywhere along the Carpathians.)

I found my smattering of German very useful here; indeed, I don't know how I should be able to get on without it.

Having had some time at my disposal when in London, I had visited the British Museum, and made search among the books and maps in the library regarding Transylvania; it had struck me that some foreknowledge of the country could not fail to have some importance in dealing with a nobleman of that country.`,

  alice: `Alice's Adventures in Wonderland.
By Lewis Carroll.

CHAPTER I.
Down the Rabbit-Hole.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.`
};

/**
 * Busca os metadados de um livro específico por ID.
 * Tenta conectar com a API e cai no mock local caso falhe.
 */
export async function fetchBookById(id) {
  const numericId = parseInt(id, 10);
  
  // Tenta encontrar nos mocks primeiro se for ID de mock
  const mockBook = MOCK_BOOKS.find(b => b.id === numericId);
  if (mockBook) return mockBook;

  try {
    const response = await fetch(`${GUTENDEX_API}${id}`);
    if (!response.ok) throw new Error('Erro na resposta do servidor.');
    return await response.json();
  } catch (err) {
    console.warn(`Erro ao carregar livro ${id} da API, tentando mocks.`, err);
    // Fallback: se o ID for parecido com os mocks ou se falhar tudo
    if (mockBook) return mockBook;
    // Se falhar tudo, retorna o primeiro mock
    return MOCK_BOOKS[0];
  }
}

/**
 * Busca livros na API Gutendex.
 * Inclui tratamento de erro robusto e fallback para Mock JSON local.
 */
export async function fetchBooks(query = '', page = 1) {
  try {
    let url = `${GUTENDEX_API}?page=${page}`;
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Limite de requisições excedido ou API indisponível.');
    const data = await response.json();
    
    // Se a API retornar sucesso mas sem resultados e tivermos buscas pelos mocks, adicionamos os mocks
    if (data.results && data.results.length === 0 && query) {
      const filteredMocks = MOCK_BOOKS.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) || 
        b.authors.some(a => a.name.toLowerCase().includes(query.toLowerCase()))
      );
      if (filteredMocks.length > 0) {
        return { count: filteredMocks.length, results: filteredMocks };
      }
    }
    
    return data;
  } catch (err) {
    console.warn('Falha na API externa de livros. Utilizando Mock data de fallback local.', err);
    
    // Filtra mocks locais com base na busca
    let filtered = MOCK_BOOKS;
    if (query) {
      filtered = MOCK_BOOKS.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) || 
        b.authors.some(a => a.name.toLowerCase().includes(query.toLowerCase())) ||
        b.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    return {
      count: filtered.length,
      results: filtered
    };
  }
}

/**
 * Busca o conteúdo textual de um livro Gutenberg.
 * Tenta fazer o download direto das opções de formatos de texto/html e
 * utiliza fallbacks com proxies públicos e mocks locais para contornar problemas de CORS.
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

  // Se for uma URL de mock interno, carrega o texto mockado
  for (const url of candidates) {
    if (url.startsWith('mock://')) {
      const key = url.replace('mock://', '');
      if (MOCK_TEXTS[key]) {
        return MOCK_TEXTS[key];
      }
    }
  }

  // Tenta proxies públicos caso ocorra erro de CORS/rede
  const proxies = [
    (url) => url, // Direto
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://r.jina.ai/${url}`
  ];

  for (const url of candidates) {
    for (const proxyFn of proxies) {
      try {
        const proxiedUrl = proxyFn(url);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const response = await fetch(proxiedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) continue;
        const text = await response.text();
        if (text && text.trim().length > 100) {
          return cleanGutenbergText(text);
        }
      } catch (err) {
        console.warn(`Erro ao carregar livro via proxy:`, err);
      }
    }
  }

  // Se tudo falhar (CORS/offline), retorna o texto do primeiro mock de fallback
  console.warn('Falha geral no download do livro. Carregando texto de demonstração local.');
  return MOCK_TEXTS.frankenstein;
}

/**
 * Limpa metadados repetitivos do Gutenberg no início/fim do texto.
 */
function cleanGutenbergText(text) {
  let clean = text;
  const startIndex = clean.search(/\*\*\* START OF THE PROJECT GUTENBERG|### START OF THE PROJECT/i);
  if (startIndex !== -1) {
    const endHeaderIndex = clean.indexOf('***', startIndex + 30);
    if (endHeaderIndex !== -1) {
      clean = clean.slice(endHeaderIndex + 3);
    } else {
      clean = clean.slice(startIndex);
    }
  }

  const endIndex = clean.search(/\*\*\* END OF THE PROJECT GUTENBERG|### END OF THE PROJECT/i);
  if (endIndex !== -1) {
    clean = clean.slice(0, endIndex);
  }

  return clean.trim();
}

/**
 * Traduz um bloco de texto para o português usando a MyMemory Translation API.
 * Divide em blocos menores (max 800 caracteres) para respeitar limites da API gratuita.
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
        if (data.responseData && data.responseData.translatedText) {
          return data.responseData.translatedText;
        }
      }
    } catch (e) {
      console.error('Erro de tradução no bloco:', e);
    }
    return trimmed; // Fallback para o original
  };

  try {
    const promises = chunks.map(chunk => translateChunk(chunk));
    const results = await Promise.all(promises);
    return results.join(' ');
  } catch (err) {
    console.error('Falha geral de tradução:', err);
    return text;
  }
}
