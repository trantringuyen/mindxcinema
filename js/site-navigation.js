(()=>{
 const routes={home:'index.html',explore:'explore.html',movies:'explore.html',series:'explore.html',detail:'movie-detail.html',watch:'watch.html',search:'search.html',login:'login.html',register:'register.html',profile:'profile.html',watchlist:'watch-list.html',history:'history.html'};
 const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
 const go=(file)=>{if(file) window.location.href=new URL(file,document.baseURI).href};
 const routeForLabel=(label)=>{const t=norm(label); if(!t)return null;
   if(/^(home|trang chủ|mindx cinema)$/.test(t))return routes.home;
   if(/^(explore|khám phá|explore all curations|explore curated archive)$/.test(t))return routes.explore;
   if(/^(movies|phim|featured masterpieces)$/.test(t))return routes.movies;
   if(/^(series|phim bộ)$/.test(t))return routes.series;
   if(/watchlist|saved watchlist|my cinephile vault|personal collection/.test(t))return routes.watchlist;
   if(/search|tìm kiếm|curated search/.test(t))return routes.search;
   if(/profile|patron profile|account_circle/.test(t))return routes.profile;
   if(/history|lịch sử xem/.test(t))return routes.history;
   if(/privacy|terms|điều khoản|bảo mật/.test(t))return routes.policies;
   if(/sign in|login|đăng nhập|return to catalog/.test(t))return routes.login;
   if(/create vip account|join vip membership|register|đăng ký/.test(t))return routes.register;
   if(/watch movie|watch premiere|stream master|resume playing|watch again|play movie|stream master edition/.test(t))return routes.watch;
   if(/movie detail|film details|back to film details/.test(t))return routes.detail;
   return null;
 };
 // Normalize links generated with server-style absolute paths to local static HTML paths.
 document.querySelectorAll('a[href]').forEach(a=>{
   const href=a.getAttribute('href');
   if(href && Object.prototype.hasOwnProperty.call({'/':1,'/explore':1,'/movies':1,'/series':1,'/watchlist':1,'/profile':1,'/search':1,'/login':1,'/history':1,'/movie-detail':1},href)){
     const m={'/':'index.html','/explore':'explore.html','/movies':'explore.html','/series':'explore.html','/watchlist':'watch-list.html','/profile':'profile.html','/search':'search.html','/login':'login.html','/history':'history.html','/movie-detail':'movie-detail.html'};a.href=m[href];
   }
   if(href==='#') { const target=routeForLabel(a.innerText||a.getAttribute('aria-label')); if(target) a.href=target; }
 });
 // Connect the common header/footer links even when the source prototype used # placeholders.
 document.querySelectorAll('header a, nav a, footer a').forEach(a=>{
   const target=routeForLabel(a.innerText||a.getAttribute('aria-label')); if(target && (a.getAttribute('href')==='#'||!a.getAttribute('href'))) a.href=target;
 });
 // Ensure every main area exposes links to the site's actual pages.
 document.querySelectorAll('nav').forEach(nav=>{
   const existing=[...nav.querySelectorAll('a')].map(a=>norm(a.innerText));
   const extras=[['Search','search.html'],['History','history.html'],['Profile','profile.html']];
   extras.forEach(([label,url])=>{if(!existing.some(x=>x===label.toLowerCase())){const a=document.createElement('a');a.href=url;a.textContent=label;a.className='text-on-surface-variant hover:text-primary transition-colors pb-1';nav.appendChild(a);}});
 });
 // Search inputs navigate to the dedicated search page and preserve the query.
 document.querySelectorAll('input[type="search"], input[placeholder*="Search" i], input[placeholder*="search" i], #header-search-input, #nav-search-input').forEach(input=>{
   input.addEventListener('keydown',e=>{if(e.key==='Enter' && input.value.trim()){e.preventDefault();go('search.html?q='+encodeURIComponent(input.value.trim()));}});
 });
 // Explicit page actions. Existing in-page controls are left untouched unless they are navigation actions.
 const idRoutes={
   'hero-watch-movie-btn':'watch.html','detail-play-btn':'watch.html','modal-play-btn':'watch.html',
   'hero-watchlist-btn':'watch-list.html','detail-bookmark-btn':'watch-list.html',
   'filmography-btn':'explore.html','tab-register':'register.html','switch-to-vip':'register.html',
   'btn-primary':'login.html'
 };
 Object.entries(idRoutes).forEach(([id,file])=>{const el=document.getElementById(id);if(el)el.addEventListener('click',e=>{if(id==='btn-primary')return; e.preventDefault();go(file);});});
 // Generic CTA routing by visible label, excluding controls that clearly perform local UI operations.
 document.addEventListener('click',e=>{
   const el=e.target.closest('button, a, [role="button"]'); if(!el)return;
   if(el.closest('#preview-modal') && el.id==='modal-bookmark-btn')return;
   const id=el.id||'';
   if(id==='hero-play-trailer-btn'){e.preventDefault();return;}
   if(id==='hero-watch-movie-btn'||id==='detail-play-btn'||id==='modal-play-btn'||id==='filmography-btn'||id==='tab-register'||id==='switch-to-vip')return;
   const label=el.innerText||el.getAttribute('aria-label')||el.title||'';
   const t=norm(label);
   let target=null;
   if(/return to film details|back to film details|return to catalog/.test(t))target='movie-detail.html';
   else if(/resume playing|watch again|watch movie|watch premiere|stream master edition|stream master/.test(t))target='watch.html';
   else if(/create vip account|join vip membership|register|đăng ký/.test(t))target='register.html';
   else if(/logout|sign out|đăng xuất/.test(t))target='login.html';
   else if(/my cinephile vault|watchlist|saved watchlist/.test(t))target='watch-list.html';
   else if(/patron profile|profile|account_circle/.test(t))target='profile.html';
   else if(/explore curated archive|explore all curations|explore complete filmography|film festivals|4k premieres|curation philosophy/.test(t))target='explore.html';
   else if(/privacy policy|terms of service/.test(t))target='policies.html';
   else if(/vip membership|upgrade to vip/.test(t))target='register.html';
   else if(/curated search|search archive|search titles/.test(t))target='search.html';
   if(target){e.preventDefault();go(target);}
 });
 // Make movie tiles open the detail page; interactive buttons inside cards retain their own behavior.
 document.querySelectorAll('.cinema-card, [data-movie-card], .movie-card').forEach(card=>{
   if(card.closest('a'))return; card.style.cursor='pointer'; card.addEventListener('click',e=>{if(e.target.closest('button, a, input'))return;go('movie-detail.html');});
 });
})();