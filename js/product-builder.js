(function ($) {
  'use strict';

  // BUILDER SERVICE
  function builderService(config) {
    var builder = {
          product: {
            imageSelector: '.product-builder-img',
            imageSrc: {
              path: 'img/builder/products/',
              name: '',
              extension: '.png'
            },
            priceSelector: '.product-builder-total',
            price: 0,
            sticker: '',
            color: ''
          }
        },
        initialConfig = {};

    // keep original config intact
    // so you can use it for other purposes if you desire
    deepExtend(builder.product, config);

    // keep initial config for restart functionality
    deepExtend(initialConfig, builder.product);

    // get product price + extras
    builder.refreshPrice = function refreshPrice(extra, cant) {
      extra = typeof extra === 'undefined' ? 0 : extra;
      $(this.product.priceSelector).text('$' + (this.product.price + extra)*cant);
    };

    function resolvePathName() {
      var src = builder.product.color;
      if (builder.product.sticker) src += '_' + builder.product.sticker;
      builder.product.imageSrc.name = src + builder.product.imageSrc.extension;
    }

    builder.refreshImage = function refreshImage() {
      resolvePathName();
      // change image
      $(this.product.imageSelector).
        children('img').
        attr('src', this.product.imageSrc.path + this.product.imageSrc.name);
      // refresh imgLiquid
      $(this.product.imageSelector).imgLiquid();
    };

    builder.changeColor = function changeColor(color) {
      this.product.color = color;
      this.refreshImage();
    };

    builder.changeSticker = function changeSticker(sticker) {
      if (sticker === 'none') sticker = '';
      this.product.sticker = sticker;
      this.refreshImage();
    };

    builder.restart = function () {
      this.product = {};
      deepExtend(this.product, initialConfig);
    };

    return builder;
  }

  // deep copy object
  function deepExtend(o, e) {
    var prop;
    for (prop in e) {
      if (typeof e[prop] === 'object') {
        var c = e[prop] instanceof Array ? [] : {};
        o[prop] = c;
        deepExtend(o[prop], e[prop]);
      } else {
        o[prop] = e[prop];
      }
    }
  }
  // /BUILDER SERVICE

  // COLORPICKER SERVICE
  function colorpickerService(config, builder) {
    var colorpicker = {
          config: {
            containerSelector: '.product-builder-colorpicker',
            colorSelector: '.c-color',
            checkMarkSelector: '.check',
            selectedColor: '',
          },
          builder: builder,
          started: false
        },
        initialConfig = {};

    // keep original config intact
    // so you can use it for other purposes if you desire
    deepExtend(colorpicker.config, config);

    // keep initial config for restart functionality
    deepExtend(initialConfig, colorpicker.config);

    function init() {
      colorpicker.selectColor.
        apply($(colorpicker.config.colorSelector + '.' + colorpicker.config.selectedColor));

      colorpicker.started = true;
      $(colorpicker.config.colorSelector).on('click', colorpicker.selectColor);
    }

    colorpicker.selectColor = function selectColor() {
      var color = $(this).attr('class').split(' ')[1],
          checkMark = '.' + color + '-check';

      // do nothing if selected color is the same
      if (color === colorpicker.config.selectedColor && colorpicker.started) return;

      colorpicker.config.selectedColor = color;
      colorpicker.builder.changeColor(color);

      $(colorpicker.config.containerSelector + ' ' + colorpicker.config.checkMarkSelector).
      removeClass('selected');
      $(checkMark).addClass('selected');
    };

    colorpicker.restart = function restart() {
      this.config = {};
      deepExtend(this.config, initialConfig);
      colorpicker.started = false;
      colorpicker.selectColor.
        apply($(colorpicker.config.colorSelector + '.' + colorpicker.config.selectedColor));
      colorpicker.started = true;
    };

    init();

    return colorpicker;
  }
  // COLORPICKER SERVICE

  // FORM SERVICE
  function formService(config, builder) {
    var form = {
          config: {
            quantity: [],
            pricing: [],
            stickers: []
          },
          builder: builder
        },
        initialConfig = {};

    // keep original config intact
    // so you can use it for other purposes if you desire
    deepExtend(form.config, config);

    // keep initial config for restart functionality
    deepExtend(initialConfig, form.config);

    function init() {
      initOptions();
      attachEventHandlers();
      selectOptions();
    }

    function initOptions() {
      createOptions(form.config.stickers);
      createOptions(form.config.pricing);
    }

    function setQuantity() {
      if (form.config.quantity.length === 0) return;
      $(form.config.quantity.id).text(form.config.quantity.value);
      form.changeQuantity();
    }

    function createOptions(options) {
      var input, id;
      for (input in options.select) {
        options.select[input].forEach(function (el, i) {
          var opt = document.createElement('option');
          opt.value = i;
          opt.innerHTML = el.name;
          document.getElementById(input).appendChild(opt);
        });
      }
    }

    function selectOptions() {
      selectOption(form.config.stickers, form.changeSticker);
      selectOption(form.config.pricing, form.changePrice);
      setQuantity();
    }

    function selectOption(options, callback) {
      var id;
      if (typeof options.select !== 'undefined') {
        for (id in options.select) {
          options.select[id].forEach(function (el, i) {
            if (el.selected) {
              document.getElementById(id).children[i].selected = true;
              callback.apply($('#' + id));
            }
          });
        }
      }

      if (typeof options.checkbox !== 'undefined') {
        for (id in options.checkbox) {
          options.checkbox[id].forEach(function (el, i) {
            if (el.selected) {
              document.getElementById(id).checked = true;
              callback.apply($('#' + id));
            } else {
              document.getElementById(id).checked = false;
            }
          });
        }
      }

      if (typeof options.radio !== 'undefined') {
        for (id in options.radio) {
          options.radio[id].forEach(function (el, i) {
            if (el.selected) {
              document.getElementById(id).checked = true;
              callback.apply($('#' + id));
            } else {
              document.getElementById(id).checked = false;
            }
          });
        }
      }
    }

    function attachEventHandlers() {
      // attach event handlers to monitor input changes
      attachEventHandler(form.config.pricing, form.changePrice);
      attachEventHandler(form.config.stickers, form.changeSticker);
      $(form.config.quantity.changeSelector).on('click', form.changeQuantity);
    }

    function attachEventHandler(el, callback) {
      var input, id;
      for (input in el) {
        for (id in el[input]) {
          $('#' + id).on('change', callback);
        }
      }
    }

    function updateSelected(el, val) {
      el.forEach(function (input, i) {
        input.selected = false;
      });

      el[val].selected = true;
      return el[val].value;
    }

    function updateSelectedCheck(el, id) {
      var selected = document.getElementById(id).checked;
      el.forEach(function (input, i) {
        input.selected = selected;
      });
    }

    function updateSelectedRadio(el, id) {
      var name, id2;
      el.forEach(function (input, i) {
        name = input.name;
        input.selected = true;
      });

      for (id2 in form.config.pricing.radio) {
        form.config.pricing.radio[id2].forEach(function (el, i) {
          if (id !== id2 || el.radio === name) el.selected = false;
        });
      }
    }

    form.changeSticker = function changeSticker() {
      var sticker = updateSelected(form.config.stickers.select[$(this).attr('id')], $(this).val());
      form.builder.changeSticker(sticker);
      form.refreshOverview();
    };

    form.changePrice = function changePrice() {
      if (typeof form.config.pricing.select[$(this).attr('id')] !== 'undefined')
        updateSelected(form.config.pricing.select[$(this).attr('id')], $(this).val());

      if (typeof form.config.pricing.checkbox !== 'undefined' && typeof form.config.pricing.checkbox[$(this).attr('id')] !== 'undefined')
          updateSelectedCheck(form.config.pricing.checkbox[$(this).attr('id')], $(this).attr('id'));

      if (typeof form.config.pricing.radio !== 'undefined' && typeof form.config.pricing.radio[$(this).attr('id')] !== 'undefined')
          updateSelectedRadio(form.config.pricing.radio[$(this).attr('id')], $(this).attr('id'));

      form.builder.refreshPrice(form.getTotal(), getQuantity());
      form.refreshOverview();
    };

    form.getTotal = function getTotal() {
      var total = 0, input, id;
      for (input in this.config.pricing) {
        for (id in this.config.pricing[input]) {
          this.config.pricing[input][id].forEach(function (el, i) {
            if (el.selected) {
              total += el.value;
            }
          });
        }
      }
      return total;
    };

    form.refreshOverview = function refreshOverview() {
      createOverviewItems('Outer Options', 'outer', '.product-builder-overview-outer');
      createOverviewItems('Inner Options', 'inner', '.product-builder-overview-inner');
      createOverviewItems('Warranty', 'warranty', '.product-builder-overview-warranty');
    };

    function createOverviewItems(head, type, selector) {
      var title = document.createElement('h6'),
          $overview = $(selector),
          input, id, additionals = '',
          p, span;
      // clear overview
      $overview.empty();;
      title.classList.add('details-list-title');
      title.innerHTML = head;
      $overview.append(title);
      for (input in form.config.pricing) {
        for (id in form.config.pricing[input]) {
          form.config.pricing[input][id].forEach(function (el, i) {
            if (el.selected && el.type === type) {
              if (el.title === 'Additionals') {
                additionals += el.description + ', ';
                return;
              }
              p = document.createElement('p');
              p.classList.add('details-list-info');
              if (type !== 'warranty') {
                span = document.createElement('span');
                span.innerHTML = el.title + ': ';
                p.appendChild(span);
              }
              p.innerHTML = p.innerHTML + el.description;
              $overview.append(p);
            }
          });
        }
      }

      if (type === 'inner' && additionals) {
        additionals = additionals.slice(0, additionals.length-2);
        p = document.createElement('p');
        p.classList.add('details-list-info');
        span = document.createElement('span');
        span.innerHTML = 'Additionals' + ': ';
        p.appendChild(span);
        p.innerHTML = p.innerHTML + additionals;
        $overview.append(p);
      }

      for (input in form.config.stickers) {
        for (id in form.config.stickers[input]) {
          form.config.stickers[input][id].forEach(function (el, i) {
            if (el.selected && el.type === type) {
              p = document.createElement('p');
              p.classList.add('details-list-info');
              if (type !== 'warranty') {
                span = document.createElement('span');
                span.innerHTML = el.title + ': ';
                p.appendChild(span);
              }
              p.innerHTML = p.innerHTML + el.description;
              $overview.append(p);
            }
          });
        }
      }
    }

    function getQuantity() {
      if (form.config.quantity.length === 0) return 1;
      return parseInt($(form.config.quantity.id).text(), 10);
    }

    form.changeQuantity = function changeQuantity() {
      form.builder.refreshPrice(form.getTotal(), getQuantity());
    };

    form.restart = function restart() {
      this.config = {};
      deepExtend(this.config, initialConfig);
      selectOptions();
    };

    init();

    return form;
  }
  // /FORM SERVICE

/******************************************************************/
  // initial product configuration
  // replace with yours from json / database
  var builderConfig = {
        price: 150
      },
      myBuilder = builderService(builderConfig),
      colorpickerConfig = {
        selectedColor: 'gold'
      },
      myColorpicker = colorpickerService(colorpickerConfig, myBuilder),
      formConfig = {
        quantity: {
          id: '#pb_quantity',
          changeSelector: '.pb_quantity_change',
          value: 4
        },
        pricing: {
          select: {
            pb_helmet_material: [
              {
                title: 'Helmet Material',
                name: 'Reinforced Polymer ($0)',
                description: 'Reinforced Polymer',
                type: 'outer',
                selected: true,
                value: 0
              },
              {
                title: 'Helmet Material',
                name: 'Premium Polymer ($10)',
                description: 'Premium Polymer',
                type: 'outer',
                selected: false,
                value: 10
              }
            ],
            pb_inner_padding: [
              {
                title: 'Inner Padding',
                name: 'Regular ($0)',
                description: 'Regular',
                type: 'inner',
                selected: false,
                value: 0
              },
              {
                title: 'Inner Padding',
                name: 'Antishock Gel and Silk ($20)',
                description: 'Antishock Gel and Silk',
                type: 'inner',
                selected: true,
                value: 20
              }
            ]
          }
        },
        stickers: {
          select: {
            pb_sticker: [
              {
                title: 'Sticker / Illustration',
                name: 'None',
                description: 'None',
                type: 'outer',
                selected: false,
                value: 'none'
              },
              {
                title: 'Sticker / Illustration',
                name: 'American Eagle',
                description: 'American Eagle',
                type: 'outer',
                selected: true,
                value: 'eagle'
              }
            ]
          }
        }
      },
      myForm = formService(formConfig, myBuilder),
      $sizepickerOption = $('.sz-option'),
      $restartButton = $('.restart-builder-button');


  $restartButton.on('click', restartBuilder);
  $sizepickerOption.on('click', toggleSizepickerOption);

  function restartBuilder() {
    myBuilder.restart();
    myColorpicker.restart();
    myForm.restart();
  }

  function toggleSizepickerOption() {
    $sizepickerOption.removeClass('selected');
    $(this).addClass('selected');
  }
})(jQuery);
