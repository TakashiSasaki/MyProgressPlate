class DomStrips extends Array {
    constructor(){
        super();
        for(var i=0; i<window.localStorage.length; ++i) {
            const keyString = window.localStorage.key(i);
            if(keyString === undefined) continue;
            if(keyString.substr(0,8) !== "stripId=") continue;
            const stripId = parseInt(keyString.substr(8));
            if(isNaN(stripId)) continue;        
            const strip = new DomStrip(stripId);
            if(typeof strip.stripId !== "number") throw "DomStrips#constructor: strip.stripId is not a number.";
            this[strip.stripId] = strip;
            this.length = Math.max(this.length, strip.stripId+1);
        }//for
        console.log("DomStrips#constructor: " + this.length + " strips loaded.");
    }
    
    create() {
        const domStrip = new DomStrip(this.length);
        this[domStrip.stripId] = domStrip;
        this.length = Math.max(this.length, domStrip.stripId+1);
        return this[domStrip.stripId];
    }
    
    save(stripId){
        if(typeof stripId !== "number") throw "DomStrips#saveToLocalStorage: stripId should be an integer.";
        this[stripId].save();
    }
}//DomStrips

class StripDivs extends Array {

    constructor(strips){
        if(!(strips instanceof DomStrips)) throw "StripDivs#constructor: expects a DomStrips.";
        super(); 
        this.strips = strips;
        for(var i in this.strips){
            const domStrip = this.strips[i];
            if(domStrip instanceof DomStrip) {
                this[i] = domStrip.divStrip();
                this.length = Math.max(this.length, i+1);
                window.divStrips.appendChild(this[i]);
            }//if
        }//for
        const tmp = this;
        this.show();
    }//StripDivs#constructor

    archive(stripId){
        if(stripId !== "number") throw "StripDivs#remove: expects a number.";
        this.strips.archive(stripId);
        this[stripId].remove();
        this[stripId] = undefined;
        this.length = Math.max(this.length, stripId+1);
        this.show();
    }//StripDivs#archive
    
    create(){
        const domStrip = strips.create();
        this[domStrip.stripId] = domStrip.divStrip();
        this.length = Math.max(this.length, domStrip.stripId+1);
        this.show();
    }//StripDivs#createNewStrip

    show(){
        for(var i=0; i<this.length; ++i){
            if(this[i] === undefined) continue;
            if(!(this[i] instanceof HTMLDivElement)) throw "StripDivs#show: i=" + i + ", typeof this[i] = " + typeof this[i];
            window.divStrips.appendChild(this[i]);
        }
    }//StripDivs#show
}


const strips = new DomStrips();
const stripDivs = new StripDivs(strips);
