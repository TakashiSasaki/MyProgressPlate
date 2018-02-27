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

setTimeout(function(){
    divStrips = document.getElementById("divStrips");
    if(divStrips.children.length === 0){
        var newStripDiv = buildStripDiv();
        divStrips.appendChild(newStripDiv);
    }
    divMenu = document.getElementById("menu");
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

function getStripJson(stripId){
    if(stripId === undefined) {
        stripId = divStrips.children.length;
    }
    var jsonString = window.localStorage.getItem(stripId);
    var stripJson;
    if(jsonString === "string"){
        stripJson = JSON.parse(jsonString);
    } else {
        stripJson = {
            stripId: stripId,
            dirty: false,
            className: null,
            imgIcon: "http://icons.iconarchive.com/icons/paomedia/small-n-flat/256/sign-check-icon.png",
            stripTitle: "no title"
        };
        window.localStorage.setItem(stripId, JSON.stringify(stripJson));
    }
    return stripJson;
}

function insertNewStripDiv(event){
    var newStripDiv = buildStripDiv();
    var stripDiv = getStripDiv(event.target.dataset.stripId);
    divStrips.insertBefore(newStripDiv, stripDiv);
    toggleMenu();
}

function deleteStripDiv(event){
    if(divStrips.children.length === 1) return;
    var jsonString = window.localStorage.getItem(event.target.dataset.stripId);
    event.target.remove();
    toggleMenu();
}

function buildStripDiv(stripJson){
    if(stripJson === undefined) stripJson = getStripJson();
    if(!(stripJson instanceof Object)) throw "buildStripDiv: stripJson is not an object";
    var newDivStrip = document.createElement("div");
    newDivStrip.classList.add("btn");
    newDivStrip.classList.add("btn-primary");
    newDivStrip.classList.add("form-group");
    newDivStrip.classList.add("divStrip");
    newDivStrip.classList.add(stripJson.className);
    newDivStrip.dataset.stripId = stripJson.stripId;

    var spanStripId = document.createElement("span");
    spanStripId.innerHTML = stripJson.stripId;
    spanStripId.classList.add("spanStripId");
    spanStripId.dataset.stripId = stripJson.stripId;
    newDivStrip.appendChild(spanStripId);
    
    var imgIcon = document.createElement("img");
    imgIcon.src = stripJson.imgIcon;
    imgIcon.classList.add("imgIcon");
    imgIcon.dataset.stripId = stripJson.stripId;
    newDivStrip.appendChild(imgIcon);
    
    var inputStripTitle = document.createElement("input");
    inputStripTitle.value = stripJson.stripTitle;
    inputStripTitle.classList.add("btn");
    inputStripTitle.classList.add("btn-default");
    inputStripTitle.readOnly = true;
    inputStripTitle.addEventListener("dblclick", toggleReadOnly);
    inputStripTitle.addEventListener("change", saveStripTitle);
    inputStripTitle.dataset.stripId = stripJson.stripId;
    newDivStrip.appendChild(inputStripTitle);
    
    
    var buttonAddStrip = document.createElement("button");
    buttonAddStrip.innerHTML = "&#128397;";
    buttonAddStrip.classList.add("btn");
    buttonAddStrip.classList.add("btn-default");
    buttonAddStrip.addEventListener("click", toggleMenu);
    buttonAddStrip.dataset.stripId = stripJson.stripId;
    newDivStrip.appendChild(buttonAddStrip);
    
    return newDivStrip;
}

function getStripDiv(stripId){
    for(var i=0; i<divStrips.children.length; ++i) {
        var stripDiv = divStrips.children[i];
        if(stripDiv.dataset.stripId === stripId) {
            return stripDiv;
        }
    }
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
        for(var i=0; i<divMenu.children.length; ++i) {
            divMenu.children[i].dataset.stripId = divMenu.dataset.stripId;
            for(var j=0; j<divMenu.children[i].children.length; ++j){
                divMenu.children[i].children[j].dataset.stripId = divMenu.dataset.stripId;
                if(divMenu.children[i].children[j].classList.contains("stripId")){
                    divMenu.children[i].children[j].innerHTML=divMenu.dataset.stripId;
                }           
            }
        }
    } else {
        divMenu.style.display = "none";
    }
}
