"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomStrips = (function (_Array) {
    _inherits(DomStrips, _Array);

    function DomStrips() {
        _classCallCheck(this, DomStrips);

        _get(Object.getPrototypeOf(DomStrips.prototype), "constructor", this).call(this);
        for (var i = 0; i < window.localStorage.length; ++i) {
            var keyString = window.localStorage.key(i);
            if (keyString === undefined) continue;
            if (keyString.substr(0, 8) !== "stripId=") continue;
            var stripId = parseInt(keyString.substr(8));
            if (isNaN(stripId)) continue;
            var strip = new DomStrip(stripId);
            if (typeof strip.stripId !== "number") throw "DomStrips#constructor: strip.stripId is not a number.";
            this[strip.stripId] = strip;
            this.length = Math.max(this.length, strip.stripId + 1);
        } //for
        console.log("DomStrips#constructor: " + this.length + " strips loaded.");
    }

    //DomStrips

    _createClass(DomStrips, [{
        key: "create",
        value: function create() {
            var domStrip = new DomStrip(this.length);
            this[domStrip.stripId] = domStrip;
            this.length = Math.max(this.length, domStrip.stripId + 1);
            return this[domStrip.stripId];
        }
    }, {
        key: "save",
        value: function save(stripId) {
            if (typeof stripId !== "number") throw "DomStrips#saveToLocalStorage: stripId should be an integer.";
            this[stripId].save();
        }
    }]);

    return DomStrips;
})(Array);

var StripDivs = (function (_Array2) {
    _inherits(StripDivs, _Array2);

    function StripDivs(strips) {
        _classCallCheck(this, StripDivs);

        if (!(strips instanceof DomStrips)) throw "StripDivs#constructor: expects a DomStrips.";
        _get(Object.getPrototypeOf(StripDivs.prototype), "constructor", this).call(this);
        this.strips = strips;
        for (var i in this.strips) {
            var domStrip = this.strips[i];
            if (domStrip instanceof DomStrip) {
                this[i] = domStrip.divStrip();
                this.length = Math.max(this.length, i + 1);
                window.divStrips.appendChild(this[i]);
            } //if
        } //for
        var tmp = this;
        this.show();
    }

    //StripDivs#constructor

    _createClass(StripDivs, [{
        key: "archive",
        value: function archive(stripId) {
            if (stripId !== "number") throw "StripDivs#remove: expects a number.";
            this.strips.archive(stripId);
            this[stripId].remove();
            this[stripId] = undefined;
            this.length = Math.max(this.length, stripId + 1);
            this.show();
        }
        //StripDivs#archive

    }, {
        key: "create",
        value: function create() {
            var domStrip = strips.create();
            this[domStrip.stripId] = domStrip.divStrip();
            this.length = Math.max(this.length, domStrip.stripId + 1);
            this.show();
        }
        //StripDivs#createNewStrip

    }, {
        key: "show",
        value: function show() {
            for (var i = 0; i < this.length; ++i) {
                if (this[i] === undefined) continue;
                if (!(this[i] instanceof HTMLDivElement)) throw "StripDivs#show: i=" + i + ", typeof this[i] = " + typeof this[i];
                window.divStrips.appendChild(this[i]);
            }
        }
        //StripDivs#show
    }]);

    return StripDivs;
})(Array);

var strips = new DomStrips();
var stripDivs = new StripDivs(strips);

