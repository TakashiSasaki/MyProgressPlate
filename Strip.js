
"use strict";

function Strip(stripId, stripTitle) {
    if (typeof stripId === "number") {
        this.stripId = stripId;
        if (typeof stripTitle === "string") {
            this.stripTitle = stripTitle;
        } else {
            this.stripTitle = "strip " + stripId;
        }
    } else if (stripId === undefined) {
        this.stripId = undefined;
        this.stripTitle = undefined;
    } else {
        throw "Strip: expects number or undefined.";
    }
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

    this.initByJson = function (stringified) {
        if (typeof stringified !== "string") throw "Strip#initByJson: expects a string.";
        var parsed = JSON.parse(stringified);
        try {
            for (var i in parsed) {
                this[i] = parsed[i];
            }
        } catch (e) {
            console.log(e);
            console.log("Strip#initByJson: i = " + i);
        }
        return this; // for method chaining
    }; //initByJson

    this.saveToLocalStorage = function(){
        const stringified = JSON.stringify(this);
        window.localStorage.setItem("stripId=" + this.stripId, stringified);
    }

    this.loadFromLocalStorage = function(stripId){
        if(stripId === undefined) stripId = this.stripId;
        if(stripId === undefined) "Strip#loadFromLocalStorage: stripId is undefined.";
        const stringified = window.localStorage.getItem("stripId="+stripId);
        if(typeof stringified !== "string") throw "Strip#loadFromLocalStorage: stripId=" + stripId + " is not found in localStorage.";
        const parsed = JSON.parse(stringified);
        for(var x in parsed) {
          this[x] = parsed[x];
        }
    }

    Object.defineProperty(this, "initByJson", { enumerable: false });
    Object.defineProperty(this, "saveToLocalStorage", { enumerable: false });
    Object.defineProperty(this, "loadFromLocalStorage", { enumerable: false });
    Object.preventExtensions(this);
    return this;
}

