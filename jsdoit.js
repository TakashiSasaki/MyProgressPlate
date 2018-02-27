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
var jsonStrips = {};
var stripDivs = {};

var jsonStripTemplate = {
    stripId: null,
    dirty: false,
    imgIcon: null,
    className: null,
    stripTitle: "no title",
    dirty: true
};

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
        const divStrip = buildDivStrip(jsonStrip);
        stripDivs[jsonStrip.stripId] = divStrip;
    }
    if(Object.keys(jsonStrips).length === 0) {
        createNewStrip();
    }
}

setTimeout(function(){
    divStrips = document.getElementById("divStrips");
    divMenu = document.getElementById("menu");
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

function addNewStrip(event){
    var newStripId = createNewStrip();
    divStrips.insertBefore(stripDivs[newStripId], stripDivs[event.target.dataset.stripId]);
}

function archiveDivStrip(event){
    var jsonString = window.localStorage.getItem(event.target.dataset.stripId);
    if(typeof jsonString !== "string") return;
    event.target.remove();
    toggleMenu();
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

    var spanStatus = document.createElement("span");
    spanStatus.classList.add("status");
    spanStatus.classList.add("checked");
    spanStatus.classList.add("stripId");
    spanStatus.addEventListener("dblclick", toggleMenu);
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
    inputStripTitle.addEventListener("dblclick", toggleReadOnly);
    inputStripTitle.addEventListener("change", saveStripTitle);
    newDivStrip.appendChild(inputStripTitle);
    
    
    var buttonAddStrip = document.createElement("button");
    buttonAddStrip.innerHTML = "&#128397;";
    buttonAddStrip.classList.add("btn");
    buttonAddStrip.classList.add("btn-default");
    buttonAddStrip.addEventListener("click", toggleMenu);
    newDivStrip.appendChild(buttonAddStrip);
    
    setStripId(newDivStrip, stripJson.stripId)
    
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

function saveStripTitle(event){
    event.target.readOnly = true;
    var jsonString = window.localStorage.getItem(event.target.dataset.stripId);
    if(jsonString !== "string") jsonString = "{}";
    var stripJson = JSON.parse(jsonString);
    stripJson.stripTitle = event.target.value;
    stripJson.dirty = true;
    window.localStorage.setItem(event.target.dataset.stripId, JSON.stringify(stripJson));
}

function toggleMenu(event){
    if(divMenu.style.display !== "block") {
        divMenu.dataset.stripId = event.target.dataset.stripId;
        divMenu.style.display = "block";
        divMenu.style.top = "5em";
        divMenu.style.left = "10%";
        setStripId(divMenu, event.target.dataset.stripId);
    } else {
        divMenu.style.display = "none";
    }
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