//http://jsdo.it/TakashiSasaki/SOuH/edit
"use strict";

var touchMoveX;
var touchMoveY;
var touchMoveElement;
var touchStartX;
var touchStartY;
var touchStartElement;
var touchEndX;
var touchEndY;
var touchEndElement;
var doubleClickX;
var doubleClickY;
var doubleClickElement;
var mouseUpX;
var mouseUpY;
var mouseUpElement;
var mouseDownX;
var mouseDownY;
var mouseDownElement;

var divStrips, divMenu, inputStripTitle, inputUrl, divRenewAfter, divRenewEveryHours, divRenewDayOfWeek, divLastOpened, divDueDateTime;
var jsonStrips = {};
var stripDivs = {};

var jsonStripTemplate = {
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
    keywords: []
};

function loadStrips() {
    jsonStrips = {};
    stripDivs = {};
    for (var i = 0; i < window.localStorage.length; ++i) {
        var keyString = window.localStorage.key(i);
        var key = parseInt(keyString);
        if (isNaN(key)) continue;
        if (Math.floor(key) !== key) continue;
        var stringJson = window.localStorage.getItem(key);
        if (typeof stringJson !== "string") {
            throw "loadStrips: stringJson is not a string";
        }
        var strip = JSON.parse(stringJson);
        if (!(strip instanceof Object)) {
            console.log("loadStrips: i = " + i);
            console.log("loadStrips: window.localStorage.key(i) = " + window.localStorage.key(i));
            console.log("loadStrips: stringJson = " + stringJson);
            throw "loadStrips: strip is not an object.";
        }
        jsonStrips[strip.stripId] = strip;
        if (strip.archived !== true) {
            var divStrip = buildDivStrip(strip);
            stripDivs[strip.stripId] = divStrip;
        }
    }
    if (Object.keys(stripDivs).length === 0) {
        createNewStrip();
    }
}

function updateStrip(event) {
    divMenu.style.display = 'none';
    var stripId = event.target.dataset.stripId;
    var strip = jsonStrips[stripId];
    strip.dirty = true;
    strip.stripTitle = inputStripTitle.value;
    strip.url = inputUrl.value;

    strip.renewAfter = [];
    var renewAfter = document.getElementsByName("renewAfter");
    for (var i = 0; i < renewAfter.length; ++i) {
        if (renewAfter[i].checked) {
            strip.renewAfter.push(renewAfter[i].value);
        }
    }

    strip.renewEveryHours = [];
    var renewEveryHours = document.getElementsByName("renewEveryHours");
    for (var i = 0; i < renewEveryHours.length; ++i) {
        if (renewEveryHours[i].checked) {
            strip.renewEveryHours.push(renewEveryHours[i].value);
        }
    }

    strip.renewDayOfWeek = [];
    var renewDayOfWeek = document.getElementsByName("renewDayOfWeek");
    for (var i = 0; i < renewDayOfWeek.length; ++i) {
        if (renewDayOfWeek[i].checked) {
            strip.renewDayOfWeek.push(renewDayOfWeek[i].value);
        }
    }

    var jsonString = JSON.stringify(strip);
    window.localStorage.setItem(stripId, jsonString);
    var oldStripDiv = stripDivs[stripId];
    if (oldStripDiv instanceof HTMLElement) {
        oldStripDiv.remove();
    }
    var newStripDiv = buildDivStrip(strip);
    stripDivs[stripId] = newStripDiv;
    sortStripDivs();
}

function updateTitle(event) {
    var stripId = event.target.dataset.stripId;
    jsonStrips[stripId].stripTitle = event.target.value;
    divMenu.style.display = "none";
    updateStrip(stripId);
}

function sortStripDivs() {
    for (var i in stripDivs) {
        divStrips.appendChild(stripDivs[i]);
    }
}

setTimeout(function () {
    divStrips = document.getElementById("divStrips");
    divMenu = document.getElementById("divMenu");
    inputStripTitle = document.getElementById("inputStripTitle");
    inputUrl = document.getElementById("inputUrl");
    divRenewAfter = document.getElementById("divRenewAfter");
    divRenewEveryHours = document.getElementById("divRenewEveryHours");
    divRenewDayOfWeek = document.getElementById("divRenewDayOfWeek");
    divDueDateTime = document.getElementById("divDueDateTime");
    divLastOpened = document.getElementById("divLastOpened");
    loadStrips(i);
    for (var i in stripDivs) {
        if (stripDivs[i] instanceof HTMLElement) {
            divStrips.appendChild(stripDivs[i]);
        }
    }
}, 100);

function dblclick(element, mouseEvent) {
    console.log("dblclick:" + element + mouseEvent);
}

function mouseup(element, mouseEvent) {
    console.log("mouseup:" + element + mouseEvent);
    return false;
}

function mousedown(element, mouseEvent) {
    console.log("mousedown:" + element + mouseEvent);
    return false;
}

function touchmove(element, touchEvent) {
    if (typeof touchEvent.changeTouches === "undefined") return;
    touchMoveX = touchEvent.changeTouches[0].clientX;
    touchMoveY = touchEvent.changeTouches[0].clientY;
    touchMoveElement = touchEvent.changeTouches[0].target;
    console.log("touchmove:" + touchMoveElement);
}

function touchstart(element, touchEvent) {
    if (typeof touchEvent.changeTouches === "undefined") return;
    touchStartX = touchEvent.changeTouches[0].clientX;
    touchStartY = touchEvent.changeTouches[0].clientY;
    touchStartElement = touchEvent.changeTouches[0].target;
    console.log("touchstart:" + touchStartElement);
}

function touchend(element, touchEvent) {
    if (typeof touchEvent.changeTouches === "undefined") return;
    touchEndX = touchEvent.changeTouches[0].clientX;
    touchEndY = touchEvent.changeTouches[0].clientY;
    touchEndElement = touchEvent.changeTouches[0].target;
    console.log("touchend:" + touchEndElement);
}

function archiveStrip(event) {
    jsonStrips[event.target.dataset.stripId].archived = true;
    stripDivs[event.target.dataset.stripId].remove();
    delete stripDivs[event.target.dataset.stripId];
    window.localStorage.setItem(event.target.dataset.stripId, JSON.stringify(jsonStrips[event.target.dataset.stripId]));
    divMenu.style.display = "none";
}

function createNewStrip() {
    var stripIds = Object.keys(jsonStrips);
    var newStripId;
    if (stripIds.length === 0) {
        newStripId = 0;
    } else {
        newStripId = Math.max.apply(null, Object.keys(stripIds)) + 1;
    }
    var newJsonStrip = Object.assign({}, jsonStripTemplate);
    newJsonStrip.stripId = newStripId;
    jsonStrips[newStripId] = newJsonStrip;
    var newDivStrip = buildDivStrip(newJsonStrip);
    stripDivs[newStripId] = newDivStrip;
    window.localStorage.setItem(newStripId, JSON.stringify(newJsonStrip));
    return newStripId;
}

function insertNewStrip(event) {
    var newStripId = createNewStrip();
    divStrips.insertBefore(stripDivs[newStripId], stripDivs[event.target.dataset.stripId]);
    divMenu.style.display = "none";
}

function buildDivStrip(stripJson) {
    if (!(stripJson instanceof Object)) {
        throw "buildDivStrip: stripJson is not an object";
    }
    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn", "btn-primary", "form-group", "divStrip", stripJson.className);
    newDivStrip.addEventListener("click", showMenu);
    newDivStrip.addEventListener("dblclick", openUrl);

    var spanStatus = document.createElement("span");
    spanStatus.classList.add("status", "checked", "stripId");
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

    setStripId(newDivStrip, stripJson.stripId);

    return newDivStrip;
}

function openUrl(event) {
    setTimeout(function () {
        if (divMenu.style.display === "block") return;
        var stripId = event.target.dataset.stripId;
        var strip = jsonStrips[stripId];
        var url = strip.url;
        if (typeof url === "string") {
            window.open(url, "window" + stripId);
            strip.lastOpened = new Date().getTime();
            window.localStorage.setItem(stripId, JSON.stringify(strip));
        }
    }, 600);
}

function showMenu(event) {

    var stripId = event.target.dataset.stripId;
    var strip = jsonStrips[stripId];
    divMenu.style.display = "block";
    inputStripTitle.value = strip.stripTitle;
    inputUrl.value = strip.url;
    divLastOpened.innerHTML = new Date(strip.lastOpened);
    divDueDateTime.innerHTML = new Date(strip.dueDateTime);

    if (!(strip.renewAfter instanceof Array)) strip.renewAfter = [];
    var renewAfter = document.getElementsByName("renewAfter");
    for (var i = 0; i < renewAfter.length; ++i) {
        if (strip.renewAfter.indexOf(renewAfter[i].value) >= 0) {
            renewAfter[i].checked = true;
        } else {
            renewAfter[i].checked = false;
        }
    }

    if (!(strip.renewEveryHours instanceof Array)) strip.renewEveryHours = [];
    var renewEveryHours = document.getElementsByName("renewEveryHours");
    for (var j = 0; j < renewEveryHours.length; ++j) {
        if (strip.renewEveryHours.indexOf(renewEveryHours[j].value) >= 0) {
            renewEveryHours[j].checked = true;
        } else {
            renewEveryHours[j].checked = false;
        }
    }

    if (!(strip.renewDayOfWeek instanceof Array)) strip.renewDayOfWeek = [];
    var renewDayOfWeek = document.getElementsByName("renewDayOfWeek");
    for (var k = 0; k < renewDayOfWeek.length; ++k) {
        if (strip.renewDayOfWeek.indexOf(renewDayOfWeek[k].value) >= 0) {
            renewDayOfWeek[k].checked = true;
        } else {
            renewDayOfWeek[k].checked = false;
        }
    }

    setStripId(divMenu, event.target.dataset.stripId);
}

function setStripId(element, stripId) {
    for (var i = 0; i < element.children.length; ++i) {
        element.children[i].dataset.stripId = stripId;
        if (element.children[i].classList.contains("stripId")) {
            element.children[i].innerHTML = stripId;
        }
        for (var j = 0; j < element.children[i].children.length; ++j) {
            element.children[i].children[j].dataset.stripId = stripId;
            if (element.children[i].children[j].classList.contains("stripId")) {
                element.children[i].children[j].innerHTML = stripId;
            }
        }
    }
}

