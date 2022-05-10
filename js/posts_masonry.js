(function ($) {
  'use strict';
  $('.post-preview-list').masonry({
    itemSelector: '.post-preview-list-item',
    columnWidth: 370,
    gutter: 30,
    horizontalOrder: true
  });
})(jQuery);
