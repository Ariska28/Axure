"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var osSelectTemplate = function osSelectTemplate(state) {
  if (!state.id) {
    return state.text;
  }

  var $state = $('<span >' + '<span class="select2-ic">' + '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ic-' + state.element.value.toLowerCase() + '"></use></svg>' + '</span>' + state.text + '</span>');
  return $state;
};
/**
 * format Cloud prices selections.
 * Replace all numbers and $ prices with bold values, replace periods with styled span
 */


var priceCloudTemplate = function priceCloudTemplate(state) {
  if (!state.id) {
    return state.text;
  }

  var periods = ['month'];
  var periodReg = new RegExp("(".concat(periods.join('|'), ")"), 'gi');
  var $state = $("<span>\n      ".concat(state.text.replace(/(\$?\d+)/g, '<b>$1</b>').replace(periodReg, '<span class="select2-cloud-period">$1</span>'), "\n    </span>"));
  return $state;
};
/**
 * video box
 * @param jBox jQuery element
 */


var DATA_VIDEO_SRC = 'data-video-src';

var VideoBox =
/*#__PURE__*/
function () {
  function VideoBox(jBox) {
    _classCallCheck(this, VideoBox);

    this.boxJEl = jBox;
    this.videoJWrapper = this.boxJEl.find("[".concat(DATA_VIDEO_SRC, "]"));
    this.playJEl = this.boxJEl.find("[data-video-play]");
    this.src = [this.videoJWrapper.attr(DATA_VIDEO_SRC)];
    var count = 1;
    var src = this.videoJWrapper.attr("".concat(DATA_VIDEO_SRC).concat(count));

    while (src) {
      this.src.push(src);
      count++;
      src = this.videoJWrapper.attr("".concat(DATA_VIDEO_SRC).concat(count));
    }

    if (!this.src.length) {
      this.log('No sources for video.');
      return;
    }

    this.downloadInit();
  }

  _createClass(VideoBox, [{
    key: "render",
    value: function render() {
      var sources = this.sources(); // const video = `
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
  }, {
    key: "sources",
    value: function sources() {
      var _this = this;

      var sources = '';
      this.src.forEach(function (val) {
        var type = _this.getVideoType(val);

        sources += "<source src=\"".concat(val, "\" type=\"video/").concat(type, "\">");
      });
      return sources;
    }
  }, {
    key: "getVideoType",
    value: function getVideoType(name) {
      if (name.indexOf('.') === -1) return '';
      return name.replace(/.+\.([^.]*)$/, '$1');
    }
  }, {
    key: "downloadInit",
    value: function downloadInit() {
      var _this2 = this;

      this.playJEl.one('click', function () {
        _this2.render();
      });
    }
  }, {
    key: "videoHandlersInit",
    value: function videoHandlersInit() {
      var _this3 = this;

      this.video.addEventListener('canplay', function (e) {
        _this3.play();
      });
      this.videoJEl.on('click', function (e) {
        _this3.pause();
      });
      this.playJEl.on('click', function (e) {
        _this3.play();
      });
    }
  }, {
    key: "play",
    value: function play() {
      if (!this.video.paused) return;
      this.videoJWrapper.css('z-index', 50).animate({
        opacity: 1
      });
      this.video.play();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.video.paused) return;
      this.video.pause();
      this.videoJWrapper.animate({
        opacity: 0
      }, {
        duration: 'fast',
        complete: function complete() {
          $(this).css('z-index', '');
        }
      });
    }
  }, {
    key: "log",
    value: function log(err) {
      console.log(err);
    }
  }]);

  return VideoBox;
}();
/**
 * video box
 * @param jBox jQuery element
 */


var DATA_VIDEO_VIMEO_ID = 'data-video-vimeo-id';

var VideoBoxVimeo =
/*#__PURE__*/
function () {
  function VideoBoxVimeo(jBox) {
    _classCallCheck(this, VideoBoxVimeo);

    this.boxJEl = jBox;
    this.videoJWrapper = this.boxJEl.find("[".concat(DATA_VIDEO_VIMEO_ID, "]"));
    this.playJEl = this.boxJEl.find("[data-video-play]"); // vimeo

    this.iframe = this.boxJEl.find('iframe');
    this.player = new Vimeo.Player(this.iframe[0]);
    this.show = this.show.bind(this);
    this.init();
  }

  _createClass(VideoBoxVimeo, [{
    key: "init",
    value: function init() {
      this.boxJEl.addClass('b-video_pseudo-hide');
      this.player.on('play', this.show);
    }
  }, {
    key: "show",
    value: function show() {
      this.boxJEl.addClass('b-video_pseudo-hide-show');
    }
  }]);

  return VideoBoxVimeo;
}();
/**
 * Sticky header detects the precense of header's second level.
 * Makes header or js-header-lv1 or js-header-lv2 sticky.
 */


var StickyHeader =
/*#__PURE__*/
function () {
  function StickyHeader(edge, isLv2Stuck) {
    _classCallCheck(this, StickyHeader);

    this.options = {
      bottoming: false,
      parent: $('body'),
      offset_top: -1
    };
    this.edge = edge;
    this.isLv2Stuck = isLv2Stuck || false;
    this.header = $('.js-header');
    this.lv1 = $('.js-header-lv1');
    this.lv2 = $('.js-header-lv2');
    this.state = {
      mobView: false
    };
    this.resize = this.resize.bind(this);
    this.init(); // if (this.lv1.length && this.lv2.length) {

    $(window).resize(this.resize); // }
  }

  _createClass(StickyHeader, [{
    key: "updateState",
    value: function updateState(opt) {
      this.state.mobView = opt.mobView || false;
    }
  }, {
    key: "init",
    value: function init() {
      var self = this;

      if ($(window).innerWidth() < this.edge) {
        //  mobile, tablet
        // header always stick
        if (this.header.length) {
          this.header.stick_in_parent(this.options).on('sticky_kit:stick', function (e) {
            self.header.addClass('header_light');
          }).on('sticky_kit:unstick', function (e) {
            self.header.removeClass('header_light');
          });
          this.updateState({
            mobView: true
          });
        }
      } else {
        //  desktop
        if (this.lv2.length && this.isLv2Stuck) {
          this.lv2.stick_in_parent(this.options);
        } else if (this.lv1.length) {
          this.lv1.stick_in_parent(this.options).on('sticky_kit:stick', function (e) {
            self.header.addClass('header_light');
          }).on('sticky_kit:unstick', function (e) {
            self.header.removeClass('header_light');
          });
        }

        this.updateState({
          mobView: false
        });
      }
    }
  }, {
    key: "reinit",
    value: function reinit() {
      this.header.trigger('sticky_kit:detach');
      this.lv1.trigger('sticky_kit:detach');
      this.lv2.trigger('sticky_kit:detach');
      this.init();
    }
  }, {
    key: "resize",
    value: function resize() {
      if ($(window).innerWidth() < this.edge && !this.state.mobView) {
        this.reinit();
      } else if ($(window).innerWidth() >= this.edge && this.state.mobView) {
        this.reinit();
      }
    }
  }]);

  return StickyHeader;
}();
/**
 * submenu parent
 * @param wrapper jQuery element
 // * @param hub observer
 */


var Submenu =
/*#__PURE__*/
function () {
  function Submenu(wrapper, upLimit) {
    var _this4 = this;

    var isClickable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Submenu);

    this.submenuClassName = 'submenu';
    this.upLimit = upLimit || null;
    this.wrapper = wrapper;
    this.submenu = this.wrapper.find(".".concat(this.submenuClassName));
    this.toggle = this.wrapper.find(">a");
    this.opened = false;
    this.listeners = {};
    this.initOpen();

    if (isClickable) {
      this.toggle.on('click', function (e) {
        if (_this4.upLimit && $(window).innerWidth() > _this4.upLimit) {
          return;
        }

        e.preventDefault();

        if (_this4.opened) {
          _this4.close();
        } else {
          _this4.open();
        }
      });
    }
  }

  _createClass(Submenu, [{
    key: "on",
    value: function on(ev, cb) {
      if (this.listeners[ev] === undefined) {
        this.listeners[ev] = {};
        this.listeners[ev].cb = [];
      }

      this.listeners[ev].cb.push(cb);
    }
  }, {
    key: "off",
    value: function off(ev, cb) {
      if (!this.listeners[ev]) return;
      this.listeners[ev].cb = this.listeners[ev].cb.filter(function (listener) {
        return listener !== cb;
      });
    }
  }, {
    key: "notify",
    value: function notify(ev, data) {
      if (!this.listeners[ev] || !this.listeners[ev].cb) return;
      this.listeners[ev].cb.forEach(function (listener) {
        return listener(data);
      });
    }
  }, {
    key: "initOpen",
    value: function initOpen() {
      this.wrapper.addClass('main-menu__item_sub-open');
      this.submenu.addClass("".concat(this.submenuClassName, "_open")).slideDown();
    }
  }, {
    key: "open",
    value: function open() {
      this.wrapper.addClass('main-menu__item_sub-open');
      this.submenu.addClass("".concat(this.submenuClassName, "_open")).slideDown();
      this.opened = true;
      this.notify('open', {
        submenu: this
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.wrapper.removeClass('main-menu__item_sub-open');
      this.submenu.removeClass("".concat(this.submenuClassName, "_open")).slideUp();
      this.opened = false; // this.notify('close', { 'submenu': this });
    }
  }]);

  return Submenu;
}();
/**
 * Handle all submenus
 * @param parents list of jQuery elements, clickable parents of the submenus
 */


var Submenus =
/*#__PURE__*/
function () {
  function Submenus(parents, upLimit, isClickable) {
    var _this5 = this;

    _classCallCheck(this, Submenus);

    this.closeRest = this.closeRest.bind(this);
    this.upLimit = upLimit || null;
    this.submenus = [];
    parents.each(function (ind, node) {
      var submenu = new Submenu($(node), _this5.upLimit, isClickable);

      _this5.submenus.push(submenu);

      submenu.on('open', _this5.closeRest);
    });
  }

  _createClass(Submenus, [{
    key: "closeRest",
    value: function closeRest() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          submenu = _ref.submenu;

      this.submenus.forEach(function (item) {
        if (item === submenu) return;
        item.close();
      });
    }
  }]);

  return Submenus;
}();
/**
 * Plan cards
 */


var PLAN_MONTHLY = 'monthly';
var PLAN_PERPETUAL = 'perpetual';

var PlanCard =
/*#__PURE__*/
function () {
  function PlanCard(el) {
    var _period, _this$options, _this$href;

    _classCallCheck(this, PlanCard);

    this.el = el;
    this.options = (_this$options = {}, _defineProperty(_this$options, PLAN_MONTHLY, $(el).find('[data-period-monthly]').attr('data-period-monthly') || 'per month'), _defineProperty(_this$options, PLAN_PERPETUAL, $(el).find('[data-period-perpetual]').attr('data-period-perpetual') || 'perpetual'), _defineProperty(_this$options, "togglePerpetualClass", 'toggle_switched'), _defineProperty(_this$options, "cardPerpetualClass", 'plan-card_perpetual'), _defineProperty(_this$options, "period", (_period = {}, _defineProperty(_period, PLAN_MONTHLY, {
      // name: $(el).find('[data-toggle-monthly]').attr('data-toggle-monthly') || 'Monthly',
      value: $(el).find('[data-period-monthly]').attr('data-period-monthly') || 'per month',
      price: $(el).find('[data-price-monthly]').attr('data-price-monthly')
    }), _defineProperty(_period, PLAN_PERPETUAL, {
      // name: $(el).find('[data-toggle-perpetual]').attr('data-toggle-perpetual') || 'Perpetual',
      value: $(el).find('[data-period-perpetual]').attr('data-period-perpetual') || 'perpetual',
      price: $(el).find('[data-price-perpetual]').attr('data-price-perpetual')
    }), _period)), _this$options);
    this.currencyJEl = $(el).find('[data-currency]');
    this.toggleJEl = $(el).find('[data-toggle]');
    this.valueJEl = $(el).find('[data-value]');
    this.periodJEl = $(el).find('[data-period]');
    this.linkJEl = $(el).find('[data-href-monthly]');
    this.href = (_this$href = {}, _defineProperty(_this$href, PLAN_MONTHLY, this.linkJEl.attr("data-href-".concat(PLAN_MONTHLY))), _defineProperty(_this$href, PLAN_PERPETUAL, this.linkJEl.attr("data-href-".concat(PLAN_PERPETUAL))), _this$href);
  }

  _createClass(PlanCard, [{
    key: "setPeriod",
    value: function setPeriod(period) {
      if (period === PLAN_MONTHLY) {
        $(this.el).removeClass(this.options.cardPerpetualClass);
        this.toggleJEl.removeClass(this.options.togglePerpetualClass);
      } else {
        $(this.el).addClass(this.options.cardPerpetualClass);
        this.toggleJEl.addClass(this.options.togglePerpetualClass);
      }

      this.updateVeiw(period);
    }
  }, {
    key: "updatePrice",
    value: function updatePrice(text, currencyJEl) {
      var currency = this.currencyJEl;
      currency.fadeOut(100);
      this.valueJEl.fadeOut(100, function () {
        $(this).html(text).fadeIn(100);
        currency.fadeIn(100);
      });
    }
  }, {
    key: "updateVeiw",
    value: function updateVeiw(period) {
      this.updatePrice(this.options.period[period].price);
      this.periodJEl.html(this.options.period[period].value);
      this.linkJEl.attr('href', this.href[period]);
    }
  }]);

  return PlanCard;
}();

var PlanCards =
/*#__PURE__*/
function () {
  function PlanCards() {
    _classCallCheck(this, PlanCards);

    var self = this;
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

  _createClass(PlanCards, [{
    key: "toggle",
    value: function toggle(e) {
      if (this.period === PLAN_MONTHLY) {
        this.setPeriod(PLAN_PERPETUAL);
      } else {
        this.setPeriod(PLAN_MONTHLY);
      }
    }
  }, {
    key: "setPeriod",
    value: function setPeriod(period) {
      this.cards.each(function (ind, item) {
        item.setPeriod(period);
      });
      this.period = period;
    }
  }]);

  return PlanCards;
}();
/**
 * toggle block. Show hide several blocks
 */


var ToggleBlock =
/*#__PURE__*/
function () {
  function ToggleBlock(block) {
    _classCallCheck(this, ToggleBlock);

    this.block = block;
    this.active = null;
    this.lastElHeight = 0;
    this.fixHeight = this.fixHeight.bind(this);
    this.restoreHeight = this.restoreHeight.bind(this);
    this.init();
  }

  _createClass(ToggleBlock, [{
    key: "init",
    value: function init() {
      var _this6 = this;

      this.block.find('[data-b-toggle-info]').not(':first-child').css('display', 'none');
      this.block.on('click', '[data-b-toggle-switcher]', function (e) {
        var name = $(e.currentTarget).attr('data-b-toggle-switcher');

        _this6.switch(name);
      });
      var firstName = this.block.find('[data-b-toggle-info]').eq(0).attr('data-b-toggle-info');
      this.show(firstName);
      this.activate(firstName);
    }
  }, {
    key: "switch",
    value: function _switch(name) {
      if (name === this.active.attr('data-b-toggle-info')) {
        return;
      }

      this.hideActive(name);
      this.activate(name);
    }
  }, {
    key: "activate",
    value: function activate(name) {
      this.block.find('[data-b-toggle-switcher]').removeClass('toggle-block__btn_active');
      this.block.find("[data-b-toggle-switcher=\"".concat(name, "\"]")).addClass('toggle-block__btn_active');
    }
  }, {
    key: "hideActive",
    value: function hideActive(name) {
      var _this7 = this;

      this.lastElHeight = this.active.outerHeight();
      this.fixHeight();
      this.active.fadeOut({
        complete: function complete() {
          if (name) {
            _this7.show(name);
          }
        }
      });
    }
  }, {
    key: "show",
    value: function show(name) {
      this.active = this.block.find("[data-b-toggle-info=\"".concat(name, "\"]"));
      this.active.fadeIn({
        start: this.restoreHeight
      });
    }
  }, {
    key: "fixHeight",
    value: function fixHeight() {
      this.block.css('height', this.block.outerHeight());
      this.block.find('[data-b-toggle-info]').css({
        position: 'absolute'
      });
    }
  }, {
    key: "restoreHeight",
    value: function restoreHeight() {
      this.block.find('[data-b-toggle-info]').css({
        position: ''
      }); // const currHeight = this.block[0].scrollHeight;

      var currHeight = this.block.height() - this.lastElHeight + this.active.outerHeight();
      this.block.animate({
        height: currHeight
      }, {
        complete: function complete() {
          $(this).css('height', 'auto');
        }
      });
    }
  }]);

  return ToggleBlock;
}();
/**
 * general purpose functions
 */

/**
 * detect windows OS
 */


function isWindows() {
  return /win/i.test(window.navigator.platform);
} // listener for ninja forms


$(document).on('nfFormReady', function (e, layoutView) {
  if (layoutView.$el.find('.js-os-select').length) {
    // render OS slects
    var osSelect = $('.js-os-select').select2({
      templateSelection: osSelectTemplate,
      templateResult: osSelectTemplate,
      escapeMarkup: function escapeMarkup(m) {
        return m;
      },
      minimumResultsForSearch: -1
    });

    if (isWindows()) {
      osSelect.val('pc');
      osSelect.trigger('change');
    }
  }
}); // page script

$('document').ready(function () {
  /**
   * max tablet width. Depends on css media
   * @var integer
   */
  var tabletUpLim = 960; // toggle menu

  var body = $('body');
  var header = $('.js-header'); // const mainMenuBox = $('.h-menu-box');

  var menuToggle = $('.js-menu-toggle');
  var isSubmenusClickable = false;
  var submenus = new Submenus($('.main-menu__item_sub-js'), tabletUpLim, isSubmenusClickable);
  menuToggle.on('click', {
    submenus: submenus
  }, menuToggleFunc);
  $(window).resize(function () {
    if ($(window).innerWidth() > tabletUpLim && body.hasClass('menu-open')) {
      if (isSubmenusClickable) {
        menuClose({
          submenus: submenus
        });
      } else {
        menuClose();
      }
    }
  });
  var stickyHeader = new StickyHeader(tabletUpLim);

  if ($('[data-plan]').length) {
    var planCards = new PlanCards();
  } // video


  $('.b-video_no-js').removeClass('b-video_no-js');
  $('[data-video]').each(function (ind, val) {
    if ($(val).find('[data-video-src]').length) {
      new VideoBox($(val));
    } else if ($(val).find('[data-video-vimeo-id]').length) {
      new VideoBoxVimeo($(val));
    }
  }); // render cloud price selects

  var priceSelect = $('.js-cloud-price-select');

  var priceSelectChange = function priceSelectChange(e) {
    var select = $(e.currentTarget);
    select.closest('.plan-card').find('.plan-card__btn').attr('href', select.val());
  };

  if (priceSelect.length) {
    priceSelect.select2({
      minimumResultsForSearch: -1,
      containerCssClass: 'select2-cloud-price',
      dropdownCssClass: 'select2-cloud-price',
      templateSelection: priceCloudTemplate,
      templateResult: priceCloudTemplate
    }).on('change', priceSelectChange);
    priceSelect.trigger('change');
  } // forms toggle


  var formsToggle = new ToggleBlock($('[data-b-toggle]'));
  /**
   * ninja forms hidden field "platform"
   */

  try {
    var nfHiddenPlatform = Marionette.Object.extend({
      initialize: function initialize() {
        // Listen to the render:view event for a field type.
        this.listenTo(nfRadio.channel('hidden'), 'render:view', this.renderView);
      },
      renderView: function renderView(view) {
        if ('platform' != view.model.get('key')) return false;
        var el = $(view.el).find('.nf-element');
        var platform = isWindows() ? 'pc' : 'mac';
        el.val(platform).trigger('change');
      }
    });
    new nfHiddenPlatform();
  } catch (e) {
    console.log(e.message);
  } // header menu functions

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


  function menuClose() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
    var tableSection = document.querySelector('.js-section-table');

    if (tableSection) {
      var _header = document.querySelector('.js-header-lv1');

      var headerHeight = _header.offsetHeight;
      var discoverContent = document.querySelector('.js-discover-content');
      var tableContent = document.querySelector('.js-discover-table');
      var buttonsList = Array.prototype.slice.call(document.querySelectorAll('.js-discover-btn'));
      var belt = document.querySelector('.js-table-belt');

      if (buttonsList.length) {
        var openCloseDiscoverTable = function openCloseDiscoverTable() {
          buttonsList.forEach(function (item) {
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

        var makeTableBeltSticky = function makeTableBeltSticky() {
          belt.classList.add('isSticky');

          _header.classList.add('stickyForTable');

          addOverflowHiddenClassToBody();
        };

        var addOverflowHiddenClassToBody = function addOverflowHiddenClassToBody() {
          document.body.classList.add('hidden-overflow');
        };

        var deleteTableBeltSticky = function deleteTableBeltSticky() {
          belt.classList.remove('isSticky');

          _header.classList.remove('stickyForTable');

          removeOverflowHiddenClassFromBody();
        };

        var removeOverflowHiddenClassFromBody = function removeOverflowHiddenClassFromBody() {
          document.body.classList.remove('hidden-overflow');
        };

        var determineIfScrollOnTable = function determineIfScrollOnTable() {
          var tableContentHeight = tableContent.offsetHeight;
          var offsetOfTheTableContent = tableContent.offsetTop;
          var offsetOfTheTableSection = tableSection.offsetTop;

          if (pageYOffset >= offsetOfTheTableSection + offsetOfTheTableContent + headerHeight && pageYOffset <= offsetOfTheTableSection + offsetOfTheTableContent + tableContentHeight && discoverContent.classList.contains('isExpand')) {
            if (!(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)) {
              // IF NOT IE11 
              makeTableBeltSticky();
            }
          } else {
            deleteTableBeltSticky();
          }

          ;
        };

        var scrollToTopBelt = function scrollToTopBelt() {
          buttonsList[1].addEventListener('click', function () {
            buttonsList[0].scrollIntoView({
              block: "center",
              behavior: "smooth"
            });
          });
        };

        ;
        openCloseDiscoverTable();
        ;
        ;
        ;
        ;
        ;
        ;
        window.addEventListener('scroll', determineIfScrollOnTable);
      }

      ;
    }
  }

  tableTransformations();

  function plansToggler() {
    var switchBtnsList = Array.prototype.slice.call(document.querySelectorAll('.js-switcher-btn'));
    var planItems = Array.prototype.slice.call(document.querySelectorAll('.js-plan-item'));
    var planLinks = Array.prototype.slice.call(document.querySelectorAll('.js-plan-link'));

    function changeValue(plan) {
      if (plan === 'perpetual') {
        planItems.forEach(function (item) {
          item.innerHTML = item.getAttribute('data-perpetual');
        });
        planLinks.forEach(function (item) {
          item.href = item.getAttribute('data-perpetual');
        });
      } else {
        planItems.forEach(function (item) {
          item.innerHTML = item.getAttribute('data-subscriptions');
        });
        planLinks.forEach(function (item) {
          item.href = item.getAttribute('data-subscriptions');
        });
      }
    }

    if (switchBtnsList.length) {
      var switchActivePlan = function switchActivePlan() {
        switchBtnsList.forEach(function (item) {
          item.addEventListener('click', function () {
            removeActiveClass();
            addActiveClass(item);
            var activePlan = item.getAttribute('data-plan');
            changeValue(activePlan);
          });
        });
      };

      ;
      switchActivePlan();
    }

    function removeActiveClass() {
      for (var i = 0; i < switchBtnsList.length; i++) {
        switchBtnsList[i].classList.remove('isActive');
      }

      ;
    }

    ;

    function addActiveClass(el) {
      el.classList.add('isActive');
    }

    ;
  }

  ;
  plansToggler();

  function pricingPopup() {
    var supportBtnList = Array.prototype.slice.call(document.querySelectorAll('.js-pricing-btn'));
    var closeBtnList = Array.prototype.slice.call(document.querySelectorAll('.js-popup-close'));

    if (supportBtnList.length) {
      supportBtnList.forEach(function (item) {
        item.addEventListener('click', function () {
          var pushedBtn = item.getAttribute('data-btn');
          openPopup(pushedBtn);
        });
      });
      closePopupByClick();
      closePopupByEsc();
    }

    function openPopup(type) {
      var currentPopup = document.querySelector('[data-popup-' + type + ']');
      currentPopup.classList.add('isShown');
      addDarkenedClassToBody();
    }

    ;

    function closePopupByClick() {
      closeBtnList.forEach(function (item) {
        item.addEventListener('click', function () {
          closePopup();
        });
      });
    }

    ;

    function closePopupByEsc() {
      document.addEventListener('keydown', function (e) {
        if (e.keyCode === 27) {
          closePopup();
        }

        ;
      });
    }

    ;

    function closePopup() {
      var openPopup = document.querySelector('.js-pricing-popup.isShown');
      openPopup.classList.remove('isShown');
      deleteDarkenedClassFromBody();
    }

    ;

    function addDarkenedClassToBody() {
      document.body.classList.add('isDarkened');
    }

    ;

    function deleteDarkenedClassFromBody() {
      document.body.classList.remove('isDarkened');
    }

    ;
  }

  pricingPopup();
});

function setPriceHeight() {
  var prices = document.querySelectorAll('.js-price');

  if (prices.length) {
    var priceList = Array.prototype.slice.call(prices);
    var firstPriceHeight = Math.ceil(priceList[0].offsetHeight);
    var secondPriceHeight = Math.ceil(priceList[1].offsetHeight);
    var thirdPriceHeight = Math.ceil(priceList[2].offsetHeight);
    var maxPriceHeight = Math.max(firstPriceHeight, secondPriceHeight, thirdPriceHeight);
    priceList.forEach(function (item) {
      item.style.minHeight = maxPriceHeight + 'px';
    });
  }

  ;
}

;
setPriceHeight();