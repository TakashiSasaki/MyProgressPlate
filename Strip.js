"use strict";

function StripBase() {
    this.stripId = undefined;
    this.stripTitle = undefined;
    this.imgIcon = undefined;
    this.className = undefined;
    this.stripTitle = undefined;
    this.archived = undefined;
    this.dirty = undefined;
    this.sticky = undefined;
    this.renewAfter = [];
    this.renewEveryHours = [];
    this.renewEveryDay = [];
    this.dueDateTime = undefined;
    this.lastOpened = undefined;
    this.keywords = undefined;
    this.color = undefined;
    this.url = undefined;
}//StripBase

class Strip extends StripBase{
    constructor(stripId){
        super();
        this.stripId = stripId;
    }//Strip#constructor
    
    init(stripId, stripTitle){
        if(typeof stripId !== "number") throw "Strip#init: stripId is expected to be an integer.";
        if(typeof stripTitle !== "string") throw "Strip#init: stripTitle is expected to be a string.";
        this.stripId = stripId;
        this.stripoTitle = stripTitle;
        return this; // for method chaining
    }//Strip#init

    update(){
        var candidate = this.lastOpened + 365 * 86400000;
        this.renewAfter.forEach(function(x){candidate = Math.min(candidate, this.lastOpened + x);});
        this.renewEveryHours.forEach(function(x){candidate = Math.min(candidate, setNextHours(this.lastOpened, x));});
        this.renewEveryDay.forEach(function(x){console.log(x);candidate = Math.min(candidate, setNextDay(this.lastOpened, x));});
        this.dueDateTime = candidate;
        this.dirty = true;
        return this; // for method chaining
    }//Strip#updateDueDateTime
    
    touch(){
        this.lastOpened = (new Date()).getTime()
        this.dirty = true;
        update();
    }

    archive(){
        this.archived = true;
        return this; // for method chaining
    }//Strip#archive
}//Strip

class PersistentStrip extends Strip{
    constructor(stripId) {
        super(stripId);
        const storageKey = "stripId=" + stripId;
        const stringified = window.localStorage.getItem(storageKey);
        if(typeof stringified == "string") {
            const parsed = JSON.parse(stringified);
            if(stripId !== parsed.stripId) throw "Strip#loadFromLocalStorage: given storageKey and loaded stripId do not match.";
            for(var x in parsed) {
              this[x] = parsed[x];
            }
        } else {
            this.save();
        }
    }//PersistentStrip#constructor
    
    save(){
        const stringified = JSON.stringify(this);
        console.log("PersistentStrip#save: this.stripId = " + this.stripId);
        window.localStorage.setItem("stripId=" + this.stripId, stringified);
        return this; // for method chaining
    }//PersistentStrip#save

}//PersistentStrip

class DomStrip extends PersistentStrip{
    constructor(stripId){
        super(stripId);
    }//constructor
    
    openUrl(){
        const strip = this;
        setTimeout(function(){
            if(typeof url === "string"){
                var newWindow = window.open(url, "window" + strip.stripId);
                setTimeout(function(){
                    if(typeof newWindow === "object") {
                        try{
                            newWindow.dummy = "dummy";
                        } catch(e){
                            strip.lastOpened = (new Date()).getTime();
                            strip.saveToLocalStorage();
                        }
                    }
                }, 5000);
            }
            openUrl.status === "opened";
        }, 1000);
        return this; //for method chaining
    }//openUrl
    
    divStrip(){
        const divStrip = document.createElement("div");
        divStrip.classList.add("btn","form-group", "col-xs-12", "divStrip", this.className);
        divStrip.addEventListener("dblclick", ()=>{window.divMenu.style.display="block";});
        if(typeof this.color === "string") {
            divStrip.style.backgroundColor = "#" + this.color;
        } else {
            divStrip.style.backgroundColor = "lightgray";
        }
    
        const spanStatus = document.createElement("span");
        spanStatus.classList.add("col-xs-1","status", "checked", "stripId");
        spanStatus.innerHTML = this.stripId;
        divStrip.appendChild(spanStatus);
        
        if(typeof this.imgIcon === "string") {
            const imgIcon = document.createElement("img");
            imgIcon.src = this.imgIcon;
            imgIcon.classList.add("imgIcon");
            divStrip.appendChild(imgIcon);
        }
            
        const inputStripTitle = document.createElement("input");
        inputStripTitle.value = this.stripTitle;
        inputStripTitle.classList.add("btn");
        inputStripTitle.readOnly = true;
        divStrip.appendChild(inputStripTitle);
     
        const stripId = this.stripId;
        traverse(divStrip, function(x){x.dataset.stripId = stripId;});
        return divStrip;
    }//divStrip
    
    divMenu(){
        window.divMenu.style.display = "block";
        window.inputStripTitle.value = strip.stripTitle;
        window.inputUrl.value = strip.url;
        window.divLastOpened.innerHTML = new Date(strip.lastOpened);
        window.divDueDateTime.innerHTML = new Date(strip.dueDateTime);
        window.inputColor.value = strip.color;
        window.inputColor.placeholder = strip.color;
        window.inputColor.style.backgroundColor = "#" + strip.color;
        window.spanStripId.innerHTML=stripId;
        checkByValues("renewAfter", strip.renewAfter);
        checkByValues("renewEveryHours", strip.renewEveryHours);
        if(!(strip.renewEveryDay) instanceof Array) strip.renewEveryDay = [];
        checkByValues("renewEveryDay", strip.renewEveryDay);
        const stripId = this.stripId;
        traverse(window.divMenu, function(x){x.dataset.stripId = stripId;});
        return window.divMenu;
    }//divMenu
}//DomStrip
