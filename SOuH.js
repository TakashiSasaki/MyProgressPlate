class DomStrips extends Array {
    constructor(){
        super();
        for(var i=0; i<window.localStorage.length; ++i) {
            const keyString = window.localStorage.key(i);
            try {
                const domStrip = new DomStrip(keyString);
                this[domStrip._idNumber] = domStrip;
                this.length = Math.max(this.length, domStrip._idNumber + 1);
            } catch (e) {
                //console.log("DomStrips#constructor: " + e);
            }
        }//for
        console.log("DomStrips#constructor: " + this.length + " strips loaded.");
    }
    
    create() {
        const domStrip = new DomStrip(this.length);
        this[domStrip._idNumber] = domStrip;
        this.length = Math.max(this.length, domStrip._idNumber + 1);
        return this[domStrip._idNumber];
    }
    
    save(_idNumber){
        if(typeof _idNumber !== "number") throw "DomStrips#save: _idNumber should be an integer.";
        this[_idNumber].save();
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

    archive(_idNumber){
        if(_idNumber !== "number") throw "StripDivs#remove: expects a number.";
        this.strips.archive(_idNumber);
        this[_idNumber].remove();
        this[_idNumber] = undefined;
        this.length = Math.max(this.length, _idNumber + 1);
        this.show();
    }//StripDivs#archive
    
    create(){
        const domStrip = strips.create();
        this[domStrip._idNumber] = domStrip.divStrip();
        this.length = Math.max(this.length, domStrip._idNumber + 1);
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
