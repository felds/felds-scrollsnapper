'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

document.registerElement('felds-scrollsnapper', function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'createdCallback',
    value: function createdCallback() {
      // config
      this.timeout = null;

      this._onScroll = this._onScroll.bind(this);
      this._run = this._run.bind(this);
      this._animate = this._animate.bind(this);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.addEventListener('scroll', this._onScroll, { passive: true });
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(e) {
      this.lastScrollEvent = e;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(this._run, this.delay);
    }
  }, {
    key: '_run',
    value: function _run() {
      var height = this.innerHeight;
      var scrollTop = this.scrollTop;
      var treshold = Math.floor(height * this.treshold);
      var children = this.children;
      var contentTop = this.contentTop;

      for (var i = 0; i < children.length; i++) {
        var el = children.item(i);
        var top = el.offsetTop - contentTop - this.scrollTop;

        if (top > 0 && top < treshold) {
          this._animate(this.scrollTop, el.offsetTop - this.contentTop);
          break;
        }
      }
    }
  }, {
    key: '_animate',
    value: function _animate(fromPos, toPos) {
      var _this2 = this;

      var startTime = Date.now();
      var endTime = startTime + this.animationTime;

      var totalDistance = toPos - fromPos;
      var totalTime = endTime - startTime;

      var animation = function animation() {
        var deltaTime = Math.max(0, Math.min(1, 1 - (endTime - Date.now()) / totalTime));
        var t = _this2._easing(deltaTime);

        _this2.scrollTop = fromPos + totalDistance * t;

        if (Date.now() <= endTime) requestAnimationFrame(animation);else _this2.scrollTop = toPos;
      };
      animation();
    }
  }, {
    key: '_easing',
    value: function _easing(t) {
      // return t // linear
      // return t * (2  - t) // easeOutQuad
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; // easeInOutCubic
    }

    /*
     * Getters and setters
     */

  }, {
    key: 'treshold',
    get: function get() {
      return Math.max(0, Math.min(1, parseFloat(this.getAttribute('treshold')))) || .5;
    },
    set: function set(val) {
      this.setAttribute('treshold', Math.max(0, Math.min(1, parseFloat())));
    }
  }, {
    key: 'delay',
    get: function get() {
      return parseInt(this.getAttribute('delay')) || 500;
    },
    set: function set(val) {
      this.setAttribute('delay', parseInt(val));
    }
  }, {
    key: 'animationTime',
    get: function get() {
      return parseInt(this.getAttribute('animation-time')) || 500;
    },
    set: function set(val) {
      this.setAttribute('animation-time', parseInt(val));
    }
  }, {
    key: 'innerHeight',
    get: function get() {
      var computedStyles = window.getComputedStyle(this, null);

      return this.offsetHeight - parseInt(computedStyles.paddingTop) - parseInt(computedStyles.borderTopWidth) - parseInt(computedStyles.paddingBottom) - parseInt(computedStyles.borderBottomWidth);
    }
  }, {
    key: 'contentTop',
    get: function get() {
      var computedStyles = window.getComputedStyle(this, null);

      return this.offsetTop + parseInt(computedStyles.paddingTop) + parseInt(computedStyles.borderTopWidth);
    }
  }]);

  return _class;
}(HTMLElement));
