(function ($) {
  'use strict';
  var $rating = $('.rating.changeable');

  $rating.children('.rating-item').on('click', updateRating);

  function updateRating(e) {
    var $rating = $(this).parent(),
        currentIndex = $(this).index();

    $rating.
      children('.rating-item').
      removeClass('filled').
      slice(0, currentIndex + 1).
      addClass('filled');
  }
})(jQuery);
