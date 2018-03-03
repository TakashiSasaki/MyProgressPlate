//http://jsdo.it/TakashiSasaki/SOuH/edit

"use strict";

var strips = {};
var stripDivs = {};

var jsonStripTemplate = (function (x) {
    var newObject = Object.assign(x);
    Object.preventExtensions(newObject);
    return newObject;
})({
    stripId: null,
    imgIcon: null,
    className: null,
    stripTitle: null,
    archived: false,
    dirty: true,
    sticky: false,
    renewAfter: [],
    renewEveryHours: [],
    renewEveryDay: [],
    dueDateTime: 0,
    lastOpened: 0,
    keywords: [],
    color: null
});

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
    strips = {};stripDivs = {};
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
    var newJsonStrip = Object.assign({}, jsonStripTemplate);
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

