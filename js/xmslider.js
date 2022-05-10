'use strict';
// my app
var xm_trickster = {};

xm_trickster.namespace = function(path) {
  var subspaces = path.split('.'),
      parent = this,
      i, len;

  for (i = 0, len = subspaces.length; i < len; i++) {
    // non destructive namespace set
    if (typeof subspaces[i] !== 'undefined') {
      parent[subspaces[i]] = {};
    }
    parent = parent[subspaces[i]];
  }
};

xm_trickster.namespace('plugins.xmslider');

//@copy Scoccimarro Maximiliano
(function () {
  /* @param: config
  ** config options -> slides: container CSS selector, controls: container CSS selector
  */
  function xmslider(config) {
    var slider = {},
        defaults = {
          slides: 'slides',
          controls: 'controls',
          startAt: 0,
          currentIndex: 0,
          autoSlide: true,
          autoSlideTimeout: 3000,
          speed: 600,
          easing: 'ease-in-out',
          animation: 'fade',
          mode: 'vertical',
          selectedControlClass: 'selected',
          slide: [],
          control: [],
          onChangeSlide: function () {}
        },
        asID;

    function init() {
      slider.config = extend(defaults, config);

      slider.config.currentIndex = slider.config.startAt;
      if (slider.config.mode === 'vertical') {
        slider.config.direction = 'top'
      } else if (slider.config.mode === 'horizontal') {
        slider.config.direction = 'left'
      }

      initSlides();
      initControls();
      bindControls();
      slider.config.onChangeSlide.apply(slider);

      if (slider.config.autoSlide) {
        slider.startAutoSlide();
      }
    }

    function getSlideOffset() {
      var offset = 0;
      switch (slider.config.mode) {
        case 'vertical':
          offset = slider.config.slide[0].offsetHeight;
          break;
        case 'horizontal':
          offset = slider.config.slide[0].offsetWidth;
          break;
      }

      return offset;
    }

    function animateNext() {
      if (slider.config.currentIndex === 0) {
        animatePrev(true);
        return;
      }
      var t = parseInt((document.getElementsByClassName(slider.config.slides)[0]).
        style[slider.config.direction]);
        t -= getSlideOffset();
      (document.getElementsByClassName(slider.config.slides)[0]).
        style[slider.config.direction] = t + "px";
    }

    function animatePrev(reset) {
      var t = parseInt((document.getElementsByClassName(slider.config.slides)[0]).
        style[slider.config.direction]);
      reset = typeof reset !== 'undefined' ? reset : false;
      if (reset) {
        t = 0;
      } else {
        t += getSlideOffset();
      }
      (document.getElementsByClassName(slider.config.slides)[0]).
        style[slider.config.direction] = t + "px";
    }

    function initSlides() {
      slider.config.slide = (document.getElementsByClassName(slider.config.slides)[0]).children;
      var speed = slider.config.speed / 1000,
          easing = slider.config.easing,
          i, len;
      // hide all slides except current index
      for (i = 0, len = slider.config.slide.length; i < len; i++) {
        // init slide positions
        slider.config.slide[i].style.width = "100%";
        slider.config.slide[i].style.height = "100%";
        slider.config.slide[i].style.position = "absolute";
        if (slider.config.mode === 'vertical') {
          slider.config.slide[i].style.top = i * getSlideOffset() + "px";
          slider.config.slide[i].style.left = "0";
        } else if (slider.config.mode === 'horizontal') {
          slider.config.slide[i].style.top = "0";
          slider.config.slide[i].style.left = i * getSlideOffset() + "px";
        }
      }

      (document.getElementsByClassName(slider.config.slides)[0]).
        style.top = "0";
      (document.getElementsByClassName(slider.config.slides)[0]).
        style.left = "0";
      (document.getElementsByClassName(slider.config.slides)[0]).
        style.transition = "all " + speed + "s " + easing;
    }

    function initControls() {
      slider.config.control = (document.getElementsByClassName(slider.config.controls)[0]).children;
      // select current index control
      slider.config.control[slider.config.currentIndex].
        classList.add(slider.config.selectedControlClass);
    }

    function bindControls() {
      var i;

      for (i = 0; i < slider.config.control.length; i++) {
        slider.config.control[i].addEventListener('click', (function (j) {
          return function () {
            if (slider.config.autoSlide) {
              slider.stopAutoSlide();
            }
            slider.showSlide(j, function () { slider.config.onChangeSlide.apply(slider); });
          };
        })(i));
      }
    }

    function getNextIndex(i) {
      return i < (slider.config.slide.length - 1) ? i + 1 : 0;
    }

    function getPrevIndex(i) {
      return i > 0 ? i - 1 : slider.config.slide.length - 1;
    }

    function select() {
      slider.config.control[slider.config.currentIndex].
        classList.add(slider.config.selectedControlClass);
    }

    function unselect() {
      slider.config.control[slider.config.currentIndex].
        classList.remove(slider.config.selectedControlClass);
    }

    slider.nextSlide = function (callback) {
      callback();
      unselect();
      slider.config.currentIndex = getNextIndex(slider.config.currentIndex);
      animateNext();
      select();
      slider.config.onChangeSlide.apply(slider);
    };

    slider.prevSlide = function (callback) {
      callback();
      unselect();
      slider.config.currentIndex = getPrevIndex(slider.config.currentIndex);
      animatePrev();
      select();
      slider.config.onChangeSlide.apply(slider);
    };

    slider.showSlide = function (i, callback) {
      if (slider.config.currentIndex === i) return;

      var dif = Math.abs(slider.config.currentIndex - i),
          j;

      if (slider.config.currentIndex < i) {
        for (j = 0; j < dif; j++) {
          slider.nextSlide(callback);
        }
      } else {
        for (j = 0; j < dif; j++) {
          slider.prevSlide(callback);
        }
      }
    };

    slider.stopAutoSlide = function () {
      slider.config.autoSlide = false;
      clearInterval(asID);
    };

    slider.startAutoSlide = function () {
      slider.config.autoSlide = true;
      asID = setInterval(function () {
        slider.nextSlide(function () { slider.config.onChangeSlide.apply(slider); });
      }, slider.config.autoSlideTimeout);
    };

    init();
    return slider;
  }

  // shallow copy
  function extend(o, p) {
    var prop;
    for (prop in p) {
      o[prop] = p[prop];
    }
    return o;
  }

  // add as a service to your app
  xm_trickster.plugins.xmslider = xmslider;
})();

// use xmslider
var ctrl = document.getElementsByClassName('slider-controls')[0],
    slider = xm_trickster.plugins.xmslider({
      slides: 'slide-list',
      controls: 'slider-controls',
      onChangeSlide: function() {
        ctrl.classList.remove('secondary');
        if (this.config.currentIndex === 2) {
          ctrl.classList.add('secondary');
        }
      },
      // autoSlide: false,
      autoSlideTimeout: 5000
      // mode: 'horizontal'
    });
