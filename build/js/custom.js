(function (factory) {
  typeof define === 'function' && define.amd ? define('custom', factory) :
  factory();
}((function () { 'use strict';

  Fancybox.bind("[data-fancybox]", {
    dragToClose: false
  });
  document.querySelectorAll('[type="tel"]').forEach(item => {
    new IMask(item, {
      mask: '{+375} 00 000 00 00',
      lazy: false
    });
  });
  document.querySelectorAll('[data-number-only]').forEach(item => {
    IMask(item, {
      mask: item.dataset.numberOnly ?? '00'
    });
  });
  document.querySelectorAll('[data-number]').forEach(item => {
    IMask(item, {
      mask: '0000000000'
    });
  });
  document.querySelectorAll('[data-birthday]').forEach(item => {
    IMask(item, {
      mask: '00.00.0000'
    });
  });

  // Вспомогательная функция открытия и закрытия
  document.querySelectorAll('[data-fancybox-src]')?.forEach(item => item.addEventListener('click', e => {
    Fancybox.close();
    Fancybox.show([{
      src: e.target.dataset.fancyboxSrc,
      dragToClose: false,
      defaultType: 'inline'
    }]);
  }));

  const dropdown = () => {
    const dropdown = document.querySelectorAll('.dropdown');
    const btnDropdown = document.querySelectorAll('.dropdown__toggler');
    const keycode = {
      ESC: 27
    };
    const closeDropdown = () => {
      dropdown.forEach(elem => {
        if (elem.classList.contains('dropdown--open')) {
          elem.classList.remove('dropdown--open');
        }
      });
    };
    btnDropdown.forEach(item => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        this.closest('.dropdown').classList.toggle('dropdown--open');
      });
    });
    document.addEventListener('click', function (evt) {
      if (!evt.target.matches('.dropdown__toggler')) {
        closeDropdown();
      }
    });
    document.addEventListener('keydown', evt => {
      if (evt.keyCode === keycode.ESC) {
        closeDropdown();
      }
    });
  };
  dropdown();

  const clipboard = document.querySelectorAll('[data-copy-code]');
  clipboard?.forEach(item => item?.addEventListener('click', async () => {
    const inputCopy = item.querySelector('input');
    const text = inputCopy.value;
    inputCopy.select();
    await navigator.clipboard.writeText(text);
  }));

  document.querySelectorAll('[data-btn-eye]').forEach(item => item?.addEventListener('click', () => {
    const field = item.parentElement.querySelector('input');
    item.classList.toggle('field-text__btn-password--open');
    item.classList.contains('field-text__btn-password--open') ? field.type = 'text' : field.type = 'password';
  }));

  const choiceSelect = document.querySelectorAll('[data-choices-select]');

  //todo: на мобилке наверное стоит убить
  choiceSelect.forEach(item => {
    new Choices(item, {
      searchChoices: false,
      searchEnabled: false,
      itemSelectText: '',
      renderSelectedChoices: 'asd',
      placeholder: true,
      placeholderValue: 'ads',
      sorter: () => false
    });
  });

  class FieldNum {
    constructor(field) {
      this.field = field;
      this.input = field.querySelector('.field-num__input');
      this.init();
    }
    init() {
      this.valueMin = this.input.getAttribute('min') ? Number(this.input.getAttribute('min')) : -Infinity;
      this.valueMax = this.input.getAttribute('max') ? Number(this.input.getAttribute('max')) : Infinity;
      this.valueStep = this.input.getAttribute('step') ? Number(this.input.getAttribute('step')) : 1;
      this.bindEvents();
    }
    bindEvents() {
      this.field.addEventListener('click', event => {
        if (event.target.classList.contains('field-num__btn') && !this.input.hasAttribute('disabled')) {
          this.handleButtonClick(event.target);
        }
      });
    }
    handleButtonClick(button) {
      let num = parseInt(this.input.value) || 0;
      if (button.classList.contains('field-num__btn--plus') && num < this.valueMax) {
        this.input.value = num + this.valueStep;
      }
      if (button.classList.contains('field-num__btn--minus') && num > this.valueMin) {
        this.input.value = num - this.valueStep;
      }
    }
  }
  document.querySelectorAll('.field-num')?.forEach(field => new FieldNum(field));

  document.querySelectorAll("[data-form]").forEach(itemForm => {
    const pristine = new Pristine(itemForm, {
      classTo: 'field-text',
      errorTextParent: 'field-text'
    }, false);
    const onSubmitForm = e => {
      const valid = pristine.validate();
      return valid ? true : e.preventDefault();
    };
    const onChangeForm = e => {
      const parent = e.target.closest('.field-text');
      parent.classList.remove('has-danger');
      if (!!parent.querySelector('.pristine-error')) {
        parent.querySelector('.pristine-error').textContent = "";
      }
    };
    itemForm.addEventListener("submit", onSubmitForm);
    itemForm.addEventListener("input", onChangeForm);
  });

  class Accordion {
    constructor() {
      this._openHeight = 0;
      this._windowWidth = window.innerWidth;
      this._documentClickHandler = this._documentClickHandler.bind(this);
      this._windowResizeHandler = this._windowResizeHandler.bind(this);
      this._init();
    }
    _init() {
      this.fullUpdate();
      document.addEventListener('click', this._documentClickHandler);
      window.addEventListener('resize', this._windowResizeHandler);
    }
    _documentClickHandler(evt) {
      const target = evt.target;
      if (!target.closest('[data-accordion="button"]')) {
        return;
      }
      evt.preventDefault();
      const parent = target.closest('[data-accordion="parent"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        return;
      }
      const element = target.closest('[data-accordion="element"]');
      if (element.classList.contains('is-active')) {
        this.closeAccordion(element);
        return;
      }
      this.openAccordion(element);
    }
    _windowResizeHandler() {
      if (this._windowWidth === window.innerWidth) {
        return;
      }
      this._windowWidth = window.innerWidth;
      this.updateAccordionsHeight();
    }
    closeAllAccordion(parent) {
      const elements = parent.querySelectorAll('[data-accordion="element"]');
      elements.forEach(element => {
        const currentParent = element.closest('[data-accordion="parent"]');
        if (currentParent === parent) {
          this.closeAccordion(element);
        }
      });
    }
    updateAccordionsHeight(element = null) {
      if (element) {
        const content = element.querySelector('[data-accordion="content"]');
        content.style.transition = 'none';
        content.style.maxHeight = `${content.scrollHeight}px`;
        setTimeout(() => {
          content.style.transition = null;
        });
        return;
      }
      const closeElements = document.querySelectorAll('[data-accordion="element"]:not(.is-active)');
      closeElements.forEach(closeElement => {
        const parent = closeElement.closest('[data-accordion="parent"]');
        const content = closeElement.querySelector('[data-accordion="content"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.maxHeight = null;
      });
      const openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      openElements.forEach(openElement => {
        const content = openElement.querySelector('[data-accordion="content"]');
        const parent = openElement.closest('[data-accordion="parent"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.transition = 'none';
        content.style.maxHeight = `${content.scrollHeight}px`;
        setTimeout(() => {
          content.style.transition = null;
        });
      });
    }
    fullUpdate(parent = null, transition = false) {
      let openElements;
      if (parent) {
        openElements = parent.querySelectorAll('[data-accordion="element"].is-active');
      } else {
        openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      }
      openElements.forEach(openElement => {
        const innerParent = openElement.querySelector('[data-accordion="parent"]');
        if (innerParent) {
          return;
        }
        this.openAccordion(openElement, transition);
      });
      this.updateAccordionsHeight();
    }
    openAccordion(element, transition = true) {
      const parentElement = element.closest('[data-accordion="parent"]');
      const contentElement = element.querySelector('[data-accordion="content"]');
      this._openHeight += contentElement.scrollHeight;
      if (parentElement.hasAttribute('data-single')) {
        this.closeAllAccordion(parentElement);
      }
      element.classList.add('is-active');
      if (transition) {
        contentElement.style.maxHeight = `${this._openHeight}px`;
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = `${this._openHeight}px`;
        setTimeout(() => {
          contentElement.style.transition = null;
        });
      }
      if (parentElement.closest('[data-accordion="element"]')) {
        this.openAccordion(parentElement.closest('[data-accordion="element"]'), transition);
        return;
      }
      this._openHeight = 0;
    }
    closeAccordion(element, transition = true) {
      const contentElement = element.querySelector('[data-accordion="content"]');
      if (!contentElement) {
        return;
      }
      element.classList.remove('is-active');
      if (transition) {
        contentElement.style.maxHeight = '0';
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = '0';
        setTimeout(() => {
          contentElement.style.transition = null;
        });
      }
    }
  }
  new Accordion();

  //TODO переместить
  Fancybox.bind("[data-src]", {
    dragToClose: false,
    on: {
      done: (fancybox, slide) => {
        const contentElement = slide.el.lastChild.querySelector('.is-active .accordion__content');
        contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
      }
    }
  });

  class TabFilter {
    constructor(elem) {
      this._ALL = 'all';
      this._elTabs = elem;
      if (!window.matchMedia(this._elTabs?.dataset?.destroy).matches) {
        if (this._elTabs) {
          this._elButtons = this._elTabs.querySelectorAll('[data-btn-filter]');
          this._elPanes = this._elTabs.querySelectorAll('[data-filter]');
          this._dropTextFilter = this._elTabs.querySelector('[data-filter-drop-text]');
          this._init();
        }
      }
    }
    defaultActivePanelFilter() {
      this._elButtons.forEach(e => {
        if (!e.classList.contains('active')) {
          const currentTab = e.dataset.btnFilter;
          this._elTabs.querySelectorAll(`[data-filter=${currentTab}]`).forEach(e => e.setAttribute('hidden', ''));
        }
      });
    }
    tabFilterPanel(elem) {
      const currentTab = elem.currentTarget.dataset.btnFilter;
      this._elPanes.forEach(e => e.setAttribute('hidden', ''));
      if (currentTab === this._ALL) {
        this._elPanes.forEach(e => e.removeAttribute("hidden"));
      } else {
        this._elTabs.querySelectorAll(`[data-filter=${currentTab}]`).forEach(e => e.removeAttribute('hidden'));
      }
    }
    tabBtnElemActive(currentElem) {
      const dataBtnValue = currentElem.currentTarget.dataset.btnFilter;
      this._elButtons.forEach(e => e.classList.remove('active'));
      this._elTabs.querySelectorAll(`[data-btn-filter=${dataBtnValue}]`).forEach(e => e.classList.add('active'));
    }
    _events() {
      this._elButtons.forEach(e => {
        e.addEventListener('click', currentElem => {
          const parentTabs = currentElem.currentTarget.closest('.' + this._elTabs.className);
          const dropTextFilter = parentTabs?.querySelector('[data-filter-drop-text]');
          if (dropTextFilter) dropTextFilter.textContent = currentElem.currentTarget.textContent;
          this.tabBtnElemActive(currentElem);
          this.tabFilterPanel(currentElem);
        });
      });
      this._dropTextFilter?.addEventListener('click', () => this._dropTextFilter.classList.toggle('active'));
    }
    _init() {
      this._events();
      this.defaultActivePanelFilter();
    }
  }
  const tabsFilter = document.querySelectorAll('[data-tab-filter]');
  tabsFilter?.forEach(item => new TabFilter(item));

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var scrollLock = createCommonjsModule(function (module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    return /******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/
      var installedModules = {};
      /******/
      /******/ // The require function
      /******/
      function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/
      __webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/
      __webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/
      __webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
          });
          /******/
        }
        /******/
      };
      /******/
      /******/ // define __esModule on exports
      /******/
      __webpack_require__.r = function (exports) {
        /******/if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
          });
          /******/
        }
        /******/
        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        /******/
      };
      /******/
      /******/ // create a fake namespace object
      /******/ // mode & 1: value is a module id, require it
      /******/ // mode & 2: merge all properties of value into the ns
      /******/ // mode & 4: return value when already ns object
      /******/ // mode & 8|1: behave like require
      /******/
      __webpack_require__.t = function (value, mode) {
        /******/if (mode & 1) value = __webpack_require__(value);
        /******/
        if (mode & 8) return value;
        /******/
        if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
        /******/
        var ns = Object.create(null);
        /******/
        __webpack_require__.r(ns);
        /******/
        Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
        });
        /******/
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
        /******/
        return ns;
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/
      __webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ? /******/function getDefault() {
          return module['default'];
        } : /******/function getModuleExports() {
          return module;
        };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/
      __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/
      __webpack_require__.p = "";
      /******/
      /******/
      /******/ // Load entry module and return exports
      /******/
      return __webpack_require__(__webpack_require__.s = 0);
      /******/
    }
    /************************************************************************/
    /******/([( /* 0 */
    /***/function (module, __webpack_exports__, __webpack_require__) {

      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./src/tools.js
      var argumentAsArray = function argumentAsArray(argument) {
        return Array.isArray(argument) ? argument : [argument];
      };
      var isElement = function isElement(target) {
        return target instanceof Node;
      };
      var isElementList = function isElementList(nodeList) {
        return nodeList instanceof NodeList;
      };
      var eachNode = function eachNode(nodeList, callback) {
        if (nodeList && callback) {
          nodeList = isElementList(nodeList) ? nodeList : [nodeList];
          for (var i = 0; i < nodeList.length; i++) {
            if (callback(nodeList[i], i, nodeList.length) === true) {
              break;
            }
          }
        }
      };
      var throwError = function throwError(message) {
        return console.error("[scroll-lock] ".concat(message));
      };
      var arrayAsSelector = function arrayAsSelector(array) {
        if (Array.isArray(array)) {
          var selector = array.join(', ');
          return selector;
        }
      };
      var nodeListAsArray = function nodeListAsArray(nodeList) {
        var nodes = [];
        eachNode(nodeList, function (node) {
          return nodes.push(node);
        });
        return nodes;
      };
      var findParentBySelector = function findParentBySelector($el, selector) {
        var self = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var $root = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document;
        if (self && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1) {
          return $el;
        }
        while (($el = $el.parentElement) && nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) === -1) {
        }
        return $el;
      };
      var elementHasSelector = function elementHasSelector($el, selector) {
        var $root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
        var has = nodeListAsArray($root.querySelectorAll(selector)).indexOf($el) !== -1;
        return has;
      };
      var elementHasOverflowHidden = function elementHasOverflowHidden($el) {
        if ($el) {
          var computedStyle = getComputedStyle($el);
          var overflowIsHidden = computedStyle.overflow === 'hidden';
          return overflowIsHidden;
        }
      };
      var elementScrollTopOnStart = function elementScrollTopOnStart($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }
          var scrollTop = $el.scrollTop;
          return scrollTop <= 0;
        }
      };
      var elementScrollTopOnEnd = function elementScrollTopOnEnd($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }
          var scrollTop = $el.scrollTop;
          var scrollHeight = $el.scrollHeight;
          var scrollTopWithHeight = scrollTop + $el.offsetHeight;
          return scrollTopWithHeight >= scrollHeight;
        }
      };
      var elementScrollLeftOnStart = function elementScrollLeftOnStart($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }
          var scrollLeft = $el.scrollLeft;
          return scrollLeft <= 0;
        }
      };
      var elementScrollLeftOnEnd = function elementScrollLeftOnEnd($el) {
        if ($el) {
          if (elementHasOverflowHidden($el)) {
            return true;
          }
          var scrollLeft = $el.scrollLeft;
          var scrollWidth = $el.scrollWidth;
          var scrollLeftWithWidth = scrollLeft + $el.offsetWidth;
          return scrollLeftWithWidth >= scrollWidth;
        }
      };
      var elementIsScrollableField = function elementIsScrollableField($el) {
        var selector = 'textarea, [contenteditable="true"]';
        return elementHasSelector($el, selector);
      };
      var elementIsInputRange = function elementIsInputRange($el) {
        var selector = 'input[type="range"]';
        return elementHasSelector($el, selector);
      };
      // CONCATENATED MODULE: ./src/scroll-lock.js
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "disablePageScroll", function () {
        return disablePageScroll;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "enablePageScroll", function () {
        return enablePageScroll;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "getScrollState", function () {
        return getScrollState;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "clearQueueScrollLocks", function () {
        return clearQueueScrollLocks;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "getTargetScrollBarWidth", function () {
        return scroll_lock_getTargetScrollBarWidth;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "getCurrentTargetScrollBarWidth", function () {
        return scroll_lock_getCurrentTargetScrollBarWidth;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "getPageScrollBarWidth", function () {
        return getPageScrollBarWidth;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "getCurrentPageScrollBarWidth", function () {
        return getCurrentPageScrollBarWidth;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addScrollableTarget", function () {
        return scroll_lock_addScrollableTarget;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "removeScrollableTarget", function () {
        return scroll_lock_removeScrollableTarget;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addScrollableSelector", function () {
        return scroll_lock_addScrollableSelector;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "removeScrollableSelector", function () {
        return scroll_lock_removeScrollableSelector;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addLockableTarget", function () {
        return scroll_lock_addLockableTarget;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addLockableSelector", function () {
        return scroll_lock_addLockableSelector;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "setFillGapMethod", function () {
        return scroll_lock_setFillGapMethod;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addFillGapTarget", function () {
        return scroll_lock_addFillGapTarget;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "removeFillGapTarget", function () {
        return scroll_lock_removeFillGapTarget;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "addFillGapSelector", function () {
        return scroll_lock_addFillGapSelector;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "removeFillGapSelector", function () {
        return scroll_lock_removeFillGapSelector;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "refillGaps", function () {
        return refillGaps;
      });
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      var FILL_GAP_AVAILABLE_METHODS = ['padding', 'margin', 'width', 'max-width', 'none'];
      var TOUCH_DIRECTION_DETECT_OFFSET = 3;
      var state = {
        scroll: true,
        queue: 0,
        scrollableSelectors: ['[data-scroll-lock-scrollable]'],
        lockableSelectors: ['body', '[data-scroll-lock-lockable]'],
        fillGapSelectors: ['body', '[data-scroll-lock-fill-gap]', '[data-scroll-lock-lockable]'],
        fillGapMethod: FILL_GAP_AVAILABLE_METHODS[0],
        //
        startTouchY: 0,
        startTouchX: 0
      };
      var disablePageScroll = function disablePageScroll(target) {
        if (state.queue <= 0) {
          state.scroll = false;
          scroll_lock_hideLockableOverflow();
          fillGaps();
        }
        scroll_lock_addScrollableTarget(target);
        state.queue++;
      };
      var enablePageScroll = function enablePageScroll(target) {
        state.queue > 0 && state.queue--;
        if (state.queue <= 0) {
          state.scroll = true;
          scroll_lock_showLockableOverflow();
          unfillGaps();
        }
        scroll_lock_removeScrollableTarget(target);
      };
      var getScrollState = function getScrollState() {
        return state.scroll;
      };
      var clearQueueScrollLocks = function clearQueueScrollLocks() {
        state.queue = 0;
      };
      var scroll_lock_getTargetScrollBarWidth = function getTargetScrollBarWidth($target) {
        var onlyExists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (isElement($target)) {
          var currentOverflowYProperty = $target.style.overflowY;
          if (onlyExists) {
            if (!getScrollState()) {
              $target.style.overflowY = $target.getAttribute('data-scroll-lock-saved-overflow-y-property');
            }
          } else {
            $target.style.overflowY = 'scroll';
          }
          var width = scroll_lock_getCurrentTargetScrollBarWidth($target);
          $target.style.overflowY = currentOverflowYProperty;
          return width;
        } else {
          return 0;
        }
      };
      var scroll_lock_getCurrentTargetScrollBarWidth = function getCurrentTargetScrollBarWidth($target) {
        if (isElement($target)) {
          if ($target === document.body) {
            var documentWidth = document.documentElement.clientWidth;
            var windowWidth = window.innerWidth;
            var currentWidth = windowWidth - documentWidth;
            return currentWidth;
          } else {
            var borderLeftWidthCurrentProperty = $target.style.borderLeftWidth;
            var borderRightWidthCurrentProperty = $target.style.borderRightWidth;
            $target.style.borderLeftWidth = '0px';
            $target.style.borderRightWidth = '0px';
            var _currentWidth = $target.offsetWidth - $target.clientWidth;
            $target.style.borderLeftWidth = borderLeftWidthCurrentProperty;
            $target.style.borderRightWidth = borderRightWidthCurrentProperty;
            return _currentWidth;
          }
        } else {
          return 0;
        }
      };
      var getPageScrollBarWidth = function getPageScrollBarWidth() {
        var onlyExists = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return scroll_lock_getTargetScrollBarWidth(document.body, onlyExists);
      };
      var getCurrentPageScrollBarWidth = function getCurrentPageScrollBarWidth() {
        return scroll_lock_getCurrentTargetScrollBarWidth(document.body);
      };
      var scroll_lock_addScrollableTarget = function addScrollableTarget(target) {
        if (target) {
          var targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-scrollable', '');
              } else {
                throwError("\"".concat($target, "\" is not a Element."));
              }
            });
          });
        }
      };
      var scroll_lock_removeScrollableTarget = function removeScrollableTarget(target) {
        if (target) {
          var targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.removeAttribute('data-scroll-lock-scrollable');
              } else {
                throwError("\"".concat($target, "\" is not a Element."));
              }
            });
          });
        }
      };
      var scroll_lock_addScrollableSelector = function addScrollableSelector(selector) {
        if (selector) {
          var selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.scrollableSelectors.push(selector);
          });
        }
      };
      var scroll_lock_removeScrollableSelector = function removeScrollableSelector(selector) {
        if (selector) {
          var selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.scrollableSelectors = state.scrollableSelectors.filter(function (sSelector) {
              return sSelector !== selector;
            });
          });
        }
      };
      var scroll_lock_addLockableTarget = function addLockableTarget(target) {
        if (target) {
          var targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-lockable', '');
              } else {
                throwError("\"".concat($target, "\" is not a Element."));
              }
            });
          });
          if (!getScrollState()) {
            scroll_lock_hideLockableOverflow();
          }
        }
      };
      var scroll_lock_addLockableSelector = function addLockableSelector(selector) {
        if (selector) {
          var selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.lockableSelectors.push(selector);
          });
          if (!getScrollState()) {
            scroll_lock_hideLockableOverflow();
          }
          scroll_lock_addFillGapSelector(selector);
        }
      };
      var scroll_lock_setFillGapMethod = function setFillGapMethod(method) {
        if (method) {
          if (FILL_GAP_AVAILABLE_METHODS.indexOf(method) !== -1) {
            state.fillGapMethod = method;
            refillGaps();
          } else {
            var methods = FILL_GAP_AVAILABLE_METHODS.join(', ');
            throwError("\"".concat(method, "\" method is not available!\nAvailable fill gap methods: ").concat(methods, "."));
          }
        }
      };
      var scroll_lock_addFillGapTarget = function addFillGapTarget(target) {
        if (target) {
          var targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.setAttribute('data-scroll-lock-fill-gap', '');
                if (!state.scroll) {
                  scroll_lock_fillGapTarget($target);
                }
              } else {
                throwError("\"".concat($target, "\" is not a Element."));
              }
            });
          });
        }
      };
      var scroll_lock_removeFillGapTarget = function removeFillGapTarget(target) {
        if (target) {
          var targets = argumentAsArray(target);
          targets.map(function ($targets) {
            eachNode($targets, function ($target) {
              if (isElement($target)) {
                $target.removeAttribute('data-scroll-lock-fill-gap');
                if (!state.scroll) {
                  scroll_lock_unfillGapTarget($target);
                }
              } else {
                throwError("\"".concat($target, "\" is not a Element."));
              }
            });
          });
        }
      };
      var scroll_lock_addFillGapSelector = function addFillGapSelector(selector) {
        if (selector) {
          var selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            if (state.fillGapSelectors.indexOf(selector) === -1) {
              state.fillGapSelectors.push(selector);
              if (!state.scroll) {
                scroll_lock_fillGapSelector(selector);
              }
            }
          });
        }
      };
      var scroll_lock_removeFillGapSelector = function removeFillGapSelector(selector) {
        if (selector) {
          var selectors = argumentAsArray(selector);
          selectors.map(function (selector) {
            state.fillGapSelectors = state.fillGapSelectors.filter(function (fSelector) {
              return fSelector !== selector;
            });
            if (!state.scroll) {
              scroll_lock_unfillGapSelector(selector);
            }
          });
        }
      };
      var refillGaps = function refillGaps() {
        if (!state.scroll) {
          fillGaps();
        }
      };
      var scroll_lock_hideLockableOverflow = function hideLockableOverflow() {
        var selector = arrayAsSelector(state.lockableSelectors);
        scroll_lock_hideLockableOverflowSelector(selector);
      };
      var scroll_lock_showLockableOverflow = function showLockableOverflow() {
        var selector = arrayAsSelector(state.lockableSelectors);
        scroll_lock_showLockableOverflowSelector(selector);
      };
      var scroll_lock_hideLockableOverflowSelector = function hideLockableOverflowSelector(selector) {
        var $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_hideLockableOverflowTarget($target);
        });
      };
      var scroll_lock_showLockableOverflowSelector = function showLockableOverflowSelector(selector) {
        var $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_showLockableOverflowTarget($target);
        });
      };
      var scroll_lock_hideLockableOverflowTarget = function hideLockableOverflowTarget($target) {
        if (isElement($target) && $target.getAttribute('data-scroll-lock-locked') !== 'true') {
          var computedStyle = window.getComputedStyle($target);
          $target.setAttribute('data-scroll-lock-saved-overflow-y-property', computedStyle.overflowY);
          $target.setAttribute('data-scroll-lock-saved-inline-overflow-property', $target.style.overflow);
          $target.setAttribute('data-scroll-lock-saved-inline-overflow-y-property', $target.style.overflowY);
          $target.style.overflow = 'hidden';
          $target.setAttribute('data-scroll-lock-locked', 'true');
        }
      };
      var scroll_lock_showLockableOverflowTarget = function showLockableOverflowTarget($target) {
        if (isElement($target) && $target.getAttribute('data-scroll-lock-locked') === 'true') {
          $target.style.overflow = $target.getAttribute('data-scroll-lock-saved-inline-overflow-property');
          $target.style.overflowY = $target.getAttribute('data-scroll-lock-saved-inline-overflow-y-property');
          $target.removeAttribute('data-scroll-lock-saved-overflow-property');
          $target.removeAttribute('data-scroll-lock-saved-inline-overflow-property');
          $target.removeAttribute('data-scroll-lock-saved-inline-overflow-y-property');
          $target.removeAttribute('data-scroll-lock-locked');
        }
      };
      var fillGaps = function fillGaps() {
        state.fillGapSelectors.map(function (selector) {
          scroll_lock_fillGapSelector(selector);
        });
      };
      var unfillGaps = function unfillGaps() {
        state.fillGapSelectors.map(function (selector) {
          scroll_lock_unfillGapSelector(selector);
        });
      };
      var scroll_lock_fillGapSelector = function fillGapSelector(selector) {
        var $targets = document.querySelectorAll(selector);
        var isLockable = state.lockableSelectors.indexOf(selector) !== -1;
        eachNode($targets, function ($target) {
          scroll_lock_fillGapTarget($target, isLockable);
        });
      };
      var scroll_lock_fillGapTarget = function fillGapTarget($target) {
        var isLockable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (isElement($target)) {
          var scrollBarWidth;
          if ($target.getAttribute('data-scroll-lock-lockable') === '' || isLockable) {
            scrollBarWidth = scroll_lock_getTargetScrollBarWidth($target, true);
          } else {
            var $lockableParent = findParentBySelector($target, arrayAsSelector(state.lockableSelectors));
            scrollBarWidth = scroll_lock_getTargetScrollBarWidth($lockableParent, true);
          }
          if ($target.getAttribute('data-scroll-lock-filled-gap') === 'true') {
            scroll_lock_unfillGapTarget($target);
          }
          var computedStyle = window.getComputedStyle($target);
          $target.setAttribute('data-scroll-lock-filled-gap', 'true');
          $target.setAttribute('data-scroll-lock-current-fill-gap-method', state.fillGapMethod);
          if (state.fillGapMethod === 'margin') {
            var currentMargin = parseFloat(computedStyle.marginRight);
            $target.style.marginRight = "".concat(currentMargin + scrollBarWidth, "px");
          } else if (state.fillGapMethod === 'width') {
            $target.style.width = "calc(100% - ".concat(scrollBarWidth, "px)");
          } else if (state.fillGapMethod === 'max-width') {
            $target.style.maxWidth = "calc(100% - ".concat(scrollBarWidth, "px)");
          } else if (state.fillGapMethod === 'padding') {
            var currentPadding = parseFloat(computedStyle.paddingRight);
            $target.style.paddingRight = "".concat(currentPadding + scrollBarWidth, "px");
          }
        }
      };
      var scroll_lock_unfillGapSelector = function unfillGapSelector(selector) {
        var $targets = document.querySelectorAll(selector);
        eachNode($targets, function ($target) {
          scroll_lock_unfillGapTarget($target);
        });
      };
      var scroll_lock_unfillGapTarget = function unfillGapTarget($target) {
        if (isElement($target)) {
          if ($target.getAttribute('data-scroll-lock-filled-gap') === 'true') {
            var currentFillGapMethod = $target.getAttribute('data-scroll-lock-current-fill-gap-method');
            $target.removeAttribute('data-scroll-lock-filled-gap');
            $target.removeAttribute('data-scroll-lock-current-fill-gap-method');
            if (currentFillGapMethod === 'margin') {
              $target.style.marginRight = "";
            } else if (currentFillGapMethod === 'width') {
              $target.style.width = "";
            } else if (currentFillGapMethod === 'max-width') {
              $target.style.maxWidth = "";
            } else if (currentFillGapMethod === 'padding') {
              $target.style.paddingRight = "";
            }
          }
        }
      };
      var onResize = function onResize(e) {
        refillGaps();
      };
      var onTouchStart = function onTouchStart(e) {
        if (!state.scroll) {
          state.startTouchY = e.touches[0].clientY;
          state.startTouchX = e.touches[0].clientX;
        }
      };
      var scroll_lock_onTouchMove = function onTouchMove(e) {
        if (!state.scroll) {
          var startTouchY = state.startTouchY,
            startTouchX = state.startTouchX;
          var currentClientY = e.touches[0].clientY;
          var currentClientX = e.touches[0].clientX;
          if (e.touches.length < 2) {
            var selector = arrayAsSelector(state.scrollableSelectors);
            var direction = {
              up: startTouchY < currentClientY,
              down: startTouchY > currentClientY,
              left: startTouchX < currentClientX,
              right: startTouchX > currentClientX
            };
            var directionWithOffset = {
              up: startTouchY + TOUCH_DIRECTION_DETECT_OFFSET < currentClientY,
              down: startTouchY - TOUCH_DIRECTION_DETECT_OFFSET > currentClientY,
              left: startTouchX + TOUCH_DIRECTION_DETECT_OFFSET < currentClientX,
              right: startTouchX - TOUCH_DIRECTION_DETECT_OFFSET > currentClientX
            };
            var handle = function handle($el) {
              var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              if ($el) {
                var parentScrollableEl = findParentBySelector($el, selector, false);
                if (elementIsInputRange($el)) {
                  return false;
                }
                if (skip || elementIsScrollableField($el) && findParentBySelector($el, selector) || elementHasSelector($el, selector)) {
                  var prevent = false;
                  if (elementScrollLeftOnStart($el) && elementScrollLeftOnEnd($el)) {
                    if (direction.up && elementScrollTopOnStart($el) || direction.down && elementScrollTopOnEnd($el)) {
                      prevent = true;
                    }
                  } else if (elementScrollTopOnStart($el) && elementScrollTopOnEnd($el)) {
                    if (direction.left && elementScrollLeftOnStart($el) || direction.right && elementScrollLeftOnEnd($el)) {
                      prevent = true;
                    }
                  } else if (directionWithOffset.up && elementScrollTopOnStart($el) || directionWithOffset.down && elementScrollTopOnEnd($el) || directionWithOffset.left && elementScrollLeftOnStart($el) || directionWithOffset.right && elementScrollLeftOnEnd($el)) {
                    prevent = true;
                  }
                  if (prevent) {
                    if (parentScrollableEl) {
                      handle(parentScrollableEl, true);
                    } else {
                      if (e.cancelable) {
                        e.preventDefault();
                      }
                    }
                  }
                } else {
                  handle(parentScrollableEl);
                }
              } else {
                if (e.cancelable) {
                  e.preventDefault();
                }
              }
            };
            handle(e.target);
          }
        }
      };
      var onTouchEnd = function onTouchEnd(e) {
        if (!state.scroll) {
          state.startTouchY = 0;
          state.startTouchX = 0;
        }
      };
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', onResize);
      }
      if (typeof document !== 'undefined') {
        document.addEventListener('touchstart', onTouchStart);
        document.addEventListener('touchmove', scroll_lock_onTouchMove, {
          passive: false
        });
        document.addEventListener('touchend', onTouchEnd);
      }
      var deprecatedMethods = {
        hide: function hide(target) {
          throwError('"hide" is deprecated! Use "disablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#disablepagescrollscrollabletarget');
          disablePageScroll(target);
        },
        show: function show(target) {
          throwError('"show" is deprecated! Use "enablePageScroll" instead. \n https://github.com/FL3NKEY/scroll-lock#enablepagescrollscrollabletarget');
          enablePageScroll(target);
        },
        toggle: function toggle(target) {
          throwError('"toggle" is deprecated! Do not use it.');
          if (getScrollState()) {
            disablePageScroll();
          } else {
            enablePageScroll(target);
          }
        },
        getState: function getState() {
          throwError('"getState" is deprecated! Use "getScrollState" instead. \n https://github.com/FL3NKEY/scroll-lock#getscrollstate');
          return getScrollState();
        },
        getWidth: function getWidth() {
          throwError('"getWidth" is deprecated! Use "getPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getpagescrollbarwidth');
          return getPageScrollBarWidth();
        },
        getCurrentWidth: function getCurrentWidth() {
          throwError('"getCurrentWidth" is deprecated! Use "getCurrentPageScrollBarWidth" instead. \n https://github.com/FL3NKEY/scroll-lock#getcurrentpagescrollbarwidth');
          return getCurrentPageScrollBarWidth();
        },
        setScrollableTargets: function setScrollableTargets(target) {
          throwError('"setScrollableTargets" is deprecated! Use "addScrollableTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addscrollabletargetscrollabletarget');
          scroll_lock_addScrollableTarget(target);
        },
        setFillGapSelectors: function setFillGapSelectors(selector) {
          throwError('"setFillGapSelectors" is deprecated! Use "addFillGapSelector" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgapselectorfillgapselector');
          scroll_lock_addFillGapSelector(selector);
        },
        setFillGapTargets: function setFillGapTargets(target) {
          throwError('"setFillGapTargets" is deprecated! Use "addFillGapTarget" instead. \n https://github.com/FL3NKEY/scroll-lock#addfillgaptargetfillgaptarget');
          scroll_lock_addFillGapTarget(target);
        },
        clearQueue: function clearQueue() {
          throwError('"clearQueue" is deprecated! Use "clearQueueScrollLocks" instead. \n https://github.com/FL3NKEY/scroll-lock#clearqueuescrolllocks');
          clearQueueScrollLocks();
        }
      };
      var scrollLock = _objectSpread({
        disablePageScroll: disablePageScroll,
        enablePageScroll: enablePageScroll,
        getScrollState: getScrollState,
        clearQueueScrollLocks: clearQueueScrollLocks,
        getTargetScrollBarWidth: scroll_lock_getTargetScrollBarWidth,
        getCurrentTargetScrollBarWidth: scroll_lock_getCurrentTargetScrollBarWidth,
        getPageScrollBarWidth: getPageScrollBarWidth,
        getCurrentPageScrollBarWidth: getCurrentPageScrollBarWidth,
        addScrollableSelector: scroll_lock_addScrollableSelector,
        removeScrollableSelector: scroll_lock_removeScrollableSelector,
        addScrollableTarget: scroll_lock_addScrollableTarget,
        removeScrollableTarget: scroll_lock_removeScrollableTarget,
        addLockableSelector: scroll_lock_addLockableSelector,
        addLockableTarget: scroll_lock_addLockableTarget,
        addFillGapSelector: scroll_lock_addFillGapSelector,
        removeFillGapSelector: scroll_lock_removeFillGapSelector,
        addFillGapTarget: scroll_lock_addFillGapTarget,
        removeFillGapTarget: scroll_lock_removeFillGapTarget,
        setFillGapMethod: scroll_lock_setFillGapMethod,
        refillGaps: refillGaps,
        _state: state
      }, deprecatedMethods);

      /* harmony default export */
      var scroll_lock = __webpack_exports__["default"] = scrollLock;

      /***/
    }
    /******/)])["default"];
  });
  });

  unwrapExports(scrollLock);

  const MediaSize = {
    LG: 1024,
    XL: 1200
  };

  if (window.matchMedia(`(min-width: ${MediaSize.XL}px)`).matches) {
    document.querySelectorAll('[data-preview-slider]').forEach(elem => {
      const slider = new Swiper(elem, {
        speed: 0,
        pagination: {
          el: '.swiper-pagination'
        }
      });
      const paginationBullets = elem.querySelectorAll('.swiper-pagination-bullet');
      paginationBullets.forEach((bullet, index) => {
        bullet.addEventListener('mouseenter', () => slider.slideToLoop(index));
      });
    });
  }

  if (window.matchMedia(`(max-width: ${MediaSize.XL - 1}px)`).matches) {
    document.querySelectorAll('[data-gallary-slider]').forEach(elem => {
      new Swiper(elem, {
        slidesPerView: 1,
        spaceBetween: 2,
        centeredSlides: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination'
        }
      });
    });
  }

  new Swiper("[data-main-slider]", {
    slidesPerView: 1,
    spaceBetween: 3,
    loop: true,
    autoplay: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      [MediaSize.XL]: {
        slidesPerView: 2
      }
    }
  });

  document.querySelectorAll('[data-product-slider]').forEach(elem => {
    new Swiper(elem, {
      slidesPerView: 'auto',
      spaceBetween: 10,
      freeMode: true,
      scrollbar: {
        el: ".swiper-scrollbar"
      },
      breakpoints: {
        [MediaSize.XL]: {
          slidesPerView: 4
        }
      }
    });
  });

  const swiper = new Swiper("[data-cert-card-slider]", {
    spaceBetween: 4,
    slidesPerView: 4,
    breakpoints: {
      [MediaSize.XL]: {
        slidesPerView: 6
      }
    }
  });
  new Swiper("[data-thumbs-slider]", {
    spaceBetween: 10,
    effect: "fade",
    thumbs: {
      swiper: swiper
    }
  });
  const selectCertCard = document.querySelector("[data-select-cert] select");
  const inputCertCard = document.querySelector("[data-input-cert] input");
  const textPriceCertCard = document.querySelector("[data-text-price]");
  const inputValueCertCard = document.querySelector("[data-input-value-cert]");
  selectCertCard?.addEventListener("change", () => {
    textPriceCertCard.textContent = selectCertCard.value;
    inputValueCertCard.value = selectCertCard.value;
  });
  inputCertCard?.addEventListener("input", () => {
    textPriceCertCard.textContent = inputCertCard.value;
    inputValueCertCard.value = inputCertCard.value;
  });

  const filterLink = document.querySelectorAll('[data-filter-link]');
  const filterCurrentClose = document.querySelectorAll('[data-close-filter-current]');
  Fancybox.bind("[href='#modal-filter']", {
    dragToClose: false,
    on: {
      close: () => {
        document.querySelectorAll('[data-filter-current]')?.forEach(elem => elem.classList.remove('active'));
      }
    }
  });
  const togglefilter = item => {
    const parentFilter = item.closest('[data-filter]');
    const currentFilter = parentFilter?.querySelector("[data-filter-current]");
    currentFilter.classList.toggle('active');
  };
  filterLink?.forEach(item => item.addEventListener('click', () => togglefilter(item)));
  filterCurrentClose?.forEach(item => item.addEventListener('click', () => togglefilter(item)));

})));
