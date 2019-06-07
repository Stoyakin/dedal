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
const pauseVideos = (activeSlide, allVideos, sliderSpeed) => {
  const speed = sliderSpeed ? sliderSpeed : 0;
  const arrVideos = allVideos;
  const activeVideo = activeSlide.querySelector('video');
  if (arrVideos && arrVideos.length) {
    arrVideos.forEach((video) => {
      if (video.hasAttribute('data-stid')) {
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

const resetForm = (itemForm) => {
  ['error', 'no-empty'].forEach(item => qsAll(`.${item}`, itemForm).forEach(elem => elem.classList.remove(item)));
  itemForm.reset();
};

window.onload = () => qs('body').classList.add('page-loaded');

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) qs('body').classList.add('ios');

document.addEventListener("DOMContentLoaded", function (event) {

  window.site = {};

  window.site.formData = {
    question: {
      'title': 'Спасибо!',
      'text': 'Ваш вопрос отправлен, и в ближайшее время с Вами свяжутся наши специалисты.'
    },
    feedback: {
      'title': 'Спасибо!',
      'text': 'Мы получили Ваш запрос, и в ближайшее время наши специалисты свяжутся с Вами.'
    },
    subsribe: {
      'title': 'Спасибо!',
      'text': 'Ваша подписка оформлена!'
    }
  }

  window.site.form = ({

    init: function () {

      const _th = this,
        inputs = qsAll('.form__field-input, .form__field-textarea'),
        forms = qsAll('form'),
        digitsInput = qsAll('.js-digits'),
        btnsOk = qsAll('.js-btn-ok');

      function emptyCheck(event) {
        let parents = getParent(event.target, 'form'),
          validateField = qsAll('[data-req]', parents),
          erorFeilds = qsAll('.error', parents),
          submitBtn = qs('[type="submit"]', parents),
          checkValidate = false;

        const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        function checkValidateFiled() {
          let countCheck = 0;
          if (erorFeilds.length) {
            for (let erorFeild of erorFeilds) {
              erorFeild.classList.remove('error');
            }
          }
          for (let itemField of validateField) {
            if (itemField.value.trim() === '') countCheck++;
          }
          if (countCheck === 0) checkValidate = true
        }

        checkValidateFiled();

        if (event.target.dataset.type === 'email' ){
          !re.test(event.target.value.trim()) ? event.target.classList.add('error') : event.target.classList.remove('error');
        }

        if (event.target.value.trim() === '') {
          event.target.classList.remove('no-empty')
        } else {
          event.target.classList.add('no-empty');
        }

        if (!erorFeilds.length && checkValidate) {
          submitBtn.disabled = false
        } else {
          submitBtn.disabled = true;
        }
      }

      for (let item of inputs) {
        item.addEventListener('keyup', emptyCheck)
        item.addEventListener('blur', emptyCheck)
      }

      for (let form of forms) {
        form.addEventListener('submit', (e) => {
          if (_th.checkForm(form)) {
            let blockMsgParent = getParent(form, 'validate-wrap'),
              blockMsg = qs('.validate-row--answer-server', blockMsgParent) || false,
              blockMsgTitle = qs('.js-title', blockMsg) || false,
              blockMsgText = qs('.js-text', blockMsg) || false;

            if (window.site.formData) {
              for (let itemElem in window.site.formData) {
                if (itemElem === form.dataset.answer) {

                  if (window.site.formData[itemElem].title && window.site.formData[itemElem].title != '' && blockMsgTitle)
                    blockMsgTitle.innerText = window.site.formData[itemElem].title;
                  if (window.site.formData[itemElem].text && window.site.formData[itemElem].text != '' && blockMsgText)
                    blockMsgText.innerText = window.site.formData[itemElem].text;

                  blockMsgParent.classList.add('validate-wrap--show-answer');
                  blockMsg.previousElementSibling.classList.add('validate-row--hidden');
                  setTimeout(() => {
                    blockMsg.classList.remove('validate-row--hidden');
                    resetForm(form);
                  }, 350)
                }
              }
            }
          }
          e.preventDefault();
        });
      }

      for (let digitInput of digitsInput) {
        digitInput.addEventListener('keydown', (e) => {
          let validArr = [46, 8, 9, 27, 13, 110, 190]
          if (validArr.indexOf(e.keyCode) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
          }
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault()
          }
        });
      }

      if (btnsOk.length) {
        for (let btnOkItem of btnsOk) {
          btnOkItem.addEventListener('click', function (e) {
            let parentBtn = getParent(e.target, 'validate-wrap'),
              msgOk = qs('.validate-row--answer-server', parentBtn);
            if (parentBtn && msgOk) {
              parentBtn.classList.remove('validate-wrap--show-answer');
              msgOk.classList.add('validate-row--hidden');
              setTimeout(() => {
                msgOk.previousElementSibling.classList.remove('validate-row--hidden');
              }, 350)
            }
            e.preventDefault();
          });
        }
      }

      return this
    },

    checkForm: function (form) {
      let checkResult = true;
      const warningElems = form.querySelectorAll('.error');

      if (warningElems.length) {
        for (let warningElem of warningElems) {
          warningElem.classList.remove('error')
        }
      }

      for (let elem of form.querySelectorAll('input, textarea, select')) {
        if (elem.getAttribute('data-req')) {
          switch (elem.getAttribute('data-type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test(elem.value)) {
                elem.classList.add('error')
                checkResult = false
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test(elem.value)) {
                elem.classList.add('error')
                checkResult = false
              }
              break;
            case 'file':
              if (elem.value.trim() === '') {
                elem.parentNode.classList.add('error')
                checkResult = false
              }
              break;
            default:
              if (elem.value.trim() === '') {
                elem.classList.add('error')
                checkResult = false
              }
              break;
          }
        }
      }

      return checkResult
    }

  }).init();

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
      qs('.js-close-nav').addEventListener('click', (e) => {
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
        return rect.top <= (wHeight * 0.75);
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
      const header = qs('.header'),
        headerHeight = header.offsetHeight;
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > headerHeight) header.classList.add('header--sticky');
        else header.classList.remove('header--sticky');
      });
    },

    paralaxDecor: function () {

      const overDecor = qs('.js-paralax'),
        decorElems = qsAll('.ifeed__decor-item', overDecor);

      function visChecker(el) {
        const rect = el.getBoundingClientRect();
        const wHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= wHeight;
      }

      window.addEventListener('scroll', () => {
        if (overDecor && decorElems.length) {
          for (let decorItem of decorElems) {
            if (visChecker(overDecor)) {
              let calc = (((overDecor.offsetTop + overDecor.offsetHeight) - (window.pageYOffset + window.innerHeight)) / 100);
              if (calc <= 0) calc = 0.1;
              if (decorItem.dataset.dir === 'up')
                decorItem.style.transform = "translateY(-" + (parseFloat(decorItem.dataset.ratio) * calc) + "px)";
              if (decorItem.dataset.dir === 'down')
                decorItem.style.transform = "translateY(" + ((parseFloat(decorItem.dataset.ratio) * calc) - 10) + "px)";
            } else {
              decorItem.removeAttribute('style');
            }
          }
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

      for(let itemSLide of qsAll('.iprod .swiper-slide')) {
        itemSLide.addEventListener('click', function(e) {
          if (!this.classList.contains('swiper-slide-active')) {
            if (this.classList.contains('swiper-slide-next')) iprodSwiper.slideNext(1500)
            if (this.classList.contains('swiper-slide-prev')) iprodSwiper.slidePrev(1500)
            e.preventDefault();
          }
        });
      }

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
      let plyrsArray = [];

      if (qsAll('.js-player').length) {
        for (let videoItem of qsAll('.js-player')) {
          plyrsArray.push(new Plyr(videoItem, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            loadSprite: false,
            playsInline: true
          }));
        }
        for (let plyrItem of plyrsArray) {
          plyrItem.on('ended', (event) => {
            let parents = getParent(event.target, 'igallery__slide-video');
            parents.classList.add('igallery__slide-video--hide-controls');
            qs('.igallery__slide-play', parents).classList.remove('igallery__slide-video--hide-controls');
          });
        }
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
          slideChange: function () {
            for (let [index, plyrItem] of plyrsArray.entries()) {
              if (index !== this.activeIndex) {
                plyrItem.pause();
              }
            }
          },
        }
      });

    },

    swiperTabsProduct: () => {

      let swiperArr = [];

      for (let swiperItem of qsAll('.js-swiper-product-vertical')) {
        swiperArr.push(new Swiper(swiperItem, {
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
            600: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
            767: {
              spaceBetween: 8,
            },
            1160: {
              slidesPerView: 2,
            },
          },
        }));
      }

      for (let swiperItem of swiperArr) {
        for (let wallItem of qsAll('.swiper-wall', swiperItem.$el[0])) {
          wallItem.addEventListener('click', function () {
            if (this.classList.contains('swiper-wall--left')) swiperItem.slideNext(1500);
            if (this.classList.contains('swiper-wall--right')) swiperItem.slidePrev(1500);
          });
        }
      }

    },

    headerTabs: function () {

      const body = qs('body'),
        header = qs('.header'),
        headerTabs = qs('.header__tabs', header),
        closeTabs = qs('.js-close-header-tabs') || false,
        closeNav = qs('.js-close-nav') || false,
        btnBackNav = qs('.js-back-nav') || false,
        btnBurger = qs('.js-burger') || false,
        wHeight = window.innerHeight || document.documentElement.clientHeight;

      function closeHeaderTabs() {
        let topActionActive = qs('.js-top-action.nav__list-item-href--active') || false,
          tabsActive = qs('.header__tabs-item.header__tabs-item--active') || false,
          submenuBtnMobileActive = qs('.header__submenu-btn-mobile.active') || false,
          submenuShow = qs('.header__submenu-scroll-wrap.show') || false,
          nav = qs('.nav') || false,
          navTopMobile = qs('.nav__top-mobile') || false,
          navTopHref = qs('.nav__top-href') || false;

        body.classList.remove('blocked');
        header.classList.add('header--hide-tabs');

        setTimeout(() => {

          header.classList.remove('header--show-tabs', 'header--hide-tabs');
          headerTabs.removeAttribute('style');
          if (topActionActive) topActionActive.classList.remove('nav__list-item-href--active');
          if (tabsActive) tabsActive.classList.remove('header__tabs-item--active');

          if (nav) nav.classList.remove('show');
          if (submenuBtnMobileActive) submenuBtnMobileActive.classList.remove('active');
          if (submenuShow) submenuShow.classList.remove('show');
          if (navTopHref) navTopHref.innerText = '';
          if (navTopMobile) navTopMobile.classList.remove('show-btns');

        }, 600);
      }

      for (let actionBtn of qsAll('.js-top-action')) {
        actionBtn.addEventListener('click', function (e) {
          let _t = this,
            _data = _t.dataset.action,
            btnActive = qs('.js-top-action.nav__list-item-href--active') || false,
            tabsActive = qs('.header__tabs-item.header__tabs-item--active') || false;

          if (!_t.classList.contains('nav__list-item-href--active')) {

            body.classList.add('blocked');
            header.classList.add('header--show-tabs');

            let findItemTab = qs('.header__tabs-item[data-tabs-item="' + _data + '"]'),
              headerTabsMaxheight = wHeight - header.clientHeight,
              findItemTabHeight = findItemTab.clientHeight;

            if (headerTabsMaxheight < findItemTabHeight) findItemTabHeight = headerTabsMaxheight;
            headerTabs.style.height = findItemTabHeight + 'px';

            if (btnActive) btnActive.classList.remove('nav__list-item-href--active');
            _t.classList.add('nav__list-item-href--active');
            if (tabsActive) tabsActive.classList.remove('header__tabs-item--active');
            findItemTab.classList.add('header__tabs-item--active');
            if (qs('.nav__top-href')) qs('.nav__top-href').innerText = _t.innerText;
            if (qs('.nav__top-mobile')) qs('.nav__top-mobile').classList.add('show-btns');
          } else {
            closeHeaderTabs();
          }
          e.preventDefault();
        });
      }

      if (window.innerWidth > 1160) {
        for (let scrollitem of qsAll('.js-submenu-scroll')) {
          if (!scrollitem.classList.contains('ps')) {
            new PerfectScrollbar(scrollitem, {
              wheelSpeed: 2,
              wheelPropagation: true,
              minScrollbarLength: 20
            });
          }
        }
      } else {
        for (let scrollitem of qsAll('.js-submenu-scroll')) {
          if (scrollitem.classList.contains('ps')) {
            scrollitem.perfectScrollbar.destroy();
          }
        }
      }

      if (closeTabs) {
        closeTabs.addEventListener('click', function (e) {
          closeHeaderTabs();
          e.preventDefault;
        });
      }

      if (closeNav) {
        closeNav.addEventListener('click', function (e) {
          closeHeaderTabs();
          e.preventDefault;
        });
      }

      if (qsAll('.js-open-sublist').length) {
        for (let itemBtn of qsAll('.js-open-sublist')) {
          itemBtn.addEventListener('click', function (e) {
            let parents = getParent(this, 'header__submenu'),
              hiddenSublist = qs('.header__submenu-scroll-wrap', parents);
            if (!this.classList.contains('active')) {
              if (qs('.header__submenu-btn-mobile.active')) qs('.header__submenu-btn-mobile.active').classList.remove('active');
              if (qs('.header__submenu-scroll-wrap.show')) qs('.header__submenu-scroll-wrap.show').classList.remove('show');
              this.classList.add('active');
              hiddenSublist.classList.add('show');
            } else {
              this.classList.remove('active');
              hiddenSublist.classList.remove('show');
            }
            e.preventDefault();
          });
        }
      }

      if (btnBurger) {
        btnBurger.addEventListener('click', (e) => {
          body.classList.add('blocked');
          qs('.nav').classList.add('show');
          e.preventDefault();
        });
      }

      if (btnBackNav) {
        btnBackNav.addEventListener('click', function (e) {
          let topActionActive = qs('.js-top-action.nav__list-item-href--active') || false,
            tabsActive = qs('.header__tabs-item.header__tabs-item--active') || false,
            submenuBtnMobileActive = qs('.header__submenu-btn-mobile.active') || false,
            submenuShow = qs('.header__submenu-scroll-wrap.show') || false,
            navTopMobile = qs('.nav__top-mobile') || false,
            navTopHref = qs('.nav__top-href') || false;
          header.classList.add('header--hide-tabs');
          setTimeout(() => {
            header.classList.remove('header--show-tabs', 'header--hide-tabs');
            headerTabs.removeAttribute('style');
            if (topActionActive) topActionActive.classList.remove('nav__list-item-href--active');
            if (tabsActive) tabsActive.classList.remove('header__tabs-item--active');
            if (submenuBtnMobileActive) submenuBtnMobileActive.classList.remove('active');
            if (submenuShow) submenuShow.classList.remove('show');
            if (navTopHref) navTopHref.innerText = '';
            if (navTopMobile) navTopMobile.classList.remove('show-btns');
          }, 600);
          e.preventDefault();
        });
      }

    },

    tabs: function () {
      let allowed = true;
      const tabsOver = qs('.js-tabs'),
        tabsBtns = qsAll('.itabs__nav-item', tabsOver),
        tabsItems = qsAll('.itabs__list-item', tabsOver),
        tabsVideos = qsAll('video', tabsOver);

      if (tabsVideos.length) tabsVideos[0].play();

      const pauseTabsVideos = (allVideos) => {
        if (allVideos && allVideos.length) {
          for (let video of allVideos) {
            video.pause();
          }
        }
      };

      for (let btn of tabsBtns) {
        btn.addEventListener('click', function (e) {
          let _t = this,
            _tData = _t.dataset.tabsNav;
          if (!_t.classList.contains('itabs__nav-item--active') && allowed) {
            allowed = false;
            pauseTabsVideos(tabsVideos);
            qs('video', btn).play();
            qs('.itabs__nav-item.itabs__nav-item--active', tabsOver).classList.remove('itabs__nav-item--active');
            _t.classList.add('itabs__nav-item--active');
            for (let tabs of tabsItems) {
              tabs.classList.remove('itabs__list-item--active');
            }
            qs('.itabs__list-item[data-tabs-item="' + _tData + '"]').classList.add('itabs__list-item--active');
            allowed = true;
          }
          e.preventDefault();
        });
      }

    },

    popUp: function () {

      let body = qs('body'),
        popups = qsAll('.popup'),
        closePopup = qsAll('.js-close-popup'),
        showPopup = qsAll('.js-show-popup[data-action]');

      function togglePopup(element) {
        let popItem = element ? element : false;
        if (popItem) {
          if (body.classList.contains('popup-open') === true) {
            popItem.classList.remove('popup--active');
            body.classList.remove('popup-open');
            body.style.overflow = ''
          } else {
            body.classList.add('popup-open');
            body.style.overflow = 'hidden';
            popItem.classList.add('popup--active');
          }
        }
      }

      if (popups.length) {
        if (closePopup.length) {
          for (let itemBtnClose of closePopup) {
            itemBtnClose.addEventListener('click', (e) => {
              for (let popup of popups) {
                if (popup.classList.contains('popup--active')) {
                  togglePopup(popup);
                  resetForm(qs('form', popup));
                }
              }
              e.preventDefault();
            });
          }
        }

        if (showPopup.length) {
          for (let itemBtn of showPopup) {
            let btnData = itemBtn.dataset.action;
            itemBtn.addEventListener('click', (e) => {
              for (let popup of popups) {
                let popupData = popup.dataset.popup;
                if (btnData == popupData) {
                  togglePopup(popup);
                }
              }
              e.preventDefault();
            })
          }
        }

      }

    },

    addBasket: function () {
      const basket = qs('.header__action-href--basket'),
        btnsAddBasket = qsAll('.js-add-basket');
      if (basket) {
        for (let btnItem of btnsAddBasket) {
          btnItem.addEventListener('click', function (e) {
            if (!this.classList.contains('added-to-basket')) {
              this.classList.add('added-to-basket');
              qs('.product__item-buy-text', this).innerText = 'Добавлено';
              basket.dataset.count = parseInt(basket.dataset.count) + 1;
              basket.classList.add('active');
              e.preventDefault();
            }
          });
        }
      }
    },

    init: function init() {

      let elemsAnimArr = ['.js-scroll-anim'];

      if (elemsAnimArr.length) this.anim();

      if (qs('.header')) this.fixedHeader();

      if (qs('.js-swiper-ihead')) this.swiperIhead();

      if (qs('.js-swiper-iprod')) this.swiperIprod();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-igallery')) this.swiperIgallery();

      if (qs('.js-swiper-ipubl')) this.swiperInews();

      if (qs('.js-swiper-product-vertical')) this.swiperTabsProduct();

      if (qs('.js-tabs')) this.tabs();

      if (qs('.header__tabs')) this.headerTabs();

      if (qsAll('.js-show-popup[data-action]').length) this.popUp();

      if (qs('.js-paralax')) this.paralaxDecor();

      if (qsAll('.js-add-basket').length) this.addBasket();

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
