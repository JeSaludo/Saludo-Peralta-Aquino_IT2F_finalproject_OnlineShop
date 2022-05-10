(function ($) {
  'use strict';
  var $radio_options = $('.radio-link');

  $radio_options.on('click', showSelected);

  function showSelected(e) {
    if ($(this).siblings('p').hasClass('open')) return;

    $radio_options.each(function (i) {
      $(this).
        siblings('p').
        removeClass('open').
        slideUp(600);
    });

    $(this).
      siblings('p').
      addClass('open').
      slideDown(600);
  }

  showSelected.apply($('input[type="radio"]:checked + .radio-link'));
})(jQuery);
