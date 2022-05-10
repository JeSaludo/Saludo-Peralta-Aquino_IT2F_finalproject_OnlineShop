(function ($) {
  'use strict';
  var $img_selectors = $('.product-img-list-item');

  $img_selectors.on('click', changeImg);

  function changeImg(e) {
    // if already selected, do nothing
    if ($(this).hasClass('selected')) return;

    var current_img = $(this).find('img').attr('src'),
        $selector_list = $(this).parent(),
        $displayed_img = $(this).parents().eq(1).children('.product-img');

    // change displayed img
    $displayed_img
      .children('img')
      .attr('src', current_img);
    // reload img liquid
    $displayed_img.imgLiquid();

    // change img list item selection
    $selector_list.find('.product-img-list-item').removeClass('selected');
    $(this).addClass('selected');
  }
})(jQuery);
