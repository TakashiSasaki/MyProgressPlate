//http://jsdo.it/TakashiSasaki/SOuH/edit
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

var divStrips;
var divMenu;
var inputTitle;
var jsonStrips = {};
var stripDivs = {};

var jsonStripTemplate = {
    stripId: null,
    imgIcon: null,
    className: null,
    stripTitle: "no title",
    archived: false,
    dirty: true,
    sticky: false
};

function updateTitle(){
}

function loadStrips(){
    jsonStrips = {};
    stripDivs = {};
    for(var i=0; i<window.localStorage.length; ++i) {
        const stringJson = window.localStorage.getItem(window.localStorage.key(i));
        if(typeof stringJson !== "string") {
            throw "loadStrips: stringJson is not a string";
        }
        const jsonStrip = JSON.parse(stringJson);
        if(!(jsonStrip instanceof Object)){
            throw "loadStrips: jsonStrip is not an object.";
        }
        jsonStrips[jsonStrip.stripId] = jsonStrip;
        if(jsonStrip.archived !== true) {
            const divStrip = buildDivStrip(jsonStrip);
            stripDivs[jsonStrip.stripId] = divStrip;
        }
    }
    if(Object.keys(divStrips).length === 0) {
        createNewStrip();
    }
}

function updateStrip(stripId){
    jsonStrips[stripId].dirty = true;
    const jsonString = JSON.stringify(jsonStrips[stripId]);
    window.localStorage.setItem(stripId, jsonString);
    const oldStripDiv = stripDivs[stripId];
    if(oldStripDiv instanceof HTMLElement) {
        oldStripDiv.remove();
    }
    const newStripDiv = buildDivStrip(jsonStrips[stripId]);
    stripDivs[stripId] = newStripDiv;
    sortStripDivs();
}

function sortStripDivs(){
    for(var i in stripDivs){
        divStrips.appendChild(stripDivs[i]);
    }
}

setTimeout(function(){
    divStrips = document.getElementById("divStrips");
    divMenu = document.getElementById("divMenu");
    inputTitle = document.getElementById("inputTitle");
    loadStrips(i);
    for(var i in stripDivs) {
        if(stripDivs[i] instanceof HTMLElement) {
            divStrips.appendChild(stripDivs[i]);
        }
    }
}, 100);

function dblclick(element,mouseEvent){
    console.log("dblclick:" + element + mouseEvent);
}

function mouseup(element,mouseEvent){
    console.log("mouseup:" + element + mouseEvent);
    return false;
}

function mousedown(element,mouseEvent){
    console.log("mousedown:" + element + mouseEvent);
    return false;
}

function touchmove(element,touchEvent){
    if(typeof touchEvent.changeTouches === "undefined") return;
    touchMoveX = touchEvent.changeTouches[0].clientX;
    touchMoveY = touchEvent.changeTouches[0].clientY;
    touchMoveElement = touchEvent.changeTouches[0].target;
    console.log("touchmove:" + touchMoveElement);
}

function touchstart(element,touchEvent){
    if(typeof touchEvent.changeTouches === "undefined") return;
    touchStartX = touchEvent.changeTouches[0].clientX;
    touchStartY = touchEvent.changeTouches[0].clientY;
    touchStartElement = touchEvent.changeTouches[0].target;
    console.log("touchstart:" + touchStartElement);
}

function touchend(element,touchEvent){
    if(typeof touchEvent.changeTouches === "undefined") return;
    touchEndX = touchEvent.changeTouches[0].clientX;
    touchEndY = touchEvent.changeTouches[0].clientY;
    touchEndElement = touchEvent.changeTouches[0].target;
    console.log("touchend:" + touchEndElement);
}

function archiveStrip(event){
    jsonStrips[event.target.dataset.stripId].archived = true;
    stripDivs[event.target.dataset.stripId].remove();
    delete stripDivs[event.target.dataset.stripId];
    window.localStorage.setItem(event.target.dataset.stripId, JSON.stringify(jsonStrips[event.target.dataset.stripId]));
    divMenu.style.display="none";
}

function createNewStrip(){
    const stripIds = Object.keys(jsonStrips);
    var newStripId;
    if(stripIds.length === 0) {
        newStripId = 0;
    } else {
        newStripId = Math.max.apply(null, Object.keys(stripIds)) + 1;
    }
    const newJsonStrip = Object.assign({}, jsonStripTemplate);
    newJsonStrip.stripId = newStripId;
    jsonStrips[newStripId] = newJsonStrip;
    const newDivStrip = buildDivStrip(newJsonStrip);
    stripDivs[newStripId] = newDivStrip;
    window.localStorage.setItem(newStripId, JSON.stringify(newJsonStrip));
    return newStripId;
}

function insertNewStrip(event){
    var newStripId = createNewStrip();
    divStrips.insertBefore(stripDivs[newStripId], stripDivs[event.target.dataset.stripId]);
    divMenu.style.display="none";
}

function buildDivStrip(stripJson){
    if(!(stripJson instanceof Object)) {
        alert(stripJson);
        throw "buildDivStrip: stripJson is not an object";
    }
    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn");
    newDivStrip.classList.add("btn-primary");
    newDivStrip.classList.add("form-group");
    newDivStrip.classList.add("divStrip");
    newDivStrip.classList.add(stripJson.className);
    newDivStrip.addEventListener("dblclick", showMenu);

    var spanStatus = document.createElement("span");
    spanStatus.classList.add("status");
    spanStatus.classList.add("checked");
    spanStatus.classList.add("stripId");
    newDivStrip.appendChild(spanStatus);
    
    if(typeof stripJson.imgIcon === "string") {
        var imgIcon = document.createElement("img");
        imgIcon.src = stripJson.imgIcon;
        imgIcon.classList.add("imgIcon");
        newDivStrip.appendChild(imgIcon);
    }
        
    var inputStripTitle = document.createElement("input");
    inputStripTitle.value = stripJson.stripTitle;
    inputStripTitle.classList.add("btn");
    inputStripTitle.classList.add("btn-default");
    inputStripTitle.readOnly = true;
    newDivStrip.appendChild(inputStripTitle);
        
    setStripId(newDivStrip, stripJson.stripId);
    
    return newDivStrip;
}

function getChildWithClass(parentElement, className) {
    for(var i in parentElement.children){
        if(parentElement.children[i].classList.contains(className)) {
            return parentElement.children[i];
        }
    }
}

function toggleReadOnly(event){
    event.target.readOnly = !(event.target.readOnly);
    event.target.focus();
    event.target.select();
}

function updateTitle(event){
    var stripId = event.target.dataset.stripId;
    jsonStrips[stripId].stripTitle = event.target.value;
    divMenu.style.display = "none";
    updateStrip(stripId);
}

function toggleMenu(event){
    if(divMenu.style.display !== "block") {
        showMenu(event);
    } else {
        divMenu.style.display = "none";
    }
}

function showMenu(event){
    var stripId = event.target.dataset.stripId;
    var jsonStrip = jsonStrips[stripId];
    divMenu.style.display = "block";
    divMenu.style.top = "5em";
    divMenu.style.left = "10%";
    inputTitle.value = jsonStrip.stripTitle;
    setStripId(divMenu, event.target.dataset.stripId);
}


function setStripId(element, stripId){
    for(var i=0; i<element.children.length; ++i) {
        element.children[i].dataset.stripId = stripId;
        if(element.children[i].classList.contains("stripId")){
            element.children[i].innerHTML=stripId;
        }           
        for(var j=0; j<element.children[i].children.length; ++j){
            element.children[i].children[j].dataset.stripId = stripId;
            if(element.children[i].children[j].classList.contains("stripId")){
                element.children[i].children[j].innerHTML=stripId;
            }           
        }
    }
}