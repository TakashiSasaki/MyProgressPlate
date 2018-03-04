//http://jsdo.it/TakashiSasaki/SOuH/edit

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stripDivs = {};

var Strips = (function (_Array) {
    _inherits(Strips, _Array);

    function Strips() {
        _classCallCheck(this, Strips);

        _get(Object.getPrototypeOf(Strips.prototype), "constructor", this).call(this);
    }

    //Strips

    _createClass(Strips, [{
        key: "addNew",
        value: function addNew() {
            var newStripId = this.length;
            this[newStripId] = new Strip(newStripId);
            return newStripId;
        }
    }, {
        key: "loadFromLocalStorage",
        value: function loadFromLocalStorage() {
            for (var i = 0; i < window.localStorage.length; ++i) {
                var keyString = window.localStorage.key(i);
                if (keyString.substr(0, 8) !== "stripId=") continue;
                var stripId = parseInt(keyString.substr(8));
                if (isNaN(stripId)) continue;
                if (Math.floor(stripId) !== stripId) continue;
                var stringified = window.localStorage.getItem(keyString);
                if (typeof stringified !== "string") throw "loadStrips: stringified should be a string.";
                var strip = new Strip().initByJson(stringified);
                this[strip.stripId] = strip;
            } //for
        }
        //loadFromLocalStorage
    }]);

    return Strips;
})(Array);

var x = new Strips();
x.loadFromLocalStorage();

var StripDivs = (function (_Array2) {
    _inherits(StripDivs, _Array2);

    function StripDivs(parentDiv) {
        _classCallCheck(this, StripDivs);

        if (!(parentDiv instanceof HTMLDivElement)) throw "StripDivs#constructor: expects HTMLDivElement.";
        _get(Object.getPrototypeOf(StripDivs.prototype), "constructor", this).call(this);
        this.parentDiv = parentDiv;
    }

    _createClass(StripDivs, [{
        key: "createDiv",
        value: function createDiv(strip) {
            if (!(strip instanceof Strip)) throw "StripDivs#createDiv: expects Strip.";
            var newDivStrip = document.createElement("div");
            newDivStrip.classList.add("btn", "form-group", "col-xs-12", "divStrip", stripJson.className);
            newDivStrip.addEventListener("dblclick", showMenu);
            if (typeof stripJson.color === "string") {
                newDivStrip.style.backgroundColor = "#" + stripJson.color;
            } else {
                newDivStrip.style.backgroundColor = "lightgray";
            }

            var spanStatus = document.createElement("span");
            spanStatus.classList.add("col-xs-1", "status", "checked", "stripId");
            spanStatus.innerHTML = stripJson.stripId;
            newDivStrip.appendChild(spanStatus);

            if (typeof stripJson.imgIcon === "string") {
                var imgIcon = document.createElement("img");
                imgIcon.src = stripJson.imgIcon;
                imgIcon.classList.add("imgIcon");
                newDivStrip.appendChild(imgIcon);
            }

            var inputStripTitle = document.createElement("input");
            inputStripTitle.value = stripJson.stripTitle;
            inputStripTitle.classList.add("btn");
            inputStripTitle.readOnly = true;
            newDivStrip.appendChild(inputStripTitle);

            traverse(newDivStrip, function (x) {
                x.dataset.stripId = stripJson.stripId;
            });
            this[strip.stripId] = newDivStrip;
            return newDivStrip;
        }
        //createDiv
    }]);

    return StripDivs;
})(Array);

var strips = {};
var stripDivs = new StripDivs(divStrips);

function updateDueDateTime(event) {
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
    var candidate = strip.lastOpened + 365 * 86400000;
    strip.renewAfter.forEach(function (x) {
        candidate = Math.min(candidate, strip.lastOpened + x);
    });
    strip.renewEveryHours.forEach(function (x) {
        candidate = Math.min(candidate, setNextHours(strip.lastOpened, x));
    });
    strip.renewEveryDay.forEach(function (x) {
        console.log(x);candidate = Math.min(candidate, setNextDay(strip.lastOpened, x));
    });
    strip.dueDateTime = candidate;
    window.localStorage.setItem("stripId=" + stripId, JSON.stringify(strip));
    event.target.innerHTML = new Date(strip.dueDateTime);
}

function loadStrips() {
    stripDivs = {};
    for (var i = 0; i < window.localStorage.length; ++i) {
        var keyString = window.localStorage.key(i);
        if (keyString.substr(0, 8) !== "stripId=") continue;
        var stripId = parseInt(keyString.substr(8));
        if (isNaN(stripId)) continue;
        if (Math.floor(stripId) !== stripId) continue;
        var stringJson = window.localStorage.getItem(keyString);
        if (typeof stringJson !== "string") throw "loadStrips: stringJson should be a string.";
        var strip = JSON.parse(stringJson);
        if (typeof strip !== "object") throw "loadStrips: strip should be an object.";
        strips[strip.stripId] = strip;
        if (strip.archived !== true) {
            var divStrip = buildStripDiv(strip);
            stripDivs[strip.stripId] = divStrip;
            window.divStrips.appendChild(divStrip);
        }
    }
    if (Object.keys(stripDivs).length === 0) {
        createNewStrip();
    }
}

function saveStrip(event) {
    var stripId = event.target.dataset.stripId;
    if (typeof stripId !== "string") throw "saveStrip: stripId is not a string.";
    var strip = strips[stripId];
    if (typeof strip !== "object") throw "saveStrip: strips[stripId] is undefined";
    strip.dirty = true;
    strip.stripTitle = window.inputStripTitle.value;
    strip.url = window.inputUrl.value;
    strip.renewAfter = getCheckedValues("renewAfter");
    strip.renewEveryHours = getCheckedValues("renewEveryHours");
    strip.renewEveryDay = getCheckedValues("renewEveryDay");
    strip.color = window.inputColor.value;

    var jsonString = JSON.stringify(strip);
    window.localStorage.setItem("stripId=" + stripId, jsonString);
    var oldStripDiv = stripDivs[stripId];
    if (oldStripDiv instanceof HTMLElement) {
        oldStripDiv.remove();
    }
    var newStripDiv = buildStripDiv(strip);
    stripDivs[stripId] = newStripDiv;
    sortStripDivs();
}

function sortStripDivs() {
    for (var i in stripDivs) {
        window.divStrips.appendChild(stripDivs[i]);
    }
}

function archiveStrip(event) {
    if (!event instanceof Event) throw "archiveStrip: event should be an Event.";
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
    strip.archived = true;
    stripDivs[stripId].remove();
    delete stripDivs[event.target.dataset.stripId];
    window.localStorage.setItem("stripId=" + stripId, JSON.stringify(strip));
    window.divMenu.style.display = "none";
}

function createNewStrip() {
    var stripIds = Object.keys(strips);
    var newStripId = stripIds.length === 0 ? 0 : Math.max.apply(null, Object.keys(stripIds)) + 1;
    var newJsonStrip = new Strip();
    newJsonStrip.stripId = newStripId;
    newJsonStrip.stripTitle = "no title (" + newStripId + ")";
    strips[newStripId] = newJsonStrip;
    var newDivStrip = buildStripDiv(newJsonStrip);
    stripDivs[newStripId] = newDivStrip;
    window.localStorage.setItem("stripId=" + newStripId, JSON.stringify(newJsonStrip));
    window.divStrips.appendChild(newDivStrip);
    return newStripId;
}

function insertNewStrip(event) {
    if (!event instanceof Event) throw "insertNewStrip: event should be an Event.";
    var newStripId = createNewStrip();
    if (typeof newStripId !== "number") throw "insertNewStrip: newStripId should be a number.";
    window.divStrips.insertBefore(stripDivs[newStripId], stripDivs[event.target.dataset.stripId]);
    window.divMenu.style.display = "none";
}

function buildStripDiv(stripJson) {
    if (typeof stripJson !== "object") throw "buildStripDiv: stripJson should be an object.";
    var stripId = stripJson.stripId;
    if (typeof stripId !== "number") throw "buildStripDiv: stripId is not a string.";

    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn", "form-group", "col-xs-12", "divStrip", stripJson.className);
    newDivStrip.addEventListener("dblclick", showMenu);
    if (typeof stripJson.color === "string") {
        newDivStrip.style.backgroundColor = "#" + stripJson.color;
    } else {
        newDivStrip.style.backgroundColor = "lightgray";
    }

    var spanStatus = document.createElement("span");
    spanStatus.classList.add("col-xs-1", "status", "checked", "stripId");
    spanStatus.innerHTML = stripJson.stripId;
    newDivStrip.appendChild(spanStatus);

    if (typeof stripJson.imgIcon === "string") {
        var imgIcon = document.createElement("img");
        imgIcon.src = stripJson.imgIcon;
        imgIcon.classList.add("imgIcon");
        newDivStrip.appendChild(imgIcon);
    }

    var inputStripTitle = document.createElement("input");
    inputStripTitle.value = stripJson.stripTitle;
    inputStripTitle.classList.add("btn");
    inputStripTitle.readOnly = true;
    newDivStrip.appendChild(inputStripTitle);

    traverse(newDivStrip, function (x) {
        x.dataset.stripId = stripJson.stripId;
    });

    return newDivStrip;
}

function openUrl(event) {
    if (openUrl.status === "waiting") return;
    setTimeout(function () {
        var stripId = event.target.dataset.stripId;
        var strip = strips[stripId];
        var url = strip.url;
        if (typeof url === "string") {
            var newWindow = window.open(url, "window" + stripId);
            setTimeout(function () {
                if (typeof newWindow === "object") {
                    try {
                        newWindow.dummy = "dummy";
                    } catch (e) {
                        strip.lastOpened = new Date().getTime();
                        window.localStorage.setItem("stripId=" + stripId, JSON.stringify(strip));
                    }
                }
            }, 5000);
        }
        openUrl.status === "opened";
    }, 1000);
}

function showMenu(event) {
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
    if (typeof strip !== "object") throw "showMenu:  strips[stripId] is not an object. stripId=" + stripId;
    window.divMenu.style.display = "block";
    window.inputStripTitle.value = strip.stripTitle;
    window.inputUrl.value = strip.url;
    window.divLastOpened.innerHTML = new Date(strip.lastOpened);
    window.divDueDateTime.innerHTML = new Date(strip.dueDateTime);
    window.inputColor.value = strip.color;
    window.inputColor.placeholder = strip.color;
    window.inputColor.style.backgroundColor = "#" + strip.color;
    window.spanStripId.innerHTML = stripId;
    checkByValues("renewAfter", strip.renewAfter);
    checkByValues("renewEveryHours", strip.renewEveryHours);
    if (!strip.renewEveryDay instanceof Array) strip.renewEveryDay = [];
    checkByValues("renewEveryDay", strip.renewEveryDay);
    traverse("divMenu", function (x) {
        x.dataset.stripId = stripId;
    });
}

setTimeout(function () {
    loadStrips();
}, 100);

