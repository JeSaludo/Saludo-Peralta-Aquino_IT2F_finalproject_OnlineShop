(function ($) {
  'use strict';
  var $search_control = $('.search-control');

  $search_control.on('click', toggleSearch);

  function toggleSearch(e) {
    $('.search-form.v2').toggleClass('open');
  }
})(jQuery);
