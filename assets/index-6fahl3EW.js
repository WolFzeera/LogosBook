(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const v="https://gutendex.com/books/",u=[{id:99901,title:"Frankenstein; Or, The Modern Prometheus",authors:[{name:"Mary Wollstonecraft Shelley"}],formats:{"image/jpeg":"https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg","text/plain; charset=utf-8":"mock://frankenstein"},subjects:["Horror","Science Fiction","Gothic"],languages:["en"]},{id:99902,title:"Dracula",authors:[{name:"Bram Stoker"}],formats:{"image/jpeg":"https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg","text/plain; charset=utf-8":"mock://dracula"},subjects:["Vampires","Horror","Gothic"],languages:["en"]},{id:99903,title:"Alice's Adventures in Wonderland",authors:[{name:"Lewis Carroll"}],formats:{"image/jpeg":"https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg","text/plain; charset=utf-8":"mock://alice"},subjects:["Fantasy","Children","Classics"],languages:["en"]}],p={frankenstein:`Frankenstein; or, The Modern Prometheus.
By Mary Wollstonecraft Shelley.

Letter 1.
To Mrs. Saville, England.
St. Petersburgh, Dec. 11th, 17—.

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.

I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.

Its productions and features may be without example, as the phenomena of the heavenly bodies undoubtedly are in those undiscovered solitudes. What may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their seeming eccentricities consistent for ever.

I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to vanquish all fear of danger or death and to induce me to commence this laborious voyage with the joy a child feels when he embarks in a little boat, with his holiday mates, on an expedition of discovery up his native river.`,dracula:`Dracula.
By Bram Stoker.

CHAPTER I.
Jonathan Harker's Journal.

3 May. Bistritz.—Left Munich at 8:30 P.M. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go far from the station, as we had arrived late and would start as near the correct time as possible.

The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.

We left in pretty good time, and came after nightfall to Klausenburg. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but made me thirsty. (Mem., get recipe for Mina. I asked the waiter, and he said it was called "paprika hendl," and that, as it was a national dish, I should be able to get it anywhere along the Carpathians.)

I found my smattering of German very useful here; indeed, I don't know how I should be able to get on without it.

Having had some time at my disposal when in London, I had visited the British Museum, and made search among the books and maps in the library regarding Transylvania; it had struck me that some foreknowledge of the country could not fail to have some importance in dealing with a nobleman of that country.`,alice:`Alice's Adventures in Wonderland.
By Lewis Carroll.

CHAPTER I.
Down the Rabbit-Hole.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.`};async function y(a){const e=parseInt(a,10),t=u.find(i=>i.id===e);if(t)return t;try{const i=await fetch(`${v}${a}`);if(!i.ok)throw new Error("Erro na resposta do servidor.");return await i.json()}catch(i){return console.warn(`Erro ao carregar livro ${a} da API, tentando mocks.`,i),t||u[0]}}async function E(a="",e=1){try{let t=`${v}?page=${e}`;a&&(t+=`&search=${encodeURIComponent(a)}`);const i=await fetch(t);if(!i.ok)throw new Error("Limite de requisições excedido ou API indisponível.");const s=await i.json();if(s.results&&s.results.length===0&&a){const n=u.filter(r=>r.title.toLowerCase().includes(a.toLowerCase())||r.authors.some(o=>o.name.toLowerCase().includes(a.toLowerCase())));if(n.length>0)return{count:n.length,results:n}}return s}catch(t){console.warn("Falha na API externa de livros. Utilizando Mock data de fallback local.",t);let i=u;return a&&(i=u.filter(s=>s.title.toLowerCase().includes(a.toLowerCase())||s.authors.some(n=>n.name.toLowerCase().includes(a.toLowerCase()))||s.subjects.some(n=>n.toLowerCase().includes(a.toLowerCase())))),{count:i.length,results:i}}}async function w(a){const e=[a["text/plain; charset=utf-8"],a["text/plain"],a["text/plain; charset=us-ascii"],a["text/html; charset=utf-8"],a["text/html"]].filter(Boolean);if(e.length===0)throw new Error("Nenhum formato de leitura compatível disponível.");for(const i of e)if(i.startsWith("mock://")){const s=i.replace("mock://","");if(p[s])return p[s]}const t=[i=>i,i=>`https://api.allorigins.win/raw?url=${encodeURIComponent(i)}`,i=>`https://r.jina.ai/${i}`];for(const i of e)for(const s of t)try{const n=s(i),r=new AbortController,o=setTimeout(()=>r.abort(),6e3),h=await fetch(n,{signal:r.signal});if(clearTimeout(o),!h.ok)continue;const l=await h.text();if(l&&l.trim().length>100)return T(l)}catch(n){console.warn("Erro ao carregar livro via proxy:",n)}return console.warn("Falha geral no download do livro. Carregando texto de demonstração local."),p.frankenstein}function T(a){let e=a;const t=e.search(/\*\*\* START OF THE PROJECT GUTENBERG|### START OF THE PROJECT/i);if(t!==-1){const s=e.indexOf("***",t+30);s!==-1?e=e.slice(s+3):e=e.slice(t)}const i=e.search(/\*\*\* END OF THE PROJECT GUTENBERG|### END OF THE PROJECT/i);return i!==-1&&(e=e.slice(0,i)),e.trim()}async function P(a){if(!a||a.trim()==="")return"";const e=800,t=new RegExp(`.{1,${e}}(\\s|$)|.{1,${e}}`,"g"),i=a.match(t)||[a],s=async n=>{const r=n.trim();if(!r)return"";try{const o=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(r)}&langpair=en|pt`,h=await fetch(o);if(h.ok){const l=await h.json();if(l.responseData&&l.responseData.translatedText)return l.responseData.translatedText}}catch(o){console.error("Erro de tradução no bloco:",o)}return r};try{const n=i.map(o=>s(o));return(await Promise.all(n)).join(" ")}catch(n){return console.error("Falha geral de tradução:",n),a}}const c={get(a,e=null){try{const t=localStorage.getItem(a);if(t==null)return e;try{return JSON.parse(t)}catch{return t}}catch(t){return console.error("Erro ao ler do localStorage:",t),e}},set(a,e){try{const t=typeof e=="object"?JSON.stringify(e):e;localStorage.setItem(a,t)}catch(t){console.error("Erro ao escrever no localStorage:",t)}},getTheme(a="dark"){return this.get("logosbook_theme",a)},setTheme(a){this.set("logosbook_theme",a)},getFontSize(a=1.1){return parseFloat(this.get("logosbook_fontsize",a))},setFontSize(a){this.set("logosbook_fontsize",a)},getVoiceName(a=""){return this.get("logosbook_voice_name",a)},setVoiceName(a){this.set("logosbook_voice_name",a)},getVoiceRate(a=1){return parseFloat(this.get("logosbook_voice_rate",a))},setVoiceRate(a){this.set("logosbook_voice_rate",a)},getVoicePitch(a=1){return parseFloat(this.get("logosbook_voice_pitch",a))},setVoicePitch(a){this.set("logosbook_voice_pitch",a)},getBookProgress(a,e=0){return parseInt(this.get(`logosbook_progress_${a}`,e),10)},setBookProgress(a,e){this.set(`logosbook_progress_${a}`,e)}};class k{constructor(){this.book=null,this.rawText="",this.pages=[],this.currentPageIndex=0,this.fontSizeRem=c.getFontSize(1.1),this.theme=c.getTheme("dark"),this.translationCache={},this.onPageChange=null}loadBook(e,t){this.book=e,this.rawText=t,this.translationCache={},this.rebuildPages();const i=c.getBookProgress(e.id,0);this.currentPageIndex=Math.min(i,this.pages.length-1)}rebuildPages(){if(!this.rawText)return;const t=Math.max(600,Math.round(1800/this.fontSizeRem)),i=this.rawText.replace(/\r/g,""),s=i.split(/\n\n+/),n=[];let r=[],o=0;for(const h of s){const l=h.trim();l&&(r.push(l),o+=l.length,o>=t&&(n.push(r.join(`

`)),r=[],o=0))}r.length>0&&n.push(r.join(`

`)),n.length===0&&n.push(i||"O conteúdo desta obra está indisponível."),this.pages=n}changeFontSize(e){if(this.fontSizeRem,this.fontSizeRem=Math.max(.8,Math.min(2.2,this.fontSizeRem+e)),c.setFontSize(this.fontSizeRem),this.pages.length>0){let t=0;for(let n=0;n<this.currentPageIndex;n++)t+=this.pages[n].length+2;this.rebuildPages();let i=0,s=0;for(let n=0;n<this.pages.length;n++)if(i+=this.pages[n].length+2,i>=t){s=n;break}this.currentPageIndex=Math.min(s,this.pages.length-1),c.setBookProgress(this.book.id,this.currentPageIndex)}return this.fontSizeRem}setTheme(e){return this.theme=e,c.setTheme(e),this.theme}getCurrentPageText(){return this.pages[this.currentPageIndex]||""}nextPage(){return this.currentPageIndex<this.pages.length-1?(this.currentPageIndex++,c.setBookProgress(this.book.id,this.currentPageIndex),this.onPageChange&&this.onPageChange(this.currentPageIndex),!0):!1}prevPage(){return this.currentPageIndex>0?(this.currentPageIndex--,c.setBookProgress(this.book.id,this.currentPageIndex),this.onPageChange&&this.onPageChange(this.currentPageIndex),!0):!1}getProgressString(){return this.pages.length<=1?"0%":`${Math.round(this.currentPageIndex/(this.pages.length-1)*100)}%`}setupSwipeGestures(e,t,i){let s=0,n=0;e.addEventListener("touchstart",r=>{s=r.touches[0].clientX,n=r.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",r=>{if(!r.changedTouches||r.changedTouches.length===0)return;const o=r.changedTouches[0].clientX-s,h=r.changedTouches[0].clientY-n;Math.abs(o)>60&&Math.abs(h)<40&&(o>0?t():i())},{passive:!0})}}class I{constructor(){this.synth=window.speechSynthesis,this.selectedVoiceName=c.getVoiceName(),this.rate=c.getVoiceRate(1),this.pitch=c.getVoicePitch(1),this.sentenceQueue=[],this.currentSentenceIndex=0,this.activeUtterance=null,this.voices=[],this.isPlaying=!1,this.isPaused=!1,this.currentLanguage="en-US",this.onStateChange=null,this.initVoices(),this.synth&&(typeof this.synth.addEventListener=="function"?this.synth.addEventListener("voiceschanged",()=>this.initVoices()):this.synth.onvoiceschanged=()=>this.initVoices())}initVoices(){return this.synth?(this.voices=this.synth.getVoices(),this.voices):[]}getAvailableVoices(){return(this.voices.length>0?this.voices:this.initVoices()).map(t=>({name:t.name,lang:t.lang,voiceObj:t}))}splitIntoSentences(e){if(!e)return[];const t=e.replace(/[_#*~[\]()]/g," ").replace(/\s+/g," ").trim();let i=[];try{i=t.split(new RegExp("(?<=[.!?])\\s+"))}catch{i=t.split(/[.!?]+\s+/)}const s=[];for(let n of i)if(n=n.trim(),!!n)if(n.length>150){const r=n.split(/[,;]+/);for(let o of r)o=o.trim(),o.length>3&&s.push(o)}else s.push(n);return s}speak(e,t="en-US"){this.synth&&(this.stop(),this.currentLanguage=t,this.sentenceQueue=this.splitIntoSentences(e),this.currentSentenceIndex=0,this.sentenceQueue.length!==0&&(this.isPlaying=!0,this.isPaused=!1,this.notifyState(),this.speakNext()))}speakNext(){var s,n;if(!this.isPlaying)return;if(this.currentSentenceIndex>=this.sentenceQueue.length){this.stop();return}const e=this.sentenceQueue[this.currentSentenceIndex];if(!e||e.trim().length===0){this.currentSentenceIndex++,this.speakNext();return}this.activeUtterance=new SpeechSynthesisUtterance(e),this.activeUtterance.rate=this.rate,this.activeUtterance.pitch=this.pitch;const t=this.getAvailableVoices();let i=(s=t.find(r=>r.name===this.selectedVoiceName))==null?void 0:s.voiceObj;if(!i){const r=this.currentLanguage.split("-")[0].toLowerCase();i=(n=t.find(o=>o.lang.toLowerCase().startsWith(r)))==null?void 0:n.voiceObj}i?this.activeUtterance.voice=i:this.activeUtterance.lang=this.currentLanguage,this.activeUtterance.onend=()=>{this.currentSentenceIndex++,this.speakNext()},this.activeUtterance.onerror=r=>{r.error!=="interrupted"&&(console.error("Erro na sentença TTS:",r),this.currentSentenceIndex++,this.speakNext())},this.synth.speak(this.activeUtterance)}pause(){this.synth&&this.isPlaying&&!this.isPaused&&(this.synth.pause(),this.isPaused=!0,this.notifyState())}resume(){this.synth&&this.isPaused&&(this.synth.resume(),this.isPaused=!1,this.notifyState())}stop(){this.synth&&(this.synth.cancel(),this.isPlaying=!1,this.isPaused=!1,this.sentenceQueue=[],this.currentSentenceIndex=0,this.activeUtterance=null,this.notifyState())}setRate(e){this.rate=parseFloat(e),c.setVoiceRate(this.rate),this.rebootCurrentSentence()}setPitch(e){this.pitch=parseFloat(e),c.setVoicePitch(this.pitch),this.rebootCurrentSentence()}selectVoice(e){this.selectedVoiceName=e,c.setVoiceName(e),this.rebootCurrentSentence()}rebootCurrentSentence(){this.isPlaying&&this.synth&&(this.synth.cancel(),this.speakNext())}notifyState(){this.onStateChange&&this.onStateChange({isPlaying:this.isPlaying,isPaused:this.isPaused})}}class x{constructor(e,t){this.container=e,this.onBookSelect=t,this.books=[],this.featuredBook=null,this.query="",this.page=1,this.loading=!1,this.activeGenre="",this.genres=[{key:"philosophy",label:"PHILOSOPHY"},{key:"fiction",label:"FICTION"},{key:"poetry",label:"POETRY"},{key:"history",label:"HISTORY"},{key:"romance",label:"ROMANCE"},{key:"science",label:"SCIENCE"},{key:"drama",label:"DRAMA"}],this.debounceTimeout=null}render(){this.container.innerHTML=`
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
    `,this.initElements(),this.bindEvents(),this.renderGenres(),this.loadCatalog()}initElements(){this.searchInput=document.getElementById("search-input"),this.genresPills=document.getElementById("genres-pills"),this.featuredCard=document.getElementById("featured-card"),this.catalogGrid=document.getElementById("catalog-grid"),this.catalogTitle=document.getElementById("catalog-title"),this.paginationControls=document.getElementById("pagination-controls")}bindEvents(){this.searchInput.addEventListener("input",s=>{clearTimeout(this.debounceTimeout),this.debounceTimeout=setTimeout(()=>{this.query=s.target.value.trim(),this.page=1,this.activeGenre="",this.genresPills.querySelectorAll(".pill").forEach(r=>r.classList.remove("active")),this.loadCatalog()},500)});let e=!1,t,i;this.genresPills.addEventListener("pointerdown",s=>{e=!0,t=s.pageX-this.genresPills.offsetLeft,i=this.genresPills.scrollLeft,this.genresPills.style.cursor="grabbing"}),window.addEventListener("pointerup",()=>{e=!1,this.genresPills&&(this.genresPills.style.cursor="grab")}),this.genresPills.addEventListener("pointermove",s=>{if(!e)return;s.preventDefault();const r=(s.pageX-this.genresPills.offsetLeft-t)*1.5;this.genresPills.scrollLeft=i-r})}renderGenres(){this.genresPills.innerHTML="";const e=document.createElement("button");e.className="pill active",e.textContent="ALL",e.addEventListener("click",()=>{this.selectGenre(e,"")}),this.genresPills.appendChild(e),this.genres.forEach(t=>{const i=document.createElement("button");i.className="pill",i.textContent=t.label,i.dataset.key=t.key,i.addEventListener("click",()=>{this.selectGenre(i,t.key)}),this.genresPills.appendChild(i)})}selectGenre(e,t){this.genresPills.querySelectorAll(".pill").forEach(i=>i.classList.remove("active")),e.classList.add("active"),this.activeGenre=t,this.query="",this.searchInput.value="",this.page=1,this.loadCatalog()}async loadCatalog(){if(this.loading=!0,this.showSkeletons(),this.query)this.catalogTitle.textContent=`QUERY: "${this.query.toUpperCase()}"`;else if(this.activeGenre){const e=this.genres.find(t=>t.key===this.activeGenre);this.catalogTitle.textContent=e?`SECTOR: ${e.label}`:"DATABANK"}else this.catalogTitle.textContent="POPULAR DATABASE";try{const e=this.query||this.activeGenre||"classics",t=await E(e,this.page);this.books=t.results||[],this.loading=!1,this.renderBooksGrid(),this.renderPagination(t.count),this.page===1&&this.books.length>0&&!this.query&&this.setFeatured(this.books[0])}catch{this.loading=!1,this.renderErrorState()}}showSkeletons(){this.catalogGrid.innerHTML="";for(let e=0;e<8;e++){const t=document.createElement("div");t.className="card skeleton",this.catalogGrid.appendChild(t)}}renderBooksGrid(){if(this.catalogGrid.innerHTML="",this.books.length===0){this.catalogGrid.innerHTML=`
        <div class="empty-state">
          <p>> NO DATA FOUND FOR THIS TERM.</p>
        </div>
      `;return}this.books.forEach(e=>{const t=this.createCard(e);this.catalogGrid.appendChild(t)})}createCard(e){var r;const t=document.createElement("div");t.className="card pixel-card",t.tabIndex=0;const i=e.formats["image/jpeg"]||e.formats["image/jpg"]||e.formats["image/png"];if(i){const o=document.createElement("img");o.className="cover",o.loading="lazy",o.alt=`Book cover: ${e.title}`,o.src=i,t.appendChild(o)}else{const o=document.createElement("div");o.className="css-cover",o.innerHTML=`<div class="title">${this.escape(e.title)}</div>`,t.appendChild(o)}const s=document.createElement("div");s.className="meta";const n=((r=e.authors)==null?void 0:r.map(o=>o.name.split(",").reverse().join(" ").trim()).join(", "))||"Unknown Author";return s.innerHTML=`
      <div class="meta-title">${this.escape(e.title)}</div>
      <div class="meta-sub">> ${this.escape(n)}</div>
    `,t.appendChild(s),t.addEventListener("click",()=>this.onBookSelect(e)),t.addEventListener("keydown",o=>{o.key==="Enter"&&this.onBookSelect(e)}),t}setFeatured(e){var n;this.featuredBook=e,this.featuredCard.innerHTML="";const t=e.formats["image/jpeg"]||e.formats["image/jpg"]||e.formats["image/png"];let i="";t?i=`<img class="cover-img" src="${t}" alt="Featured: ${this.escape(e.title)}">`:i=`<div class="css-cover featured-fallback"><div class="title">${this.escape(e.title)}</div></div>`;const s=((n=e.authors)==null?void 0:n.map(r=>r.name.split(",").reverse().join(" ").trim()).join(", "))||"Unknown Author";this.featuredCard.innerHTML=`
      ${i}
      <div class="featured-overlay">
        <div class="featured-tag">> SYS_PICK</div>
        <h3 class="featured-title">${this.escape(e.title)}</h3>
        <p class="featured-author">by ${this.escape(s)}</p>
        <button class="btn btn-primary btn-pixel" id="btn-read-featured">BOOT_READER</button>
      </div>
    `,document.getElementById("btn-read-featured").addEventListener("click",r=>{r.stopPropagation(),this.onBookSelect(e)})}renderPagination(e){if(this.paginationControls.innerHTML="",!e||e<=32)return;const t=Math.min(Math.ceil(e/32),15),i=document.createElement("button");i.className=`btn btn-outline btn-pixel-sm ${this.page===1?"disabled":""}`,i.textContent="PREV",i.disabled=this.page===1,i.addEventListener("click",()=>{this.page>1&&(this.page--,this.loadCatalog())}),this.paginationControls.appendChild(i);const s=document.createElement("span");s.className="page-info",s.textContent=`SECTOR ${this.page}/${t}`,this.paginationControls.appendChild(s);const n=document.createElement("button");n.className=`btn btn-outline btn-pixel-sm ${this.page===t?"disabled":""}`,n.textContent="NEXT",n.disabled=this.page===t,n.addEventListener("click",()=>{this.page<t&&(this.page++,this.loadCatalog())}),this.paginationControls.appendChild(n)}renderErrorState(){this.catalogGrid.innerHTML=`
      <div class="error-container pixel-card">
        <div class="error-icon">⚡</div>
        <p class="error-message">CONNECTION TIMEOUT: EXTERNAL SERVER NOT RESPONDING.</p>
        <button class="btn btn-primary btn-pixel" id="btn-retry-catalog">REBOOT CONSOLE</button>
      </div>
    `,this.featuredCard.innerHTML='<div class="featured-placeholder error">API_ERROR</div>',document.getElementById("btn-retry-catalog").addEventListener("click",()=>{this.loadCatalog()})}escape(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}class C{constructor(e,t,i,s){this.container=e,this.reader=t,this.tts=i,this.onClose=s,this.isLoading=!1,this.isTranslated=!1,this.translating=!1,this.errorMessage=""}async open(e){this.isLoading=!0,this.isTranslated=!1,this.errorMessage="",this.render();try{const t=await w(e.formats);this.reader.loadBook(e,t),this.isLoading=!1,this.render(),this.applyThemeAndFont(),this.setupTTSVoices();const i=document.getElementById("book-page-text");i&&this.reader.setupSwipeGestures(i,()=>this.navigatePage(-1),()=>this.navigatePage(1))}catch(t){console.error(t),this.isLoading=!1,this.errorMessage=t.message||"Erro ao obter conteúdo do livro.",this.render()}}render(){var s;if(this.isLoading){this.container.innerHTML=`
        <div class="reader-loading-screen pixel-layout">
          <div class="spinner pixel-spinner"></div>
          <p class="blink">LOADING DATA...</p>
          <span class="loading-subtitle">> LENDO SETORES DE MEMORIA</span>
        </div>
      `;return}if(this.errorMessage){this.container.innerHTML=`
        <div class="reader-error-screen pixel-layout">
          <div class="error-badge">ERR_CORS</div>
          <h2>LOAD FAILED</h2>
          <p>${this.errorMessage}</p>
          <div class="error-actions">
            <button class="btn btn-primary btn-pixel" id="btn-reader-close-error">RETURN TO HUB</button>
          </div>
        </div>
      `,document.getElementById("btn-reader-close-error").addEventListener("click",()=>this.onClose());return}const e=this.reader.book;if(!e)return;const t=this.isTranslated?this.reader.translationCache[this.reader.currentPageIndex]||"TRANSLATING PAGE CONTENT...":this.reader.getCurrentPageText(),i=((s=e.authors)==null?void 0:s.map(n=>n.name.split(",").reverse().join(" ").trim()).join(", "))||"Unknown Author";this.container.innerHTML=`
      <div class="reader-container pixel-layout" id="reader-layout">
        
        <!-- Header Arcade -->
        <header class="reader-header">
          <button class="btn-close-reader btn-pixel-sm" id="btn-close-reader" title="Return to Menu">ESC</button>
          <div class="reader-header-meta">
            <h2 class="reader-book-title">${this.escape(e.title)}</h2>
            <span class="reader-book-author">> AUTHOR: ${this.escape(i)}</span>
          </div>
          <div class="reader-progress-bubble" id="progress-indicator">
            READ: ${this.reader.getProgressString()}
          </div>
        </header>

        <div class="reader-main-content">
          <!-- Sidebar de Controles Retro (Bits Coloridos) -->
          <aside class="reader-sidebar">
            <div class="sidebar-section">
              <h4 class="sidebar-title">[01] COLOR THEME</h4>
              <div class="theme-toggles">
                <button class="theme-btn theme-light-btn" data-theme="light" title="GameBoy Theme"></button>
                <button class="theme-btn theme-sepia-btn" data-theme="sepia" title="Amber Terminal"></button>
                <button class="theme-btn theme-dark-btn" data-theme="dark" title="Cyber Neon"></button>
              </div>
              
              <h4 class="sidebar-title" style="margin-top: 8px;">[02] FONT RESIZER</h4>
              <div class="font-resizers">
                <button class="font-btn" id="btn-font-decrease" title="Shrink Font">A-</button>
                <span class="font-indicator" id="font-size-text">${Math.round(this.reader.fontSizeRem*100)}%</span>
                <button class="font-btn" id="btn-font-increase" title="Grow Font">A+</button>
              </div>
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-section">
              <h4 class="sidebar-title">[03] TRANSLATOR</h4>
              <button class="btn btn-full btn-pixel ${this.isTranslated?"btn-translated":""}" id="btn-translate-page">
                ${this.translating?"LOADING...":this.isTranslated?"ENGLISH":"PORTUGUESE"}
              </button>
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-section">
              <h4 class="sidebar-title">[04] VOICE DECODER</h4>
              
              <div class="tts-voice-wrapper">
                <label for="tts-voice-select">VOICE CHIP</label>
                <select id="tts-voice-select" class="tts-select"></select>
              </div>

              <div class="tts-range-group">
                <div class="range-header">
                  <label for="tts-rate-range">SPEED</label>
                  <span id="rate-value">${this.tts.rate.toFixed(1)}x</span>
                </div>
                <input type="range" id="tts-rate-range" min="0.5" max="2" step="0.1" value="${this.tts.rate}">
              </div>

              <div class="tts-range-group">
                <div class="range-header">
                  <label for="tts-pitch-range">PITCH</label>
                  <span id="pitch-value">${this.tts.pitch.toFixed(1)}</span>
                </div>
                <input type="range" id="tts-pitch-range" min="0.5" max="2" step="0.1" value="${this.tts.pitch}">
              </div>

              <div class="tts-player-controls">
                <button class="player-btn btn-pixel-sm" id="tts-play-btn" title="Speak Page">PLAY</button>
                <button class="player-btn btn-pixel-sm" id="tts-stop-btn" title="Mute Audio" disabled>STOP</button>
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
            <button class="btn-nav btn-pixel-sm" id="btn-prev-page" ${this.reader.currentPageIndex===0?"disabled":""}>PREV</button>
            <span class="page-numbers" id="page-numbers-text">
              PAGE ${this.reader.currentPageIndex+1} OF ${this.reader.pages.length}
            </span>
            <button class="btn-nav btn-pixel-sm" id="btn-next-page" ${this.reader.currentPageIndex===this.reader.pages.length-1?"disabled":""}>NEXT</button>
          </div>
          <div class="reader-progress-bar-container">
            <div class="reader-progress-bar-fill" id="progress-bar-fill" style="width: ${this.reader.getProgressString()};"></div>
          </div>
        </footer>

      </div>
    `,this.bindEvents(),this.applyThemeAndFont(),this.updatePlayerUI()}bindEvents(){document.getElementById("btn-close-reader").addEventListener("click",()=>{this.tts.stop(),this.onClose()}),document.getElementById("btn-prev-page").addEventListener("click",()=>this.navigatePage(-1)),document.getElementById("btn-next-page").addEventListener("click",()=>this.navigatePage(1)),document.querySelectorAll(".theme-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.theme;this.reader.setTheme(d),this.applyThemeAndFont()})}),document.getElementById("btn-font-decrease").addEventListener("click",()=>{this.reader.changeFontSize(-.15),this.applyThemeAndFont(),this.rebindSwipe()}),document.getElementById("btn-font-increase").addEventListener("click",()=>{this.reader.changeFontSize(.15),this.applyThemeAndFont(),this.rebindSwipe()}),document.getElementById("btn-translate-page").addEventListener("click",()=>this.toggleTranslation()),document.getElementById("tts-voice-select").addEventListener("change",l=>{this.tts.selectVoice(l.target.value)});const i=document.getElementById("tts-rate-range"),s=document.getElementById("rate-value");i.addEventListener("input",l=>{const d=l.target.value;s.textContent=`${parseFloat(d).toFixed(1)}x`,this.tts.setRate(d)});const n=document.getElementById("tts-pitch-range"),r=document.getElementById("pitch-value");n.addEventListener("input",l=>{const d=l.target.value;r.textContent=parseFloat(d).toFixed(1),this.tts.setPitch(d)});const o=document.getElementById("tts-play-btn"),h=document.getElementById("tts-stop-btn");o.addEventListener("click",()=>{if(this.tts.isPlaying)this.tts.isPaused?this.tts.resume():this.tts.pause();else{const l=document.getElementById("book-page-text").innerText,d=this.isTranslated?"pt-BR":"en-US";this.tts.speak(l,d)}}),h.addEventListener("click",()=>{this.tts.stop()}),this.tts.onStateChange=l=>{this.updatePlayerUI(l)},this.reader.onPageChange=()=>{this.tts.stop(),this.isTranslated=!1,this.render()}}rebindSwipe(){const e=document.getElementById("book-page-text");e&&this.reader.setupSwipeGestures(e,()=>this.navigatePage(-1),()=>this.navigatePage(1))}navigatePage(e){const t=document.getElementById("book-page-text");if(!t)return;const i=e>0?"slide-out-left":"slide-out-right";t.classList.add(i),setTimeout(()=>{let s=!1;e>0?s=this.reader.nextPage():s=this.reader.prevPage(),s||t.classList.remove(i)},220)}async toggleTranslation(){if(this.translating)return;if(this.isTranslated){this.isTranslated=!1,this.render();return}const e=this.reader.currentPageIndex;if(this.reader.translationCache[e]){this.isTranslated=!0,this.render();return}this.translating=!0;const i=document.getElementById("btn-translate-page");i&&(i.textContent="DECODING...",i.classList.add("translating"));try{const s=this.reader.getCurrentPageText(),n=await P(s);this.reader.translationCache[e]=n,this.isTranslated=!0}catch{alert("ERRO DE PROTOCOLO: FALHA NA TRADUÇÃO.")}finally{this.translating=!1,this.render()}}setupTTSVoices(){const e=document.getElementById("tts-voice-select");if(!e)return;e.innerHTML="";const t=this.tts.getAvailableVoices();if(t.length===0){e.innerHTML='<option value="">VOICE CHIP ERROR</option>';return}[...t].sort((s,n)=>{const r=s.lang.startsWith("pt"),o=n.lang.startsWith("pt");return r&&!o?-1:!r&&o?1:s.name.localeCompare(n.name)}).forEach(s=>{const n=document.createElement("option");n.value=s.name,n.textContent=`${s.name.substring(0,16)} (${s.lang})`,s.name===this.tts.selectedVoiceName&&(n.selected=!0),e.appendChild(n)})}applyThemeAndFont(){const e=document.getElementById("reader-layout");if(!e)return;e.classList.remove("theme-light","theme-dark","theme-sepia"),e.classList.add(`theme-${this.reader.theme}`),e.style.setProperty("--reader-font-size",`${this.reader.fontSizeRem}rem`);const t=document.getElementById("font-size-text");t&&(t.textContent=`${Math.round(this.reader.fontSizeRem*100)}%`),document.querySelectorAll(".theme-btn").forEach(s=>{s.dataset.theme===this.reader.theme?s.classList.add("active"):s.classList.remove("active")})}updatePlayerUI(e){const t=document.getElementById("tts-play-btn"),i=document.getElementById("tts-stop-btn"),s=document.getElementById("book-page-text");if(!t||!i)return;const n=e||{isPlaying:this.tts.isPlaying,isPaused:this.tts.isPaused};n.isPlaying?(i.disabled=!1,n.isPaused?(t.textContent="PLAY",t.classList.remove("blink"),s==null||s.classList.remove("voice-reading-active")):(t.textContent="PAUSE",t.classList.add("blink"),s==null||s.classList.add("voice-reading-active"))):(t.textContent="PLAY",t.classList.remove("blink"),i.disabled=!0,s==null||s.classList.remove("voice-reading-active"))}formatTextHtml(e){return e?e.split(`

`).map(t=>`<p>${this.escape(t.trim())}</p>`).join(""):""}escape(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}const g=document.getElementById("app"),L=new k,f=new I,m={};async function b(){const a=window.location.hash||"#home";if(f.stop(),a==="#home"||a==="#")S();else if(a.startsWith("#book/")){const e=a.replace("#book/","");R(e)}else window.location.hash="#home"}function S(){g.innerHTML="",new x(g,e=>{m[e.id]=e,window.location.hash=`#book/${e.id}`}).render()}async function R(a){g.innerHTML="";const e=new C(g,L,f,()=>{window.location.hash="#home"});let t=m[a];if(t)e.open(t);else try{e.isLoading=!0,e.render(),t=await y(a),m[a]=t,e.open(t)}catch(i){console.error(i),e.isLoading=!1,e.errorMessage="Esta obra não foi encontrada no catálogo ou a API está instável.",e.render()}}window.addEventListener("hashchange",b);window.addEventListener("DOMContentLoaded",()=>{b(),f.initVoices()});
