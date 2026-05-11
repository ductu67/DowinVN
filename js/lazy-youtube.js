(function () {
  var STYLE = [
    '.lazy-yt__thumb{position:relative;aspect-ratio:16/9;background:#0f0f0f;border-radius:var(--radius-lg,8px);overflow:hidden;cursor:pointer}',
    '.lazy-yt__thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .3s}',
    '.lazy-yt__thumb:hover img{opacity:.85}',
    '.lazy-yt__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}',
    '.lazy-yt__play > div{width:64px;height:64px;background:rgba(255,0,0,.9);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform .2s}',
    '.lazy-yt__thumb:hover .lazy-yt__play > div{transform:scale(1.1)}',
    '.lazy-yt__title{margin-top:var(--space-3,12px);font-weight:600;color:var(--color-gray-800,#1f2937);font-size:var(--text-base,1rem)}'
  ].join('');

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function buildThumb(el) {
    var vid = el.dataset.videoid;
    if (!vid || vid === 'VIDEO_ID_1' || vid === 'VIDEO_ID_2' || vid === 'VIDEO_ID_3') return;
    var title = el.querySelector('.lazy-yt__title');
    var titleText = title ? title.textContent : '';
    el.innerHTML = '';

    var thumb = document.createElement('div');
    thumb.className = 'lazy-yt__thumb';
    thumb.setAttribute('role', 'button');
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('aria-label', 'Phát video: ' + titleText);

    var img = document.createElement('img');
    img.src = 'https://img.youtube.com/vi/' + vid + '/maxresdefault.jpg';
    img.alt = titleText;
    img.loading = 'lazy';
    img.decoding = 'async';
    thumb.appendChild(img);

    var playWrap = document.createElement('div');
    playWrap.className = 'lazy-yt__play';
    playWrap.setAttribute('aria-hidden', 'true');
    playWrap.innerHTML = '<div><svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';
    thumb.appendChild(playWrap);

    function activate() {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=0';
      iframe.title = titleText;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
      thumb.style.position = 'relative';
      thumb.innerHTML = '';
      thumb.appendChild(iframe);
    }

    thumb.addEventListener('click', activate);
    thumb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });

    el.appendChild(thumb);

    if (titleText) {
      var p = document.createElement('p');
      p.className = 'lazy-yt__title';
      p.textContent = titleText;
      el.appendChild(p);
    }
  }

  function init() {
    injectStyles();
    document.querySelectorAll('.lazy-yt[data-videoid]').forEach(buildThumb);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
