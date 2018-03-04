
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
    this.renewAfter = undefined;
    this.renewEveryHours = undefined;
    this.renewEveryDay = undefined;
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

    Object.defineProperty(this, "initByJson", { enumerable: false });
    Object.preventExtensions(this);
    return this;
}

