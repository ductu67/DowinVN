/**
 * Zoom ảnh lightbox: nút +/−/reset, cuộn chuột, double-click phóng nhanh.
 * Dùng width thực để overflow scroll ổn định (không dùng transform scale cho layout).
 */
(function () {
  function baseWidth(img, stage) {
    if (!img.naturalWidth) return 400;
    var cap = Math.min(1400, stage.clientWidth - 24);
    return Math.min(img.naturalWidth, cap);
  }

  function initGalleryZoom(options) {
    var modal = document.getElementById(options.modalId);
    var img = document.getElementById(options.imageId);
    var stage = document.getElementById(options.stageId);
    var btnIn = document.getElementById(options.zoomInId);
    var btnOut = document.getElementById(options.zoomOutId);
    var btnReset = document.getElementById(options.zoomResetId);
    var labelPct = document.getElementById(options.pctId);

    if (!modal || !img || !stage) return null;

    var scale = 1;
    var minScale = 1;
    var maxScale = 4;
    var step = 0.25;

    function pct() {
      return Math.round(scale * 100) + "%";
    }

    function apply() {
      if (!img.naturalWidth) return;
      var bw = baseWidth(img, stage);
      var w = Math.round(bw * scale);
      img.style.width = w + "px";
      img.style.height = "auto";
      img.style.maxWidth = "none";
      if (labelPct) labelPct.textContent = pct();
    }

    function setScale(next) {
      scale = Math.min(maxScale, Math.max(minScale, next));
      apply();
    }

    function zoomIn() {
      setScale(scale + step);
    }

    function zoomOut() {
      setScale(scale - step);
    }

    function resetZoom() {
      scale = 1;
      if (img.naturalWidth) {
        var bw = baseWidth(img, stage);
        img.style.width = bw + "px";
        img.style.height = "auto";
      } else {
        img.style.width = "";
      }
      if (labelPct) labelPct.textContent = pct();
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }

    if (btnIn) btnIn.addEventListener("click", function (e) { e.stopPropagation(); zoomIn(); });
    if (btnOut) btnOut.addEventListener("click", function (e) { e.stopPropagation(); zoomOut(); });
    if (btnReset) btnReset.addEventListener("click", function (e) { e.stopPropagation(); resetZoom(); });

    stage.addEventListener(
      "wheel",
      function (e) {
        if (modal.style.display !== "flex" && modal.style.display !== "block") return;
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      },
      { passive: false }
    );

    img.addEventListener("dblclick", function (e) {
      e.stopPropagation();
      if (scale > 1) resetZoom();
      else setScale(Math.min(2, maxScale));
    });

    window.addEventListener("resize", function () {
      if (modal.style.display === "flex" || modal.style.display === "block") apply();
    });

    return {
      reset: resetZoom,
      syncOpen: function () {
        scale = 1;
        function finish() {
          resetZoom();
        }
        if (img.complete && img.naturalWidth) {
          finish();
        } else {
          img.addEventListener("load", finish, { once: true });
        }
      },
    };
  }

  window.initGalleryZoom = initGalleryZoom;
})();
