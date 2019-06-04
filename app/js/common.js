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

let iheadVideos, igalleryVideos;
const pauseVideos = (activeSlide, allVideos, sliderSpeed ) => {
  const speed = sliderSpeed ? sliderSpeed : 0;
  const arrVideos = allVideos;
  const activeVideo = activeSlide.querySelector('video');
  if (arrVideos && arrVideos.length) {
    arrVideos.forEach((video) => {
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
        }, speed);
        video.setAttribute('data-stid', id);
      } else {
        activeVideo.play();
      }
    });
  }
};

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
        return rect.top <= (wHeight * 0.82);
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

    fixedHeader: function () {
      var header = qs('.header'),
        headerHeight = header.offsetHeight;
      window.addEventListener('scroll', ()=> {
        if (window.pageYOffset > headerHeight) header.classList.add('header--sticky');
        else header.classList.remove('header--sticky');
      });
    },

    animDecor: function () {
      const elemsScroll = qsAll('.js-anim-decor');

      let animOk = true;

      window.addEventListener('scroll', ()=> {
        if (animFlag){
          for (let elemItem of elemsScroll) {}
        }
      });

    },

    swiperDirections: function () {

      const directionsSwiper = new Swiper('.js-swiper-directions', {
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

      const iprodSwiper = new Swiper('.js-swiper-iprod', {
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

      const ipublSwiper = new Swiper('.js-swiper-ipubl', {
        speed: 1500,
        spaceBetween: 32,
        slidesPerView: 3,
        simulateTouch: true,
        navigation: {
          nextEl: '.ipubl .swiper-wall-next',
          prevEl: '.ipubl .swiper-wall-prev',
        },
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

    swiperIhead: function () {

      const iheadSliderSpeed = 1500;

      const iheadSwiper = new Swiper('.js-swiper-ihead', {
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
            pauseVideos(activeSlide, iheadVideos, iheadSliderSpeed);
          },
          slideChange: function () {
            let activeSlide = this.slides[this.activeIndex];
            pauseVideos(activeSlide, iheadVideos, iheadSliderSpeed);
          },
        }
      });

    },

    swiperIgallery: function () {

      let igallerySliderSpeed = 1500;

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
            playsInline: true
          });
        }
        const players = Array.from(qsAll('.js-player')).map(p => new Plyr(p));
      }

      if (qsAll('.igallery__slide-play').length) {
        const arrPlayBtns = qsAll('.igallery__slide-play');
        for (let playBtn of arrPlayBtns) {
          playBtn.addEventListener('click', function (e) {
            let parents = getParent(this, 'igallery__slide-video');
            for (let playBtn of arrPlayBtns) {
              playBtn.classList.add('igallery__slide-video--hide-controls')
            }
            qs('.swiper-slide-active .js-player').plyr.play();
            parents.classList.remove('igallery__slide-video--hide-controls');
            e.preventDefault();
          });
        }
      }
    },

    swiperTabsProduct: ()=> {

      for (let swiperItem of qsAll('.js-swiper-product-vertical')) {
        new Swiper(swiperItem, {
          spaceBetween: 32,
          slidesPerView: 3,
          simulateTouch: true,
          speed: 1500,
          navigation: {
            nextEl: qs('.swiper-button-next', swiperItem),
            prevEl: qs('.swiper-button-prev', swiperItem)
          },
          pagination: {
            el: qs('.swiper-pagination', swiperItem),
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
      }

    },

    headerTabs: function () {
      const body = qs('body'),
        header = qs('.header'),
        closeTabs = qs('.js-close-header-tabs') || false;

      function closeHeaderTabs() {
        body.classList.remove('blocked');
        header.classList.add('header--hide-tabs');
        setTimeout(()=>{
          header.classList.remove('header--show-tabs', 'header--hide-tabs');
          qs('.js-top-action.nav__list-item-href--active').classList.remove('nav__list-item-href--active');
          qs('.header__tabs-item.header__tabs-item--active').classList.remove('header__tabs-item--active');
        }, 600);
      }

      for(let actionBtn of qsAll('.js-top-action')) {
        actionBtn.addEventListener('click', function(e) {
          let _t = this,
            _data = _t.dataset.action,
            btnActive = qs('.js-top-action.nav__list-item-href--active') || false,
            tabsActive = qs('.header__tabs-item.header__tabs-item--active') || false;
          body.classList.add('blocked');
          header.classList.add('header--show-tabs');
          if (!_t.classList.contains('nav__list-item-href--active')) {
            if (btnActive) btnActive.classList.remove('nav__list-item-href--active');
            _t.classList.add('nav__list-item-href--active');
            if (tabsActive) tabsActive.classList.remove('header__tabs-item--active');
            qs('.header__tabs-item[data-tabs-item="'+_data+'"]').classList.add('header__tabs-item--active');
          } else {
            closeHeaderTabs();
          }

          e.preventDefault();
        });
      }

      if (window.innerWidth > 1023) {
        for(let scrollitem of qsAll('.js-submenu-scroll')) {
          if (!scrollitem.classList.contains('ps')) {
            new PerfectScrollbar(scrollitem, {
              wheelSpeed: 2,
              wheelPropagation: true,
              minScrollbarLength: 20
            });
          }
        }
      } else {
        for(let scrollitem of qsAll('.js-submenu-scroll')) {
          scrollitem.perfectScrollbar.destroy();
        }
      }

      if (closeTabs) {
        closeTabs.addEventListener('click', function(e) {
          closeHeaderTabs();
          e.preventDefault;
        });
      }

    },

    tabs: function () {
      let allowed = true;
      const tabsOver = qs('.js-tabs'),
        tabsBtns = qsAll('.itabs__nav-item', tabsOver),
        tabsItems = qsAll('.itabs__list-item', tabsOver),
        tabsVideos = qsAll('video', tabsOver);
      for (let btn of tabsBtns) {
        btn.addEventListener('click', function (e) {
          let _t = this,
            _tData = _t.dataset.tabsNav;
          if (!_t.classList.contains('itabs__nav-item--active') && allowed) {
            allowed = false;

            pauseVideos(btn, tabsVideos);

            qs('.itabs__nav-item.itabs__nav-item--active', tabsOver).classList.remove('itabs__nav-item--active');
            _t.classList.add('itabs__nav-item--active');
            for (let tabs of tabsItems) {
              tabs.classList.remove('itabs__list-item--active');
            }
            qs('.itabs__list-item[data-tabs-item="'+_tData+'"]').classList.add('itabs__list-item--active');
            allowed = true;
          }
          e.preventDefault();
        });
      }
    },

    init: function init() {

      let elemsAnimArr = ['.js-scroll-anim'];

      //if (elemsAnimArr.length) this.anim();

      if (qs('.header')) this.fixedHeader();

      if (qs('.js-swiper-ihead')) this.swiperIhead();

      if (qs('.js-swiper-iprod')) this.swiperIprod();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-ipubl')) this.swiperInews();

      if (qs('.js-swiper-product-vertical')) this.swiperTabsProduct();

      if (qs('.js-tabs')) this.tabs();

      if (qs('.header__tabs')) this.headerTabs();

      let eventResize
      try {
        eventResize = new Event('resize')
      } catch (e) {
        eventResize = document.createEvent('Event');
        eventResize.initEvent('resize', false, false);
      }
      window.dispatchEvent(eventResize)

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

