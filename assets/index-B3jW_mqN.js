(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const f="https://gutendex.com/books/",u="https://openlibrary.org",P="https://archive.org/advancedsearch.php",S=50,g=[{id:"gutendex-99901",title:"Frankenstein; Or, The Modern Prometheus",authors:[{name:"Mary Wollstonecraft Shelley"}],coverUrl:"https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",formats:{"text/plain; charset=utf-8":"mock://frankenstein"},subjects:["Horror","Science Fiction","Gothic"],source:"gutendex",download_count:5e3},{id:"gutendex-99902",title:"Dracula",authors:[{name:"Bram Stoker"}],coverUrl:"https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",formats:{"text/plain; charset=utf-8":"mock://dracula"},subjects:["Vampires","Horror","Gothic"],source:"gutendex",download_count:4500},{id:"gutendex-99903",title:"Alice's Adventures in Wonderland",authors:[{name:"Lewis Carroll"}],coverUrl:"https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",formats:{"text/plain; charset=utf-8":"mock://alice"},subjects:["Fantasy","Children","Classics"],source:"gutendex",download_count:6e3}],m={frankenstein:`Frankenstein; or, The Modern Prometheus.
By Mary Wollstonecraft Shelley.

Letter 1.
To Mrs. Saville, England.
St. Petersburgh, Dec. 11th, 17—.

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.

I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour.`,dracula:`Dracula.
By Bram Stoker.

CHAPTER I.
Jonathan Harker's Journal.

3 May. Bistritz.—Left Munich at 8:30 P.M. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.

The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.

We left in pretty good time, and came after nightfall to Klausenburg. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but made me thirsty.`,alice:`Alice's Adventures in Wonderland.
By Lewis Carroll.

CHAPTER I.
Down the Rabbit-Hole.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet.`};function E(i){var t,s,n;const e=((t=i.formats)==null?void 0:t["image/jpeg"])||((s=i.formats)==null?void 0:s["image/jpg"])||((n=i.formats)==null?void 0:n["image/png"])||null;return{id:`gutendex-${i.id}`,_gutendexId:i.id,title:i.title,authors:i.authors||[],coverUrl:e,formats:i.formats||{},subjects:i.subjects||[],source:"gutendex",download_count:i.download_count||0}}function A(i){const e=i.cover_i,t=e?`https://covers.openlibrary.org/b/id/${e}-M.jpg`:null,s=(i.author_name||[]).map(o=>({name:o})),n=i.key,a=i.ia&&i.ia[0],r=a?`https://archive.org/stream/${a}`:`https://openlibrary.org${n}`;return{id:`openlibrary-${n==null?void 0:n.replace(/\//g,"_")}`,_olKey:n,_iaId:a||null,title:i.title,authors:s,coverUrl:t,formats:{"text/html":a?`https://archive.org/stream/${a}#page/n0/mode/2up`:`${u}${n}`,_readUrl:r},subjects:i.subject?i.subject.slice(0,5):[],source:"openlibrary",download_count:i.edition_count||1}}function T(i){const e=i.identifier,t=`https://archive.org/services/img/${e}`,s=i.creator?(Array.isArray(i.creator)?i.creator:[i.creator]).map(n=>({name:n})):[];return{id:`archive-${e}`,_iaId:e,title:i.title||"Título Desconhecido",authors:s,coverUrl:t,formats:{"text/plain":`https://archive.org/stream/${e}/${e}_djvu.txt`,"text/html":`https://archive.org/stream/${e}`,_readUrl:`https://archive.org/stream/${e}`},subjects:i.subject?Array.isArray(i.subject)?i.subject.slice(0,5):[i.subject]:[],source:"archive",download_count:parseInt(i.downloads||0)}}async function C(i,e){const t=i&&i!=="classicos"?`${f}?page=${e}&sort=popular&search=${encodeURIComponent(i)}`:`${f}?page=${e}&sort=popular`,s=await fetch(t,{signal:AbortSignal.timeout(8e3)});if(!s.ok)throw new Error("Gutendex indisponível");return((await s.json()).results||[]).filter(a=>(a.download_count||0)>=S).map(E)}async function O(i,e){const t=i&&i!=="classicos"?i:"classics public domain",s=(e-1)*10,n=`${u}/search.json?q=${encodeURIComponent(t)}&fields=key,title,author_name,cover_i,subject,edition_count,ia,public_scan_b&limit=10&offset=${s}&has_fulltext=true`,a=await fetch(n,{headers:{"User-Agent":"LogosBook/1.0 (github.com/WolFzeera/LogosBook)"},signal:AbortSignal.timeout(8e3)});if(!a.ok)throw new Error("Open Library indisponível");return((await a.json()).docs||[]).filter(o=>o.title&&o.edition_count&&o.edition_count>=2).map(A)}async function k(i,e){const t=i&&i!=="classicos"?`(${encodeURIComponent(i)}) AND mediatype:texts AND licenseurl:(http://creativecommons.org/licenses/publicdomain OR "") AND language:(Portuguese OR pt) AND !subject:(periodical)`:"mediatype:texts AND language:(Portuguese OR pt) AND subject:(literature OR romance OR novela OR poesia) AND !subject:(periodical)",s=10,n=(e-1)*s,a=`${P}?q=${t}&fl[]=identifier,title,creator,subject,downloads&sort[]=downloads+desc&rows=${s}&start=${n}&output=json`,r=await fetch(a,{signal:AbortSignal.timeout(8e3)});if(!r.ok)throw new Error("Internet Archive indisponível");const o=await r.json();return(o.response&&o.response.docs||[]).filter(l=>l.title&&l.identifier).map(T)}async function L(i="",e=1){const[t,s,n]=await Promise.allSettled([C(i,e),O(i,e),k(i,e)]),a=t.status==="fulfilled"?t.value:[],r=s.status==="fulfilled"?s.value:[],o=n.status==="fulfilled"?n.value:[];t.status==="rejected"&&console.warn("[Gutendex] Falhou:",t.reason),s.status==="rejected"&&console.warn("[Open Library] Falhou:",s.reason),n.status==="rejected"&&console.warn("[Archive.org] Falhou:",n.reason);const l=R(a,r,o),c=new Set,d=l.filter(I=>{const y=I.title.trim().toLowerCase().slice(0,40);return c.has(y)?!1:(c.add(y),!0)});if(d.length===0)return console.warn("[API] Todas as fontes falharam. Usando mocks locais."),{count:g.length,results:g,sources:[]};const w=[a.length>0?"Gutenberg":null,r.length>0?"Open Library":null,o.length>0?"Archive.org":null].filter(Boolean);return{count:d.length,results:d,sources:w}}function R(...i){const e=[],t=Math.max(...i.map(s=>s.length));for(let s=0;s<t;s++)for(const n of i)n[s]!==void 0&&e.push(n[s]);return e}async function B(i){if(!i)return null;const e=g.find(t=>t.id===i);if(e)return e;if(i.startsWith("gutendex-")){const t=i.replace("gutendex-","");try{const s=await fetch(`${f}${t}`,{signal:AbortSignal.timeout(8e3)});if(s.ok){const n=await s.json();return E(n)}}catch(s){console.warn("Erro ao buscar livro Gutendex por ID",s)}}if(i.startsWith("openlibrary-")){const t=i.replace("openlibrary-","").replace(/_/g,"/");try{const s=await fetch(`${u}${t}.json`,{signal:AbortSignal.timeout(8e3)});if(s.ok){const n=await s.json();return{id:i,title:n.title,authors:(n.authors||[]).map(a=>({name:a.key})),coverUrl:null,formats:{"text/html":`${u}${t}`},subjects:(n.subjects||[]).slice(0,5),source:"openlibrary",download_count:1}}}catch(s){console.warn("Erro ao buscar livro Open Library por ID",s)}}if(i.startsWith("archive-")){const t=i.replace("archive-","");try{const s=await fetch(`https://archive.org/metadata/${t}`,{signal:AbortSignal.timeout(8e3)});if(s.ok){const n=await s.json();return T({identifier:t,...n.metadata})}}catch(s){console.warn("Erro ao buscar livro Archive.org por ID",s)}}return g[0]}async function N(i){const e=[i["text/plain; charset=utf-8"],i["text/plain"],i["text/plain; charset=us-ascii"],i["text/html; charset=utf-8"],i["text/html"]].filter(Boolean);if(e.length===0)throw new Error("Nenhum formato de leitura compatível disponível.");for(const s of e)if(s&&s.startsWith("mock://")){const n=s.replace("mock://","");if(m[n])return m[n]}const t=[s=>s,s=>`https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,s=>`https://r.jina.ai/${s}`];for(const s of e)if(!(!s||s.startsWith("mock://")||s.startsWith("https://openlibrary.org/works/")||s.includes("mode/2up")))for(const n of t)try{const a=new AbortController,r=setTimeout(()=>a.abort(),8e3),o=await fetch(n(s),{signal:a.signal});if(clearTimeout(r),!o.ok)continue;const l=await o.text();if(l&&l.trim().length>500)return D(l)}catch(a){console.warn("Falha ao carregar conteúdo:",(a==null?void 0:a.message)||a)}return console.warn("Falha geral. Carregando demonstração local."),m.frankenstein}function D(i){let e=i;(e.includes("<html")||e.includes("<body"))&&(e=e.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,""),e=e.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,""),e=e.replace(/<[^>]+>/g," "),e=e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," "));const t=e.search(/\*\*\* START OF THE PROJECT GUTENBERG|### START OF THE PROJECT/i);if(t!==-1){const n=e.indexOf("***",t+30);n!==-1?e=e.slice(n+3):e=e.slice(t)}const s=e.search(/\*\*\* END OF THE PROJECT GUTENBERG|### END OF THE PROJECT/i);return s!==-1&&(e=e.slice(0,s)),e.trim()}async function $(i){if(!i||i.trim()==="")return"";const e=800,t=new RegExp(`.{1,${e}}(\\s|$)|.{1,${e}}`,"g"),s=i.match(t)||[i],n=async a=>{var o;const r=a.trim();if(!r)return"";try{const l=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(r)}&langpair=en|pt`,c=await fetch(l);if(c.ok){const d=await c.json();if((o=d.responseData)!=null&&o.translatedText)return d.responseData.translatedText}}catch(l){console.error("Erro de tradução no bloco:",l)}return r};try{return(await Promise.all(s.map(r=>n(r)))).join(" ")}catch(a){return console.error("Falha geral de tradução:",a),i}}const h={get(i,e=null){try{const t=localStorage.getItem(i);if(t==null)return e;try{return JSON.parse(t)}catch{return t}}catch(t){return console.error("Erro ao ler do localStorage:",t),e}},set(i,e){try{const t=typeof e=="object"?JSON.stringify(e):e;localStorage.setItem(i,t)}catch(t){console.error("Erro ao escrever no localStorage:",t)}},getTheme(i="dark"){return this.get("logosbook_theme",i)},setTheme(i){this.set("logosbook_theme",i)},getFontSize(i=1.1){return parseFloat(this.get("logosbook_fontsize",i))},setFontSize(i){this.set("logosbook_fontsize",i)},getVoiceName(i=""){return this.get("logosbook_voice_name",i)},setVoiceName(i){this.set("logosbook_voice_name",i)},getVoiceRate(i=1){return parseFloat(this.get("logosbook_voice_rate",i))},setVoiceRate(i){this.set("logosbook_voice_rate",i)},getVoicePitch(i=1){return parseFloat(this.get("logosbook_voice_pitch",i))},setVoicePitch(i){this.set("logosbook_voice_pitch",i)},getBookProgress(i,e=0){return parseInt(this.get(`logosbook_progress_${i}`,e),10)},setBookProgress(i,e){this.set(`logosbook_progress_${i}`,e)}};class M{constructor(){this.book=null,this.rawText="",this.pages=[],this.currentPageIndex=0,this.fontSizeRem=h.getFontSize(1.1),this.theme=h.getTheme("dark"),this.translationCache={},this.onPageChange=null}loadBook(e,t){this.book=e,this.rawText=t,this.translationCache={},this.rebuildPages();const s=h.getBookProgress(e.id,0);this.currentPageIndex=Math.min(s,this.pages.length-1)}rebuildPages(){if(!this.rawText)return;const t=Math.max(600,Math.round(1800/this.fontSizeRem)),s=this.rawText.replace(/\r/g,""),n=s.split(/\n\n+/),a=[];let r=[],o=0;for(const l of n){const c=l.trim();c&&(r.push(c),o+=c.length,o>=t&&(a.push(r.join(`

`)),r=[],o=0))}r.length>0&&a.push(r.join(`

`)),a.length===0&&a.push(s||"O conteúdo desta obra está indisponível."),this.pages=a}changeFontSize(e){if(this.fontSizeRem,this.fontSizeRem=Math.max(.8,Math.min(2.2,this.fontSizeRem+e)),h.setFontSize(this.fontSizeRem),this.pages.length>0){let t=0;for(let a=0;a<this.currentPageIndex;a++)t+=this.pages[a].length+2;this.rebuildPages();let s=0,n=0;for(let a=0;a<this.pages.length;a++)if(s+=this.pages[a].length+2,s>=t){n=a;break}this.currentPageIndex=Math.min(n,this.pages.length-1),h.setBookProgress(this.book.id,this.currentPageIndex)}return this.fontSizeRem}setTheme(e){return this.theme=e,h.setTheme(e),this.theme}getCurrentPageText(){return this.pages[this.currentPageIndex]||""}nextPage(){return this.currentPageIndex<this.pages.length-1?(this.currentPageIndex++,h.setBookProgress(this.book.id,this.currentPageIndex),this.onPageChange&&this.onPageChange(this.currentPageIndex),!0):!1}prevPage(){return this.currentPageIndex>0?(this.currentPageIndex--,h.setBookProgress(this.book.id,this.currentPageIndex),this.onPageChange&&this.onPageChange(this.currentPageIndex),!0):!1}getProgressString(){return this.pages.length<=1?"0%":`${Math.round(this.currentPageIndex/(this.pages.length-1)*100)}%`}setupSwipeGestures(e,t,s){let n=0,a=0;e.addEventListener("touchstart",r=>{n=r.touches[0].clientX,a=r.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",r=>{if(!r.changedTouches||r.changedTouches.length===0)return;const o=r.changedTouches[0].clientX-n,l=r.changedTouches[0].clientY-a;Math.abs(o)>60&&Math.abs(l)<40&&(o>0?t():s())},{passive:!0})}}class U{constructor(){this.synth=window.speechSynthesis,this.selectedVoiceName=h.getVoiceName(),this.rate=h.getVoiceRate(1),this.pitch=h.getVoicePitch(1),this.sentenceQueue=[],this.currentSentenceIndex=0,this.activeUtterance=null,this.voices=[],this.isPlaying=!1,this.isPaused=!1,this.currentLanguage="en-US",this.onStateChange=null,this.initVoices(),this.synth&&(typeof this.synth.addEventListener=="function"?this.synth.addEventListener("voiceschanged",()=>this.initVoices()):this.synth.onvoiceschanged=()=>this.initVoices())}initVoices(){return this.synth?(this.voices=this.synth.getVoices(),this.voices):[]}getAvailableVoices(){return(this.voices.length>0?this.voices:this.initVoices()).map(t=>({name:t.name,lang:t.lang,voiceObj:t}))}splitIntoSentences(e){if(!e)return[];const t=e.replace(/[_#*~[\]()]/g," ").replace(/\s+/g," ").trim();let s=[];try{s=t.split(new RegExp("(?<=[.!?])\\s+"))}catch{s=t.split(/[.!?]+\s+/)}const n=[];for(let a of s)if(a=a.trim(),!!a)if(a.length>150){const r=a.split(/[,;]+/);for(let o of r)o=o.trim(),o.length>3&&n.push(o)}else n.push(a);return n}speak(e,t="en-US"){this.synth&&(this.stop(),this.currentLanguage=t,this.sentenceQueue=this.splitIntoSentences(e),this.currentSentenceIndex=0,this.sentenceQueue.length!==0&&(this.isPlaying=!0,this.isPaused=!1,this.notifyState(),this.speakNext()))}speakNext(){var n,a;if(!this.isPlaying)return;if(this.currentSentenceIndex>=this.sentenceQueue.length){this.stop();return}const e=this.sentenceQueue[this.currentSentenceIndex];if(!e||e.trim().length===0){this.currentSentenceIndex++,this.speakNext();return}this.activeUtterance=new SpeechSynthesisUtterance(e),this.activeUtterance.rate=this.rate,this.activeUtterance.pitch=this.pitch;const t=this.getAvailableVoices();let s=(n=t.find(r=>r.name===this.selectedVoiceName))==null?void 0:n.voiceObj;if(!s){const r=this.currentLanguage.split("-")[0].toLowerCase();s=(a=t.find(o=>o.lang.toLowerCase().startsWith(r)))==null?void 0:a.voiceObj}s?this.activeUtterance.voice=s:this.activeUtterance.lang=this.currentLanguage,this.activeUtterance.onend=()=>{this.currentSentenceIndex++,this.speakNext()},this.activeUtterance.onerror=r=>{r.error!=="interrupted"&&(console.error("Erro na sentença TTS:",r),this.currentSentenceIndex++,this.speakNext())},this.synth.speak(this.activeUtterance)}pause(){this.synth&&this.isPlaying&&!this.isPaused&&(this.synth.pause(),this.isPaused=!0,this.notifyState())}resume(){this.synth&&this.isPaused&&(this.synth.resume(),this.isPaused=!1,this.notifyState())}stop(){this.synth&&(this.synth.cancel(),this.isPlaying=!1,this.isPaused=!1,this.sentenceQueue=[],this.currentSentenceIndex=0,this.activeUtterance=null,this.notifyState())}setRate(e){this.rate=parseFloat(e),h.setVoiceRate(this.rate),this.rebootCurrentSentence()}setPitch(e){this.pitch=parseFloat(e),h.setVoicePitch(this.pitch),this.rebootCurrentSentence()}selectVoice(e){this.selectedVoiceName=e,h.setVoiceName(e),this.rebootCurrentSentence()}rebootCurrentSentence(){this.isPlaying&&this.synth&&(this.synth.cancel(),this.speakNext())}notifyState(){this.onStateChange&&this.onStateChange({isPlaying:this.isPlaying,isPaused:this.isPaused})}}class _{constructor(e,t){this.container=e,this.onBookSelect=t,this.books=[],this.featuredBook=null,this.query="",this.page=1,this.loading=!1,this.activeGenre="",this.genres=[{key:"filosofia",label:"FILOSOFIA"},{key:"romance",label:"ROMANCE"},{key:"poesia",label:"POESIA"},{key:"historia",label:"HISTÓRIA"},{key:"contos",label:"CONTOS"},{key:"ciencia",label:"CIÊNCIA"},{key:"drama",label:"DRAMA"},{key:"aventura",label:"AVENTURA"},{key:"misterio",label:"MISTÉRIO"}],this.debounceTimeout=null}render(){this.container.innerHTML=`
      <header class="hero pixel-layout">
        <div class="hero-inner">
          <div class="hero-meta">
            <div class="brand-badge pixel-badge">LOGOS_BOOK.EXE</div>
            <h1 class="title pixel-title">BIBLIOTECA RETRO</h1>
            <p class="tagline">// CLÁSSICOS DO DOMÍNIO PÚBLICO EM ALTA RESOLUÇÃO DE BITS.</p>
            
            <div class="search-wrap">
              <span class="search-icon">></span>
              <input id="search-input" class="search pixel-search" type="search" placeholder="BUSCAR TÍTULOS, AUTORES..." aria-label="Buscar Catálogo">
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
        <div class="grid" id="catalog-grid" role="list"></div>
      </main>
    `,this.initElements(),this.bindEvents(),this.renderGenres(),this.loadCatalog()}initElements(){this.searchInput=document.getElementById("search-input"),this.genresPills=document.getElementById("genres-pills"),this.featuredCard=document.getElementById("featured-card"),this.catalogGrid=document.getElementById("catalog-grid"),this.catalogTitle=document.getElementById("catalog-title"),this.paginationControls=document.getElementById("pagination-controls")}bindEvents(){this.searchInput.addEventListener("input",n=>{clearTimeout(this.debounceTimeout),this.debounceTimeout=setTimeout(()=>{this.query=n.target.value.trim(),this.page=1,this.activeGenre="",this.genresPills.querySelectorAll(".pill").forEach(r=>r.classList.remove("active")),this.loadCatalog()},500)});let e=!1,t,s;this.genresPills.addEventListener("pointerdown",n=>{e=!0,t=n.pageX-this.genresPills.offsetLeft,s=this.genresPills.scrollLeft,this.genresPills.style.cursor="grabbing"}),window.addEventListener("pointerup",()=>{e=!1,this.genresPills&&(this.genresPills.style.cursor="grab")}),this.genresPills.addEventListener("pointermove",n=>{if(!e)return;n.preventDefault();const r=(n.pageX-this.genresPills.offsetLeft-t)*1.5;this.genresPills.scrollLeft=s-r})}renderGenres(){this.genresPills.innerHTML="";const e=document.createElement("button");e.className="pill active",e.textContent="TODOS",e.addEventListener("click",()=>{this.selectGenre(e,"")}),this.genresPills.appendChild(e),this.genres.forEach(t=>{const s=document.createElement("button");s.className="pill",s.textContent=t.label,s.dataset.key=t.key,s.addEventListener("click",()=>{this.selectGenre(s,t.key)}),this.genresPills.appendChild(s)})}selectGenre(e,t){this.genresPills.querySelectorAll(".pill").forEach(s=>s.classList.remove("active")),e.classList.add("active"),this.activeGenre=t,this.query="",this.searchInput.value="",this.page=1,this.loadCatalog()}async loadCatalog(){if(this.loading=!0,this.showSkeletons(),this.query)this.catalogTitle.textContent=`BUSCA: "${this.query.toUpperCase()}"`;else if(this.activeGenre){const e=this.genres.find(t=>t.key===this.activeGenre);this.catalogTitle.textContent=e?`SETOR: ${e.label}`:"BANCO DE DADOS"}else this.catalogTitle.textContent="BANCO DE DADOS POPULAR";try{const e=this.query||this.activeGenre||"classicos",t=await L(e,this.page);this.books=t.results||[],this.loading=!1,this.renderBooksGrid(),this.renderPagination(t.count),this.renderSourceBadge(t.sources||[]),this.page===1&&this.books.length>0&&!this.query&&this.setFeatured(this.books[0])}catch{this.loading=!1,this.renderErrorState()}}showSkeletons(){this.catalogGrid.innerHTML="";for(let e=0;e<8;e++){const t=document.createElement("div");t.className="card skeleton",this.catalogGrid.appendChild(t)}}renderBooksGrid(){if(this.catalogGrid.innerHTML="",this.books.length===0){this.catalogGrid.innerHTML=`
        <div class="empty-state">
          <p>> NENHUM DADO ENCONTRADO PARA ESTE TERMO.</p>
          <p style="font-size:8px;margin-top:12px;color:var(--text-muted)">Tente outra busca ou selecione um gênero diferente.</p>
        </div>
      `;return}this.books.forEach(e=>{const t=this.createCard(e);this.catalogGrid.appendChild(t)})}createCard(e){var o;const t=document.createElement("div");t.className="card pixel-card",t.tabIndex=0;const s=e.coverUrl;if(s){const l=document.createElement("img");l.className="cover",l.loading="lazy",l.alt=`Capa do livro: ${e.title}`,l.src=s,l.onerror=()=>{l.style.display="none"},t.appendChild(l)}else{const l=document.createElement("div");l.className="css-cover",l.innerHTML=`<div class="title">${this.escape(e.title)}</div>`,t.appendChild(l)}const n=document.createElement("div");n.className="meta";const a=((o=e.authors)==null?void 0:o.map(l=>l.name.split(",").reverse().join(" ").trim()).join(", "))||"Autor Desconhecido",r=this.getSourceLabel(e.source);return n.innerHTML=`
      <div class="meta-source">${r}</div>
      <div class="meta-title">${this.escape(e.title)}</div>
      <div class="meta-sub">> ${this.escape(a)}</div>
    `,t.appendChild(n),t.addEventListener("click",()=>this.onBookSelect(e)),t.addEventListener("keydown",l=>{l.key==="Enter"&&this.onBookSelect(e)}),t}getSourceLabel(e){return{gutendex:"[GUTENBERG]",openlibrary:"[OPEN LIB]",archive:"[ARCHIVE]"}[e]||"[???]"}renderSourceBadge(e){const t=document.getElementById("source-badge");if(t&&t.remove(),!e||e.length===0)return;const s=document.createElement("div");s.id="source-badge",s.className="source-badge",s.textContent=`FONTES ATIVAS: ${e.join(" + ")}`;const n=document.querySelector(".section-header");n&&n.insertAdjacentElement("afterend",s)}setFeatured(e){var r;this.featuredBook=e,this.featuredCard.innerHTML="";const t=e.coverUrl;let s="";t?s=`<img class="cover-img" src="${t}" alt="Em Destaque: ${this.escape(e.title)}" onerror="this.style.display='none'">`:s=`<div class="css-cover featured-fallback"><div class="title">${this.escape(e.title)}</div></div>`;const n=((r=e.authors)==null?void 0:r.map(o=>o.name.split(",").reverse().join(" ").trim()).join(", "))||"Autor Desconhecido",a=this.getSourceLabel(e.source);this.featuredCard.innerHTML=`
      ${s}
      <div class="featured-overlay">
        <div class="featured-tag">> SELEÇÃO DO SISTEMA ${a}</div>
        <h3 class="featured-title">${this.escape(e.title)}</h3>
        <p class="featured-author">por ${this.escape(n)}</p>
        <button class="btn btn-primary btn-pixel" id="btn-read-featured">INICIAR LEITURA</button>
      </div>
    `,document.getElementById("btn-read-featured").addEventListener("click",o=>{o.stopPropagation(),this.onBookSelect(e)})}renderPagination(e){if(this.paginationControls.innerHTML="",!e||e<=32)return;const t=Math.min(Math.ceil(e/32),15),s=document.createElement("button");s.className=`btn btn-outline btn-pixel-sm ${this.page===1?"disabled":""}`,s.textContent="ANTERIOR",s.disabled=this.page===1,s.addEventListener("click",()=>{this.page>1&&(this.page--,this.loadCatalog())}),this.paginationControls.appendChild(s);const n=document.createElement("span");n.className="page-info",n.textContent=`SETOR ${this.page}/${t}`,this.paginationControls.appendChild(n);const a=document.createElement("button");a.className=`btn btn-outline btn-pixel-sm ${this.page===t?"disabled":""}`,a.textContent="PRÓXIMO",a.disabled=this.page===t,a.addEventListener("click",()=>{this.page<t&&(this.page++,this.loadCatalog())}),this.paginationControls.appendChild(a)}renderErrorState(){this.catalogGrid.innerHTML=`
      <div class="error-container pixel-card">
        <div class="error-icon">⚡</div>
        <p class="error-message">TIMEOUT DE CONEXÃO: SERVIDOR EXTERNO SEM RESPOSTA.</p>
        <button class="btn btn-primary btn-pixel" id="btn-retry-catalog">REINICIAR CONSOLE</button>
      </div>
    `,this.featuredCard.innerHTML='<div class="featured-placeholder error">ERRO_DE_API</div>',document.getElementById("btn-retry-catalog").addEventListener("click",()=>{this.loadCatalog()})}escape(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}class j{constructor(e,t,s,n){this.container=e,this.reader=t,this.tts=s,this.onClose=n,this.isLoading=!1,this.isTranslated=!1,this.translating=!1,this.errorMessage=""}async open(e){this.isLoading=!0,this.isTranslated=!1,this.errorMessage="",this.render();try{const t=await N(e.formats);this.reader.loadBook(e,t),this.isLoading=!1,this.render(),this.applyThemeAndFont(),this.setupTTSVoices();const s=document.getElementById("book-page-text");s&&this.reader.setupSwipeGestures(s,()=>this.navigatePage(-1),()=>this.navigatePage(1))}catch(t){console.error(t),this.isLoading=!1,this.errorMessage=t.message||"Erro ao obter conteúdo do livro.",this.render()}}render(){var n;if(this.isLoading){this.container.innerHTML=`
        <div class="reader-loading-screen pixel-layout">
          <div class="spinner pixel-spinner"></div>
          <p class="blink">CARREGANDO DADOS...</p>
          <span class="loading-subtitle">> LENDO SETORES DE MEMÓRIA</span>
        </div>
      `;return}if(this.errorMessage){this.container.innerHTML=`
        <div class="reader-error-screen pixel-layout">
          <div class="error-badge">ERRO_CORS</div>
          <h2>FALHA NO CARREGAMENTO</h2>
          <p>${this.errorMessage}</p>
          <div class="error-actions">
            <button class="btn btn-primary btn-pixel" id="btn-reader-close-error">VOLTAR AO MENU</button>
          </div>
        </div>
      `,document.getElementById("btn-reader-close-error").addEventListener("click",()=>this.onClose());return}const e=this.reader.book;if(!e)return;const t=this.isTranslated?this.reader.translationCache[this.reader.currentPageIndex]||"TRADUZINDO CONTEÚDO DA PÁGINA...":this.reader.getCurrentPageText(),s=((n=e.authors)==null?void 0:n.map(a=>a.name.split(",").reverse().join(" ").trim()).join(", "))||"Autor Desconhecido";this.container.innerHTML=`
      <div class="reader-container pixel-layout" id="reader-layout">
        
        <!-- Header Arcade -->
        <header class="reader-header">
          <button class="btn-close-reader btn-pixel-sm" id="btn-close-reader" title="Voltar ao Menu">ESC</button>
          <div class="reader-header-meta">
            <h2 class="reader-book-title">${this.escape(e.title)}</h2>
            <span class="reader-book-author">> AUTOR: ${this.escape(s)}</span>
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
                <span class="font-indicator" id="font-size-text">${Math.round(this.reader.fontSizeRem*100)}%</span>
                <button class="font-btn" id="btn-font-increase" title="Aumentar Fonte">A+</button>
              </div>
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-section">
              <h4 class="sidebar-title">[03] TRADUÇÃO</h4>
              <button class="btn btn-full btn-pixel ${this.isTranslated?"btn-translated":""}" id="btn-translate-page">
                ${this.translating?"TRADUZINDO...":this.isTranslated?"VER ORIGINAL":"TRADUZIR PT-BR"}
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
                ${this.formatTextHtml(t)}
              </div>
            </div>
          </article>
        </div>

        <!-- Rodapé Retro -->
        <footer class="reader-footer">
          <div class="reader-footer-inner">
            <button class="btn-nav btn-pixel-sm" id="btn-prev-page" ${this.reader.currentPageIndex===0?"disabled":""}>ANTERIOR</button>
            <span class="page-numbers" id="page-numbers-text">
              PÁGINA ${this.reader.currentPageIndex+1} DE ${this.reader.pages.length}
            </span>
            <button class="btn-nav btn-pixel-sm" id="btn-next-page" ${this.reader.currentPageIndex===this.reader.pages.length-1?"disabled":""}>PRÓXIMA</button>
          </div>
          <div class="reader-progress-bar-container">
            <div class="reader-progress-bar-fill" id="progress-bar-fill" style="width: ${this.reader.getProgressString()};"></div>
          </div>
        </footer>

      </div>
    `,this.bindEvents(),this.applyThemeAndFont(),this.updatePlayerUI()}bindEvents(){document.getElementById("btn-close-reader").addEventListener("click",()=>{this.tts.stop(),this.onClose()}),document.getElementById("btn-prev-page").addEventListener("click",()=>this.navigatePage(-1)),document.getElementById("btn-next-page").addEventListener("click",()=>this.navigatePage(1)),document.querySelectorAll(".theme-btn").forEach(c=>{c.addEventListener("click",()=>{const d=c.dataset.theme;this.reader.setTheme(d),this.applyThemeAndFont()})}),document.getElementById("btn-font-decrease").addEventListener("click",()=>{this.reader.changeFontSize(-.15),this.applyThemeAndFont(),this.rebindSwipe()}),document.getElementById("btn-font-increase").addEventListener("click",()=>{this.reader.changeFontSize(.15),this.applyThemeAndFont(),this.rebindSwipe()}),document.getElementById("btn-translate-page").addEventListener("click",()=>this.toggleTranslation()),document.getElementById("tts-voice-select").addEventListener("change",c=>{this.tts.selectVoice(c.target.value)});const s=document.getElementById("tts-rate-range"),n=document.getElementById("rate-value");s.addEventListener("input",c=>{const d=c.target.value;n.textContent=`${parseFloat(d).toFixed(1)}x`,this.tts.setRate(d)});const a=document.getElementById("tts-pitch-range"),r=document.getElementById("pitch-value");a.addEventListener("input",c=>{const d=c.target.value;r.textContent=parseFloat(d).toFixed(1),this.tts.setPitch(d)});const o=document.getElementById("tts-play-btn"),l=document.getElementById("tts-stop-btn");o.addEventListener("click",()=>{if(this.tts.isPlaying)this.tts.isPaused?this.tts.resume():this.tts.pause();else{const c=document.getElementById("book-page-text").innerText,d=this.isTranslated?"pt-BR":"en-US";this.tts.speak(c,d)}}),l.addEventListener("click",()=>{this.tts.stop()}),this.tts.onStateChange=c=>{this.updatePlayerUI(c)},this.reader.onPageChange=()=>{this.tts.stop(),this.isTranslated=!1,this.render()}}rebindSwipe(){const e=document.getElementById("book-page-text");e&&this.reader.setupSwipeGestures(e,()=>this.navigatePage(-1),()=>this.navigatePage(1))}navigatePage(e){const t=document.getElementById("book-page-text");if(!t)return;const s=e>0?"slide-out-left":"slide-out-right";t.classList.add(s),setTimeout(()=>{let n=!1;e>0?n=this.reader.nextPage():n=this.reader.prevPage(),n||t.classList.remove(s)},220)}async toggleTranslation(){if(this.translating)return;if(this.isTranslated){this.isTranslated=!1,this.render();return}const e=this.reader.currentPageIndex;if(this.reader.translationCache[e]){this.isTranslated=!0,this.render();return}this.translating=!0;const s=document.getElementById("btn-translate-page");s&&(s.textContent="DECODIFICANDO...",s.classList.add("translating"));try{const n=this.reader.getCurrentPageText(),a=await $(n);this.reader.translationCache[e]=a,this.isTranslated=!0}catch{alert("ERRO DE PROTOCOLO: FALHA NA TRADUÇÃO.")}finally{this.translating=!1,this.render()}}setupTTSVoices(){const e=document.getElementById("tts-voice-select");if(!e)return;e.innerHTML="";const t=this.tts.getAvailableVoices();if(t.length===0){e.innerHTML='<option value="">ERRO NO CHIP DE VOZ</option>';return}[...t].sort((n,a)=>{const r=n.lang.startsWith("pt"),o=a.lang.startsWith("pt");return r&&!o?-1:!r&&o?1:n.name.localeCompare(a.name)}).forEach(n=>{const a=document.createElement("option");a.value=n.name,a.textContent=`${n.name.substring(0,16)} (${n.lang})`,n.name===this.tts.selectedVoiceName&&(a.selected=!0),e.appendChild(a)})}applyThemeAndFont(){const e=document.getElementById("reader-layout");if(!e)return;e.classList.remove("theme-light","theme-dark","theme-sepia"),e.classList.add(`theme-${this.reader.theme}`),e.style.setProperty("--reader-font-size",`${this.reader.fontSizeRem}rem`);const t=document.getElementById("font-size-text");t&&(t.textContent=`${Math.round(this.reader.fontSizeRem*100)}%`),document.querySelectorAll(".theme-btn").forEach(n=>{n.dataset.theme===this.reader.theme?n.classList.add("active"):n.classList.remove("active")})}updatePlayerUI(e){const t=document.getElementById("tts-play-btn"),s=document.getElementById("tts-stop-btn"),n=document.getElementById("book-page-text");if(!t||!s)return;const a=e||{isPlaying:this.tts.isPlaying,isPaused:this.tts.isPaused};a.isPlaying?(s.disabled=!1,a.isPaused?(t.textContent="PLAY",t.classList.remove("blink"),n==null||n.classList.remove("voice-reading-active")):(t.textContent="PAUSAR",t.classList.add("blink"),n==null||n.classList.add("voice-reading-active"))):(t.textContent="PLAY",t.classList.remove("blink"),s.disabled=!0,n==null||n.classList.remove("voice-reading-active"))}formatTextHtml(e){return e?e.split(`

`).map(t=>`<p>${this.escape(t.trim())}</p>`).join(""):""}escape(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}const p=document.getElementById("app"),F=new M,b=new U,v={};async function x(){const i=window.location.hash||"#home";if(b.stop(),i==="#home"||i==="#")V();else if(i.startsWith("#book/")){const e=i.replace("#book/","");G(e)}else window.location.hash="#home"}function V(){p.innerHTML="",new _(p,e=>{v[e.id]=e,window.location.hash=`#book/${e.id}`}).render()}async function G(i){p.innerHTML="";const e=new j(p,F,b,()=>{window.location.hash="#home"});let t=v[i];if(t)e.open(t);else try{e.isLoading=!0,e.render(),t=await B(i),v[i]=t,e.open(t)}catch(s){console.error(s),e.isLoading=!1,e.errorMessage="Esta obra não foi encontrada no catálogo ou a API está instável.",e.render()}}window.addEventListener("hashchange",x);window.addEventListener("DOMContentLoaded",()=>{x(),b.initVoices()});
