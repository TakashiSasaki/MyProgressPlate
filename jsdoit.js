//http://jsdo.it/TakashiSasaki/SOuH/edit

"use strict";

var divStrips, divMenu, inputStripTitle, inputUrl, divRenewAfter, divRenewEveryHours, divRenewDayOfWeek, divLastOpened, divDueDateTime;
var jsonStrips = {};
var stripDivs = {};
var idElements = {};

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
    jsonStrips = {};
    stripDivs = {};
    for (var i = 0; i < window.localStorage.length; ++i) {
        var keyString = window.localStorage.key(i);
        var key = parseInt(keyString);
        if (isNaN(key)) continue;
        if (Math.floor(key) !== key) continue;
        var stringJson = window.localStorage.getItem(key);
        if (typeof stringJson !== "string") throw "loadStrips: stringJson should be a string.";
        var strip = JSON.parse(stringJson);
        if (typeof strip !== "object") throw "loadStrips: strip should be an object.";
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
    idElements.divMenu.style.display = 'none';
    var stripId = event.target.dataset.stripId;
    var strip = jsonStrips[stripId];
    strip.dirty = true;
    strip.stripTitle = idElements.inputStripTitle.value;
    strip.url = idElements.inputUrl.value;
    strip.renewAfter = getCheckedValues("renewAfter");
    strip.renewEveryHours = getCheckedValues("renewEveryHours");
    strip.renewDayOfWeek = getCheckedValues("renewDayOfWeek");
    strip.color = idElements.inputColor.value;
    console.log("updateStrip: " + strip.color);

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

function sortStripDivs() {
    for (var i in stripDivs) {
        idElements.divStrips.appendChild(stripDivs[i]);
    }
}

setTimeout(function () {
    traverse(document, function (x) {
        if (typeof x.id === "string" && x.id.length > 0) idElements[x.id] = x;
    });
    loadStrips(i);
    for (var i in stripDivs) {
        if (stripDivs[i] instanceof HTMLElement) {
            idElements.divStrips.appendChild(stripDivs[i]);
        }
    }
}, 100);

function archiveStrip(event) {
    if (!event instanceof Event) throw "archiveStrip: event should be an Event.";
    jsonStrips[event.target.dataset.stripId].archived = true;
    stripDivs[event.target.dataset.stripId].remove();
    delete stripDivs[event.target.dataset.stripId];
    window.localStorage.setItem(event.target.dataset.stripId, JSON.stringify(jsonStrips[event.target.dataset.stripId]));
    divMenu.style.display = "none";
}

function createNewStrip() {
    var stripIds = Object.keys(jsonStrips);
    var newStripId = stripIds.length === 0 ? 0 : Math.max.apply(null, Object.keys(stripIds)) + 1;
    var newJsonStrip = Object.assign({}, jsonStripTemplate);
    newJsonStrip.stripId = newStripId;
    jsonStrips[newStripId] = newJsonStrip;
    var newDivStrip = buildDivStrip(newJsonStrip);
    stripDivs[newStripId] = newDivStrip;
    window.localStorage.setItem(newStripId, JSON.stringify(newJsonStrip));
    return newStripId;
}

function insertNewStrip(event) {
    if (!event instanceof Event) throw "insertNewStrip: event should be an Event.";
    var newStripId = createNewStrip();
    if (typeof newStripId !== "number") throw "insertNewStrip: newStripId should be a number.";
    idElements.divStrips.insertBefore(stripDivs[newStripId], stripDivs[event.target.dataset.stripId]);
    idElements.divMenu.style.display = "none";
}

function buildDivStrip(stripJson) {
    if (typeof stripJson !== "object") throw "buildDivStrip: stripJson should be an object.";
    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn", "btn-primary", "form-group", "divStrip", stripJson.className);
    newDivStrip.addEventListener("dblclick", showMenu);
    newDivStrip.addEventListener("click", openUrl);

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
        if (idElements.divMenu.style.display === "block") return;
        var stripId = event.target.dataset.stripId;
        var strip = jsonStrips[stripId];
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
    var strip = jsonStrips[stripId];
    idElements.divMenu.style.display = "block";
    idElements.inputStripTitle.value = strip.stripTitle;
    idElements.inputUrl.value = strip.url;
    idElements.divLastOpened.innerHTML = new Date(strip.lastOpened);
    idElements.divDueDateTime.innerHTML = new Date(strip.dueDateTime);
    idElements.inputColor.value = strip.color;
    idElements.inputColor.placeholder = strip.color;
    idElements.inputColor.style.backgroundColor = "#" + strip.color;
    console.log("showMenu: " + strip.color);

    checkByValues("renewAfter", strip.renewAfter);
    checkByValues("renewEveryHours", strip.renewEveryHours);
    checkByValues("renewDayOfWeek", strip.renewDayOfWeek);
    traverse("divMenu", function (x) {
        x.dataset.stripId = stripId;
    });
    document.getElementById("spanStripId").innerHTML = stripId;
}

