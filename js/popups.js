(function ($) {
  'use strict';
  $('.popup-trigger').magnificPopup({
    type:'inline',
    showCloseBtn: false,
    mainClass: 'mfp-anim',
    removalDelay: 300
  });
  // custom close button
  $('.close-btn').on('click', $.magnificPopup.instance.close);
})(jQuery);
