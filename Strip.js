"use strict";

function StripBase() {
    this._oid = "2.25.233426837401770292559991393619474392241.2000";
    this._idNumber = undefined; 
    this._idPrefix = "Strip";
    this._dirty = undefined;
    this._order = undefined;
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
    constructor(_idNumber){
        if(typeof _idNumber !== "number") throw "Strip#constructor expects a number.";
        super();
        this._idNumber = _idNumber;
    }//Strip#constructor
    
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
    constructor(idNumberOrStorageKey) {
        if(typeof idNumberOrStorageKey === "number"){
            super(idNumberOrStorageKey);
            var storageKey = this._idPrefix + idNumberOrStorageKey;
            const stringified = window.localStorage.getItem(storageKey);
            if(typeof stringified === "string") {
                const parsed = JSON.parse(stringified);
                if(this._idNumber !== parsed._idNumber) throw "PersistentStrip#constructor: this._idNumber !== parsed._idNumber";
                for(var x in parsed) {
                  this[x] = parsed[x];
                }
            } else {
                this.save();
            }
        } else {
            const stringified = window.localStorage.getItem(idNumberOrStorageKey);
            //console.log(stringified);
            const parsed = JSON.parse(stringified);
            super(parsed._idNumber);
            for(var x in parsed) {
              this[x] = parsed[x];
            }
        }
    }//PersistentStrip#constructor
    
    save(){
        const stringified = JSON.stringify(this);
        console.log("PersistentStrip#save: this._idNumber = " + this._idNumber);
        window.localStorage.setItem(this._idPrefix + this._idNumber, stringified);
        return this; // for method chaining
    }//PersistentStrip#save

}//PersistentStrip

class DomStrip extends PersistentStrip{
    constructor(idNumberOrStorageKey){
        super(idNumberOrStorageKey);
    }//constructor
    
    openUrl(){
        const strip = this;
        setTimeout(function(){
            if(typeof url === "string"){
                var newWindow = window.open(url, "window" + strip._idNumber);
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
        spanStatus.classList.add("col-xs-1","status", "checked", "_idNumber");
        spanStatus.innerHTML = this._idNumber;
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
     
        const _idNumber = this._idNumber;
        traverse(divStrip, function(x){x.dataset._idNumber = _idNumber;});
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
        window.spanStripId.innerHTML=this._idNumber;
        checkByValues("renewAfter", strip.renewAfter);
        checkByValues("renewEveryHours", strip.renewEveryHours);
        if(!(strip.renewEveryDay) instanceof Array) strip.renewEveryDay = [];
        checkByValues("renewEveryDay", strip.renewEveryDay);
        const _idNumber = this._idNumber;
        traverse(window.divMenu, function(x){x.dataset._idNumber = _idNumber;});
        return window.divMenu;
    }//divMenu
}//DomStrip
