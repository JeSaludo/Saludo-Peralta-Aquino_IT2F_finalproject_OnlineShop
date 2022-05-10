(function ($) {
  'use strict';
  var $toScale = $('.scalable'),
      $wrapper,
      imgWidth = $toScale.width(),
      imgHeight = $toScale.height(),
      // desired zoom, 1 = no zoom, 1.3 = +30%
      magGlassZoom = 1.3,
      enableFromResolution = 681;

  // remove handlers on low resolution
  $(window).on('resize', toggleZoomifier);
  toggleZoomifier.apply($(window));

  function toggleZoomifier() {
    if ($(this).outerWidth() >= enableFromResolution) {
      $toScale.on('mousemove', zoom);
      $(window).on('scroll', removeZoom);
    } else {
      $toScale.off('mousemove', zoom);
      $(window).off('scroll', removeZoom);
    }
  }

  // create magnifying glass
  createImgGhost.apply($toScale);

  function createImgGhost(e) {
    var imgSrc = $(this).children('img').attr('src');
    createWrapper(imgSrc);

    $(this).append($wrapper);
  }

  function removeZoom() {
    $wrapper.css({ display: 'none' });
  }

  function createWrapper(imgSrc) {
    $wrapper = $('<div class="mglass">');

    $wrapper.
      css({
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundImage: 'url(' + imgSrc + ')',
        backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
        backgroundRepeat: 'no-repeat',
        display: 'none',
        cursor: 'none',
        position: 'absolute',
        boxShadow: '0 0 0 7px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25), inset 0 0 40px 2px rgba(0, 0, 0, 0.25)',
        transform: 'scale(' + magGlassZoom + ')'
      });
  }

  function updateImg() {
    var imgSrc = $toScale.children('img').attr('src');
    $wrapper.css({
      backgroundImage: 'url(' + imgSrc + ')',
    });
  }

  function zoom(e) {
    var currX = e.pageX - $(this).offset().left + .5,
        currY = e.pageY - $(this).offset().top,
        rx = Math.round((currX / imgWidth*imgWidth) - 150/2)*-1,
        ry = Math.round((currY / imgHeight*imgHeight) - 150/2)*-1,
        bgp = rx + "px " + ry + "px",
        px = currX - 150/2,
        py = currY - 150/2;

    if (currX >= imgWidth || currY >= imgHeight || currX < 0 || currY < 0) {
      $wrapper.css({ display: 'none' });
		} else {
      updateImg();
      $wrapper.css({ display: 'block' });
    }

    $wrapper.
    css({
      backgroundPosition: bgp,
      top: py + 'px',
      left: px + 'px'
    });
  }
})(jQuery);
