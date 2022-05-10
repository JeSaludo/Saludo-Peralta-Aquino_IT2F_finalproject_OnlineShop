(function ($) {
  'use strict';
  var $tab_controls = $('.tab-control');

  $tab_controls.on('click', showTabItem);

  function showTabItem(e) {
    var indexToShow = $(this).index(),
        $tabControls = $(this).parent(),
        $tabItems = $tabControls.siblings('.tab-item');

    $tabControls.children('.tab-control').removeClass('selected');
    $(this).addClass('selected');
    $tabItems.addClass('hidden');
    $tabItems.eq(indexToShow).removeClass('hidden');
  }
})(jQuery);
