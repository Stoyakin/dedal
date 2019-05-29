"use strict";

function qs(query, root = document) {
  return root.querySelector(query);
}

function qsAll(query, root = document) {
  return root.querySelectorAll(query);
}

function getParent(el, findParent) {
  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.classList && el.classList.contains(findParent)) return el;
  }
  return false;
}

window.onload = () => qs('body').classList.add('page-loaded');

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) qs('body').classList.add('ios');

document.addEventListener("DOMContentLoaded", function (event) {

  window.site = {};

  window.site.form = {

    init: function init() {
      let _th = this,
        forms = qsAll('form'),
        fieldPhones = qsAll('.js-phone'),
        formElems = qsAll('.form__field-input, .form__field-textarea');
      for (let phoneItem of fieldPhones) {
        $(phoneItem).mask('+7(999) 999-9999')
      }
      for (let formElem of formElems) {
        if (formElem.value != '') {
          formElem.classList.add('no-empty')
        } else {
          formElem.classList.remove('no-empty')
        }
        formElem.addEventListener('keyup', function () {
          if (formElem.value != '') {
            formElem.classList.add('no-empty')
          } else {
            formElem.classList.remove('no-empty')
          }
        });
      }
      for (let formItem of forms) {
        formItem.addEventListener('submit', function (event) {
          if (!_th.checkForm($(this))) event.preventDefault()
        });
      }
      return this;
    },

    checkForm: function checkForm(form) {
      let checkResult = true;
      form.find('.warning').removeClass('warning');
      form.find('input, textarea, select').each(function () {
        if ($(this).data('req')) {
          switch ($(this).data('type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test($(this).val())) {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test($(this).val())) {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
            case 'checkbox_personal':
              if (!$(this).is(':checked')) {
                $(this).parents('.checkbox').addClass('warning');
                checkResult = false;
              }
              break;
            default:
              if ($.trim($(this).val()) === '') {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
          }
        }
      });
      return checkResult;
    }

  }.init();

  window.site.obj = {

    fadeOut: function fadeOut(selector, duration, cb = null) {
      if (!selector)
        return;
      let element,
        op = 1;
      if (typeof selector === 'string' || selector instanceof String) {
        element = document.querySelector(selector);
      } else {
        element = selector;
      }
      let timer = setInterval(function () {
        if (op <= 0.1) {
          clearInterval(timer);
          element.style.display = 'none';
          if (cb) cb();
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
      }, duration / 50 || 20);
    },

    fadeIn: function fadeIn(selector, duration, type, cb = null) {
      if (!selector)
        return;
      let element,
        op = 0.1,
        typeBlock = type ? type : 'block';
      if (typeof selector === 'string' || selector instanceof String) {
        element = document.querySelector(selector);
      } else {
        element = selector;
      }
      element.style.opacity = 0;
      element.style.display = typeBlock;
      let timer = setInterval(function () {
        if (op >= 1) {
          clearInterval(timer);
          if (cb) cb();
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
      }, duration / 50 || 20);
    },

    burger: function () {
      let _th = this,
        nav = qs('.nav');
      qs('.js-burger').addEventListener('click', function () {
        let _t = this;
        if (!_t.classList.contains('header__burger--active')) {
          _t.classList.add('header__burger--active');
          qs('body').classList.add('blocekd');
          _th.fadeIn('.nav', 300);
        } else {
          _t.classList.remove('header__burger--active');
          qs('body').classList.remove('blocekd');
          _th.fadeOut('.nav', 300);
        }
        return false;
      });
      qs('.js-close-nav').addEventListener('click', (e)=> {
        qs('.header__burger').classList.remove('header__burger--active');
        _th.fadeOut('.nav', 300);
        e.preventDefault();
      });
    },

    anim: function () {
      let elemsAnimArr = ['.js-scroll-anim'];

      function visChecker(el) {
        const rect = el.getBoundingClientRect();
        const wHeight = window.innerHeight || document.documentElement.clientHeight;
        const wWidth = window.innerWidth || document.documentElement.clientWidth;
        return (
          rect.bottom - el.offsetHeight * 0.75 <= wHeight &&
          rect.right <= wWidth
        );
      }

      function elemVisCheck(elArray) {
        window.addEventListener('scroll', () => {
          if (elArray.length) {
            elArray.forEach((item) => {
              if (document.querySelectorAll(item).length) {
                document.querySelectorAll(item).forEach((elem) => {
                  if (visChecker(elem)) {
                    elem.classList.add('start-animate');
                  }
                });
              }
            });
          }
        });
      }

      if (elemsAnimArr.length) {
        elemVisCheck(elemsAnimArr);
      }
    },

    swiperDirections: function () {
      let directionsSwiper = new Swiper('.js-swiper-directions', {
        loop: true,
        spaceBetween: 12,
        slidesPerView: 6,
        speed: 500,
        mousewheel: false,
        grabCursor: false,
        keyboard: false,
        simulateTouch: false,
        allowSwipeToNext: false,
        allowSwipeToPrev: false,
        navigation: {
          nextEl: '.directions .swiper-button-next',
          prevEl: '.directions .swiper-button-prev'
        },
        breakpoints: {
          767: {
            slidesPerView: 1
          },
          992: {
            slidesPerView: 3
          },
          1365: {
            slidesPerView: 5
          },
        }
      });
    },

    init: function init() {

      let _self = this,
        elemsAnimArr = ['.js-scroll-anim'];

      if (elemsAnimArr.length) this.anim();

      let eventScroll
      try {
        eventScroll = new Event('scroll')
      } catch (e) {
        eventScroll = document.createEvent('Event');
        eventScroll.initEvent('scroll', false, false);
      }
      window.dispatchEvent(eventScroll)

      return this;
    }

  }.init();

});

