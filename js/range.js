(function ($) {
  'use strict';
  $('.price-range-slider').jRange({
      from: 0,
      to: 350,
      step: 1,
      width: 256,
      showScale: false,
      format: '',
      isRange : true,
      theme: "theme-trickster",
      onstatechange: function () {
        var values = $('.price-range-slider').val().split(',');
        $('.price-from').text('$' + values[0]);
        $('.price-to').text('$' + values[1]);
      }
  });
})(jQuery);
