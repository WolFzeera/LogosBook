import { fetchBookById } from './api.js';
import { BookReader } from './reader.js';
import { SpeechController } from './tts.js';
import { Catalog } from './components/Catalog.js';
import { ReaderView } from './components/ReaderView.js';

// Elemento container raiz
const app = document.getElementById('app');

// Instâncias Globais de Estado
const bookReader = new BookReader();
const speechController = new SpeechController();

// Cache em memória para evitar requisições extras ao navegar de volta
const bookCache = {};

/**
 * Roteador baseado em Hash para evitar problemas de deploy (404) no GitHub Pages.
 */
async function router() {
  const hash = window.location.hash || '#home';
  
  // Parar fala do TTS se mudar de tela
  speechController.stop();

  if (hash === '#home' || hash === '#') {
    renderCatalogView();
  } else if (hash.startsWith('#book/')) {
    const bookId = hash.replace('#book/', '');
    renderReaderView(bookId);
  } else {
    // Rota fallback
    window.location.hash = '#home';
  }
}

/**
 * Renderiza o catálogo de livros
 */
function renderCatalogView() {
  app.innerHTML = '';
  
  // Instancia e renderiza o catálogo
  const catalog = new Catalog(app, (book) => {
    // Ao clicar em um livro, salva no cache e altera a hash
    bookCache[book.id] = book;
    window.location.hash = `#book/${book.id}`;
  });
  
  catalog.render();
}

/**
 * Renderiza o leitor de livros
 */
async function renderReaderView(bookId) {
  app.innerHTML = '';

  // Cria e renderiza a view do leitor
  const readerView = new ReaderView(
    app,
    bookReader,
    speechController,
    () => {
      // Ao fechar, volta para o catálogo
      window.location.hash = '#home';
    }
  );

  let book = bookCache[bookId];

  if (book) {
    // Carrega diretamente se já estiver no cache
    readerView.open(book);
  } else {
    // Se a página foi carregada/recarregada direto na URL do leitor, busca metadados
    try {
      readerView.isLoading = true;
      readerView.render();
      
      book = await fetchBookById(bookId);
      bookCache[bookId] = book;
      
      readerView.open(book);
    } catch (err) {
      console.error(err);
      readerView.isLoading = false;
      readerView.errorMessage = 'Esta obra não foi encontrada no catálogo ou a API está instável.';
      readerView.render();
    }
  }
}

// Ouvir alterações na URL
window.addEventListener('hashchange', router);

// Inicialização da aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  router();
  
  // Alguns navegadores exigem interação do usuário antes de listar vozes.
  // Pré-inicializamos o controller para escutar as vozes carregando em background.
  speechController.initVoices();
});
