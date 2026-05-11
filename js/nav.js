(function () {
  var mq = window.matchMedia('(max-width: 900px)');

  function closeMenus() {
    document.querySelectorAll('.header').forEach(function (h) {
      h.classList.remove('nav-open');
      var t = h.querySelector('.nav-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  }

  document.querySelectorAll('.header').forEach(function (header) {
    var toggle = header.querySelector('.nav-toggle');
    var nav = header.querySelector('#site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    header.querySelectorAll('.dropdown > .dropbtn').forEach(function (dropbtn) {
      dropbtn.addEventListener('click', function (e) {
        if (!mq.matches) return;
        e.preventDefault();
        var dd = dropbtn.closest('.dropdown');
        var wasOpen = dd.classList.contains('open');
        header.querySelectorAll('.dropdown').forEach(function (d) {
          d.classList.remove('open');
        });
        if (!wasOpen) dd.classList.add('open');
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenus();
  });

  function onMqChange() {
    if (!mq.matches) closeMenus();
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', onMqChange);
  } else {
    mq.addListener(onMqChange);
  }
})();
