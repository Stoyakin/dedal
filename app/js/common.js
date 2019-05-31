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

    swiperIprod: function () {

      let iprodSwiper = new Swiper('.js-swiper-iprod', {
        loop: false,
        spaceBetween: 32,
        slidesPerView: 'auto',
        centeredSlides: true,
        speed: 1500,
        autoplay: {
          delay: 7000,
        },
        navigation: {
          nextEl: '.iprod .swiper-button-next',
          prevEl: '.iprod .swiper-button-prev'
        },
        pagination: {
          el: '.iprod .swiper-pagination',
          clickable: true,
        },
        on: {
          init: function () {
            setTimeout(() => {
              this.params.autoplay.delay = 10000;
            }, 15100);
            setTimeout(() => {
              this.$el[0].classList.add('start-anim');
            }, 200);
          },
        },
        breakpoints: {
          767: {
            spaceBetween: 8,
          }
        },
      });

    },

    swiperInews: function () {

      let ipublSwiper = new Swiper('.js-swiper-ipubl', {
        speed: 1500,
        spaceBetween: 32,
        slidesPerView: 3,
        simulateTouch: true,
        navigation: {
          nextEl: '.ipubl .swiper-wall-next',
          prevEl: '.ipubl .swiper-wall-prev',
        },
        // on: {
        //   slideChange: () => {
        //     if (this.isNextNews && (this.$refs.newsSlider.swiper.activeIndex > this.$refs.newsSlider.swiper.slides.length - 5 )) {
        //       this.newsPage++;
        //       let requestBody = new FormData;
        //       requestBody.append('PAGEN_1', this.newsPage);
        //       axios({
        //         method: 'post',
        //         url: '/ajax/getIndexNews.php',
        //         data: requestBody,
        //       }).then((response) => {
        //         if (response.status == 200) {
        //           this.setIsNextNews(response.data.isNextNews);
        //           this.addIndexNews(response.data.indexNews);
        //         }
        //       });

        //     }
        //   }
        // },
        breakpoints: {
          1280: {
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          767: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
        }
      });

    },

    swiperTabsProduct: function () {
      /*
      speed: mainSliderSpeed,
        spaceBetween: 32,
        slidesPerView: 3,
        simulateTouch: !isIE,
        navigation: {
          nextEl: '.index__main-tabs__content .swiper-wall-next',
          prevEl: '.index__main-tabs__content .swiper-wall-prev',
        },
        breakpoints: {
          1024: {
            slidesPerView: 1,
            pagination: {
              el: '.index__main-tabs__content .swiper-pagination',
              clickable: true,
            },
            navigation: {
              nextEl: '.swiper-mobile--right',
              prevEl: '.swiper-mobile--left',
            },
          },
        },
      */

      let itabsProductSwiper = new Swiper('.js-swiper-product-vertical', {
        spaceBetween: 32,
        slidesPerView: 3,
        simulateTouch: true,
        speed: 1500,
        navigation: {
          nextEl: '.itabs .swiper-button-next',
          prevEl: '.itabs .swiper-button-prev'
        },
        pagination: {
          el: '.itabs .swiper-pagination',
          clickable: true,
        },
        on: {
          init: function () {
            setTimeout(() => {
              this.$el[0].classList.add('start-anim');
            }, 200);
          },
        },
        breakpoints: {
          767: {
            spaceBetween: 8,
          }
        },
      });

    },

    swiperIhead: function () {

      let iheadVideos,
        iheadSliderSpeed = 1500;

      const pauseMainBgSliderVideos = (activeSlide) => {
        let activeVideo = activeSlide.querySelector('video');
        if (iheadVideos && iheadVideos.length)
          iheadVideos.forEach((video) => {
            if (video.hasAttribute('data-stid')){
              clearTimeout(video.getAttribute('data-stid'));
              video.removeAttribute('data-stid');
            }
            video.pause();
            if (!activeVideo.isEqualNode(video)) {
              let id = setTimeout(() => {
                if (!isNaN(video.duration))
                  video.currentTime = 0;
                  video.removeAttribute('data-stid');
              }, iheadSliderSpeed);
              video.setAttribute('data-stid', id);
            } else {
              activeVideo.play();
            }
          });
      };

      let iheadSwiper = new Swiper('.js-swiper-ihead', {
        loop: true,
        spaceBetween: 0,
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 10000,
        },
        speed: iheadSliderSpeed,
        navigation: {
          nextEl: '.ihead .swiper-button-next',
          prevEl: '.ihead .swiper-button-prev'
        },
        on: {
          init: function () {
            iheadVideos = [...qsAll('.ihead video')];
            let activeSlide = this.slides[this.activeIndex];
            pauseMainBgSliderVideos(activeSlide);
          },
          slideChange: function () {
            let activeSlide = this.slides[this.activeIndex];
            pauseMainBgSliderVideos(activeSlide);
          },
        }
      });

    },

    swiperIgallery: function () {

      let igalleryVideos,
        igallerySliderSpeed = 1500;

      const pauseMainBgSliderVideos = (activeSlide) => {
        let activeVideo = activeSlide.querySelector('video');
        if (igalleryVideos && igalleryVideos.length)
          igalleryVideos.forEach((video) => {
            if (video.hasAttribute('data-stid')){
              clearTimeout(video.getAttribute('data-stid'));
              video.removeAttribute('data-stid');
            }
            video.pause();
            if (!activeVideo.isEqualNode(video)) {
              let id = setTimeout(() => {
                if (!isNaN(video.duration))
                  video.currentTime = 0;
                  video.removeAttribute('data-stid');
              }, igallerySliderSpeed);
              video.setAttribute('data-stid', id);
            } else {
              activeVideo.play();
            }
          });
      };

      let igallerySwiper = new Swiper('.js-swiper-igallery', {
        loop: false,
        spaceBetween: 0,
        slidesPerView: 1,
        simulateTouch: false,
        speed: igallerySliderSpeed,
        navigation: {
          nextEl: '.igallery .swiper-button-next',
          prevEl: '.igallery .swiper-button-prev'
        },
        pagination: {
          el: '.igallery .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          767: {
            navigation: false,
          },
        },
        on: {
          init: function () {
            igalleryVideos = [...qsAll('.igallery video')];
            let activeSlide = this.slides[this.activeIndex];
            //pauseMainBgSliderVideos(activeSlide);
          },
          slideChange: function () {
            let activeSlide = this.slides[this.activeIndex];
            //pauseMainBgSliderVideos(activeSlide);
          },
        }
      });

      if (qsAll('.js-player').length){
        for (let videoItem of qsAll('.js-player')) {
          new Plyr(videoItem, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            loadSprite: false,
          });
        }
        const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Plyr(p));
      }

    },

    init: function init() {

      let _self = this,
        elemsAnimArr = ['.js-scroll-anim'];

      if (elemsAnimArr.length) this.anim();

      if (qs('.js-swiper-ihead')) this.swiperIhead();

      if (qs('.js-swiper-iprod')) this.swiperIprod();

      if (qs('.js-swiper-product-vertical')) this.swiperTabsProduct();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-ipubl')) this.swiperInews();

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
