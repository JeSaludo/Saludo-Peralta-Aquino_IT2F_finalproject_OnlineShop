(function ($) {
  'use strict';
  var $counter_up = $('.increment-count'),
      $counter_down = $('.decrement-count'),
      maxCount = 100,
      minCount = 1;

  $counter_up.on('click', incrementCount);
  $counter_down.on('click', decrementCount);

  function incrementCount(e) {
    var $count = $(this).siblings('.count'),
        count = parseInt($count.text());
    count = count >= maxCount ? maxCount : count + 1;
    $count.text(count);
  }

  function decrementCount(e) {
    var $count = $(this).siblings('.count'),
        count = parseInt($count.text());
    count = count <= minCount ? minCount : count - 1;
    $count.text(count);
  }
})(jQuery);
