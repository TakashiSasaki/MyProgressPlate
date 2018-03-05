
"use strict";

function Strip() {
    this.stripId = stripId;
    this.stripTitle = stripTitle;
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

    this.init = function(stripId, stripTitle){
      if(typeof stripId !== "number") throw "Strip#init: stripId is expected to be an integer.";
      if(typeof stripTitle !== "string") throw "Strip#init: stripTitle is expected to be a string.";
      this.stripId = stripId;
      this.stripoTitle = stripTitle;
    }

    this.saveToLocalStorage = function(){
        const stringified = JSON.stringify(this);
        window.localStorage.setItem("stripId=" + this.stripId, stringified);
    }

    this.loadFromLocalStorage = function(storageKey){
        if(storageKey === undefined) throw "Strip#loadFromLocalStorage: expects string storageKey.";
        if(keyString.substr(0,8) !== "stripId=") return null;
        const stripId = parseInt(keyString.substr(8));
        if(isNaN(stripId)) return null;        
        const stringified = window.localStorage.getItem(storageKey);
        if(typeof stringified !== "string") throw "Strip#loadFromLocalStorage: " + storageKey + " is not found in localStorage.";
        const parsed = JSON.parse(stringified);
        if(stripId !== parsed.stripId) throw "Strip#loadFromLocalStorage: given storageKey and loaded stripId do not match.";
        for(var x in parsed) {
          this[x] = parsed[x];
        }
        return parsed.stripId;
    }

    this.archive = function(){
        this.archived = true;
        this.saveToLocalStorage();
    }

    Object.defineProperty(this, "initByJson", { enumerable: false });
    Object.defineProperty(this, "saveToLocalStorage", { enumerable: false });
    Object.defineProperty(this, "loadFromLocalStorage", { enumerable: false });
    Object.defineProperty(this, "archiveStrip", { enumerable: false });
    Object.preventExtensions(this);
    return this;
}

