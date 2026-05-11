(function () {
  function initLightbox(modalId, closeModalFn) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModalFn();
    });

    document.addEventListener('keydown', function (e) {
      var open = modal.style.display === 'block' || modal.style.display === 'flex';
      if (e.key === 'Escape' && open) {
        closeModalFn();
      }
    });
  }

  window.initLightbox = initLightbox;
})();
