function getDay(epoch){
    if(getDay.epoch === epoch) return getDay.day;
    if(typeof epoch !== "number") throw "decomposeDate: expects epoch in millisecond";
    getDay.epoch = epoch;
    getDay.day = (new Date(epoch)).getDay();
    return getDay.day;
}

function getHours(epoch){
    if(getHours.epoch === epoch) return getHours.hours;
    if(typeof epoch !== "number") throw "getHours: expects epoch in millisecond";
    getHours.epoch = epoch;
    getHours.hours = (new Date(epoch)).getHours();
    return getHours.hours;
}

function setNextHours(epoch, hours){
    if(typeof epoch !== "number") throw "setNextHours: epoch should be a number.";
    if(hours < 0 || hours > 23) throw "setNextHours: hours should be an integer between 0 and 23.";
    if(setNextHours.epoch === epoch && setNextHours.hours === hours) return setNextHours.nextHoursEpoch;
    setNextHours.epoch = epoch; setNextHours.hours = hours;
    if(getHours(epoch) < hours) {
        var date = new Date(epoch);
        date.setHours(hours);
    } else {
        var date = new Date(epoch + 86400000);
        date.setHours(hours);
    }
    date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    setNextHours.nextHoursEpoch = date.getTime();
    return setNextHours.nextHoursEpoch;
}

function setNextDay(epoch, day){
    if(day < 0 || day >6) throw "setNextDay: day should be an integer between 0 and 6.";
    if(setNextDay.epoch === epoch && setNextDay.day === day) return setNextDay.nextDayEpoch;
    setNextDay.epoch = epoch; setNextDay.day = day;
    if(getDay(epoch) < day) {
        var date = new Date(epoch + (day-getDay(epoch)) * 86400000);
    } else {
        var date = new Date(epoch + (day-getDay(epoch) + 7) * 86400000);
    }
    date.setHours(0), date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    setNextDay.nextDayEpoch = date.getTime();
    return setNextDay.nextDayEpoch;
}

