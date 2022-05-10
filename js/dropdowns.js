(function ($) {
  'use strict';
  // DROPDOWNS
  var $dropdown_control = $('.dropdown-control');

  $dropdown_control.on('click', toggleDropdown);

  function toggleDropdown(e, notoggle) {
    e.preventDefault();
    e.stopPropagation();
    notoggle = typeof notoggle === 'undefined' ? false : notoggle;

    if (!notoggle) {
      $(this).
        toggleClass('open');
    }

    $(this).
      siblings('.dropdown').
      slideToggle(500);
  }

  $('.dropdown-control.open').trigger('click', true);

  // DROPDOWN OPTIONS
  var $languageOption = $('.language-option'),
      $currencyOption = $('.currency-option'),
      $currencySelectedOption = $('.currency-selected-option'),
      $languageSelectedOption = $('.language-selected-option');


  $languageOption.on('click', selectLanguage);
  $currencyOption.on('click', selectCurrency);

  function selectLanguage(e) {
    e.preventDefault();
    e.stopPropagation();

    var $dropdown_control = $(this).parents().eq(1).find('.dropdown-control'),
        selectedOption = $(this).attr('data-language');

    // clear previous selected option
    $languageOption.removeClass('selected');
    // change selected option
    $languageOption.
      filter(function() {
        return $(this).attr('data-language') === selectedOption;
      }).
      addClass('selected');
    $languageSelectedOption.text(selectedOption);

    // toggle dropdown
    $dropdown_control.trigger('click');
  }

  function selectCurrency(e) {
    e.preventDefault();
    e.stopPropagation();

    var $dropdown_control = $(this).parents().eq(1).find('.dropdown-control'),
        selectedOption = $(this).attr('data-currency');

    // clear previous selected option
    $currencyOption.removeClass('selected');
    // change selected option
    $currencyOption.
      filter(function() {
        return $(this).attr('data-currency') === selectedOption;
      }).
      addClass('selected');
    $currencySelectedOption.text(selectedOption);

    // toggle dropdown
    $dropdown_control.trigger('click');
  }

  // CLICK ANYWHERE CLOSABLE ITEMS
  $('body').on('click', closeAll);

  function closeAll() {
    $('.click-closable.open').trigger('click');
  }

  // SEARCH FORM
  var $searchForm = $('.search-form'),
      $searchInput = $searchForm.find('input[name="search"]'),
      $submitButton = $searchForm.find('.search-submit'),
      $cancelButton = $searchForm.find('.search-cancel');

  $searchInput.on('focus', toggleSearch);
  $searchInput.on('blur', toggleSearch);
  // use mousedown to prevent event cancel
  $cancelButton.on('mousedown', cancelForm);
  $submitButton.on('click', submitForm);

  function toggleSearch() {
    toggleExtended();
    $submitButton.toggleClass('hidden');
    $cancelButton.toggleClass('hidden');
  }

  function toggleExtended() {
    $searchForm.toggleClass('extended');
  }

  function submitForm() {
    $searchForm.submit();
  }

  function cancelForm() {
    $searchInput.val('');
  }

  // CART
  var $cart_control = $('.cart-dropdown-control'),
      $cart = $('.cart-dropdown'),
      $cart_dropdown = $('.cart-dropdown-items');

  $cart_control.on('click', toggleCartDropdown);

  // position cart
  var maxOffset = 165,
      gridWidth = document.getElementsByClassName('navigation')[0].offsetWidth,
      rightSurplus = (document.body.clientWidth - gridWidth) / 2,
      rightOffset = Math.min(rightSurplus, maxOffset);

  if (window.innerWidth <= 680) {
    rightOffset = 0;
  }

  $cart.css({
    right: -rightOffset + "px",
  });

  function toggleCartDropdown(e) {
    var $cur_cart = $(this).siblings('.cart-dropdown');
    e.stopPropagation();
    // stretch to bottom
    var cartDropdownHeight = (window.innerHeight - 280) + "px";
    $cur_cart.
      children('.cart-dropdown-items').
      height(cartDropdownHeight);

    // toggle cart
    $(this).find('.svg-cart').toggleClass('hidden');
    $(this).find('.svg-cross').toggleClass('hidden');
    $cur_cart.toggleClass('opened');
  }
})(jQuery);
