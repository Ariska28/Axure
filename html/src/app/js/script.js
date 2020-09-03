const osSelectTemplate = function (state) {
  if (!state.id) {
    return state.text;
  }

  var $state = $(
    '<span >' +
    '<span class="select2-ic">' +
    '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ic-' +
    state.element.value.toLowerCase() +
    '"></use></svg>' +
    '</span>' +
    state.text +
    '</span>'
  );

  return $state;
};

/**
 * format Cloud prices selections.
 * Replace all numbers and $ prices with bold values, replace periods with styled span
 */
const priceCloudTemplate = function (state) {
  if (!state.id) {
    return state.text;
  }

  const periods = ['month'];
  const periodReg = new RegExp(`(${periods.join('|')})`, 'gi');

  const $state = $(
    `<span>
      ${state.text
      .replace(/(\$?\d+)/g, '<b>$1</b>')
      .replace(periodReg, '<span class="select2-cloud-period">$1</span>')}
    </span>`
  );
  return $state;
};

/**
 * video box
 * @param jBox jQuery element
 */
const DATA_VIDEO_SRC = 'data-video-src';
class VideoBox {
  constructor(jBox) {
    this.boxJEl = jBox;
    this.videoJWrapper = this.boxJEl.find(`[${DATA_VIDEO_SRC}]`);
    this.playJEl = this.boxJEl.find(`[data-video-play]`);
    this.src = [this.videoJWrapper.attr(DATA_VIDEO_SRC)];

    let count = 1;
    let src = this.videoJWrapper.attr(`${DATA_VIDEO_SRC}${count}`);
    while (src) {
      this.src.push(src);
      count++;
      src = this.videoJWrapper.attr(`${DATA_VIDEO_SRC}${count}`);
    }

    if (!this.src.length) {
      this.log('No sources for video.');
      return;
    }

    this.downloadInit();
  }

  render() {
    const sources = this.sources();
    // const video = `
    //   <video>
    //     ${sources}
    //   </video>
    // `;
    this.videoJEl = $('<video></video>');
    this.video = this.videoJEl[0];
    this.videoHandlersInit();
    $(this.videoJEl).append(sources);
    this.videoJWrapper.html(this.videoJEl);
  }

  sources() {
    let sources = '';
    this.src.forEach(val => {
      let type = this.getVideoType(val);
      sources += `<source src="${val}" type="video/${type}">`;
    });
    return sources;
  }

  getVideoType(name) {
    if (name.indexOf('.') === -1) return '';
    return name.replace(/.+\.([^.]*)$/, '$1');
  }

  downloadInit() {
    this.playJEl.one('click', () => {
      this.render();
    });
  }

  videoHandlersInit() {
    this.video.addEventListener('canplay', e => {
      this.play();
    });

    this.videoJEl.on('click', e => {
      this.pause();
    });

    this.playJEl.on('click', e => {
      this.play();
    });
  }

  play() {
    if (!this.video.paused) return;

    this.videoJWrapper.css('z-index', 50).animate({
      opacity: 1,
    });
    this.video.play();
  }

  pause() {
    if (this.video.paused) return;

    this.video.pause();
    this.videoJWrapper.animate(
      {
        opacity: 0,
      },
      {
        duration: 'fast',
        complete: function () {
          $(this).css('z-index', '');
        },
      }
    );
  }

  log(err) {
    console.log(err);
  }
}

/**
 * video box
 * @param jBox jQuery element
 */
const DATA_VIDEO_VIMEO_ID = 'data-video-vimeo-id';
class VideoBoxVimeo {
  constructor(jBox) {
    this.boxJEl = jBox;
    this.videoJWrapper = this.boxJEl.find(`[${DATA_VIDEO_VIMEO_ID}]`);
    this.playJEl = this.boxJEl.find(`[data-video-play]`);
    // vimeo
    this.iframe = this.boxJEl.find('iframe');
    this.player = new Vimeo.Player(this.iframe[0]);

    this.show = this.show.bind(this);

    this.init();
  }

  init() {
    this.boxJEl.addClass('b-video_pseudo-hide');

    this.player.on('play', this.show);
  }

  show() {
    this.boxJEl.addClass('b-video_pseudo-hide-show');
  }
}

/**
 * Sticky header detects the precense of header's second level.
 * Makes header or js-header-lv1 or js-header-lv2 sticky.
 */
class StickyHeader {
  constructor(edge, isLv2Stuck) {
    this.options = {
      bottoming: false,
      parent: $('body'),
      offset_top: -1,
    };

    this.edge = edge;
    this.isLv2Stuck = isLv2Stuck || false;

    this.header = $('.js-header');
    this.lv1 = $('.js-header-lv1');
    this.lv2 = $('.js-header-lv2');
    this.state = {
      mobView: false,
    };

    this.resize = this.resize.bind(this);
    this.init();

    // if (this.lv1.length && this.lv2.length) {
    $(window).resize(this.resize);
    // }
  }

  updateState(opt) {
    this.state.mobView = opt.mobView || false;
  }

  init() {
    const self = this;

    if ($(window).innerWidth() < this.edge) {
      //  mobile, tablet
      // header always stick
      if (this.header.length) {
        this.header
          .stick_in_parent(this.options)
          .on('sticky_kit:stick', function (e) {
            self.header.addClass('header_light');
          })
          .on('sticky_kit:unstick', function (e) {
            self.header.removeClass('header_light');
          });

        this.updateState({ mobView: true });
      }
    } else {
      //  desktop
      if (this.lv2.length && this.isLv2Stuck) {
        this.lv2.stick_in_parent(this.options);
      } else if (this.lv1.length) {
        this.lv1
          .stick_in_parent(this.options)
          .on('sticky_kit:stick', function (e) {
            self.header.addClass('header_light');
          })
          .on('sticky_kit:unstick', function (e) {
            self.header.removeClass('header_light');
          });
      }
      this.updateState({ mobView: false });
    }
  }

  reinit() {
    this.header.trigger('sticky_kit:detach');
    this.lv1.trigger('sticky_kit:detach');
    this.lv2.trigger('sticky_kit:detach');
    this.init();
  }

  resize() {
    if ($(window).innerWidth() < this.edge && !this.state.mobView) {
      this.reinit();
    } else if ($(window).innerWidth() >= this.edge && this.state.mobView) {
      this.reinit();
    }
  }
}

/**
 * submenu parent
 * @param wrapper jQuery element
 // * @param hub observer
 */
class Submenu {
  constructor(wrapper, upLimit, isClickable = true) {
    this.submenuClassName = 'submenu';
    this.upLimit = upLimit || null;
    this.wrapper = wrapper;
    this.submenu = this.wrapper.find(`.${this.submenuClassName}`);
    this.toggle = this.wrapper.find(`>a`);
    this.opened = false;
    this.listeners = {};

    this.initOpen();

    if (isClickable) {
      this.toggle.on('click', e => {
        if (this.upLimit && $(window).innerWidth() > this.upLimit) {
          return;
        }

        e.preventDefault();

        if (this.opened) {
          this.close();
        } else {
          this.open();
        }
      });
    }
  }

  on(ev, cb) {
    if (this.listeners[ev] === undefined) {
      this.listeners[ev] = {};
      this.listeners[ev].cb = [];
    }

    this.listeners[ev].cb.push(cb);
  }

  off(ev, cb) {
    if (!this.listeners[ev]) return;
    this.listeners[ev].cb = this.listeners[ev].cb.filter(
      listener => listener !== cb
    );
  }

  notify(ev, data) {
    if (!this.listeners[ev] || !this.listeners[ev].cb) return;
    this.listeners[ev].cb.forEach(listener => listener(data));
  }

  initOpen() {
    this.wrapper.addClass('main-menu__item_sub-open');
    this.submenu.addClass(`${this.submenuClassName}_open`).slideDown();
  }

  open() {
    this.wrapper.addClass('main-menu__item_sub-open');
    this.submenu.addClass(`${this.submenuClassName}_open`).slideDown();
    this.opened = true;
    this.notify('open', { submenu: this });
  }

  close() {
    this.wrapper.removeClass('main-menu__item_sub-open');
    this.submenu.removeClass(`${this.submenuClassName}_open`).slideUp();
    this.opened = false;
    // this.notify('close', { 'submenu': this });
  }
}

/**
 * Handle all submenus
 * @param parents list of jQuery elements, clickable parents of the submenus
 */
class Submenus {
  constructor(parents, upLimit, isClickable) {
    this.closeRest = this.closeRest.bind(this);
    this.upLimit = upLimit || null;
    this.submenus = [];
    parents.each((ind, node) => {
      const submenu = new Submenu($(node), this.upLimit, isClickable);
      this.submenus.push(submenu);
      submenu.on('open', this.closeRest);
    });
  }

  closeRest({ submenu } = {}) {
    this.submenus.forEach(item => {
      if (item === submenu) return;
      item.close();
    });
  }
}

/**
 * Plan cards
 */
const PLAN_MONTHLY = 'monthly';
const PLAN_PERPETUAL = 'perpetual';

class PlanCard {
  constructor(el) {
    this.el = el;
    this.options = {
      [PLAN_MONTHLY]:
        $(el)
          .find('[data-period-monthly]')
          .attr('data-period-monthly') || 'per month',
      [PLAN_PERPETUAL]:
        $(el)
          .find('[data-period-perpetual]')
          .attr('data-period-perpetual') || 'perpetual',
      togglePerpetualClass: 'toggle_switched',
      cardPerpetualClass: 'plan-card_perpetual',
      period: {
        [PLAN_MONTHLY]: {
          // name: $(el).find('[data-toggle-monthly]').attr('data-toggle-monthly') || 'Monthly',
          value:
            $(el)
              .find('[data-period-monthly]')
              .attr('data-period-monthly') || 'per month',
          price: $(el)
            .find('[data-price-monthly]')
            .attr('data-price-monthly'),
        },
        [PLAN_PERPETUAL]: {
          // name: $(el).find('[data-toggle-perpetual]').attr('data-toggle-perpetual') || 'Perpetual',
          value:
            $(el)
              .find('[data-period-perpetual]')
              .attr('data-period-perpetual') || 'perpetual',
          price: $(el)
            .find('[data-price-perpetual]')
            .attr('data-price-perpetual'),
        },
      },
    };

    this.currencyJEl = $(el).find('[data-currency]');
    this.toggleJEl = $(el).find('[data-toggle]');
    this.valueJEl = $(el).find('[data-value]');
    this.periodJEl = $(el).find('[data-period]');
    this.linkJEl = $(el).find('[data-href-monthly]');
    this.href = {
      [PLAN_MONTHLY]: this.linkJEl.attr(`data-href-${PLAN_MONTHLY}`),
      [PLAN_PERPETUAL]: this.linkJEl.attr(`data-href-${PLAN_PERPETUAL}`),
    };
  }

  setPeriod(period) {
    if (period === PLAN_MONTHLY) {
      $(this.el).removeClass(this.options.cardPerpetualClass);
      this.toggleJEl.removeClass(this.options.togglePerpetualClass);
    } else {
      $(this.el).addClass(this.options.cardPerpetualClass);
      this.toggleJEl.addClass(this.options.togglePerpetualClass);
    }

    this.updateVeiw(period);
  }

  updatePrice(text, currencyJEl) {
    const currency = this.currencyJEl;
    currency.fadeOut(100);
    this.valueJEl.fadeOut(100, function () {
      $(this)
        .html(text)
        .fadeIn(100);
      currency.fadeIn(100);
    });
  }

  updateVeiw(period) {
    this.updatePrice(this.options.period[period].price);
    this.periodJEl.html(this.options.period[period].value);
    this.linkJEl.attr('href', this.href[period]);
  }
}

class PlanCards {
  constructor() {
    const self = this;

    this.cards = $('[data-plan]').map(function (ind, item) {
      return new PlanCard(item);
    });
    this.period = PLAN_MONTHLY;

    this.toggle = this.toggle.bind(this);

    this.cards.each(function (ind, item) {
      $(item.el).on('click', '[data-toggle]', function (e) {
        $(item.el).trigger('change:period');
      });
      $(item.el).on('change:period', self.toggle);
    });
  }

  toggle(e) {
    if (this.period === PLAN_MONTHLY) {
      this.setPeriod(PLAN_PERPETUAL);
    } else {
      this.setPeriod(PLAN_MONTHLY);
    }
  }

  setPeriod(period) {
    this.cards.each(function (ind, item) {
      item.setPeriod(period);
    });
    this.period = period;
  }
}

/**
 * toggle block. Show hide several blocks
 */
class ToggleBlock {
  constructor(block) {
    this.block = block;
    this.active = null;
    this.lastElHeight = 0;

    this.fixHeight = this.fixHeight.bind(this);
    this.restoreHeight = this.restoreHeight.bind(this);

    this.init();
  }

  init() {
    this.block
      .find('[data-b-toggle-info]')
      .not(':first-child')
      .css('display', 'none');
    this.block.on('click', '[data-b-toggle-switcher]', e => {
      const name = $(e.currentTarget).attr('data-b-toggle-switcher');

      this.switch(name);
    });

    const firstName = this.block
      .find('[data-b-toggle-info]')
      .eq(0)
      .attr('data-b-toggle-info');

    this.show(firstName);
    this.activate(firstName);
  }

  switch(name) {
    if (name === this.active.attr('data-b-toggle-info')) {
      return;
    }
    this.hideActive(name);
    this.activate(name);
  }

  activate(name) {
    this.block
      .find('[data-b-toggle-switcher]')
      .removeClass('toggle-block__btn_active');
    this.block
      .find(`[data-b-toggle-switcher="${name}"]`)
      .addClass('toggle-block__btn_active');
  }

  hideActive(name) {
    this.lastElHeight = this.active.outerHeight();
    this.fixHeight();
    this.active.fadeOut({
      complete: () => {
        if (name) {
          this.show(name);
        }
      },
    });
  }

  show(name) {
    this.active = this.block.find(`[data-b-toggle-info="${name}"]`);
    this.active.fadeIn({
      start: this.restoreHeight,
    });
  }

  fixHeight() {
    this.block.css('height', this.block.outerHeight());
    this.block.find('[data-b-toggle-info]').css({ position: 'absolute' });
  }

  restoreHeight() {
    this.block.find('[data-b-toggle-info]').css({ position: '' });
    // const currHeight = this.block[0].scrollHeight;
    const currHeight =
      this.block.height() - this.lastElHeight + this.active.outerHeight();

    this.block.animate(
      {
        height: currHeight,
      },
      {
        complete: function () {
          $(this).css('height', 'auto');
        },
      }
    );
  }
}

/**
 * general purpose functions
 */

/**
 * detect windows OS
 */
function isWindows() {
  return /win/i.test(window.navigator.platform);
}

// listener for ninja forms
$(document).on('nfFormReady', function (e, layoutView) {
  if (layoutView.$el.find('.js-os-select').length) {
    // render OS slects
    const osSelect = $('.js-os-select').select2({
      templateSelection: osSelectTemplate,
      templateResult: osSelectTemplate,
      escapeMarkup: function (m) {
        return m;
      },
      minimumResultsForSearch: -1,
    });

    if (isWindows()) {
      osSelect.val('pc');
      osSelect.trigger('change');
    }
  }
});

// page script
$('document').ready(function () {
  /**
   * max tablet width. Depends on css media
   * @var integer
   */
  const tabletUpLim = 960;

  // toggle menu
  const body = $('body');
  const header = $('.js-header');
  // const mainMenuBox = $('.h-menu-box');
  const menuToggle = $('.js-menu-toggle');
  const isSubmenusClickable = false;
  const submenus = new Submenus(
    $('.main-menu__item_sub-js'),
    tabletUpLim,
    isSubmenusClickable
  );

  menuToggle.on('click', { submenus }, menuToggleFunc);

  $(window).resize(function () {
    if ($(window).innerWidth() > tabletUpLim && body.hasClass('menu-open')) {
      if (isSubmenusClickable) {
        menuClose({ submenus });
      } else {
        menuClose();
      }
    }
  });

  const stickyHeader = new StickyHeader(tabletUpLim);

  if ($('[data-plan]').length) {
    const planCards = new PlanCards();
  }
  // video
  $('.b-video_no-js').removeClass('b-video_no-js');
  $('[data-video]').each(function (ind, val) {
    if ($(val).find('[data-video-src]').length) {
      new VideoBox($(val));
    } else if ($(val).find('[data-video-vimeo-id]').length) {
      new VideoBoxVimeo($(val));
    }
  });

  // render cloud price selects
  const priceSelect = $('.js-cloud-price-select');
  const priceSelectChange = function (e) {
    const select = $(e.currentTarget);
    select
      .closest('.plan-card')
      .find('.plan-card__btn')
      .attr('href', select.val());
  };

  if (priceSelect.length) {
    priceSelect
      .select2({
        minimumResultsForSearch: -1,
        containerCssClass: 'select2-cloud-price',
        dropdownCssClass: 'select2-cloud-price',
        templateSelection: priceCloudTemplate,
        templateResult: priceCloudTemplate,
      })
      .on('change', priceSelectChange);
    priceSelect.trigger('change');
  }

  // forms toggle
  const formsToggle = new ToggleBlock($('[data-b-toggle]'));

  /**
   * ninja forms hidden field "platform"
   */
  try {
    const nfHiddenPlatform = Marionette.Object.extend({
      initialize: function () {
        // Listen to the render:view event for a field type.
        this.listenTo(
          nfRadio.channel('hidden'),
          'render:view',
          this.renderView
        );
      },

      renderView: function (view) {
        if ('platform' != view.model.get('key')) return false;

        const el = $(view.el).find('.nf-element');
        const platform = isWindows() ? 'pc' : 'mac';
        el.val(platform).trigger('change');
      },
    });

    new nfHiddenPlatform();
  } catch (e) {
    console.log(e.message);
  }

  // header menu functions
  /**
   * Toggle header menu displaying
   * @param e Click event
   */
  function menuToggleFunc(e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass('open')) {
      menuClose(e.data);
    } else {
      menuOpen();
    }
  }

  /**
   * Close header menu
   */
  function menuClose(data = {}) {
    body.removeClass('menu-open');
    header.removeClass('menu-open');
    menuToggle.removeClass('open');

    if (data.submenus && isSubmenusClickable) {
      data.submenus.closeRest();
    }
  }

  /**
   * open header menu
   */
  function menuOpen() {
    body.addClass('menu-open');
    header.addClass('menu-open');
    menuToggle.addClass('open');
  }

  function tableTransformations() {
    const tableSection = document.querySelector('.js-section-table');
    if (tableSection) {
      const header = document.querySelector('.js-header-lv1');
      const headerHeight = header.offsetHeight;
      const discoverContent = document.querySelector('.js-discover-content');
      const tableContent = document.querySelector('.js-discover-table');
      const buttonsList = Array.prototype.slice.call(document.querySelectorAll('.js-discover-btn'));
      const belt = document.querySelector('.js-table-belt');

      if (buttonsList.length) {
        function openCloseDiscoverTable() {
          buttonsList.forEach(item => {
            item.addEventListener('click', function () {
              discoverContent.classList.toggle('isExpand');
              buttonsList[0].classList.toggle('isRotated');
              buttonsList[1].classList.toggle('isVisible');
            });
          });

          $('.js-discover-btn').click(function () {
            $(".js-discover-content").fadeToggle("slow");
          });

          scrollToTopBelt();
        };

        openCloseDiscoverTable();

        function makeTableBeltSticky() {
          belt.classList.add('isSticky');
          header.classList.add('stickyForTable');
          addOverflowHiddenClassToBody();
        };

        function addOverflowHiddenClassToBody() {
          document.body.classList.add('hidden-overflow');
        };

        function deleteTableBeltSticky() {
          belt.classList.remove('isSticky');
          header.classList.remove('stickyForTable');
          removeOverflowHiddenClassFromBody();
        };

        function removeOverflowHiddenClassFromBody() {
          document.body.classList.remove('hidden-overflow');
        };

        function determineIfScrollOnTable() {
          let tableContentHeight = tableContent.offsetHeight;
          let offsetOfTheTableContent = tableContent.offsetTop;
          let offsetOfTheTableSection = tableSection.offsetTop;

          if (pageYOffset >= offsetOfTheTableSection + offsetOfTheTableContent + headerHeight && pageYOffset <= offsetOfTheTableSection + offsetOfTheTableContent + tableContentHeight && discoverContent.classList.contains('isExpand')) {
            if (!(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)) { // IF NOT IE11 
              makeTableBeltSticky();
            }
          } else {
            deleteTableBeltSticky();
          };
        };

        function scrollToTopBelt() {
          buttonsList[1].addEventListener('click', function () {
            buttonsList[0].scrollIntoView({ block: "center", behavior: "smooth" });
          });
        };

        window.addEventListener('scroll', determineIfScrollOnTable);
      };
    }
  }

  tableTransformations();

  function plansToggler() {
    const switchBtnsList = Array.prototype.slice.call(document.querySelectorAll('.js-switcher-btn'));
    let planItems = Array.prototype.slice.call(document.querySelectorAll('.js-plan-item'));
    let planLinks = Array.prototype.slice.call(document.querySelectorAll('.js-plan-link'));

    function changeValue(plan) {
      if (plan === 'perpetual') {
        planItems.forEach(item => {
          item.innerHTML = item.getAttribute('data-perpetual');
        });

        planLinks.forEach(item => {
          item.href = item.getAttribute('data-perpetual');
        });
      } else {
        planItems.forEach(item => {
          item.innerHTML = item.getAttribute('data-subscriptions');
        });
        planLinks.forEach(item => {
          item.href = item.getAttribute('data-subscriptions');
        });
      }
    }

    if (switchBtnsList.length) {
      function switchActivePlan() {
        switchBtnsList.forEach(item => {
          item.addEventListener('click', function () {
            removeActiveClass();
            addActiveClass(item);
            let activePlan = item.getAttribute('data-plan');
            changeValue(activePlan);
          });
        });
      };

      switchActivePlan();
    }

    function removeActiveClass() {
      for (let i = 0; i < switchBtnsList.length; i++) {
        switchBtnsList[i].classList.remove('isActive');
      };
    };

    function addActiveClass(el) {
      el.classList.add('isActive');
    };
  };

  plansToggler();

  function pricingPopup() {
    const supportBtnList = Array.prototype.slice.call(document.querySelectorAll('.js-pricing-btn'));
    const closeBtnList = Array.prototype.slice.call(document.querySelectorAll('.js-popup-close'));

    if (supportBtnList.length) {
      supportBtnList.forEach(item => {
        item.addEventListener('click', function () {
          let pushedBtn = item.getAttribute('data-btn');
          openPopup(pushedBtn);
        });
      });

      closePopupByClick();
      closePopupByEsc();
    }

    function openPopup(type) {
      let currentPopup = document.querySelector('[data-popup-' + type + ']');
      currentPopup.classList.add('isShown');
      addDarkenedClassToBody();
    };

    function closePopupByClick() {
      closeBtnList.forEach(item => {
        item.addEventListener('click', function () {
          closePopup();
        });
      });
    };

    function closePopupByEsc() {
      document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
          closePopup();
        };
      });
    };

    function closePopup() {
      let openPopup = document.querySelector('.js-pricing-popup.isShown');
      openPopup.classList.remove('isShown');
      deleteDarkenedClassFromBody();
    };

    function addDarkenedClassToBody() {
      document.body.classList.add('isDarkened');
    };

    function deleteDarkenedClassFromBody() {
      document.body.classList.remove('isDarkened');
    };
  }

  pricingPopup();
});

function setPriceHeight() {
  let prices = document.querySelectorAll('.js-price');

  if (prices.length) {
    let priceList = Array.prototype.slice.call(prices);

    let firstPriceHeight = Math.ceil(priceList[0].offsetHeight);
    let secondPriceHeight = Math.ceil(priceList[1].offsetHeight);
    let thirdPriceHeight = Math.ceil(priceList[2].offsetHeight);

    let maxPriceHeight = Math.max(firstPriceHeight, secondPriceHeight, thirdPriceHeight);
    priceList.forEach(item => {
      item.style.minHeight = maxPriceHeight + 'px';
    });
  };
};

setPriceHeight();