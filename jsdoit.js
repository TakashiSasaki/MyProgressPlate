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
    stripTitle: "no title",
    archived: false,
    dirty: true,
    sticky: false,
    renewAfter: [],
    renewEveryHours: [],
    renewDayOfWeek: [],
    dueDateTime: 0,
    lastOpened: 0,
    keywords: [],
    color: null
});

function loadStrips() {
    strips = {};stripDivs = {};
    for (var i = 0; i < window.localStorage.length; ++i) {
        var keyString = window.localStorage.key(i);
        var key = parseInt(keyString);
        if (isNaN(key)) continue;
        if (Math.floor(key) !== key) continue;
        var stringJson = window.localStorage.getItem(key);
        if (typeof stringJson !== "string") throw "loadStrips: stringJson should be a string.";
        var strip = JSON.parse(stringJson);
        if (typeof strip !== "object") throw "loadStrips: strip should be an object.";
        strips[strip.stripId] = strip;
        if (strip.archived !== true) {
            var divStrip = buildStripDiv(strip);
            stripDivs[strip.stripId] = divStrip;
        }
    }
    if (Object.keys(stripDivs).length === 0) {
        createNewStrip();
    }
}

function saveStrip(event) {
    window.divMenu.style.display = 'none';
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
    strip.dirty = true;
    strip.stripTitle = window.inputStripTitle.value;
    strip.url = window.inputUrl.value;
    strip.renewAfter = getCheckedValues("renewAfter");
    strip.renewEveryHours = getCheckedValues("renewEveryHours");
    strip.renewDayOfWeek = getCheckedValues("renewDayOfWeek");
    strip.color = window.inputColor.value;

    var jsonString = JSON.stringify(strip);
    window.localStorage.setItem(stripId, jsonString);
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

setTimeout(function () {
    loadStrips(i);
    for (var i in stripDivs) {
        if (stripDivs[i] instanceof HTMLElement) {
            window.divStrips.appendChild(stripDivs[i]);
        }
    }
}, 10);

function archiveStrip(event) {
    if (!event instanceof Event) throw "archiveStrip: event should be an Event.";
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
    strip.archived = true;
    stripDivs[stripId].remove();
    delete stripDivs[event.target.dataset.stripId];
    window.localStorage.setItem(stripId, JSON.stringify(strip));
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
    window.localStorage.setItem(newStripId, JSON.stringify(newJsonStrip));
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
    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn", "form-group", "divStrip", stripJson.className);
    newDivStrip.addEventListener("dblclick", showMenu);
    newDivStrip.addEventListener("click", openUrl);
    if (typeof stripJson.color === "string") {
        newDivStrip.style.backgroundColor = "#" + stripJson.color;
    } else {
        newDivStrip.style.backgroundColor = "lightgray";
    }

    var spanStatus = document.createElement("span");
    spanStatus.classList.add("status", "checked", "stripId");
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
    inputStripTitle.classList.add("btn", "btn-default");
    inputStripTitle.readOnly = true;
    newDivStrip.appendChild(inputStripTitle);

    traverse(newDivStrip, function (x) {
        x.dataset.stripId = stripJson.stripId;
    });

    return newDivStrip;
}

function openUrl(event) {
    setTimeout(function () {
        if (window.divMenu.style.display === "block") return;
        var stripId = event.target.dataset.stripId;
        var strip = strips[stripId];
        var url = strip.url;
        if (typeof url === "string") {
            window.open(url, "window" + stripId);
            strip.lastOpened = new Date().getTime();
            window.localStorage.setItem(stripId, JSON.stringify(strip));
        }
    }, 1000);
}

function showMenu(event) {
    var stripId = event.target.dataset.stripId;
    var strip = strips[stripId];
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
    checkByValues("renewDayOfWeek", strip.renewDayOfWeek);
    traverse("divMenu", function (x) {
        x.dataset.stripId = stripId;
    });
}

