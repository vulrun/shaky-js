const crypto = require("crypto");

module.exports = {
    md5,
    sha256,
    hexEncode,
    hexDecode,
    base64Encode,
    base64Decode,

    dateMs,
    toDecimals,
    randomNumber,
    randomString,

    addToSet,
    removeFromSet,

    cleanJSON,
    cleanObj: cleanJSON,
    toObject,
    removeFalsy,
    getObjPropValue,

    normalCase,
    titleCase,
    prettyCase,

    calcAge,
    calcKms,
    timeAgo,

    parseEmail,
};

// crypto
function md5(str) {
    return crypto.createHash("md5").update(str).digest("hex");
}
function sha256(val) {
    return crypto.createHash("sha256").update(val).digest("hex");
}
function hexEncode(val) {
    return Buffer.from(String(val), "utf8").toString("hex");
}
function hexDecode(val) {
    return Buffer.from(String(val), "hex").toString("utf8");
}
function base64Encode(val) {
    return Buffer.from(String(val), "utf8").toString("base64");
}
function base64Decode(val) {
    return Buffer.from(String(val), "base64").toString("utf8");
}

// date, number, string
function dateMs(str) {
    str = String(str || "now").replace(/\s/g, "");
    if (str === "now") return Date.now();
    if (str.length > 100) throw new Error("Value exceeds the maximum length of 100 characters.");

    // match for input values
    const matches = /^(-?(?:\d+)?\.?\d+)[\-\.\_ ]*(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?[\-\.\_ ]*(ago|ahead)?$/i.exec(str);
    if (!matches) return NaN;

    // sanitize variables
    let [___, num, unit, mode] = matches;
    num = parseFloat(num);
    unit = (unit || "ms").toLowerCase();
    mode = (mode || "").toLowerCase();

    // unit values
    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const w = d * 7;
    const y = d * 365.25;

    // cases
    switch (unit) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            num *= y;
            break;
        case "weeks":
        case "week":
        case "w":
            num *= w;
            break;
        case "days":
        case "day":
        case "d":
            num *= d;
            break;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            num *= h;
            break;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            num *= m;
            break;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            num *= s;
            break;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            break;
        default:
            num = 0;
    }

    // modify as per selected mode
    if (mode === "ago") return Date.now() - num;
    if (mode === "ahead") return Date.now() + num;
    return num;
}
function toDecimals(val, decimal = 2) {
    const base = Math.pow(10, decimal);
    return Math.round(val * base) / base;
}
function randomNumber(max = Date.now()) {
    return Math.abs((Math.random() * max) | 0);
}
function randomString(input = "aaaa-aaa-1234") {
    const numericals = "0123465789";
    const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
    const upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (typeof input === "number") {
        let set = numericals + lowerAlpha + upperAlpha;
        let str = "";
        while (input--) str += set[randomNumber(set.length)];
        return str;
    }

    return String(input).replace(/[0-9a-z*]/gi, function (val) {
        if (numericals.indexOf(val) > -1) return numericals[randomNumber(numericals.length)];
        if (lowerAlpha.indexOf(val) > -1) return lowerAlpha[randomNumber(lowerAlpha.length)];
        if (upperAlpha.indexOf(val) > -1) return upperAlpha[randomNumber(upperAlpha.length)];
        return Math.random().toString(36).slice(-1);
    });
}

// array
function addToSet(array, value) {
    return array.includes(value) ? array.slice(0) : array.concat([value]);
}
function removeFromSet(array, value) {
    const index = array.indexOf(value);
    index > -1 && array.splice(index, 1);
    return array;
}

// object
function cleanJSON(data) {
    if (typeof data === "string") {
        const regex = /^(?:[^\(]+)\(|\)$/g;
        // handling jsonp
        if (regex.test(data)) data = data.replace(regex, "");
    } else {
        data = JSON.stringify(data);
    }

    data = JSON.parse(data);
    return data;
}
function toObject(data, key, val) {
    if (!Array.isArray(data)) throw new Error("INVALID_DATA");
    if (!key || typeof key !== "string") throw new Error("INVALID_KEY");

    const newObj = {};
    if (data.length > 0) {
        for (const item of data) {
            newObj[item[key] + ""] = !!val ? item[val] : item;
        }
    }
    return newObj;
}
function removeFalsy(obj) {
    const newObj = {};
    for (const prop of Object.keys(obj)) {
        if (obj[prop]) {
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}
function getObjPropValue(obj, path) {
    if (!path) return obj;

    if (Array.isArray(path)) {
        const [top, ...rest] = path;

        // look into one level
        obj = obj[top];
        path = rest;

        // oops, nullish value
        if (!obj) return obj;

        // wow, this is last level
        if (rest.length === 0) return obj;
    } else {
        path = String(path).split(".");
    }

    return getObjPropValue(obj, path);
}

// misc
function calcAge(dob) {
    return Math.abs(new Date(new Date() - new Date(dob)).getUTCFullYear() - 1970);
}

function calcKms(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the earth in km
    const deg2rad = (deg) => deg * (Math.PI / 180);

    const lat = deg2rad(lat2 - lat1);
    const lon = deg2rad(lon2 - lon1);

    const accu = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(lon / 2) * Math.sin(lon / 2);
    const calc = 2 * Math.atan2(Math.sqrt(accu), Math.sqrt(1 - accu));
    const dist = earthRadius * calc; // Distance in km
    return dist;
}

function timeAgo(unix) {
    unix = new Date().getTime() - new Date(unix).getTime();
    unix = Math.max(0, unix / 1000);

    const periods = {
        decade: 60 * 60 * 24 * 30 * 12 * 10,
        year: 60 * 60 * 24 * 30 * 12,
        month: 60 * 60 * 24 * 30,
        week: 60 * 60 * 24 * 7,
        day: 60 * 60 * 24,
        hr: 60 * 60,
        min: 60,
        sec: 1,
    };

    if (periods.year * 5 < unix) return "";

    for (const unit in periods) {
        if (unix < periods[unit]) continue;

        const number = Math.floor(unix / periods[unit]);
        return "".concat(number, " ", unit, number > 1 ? "s ago" : " ago");
    }

    return "just now";
}

// case-conversions
function normalCase(str) {
    return String(str).replace(/[^a-z0-9]/gi, " ");
}
function titleCase(str) {
    return normalCase(str)
        .toLowerCase()
        .replace(/\b[a-z]/g, (v) => v.toUpperCase());
}
function prettyCase(str) {
    if (typeof str === "string" && /^[A-Z_]+$/.test(str)) {
        str = titleCase(str);
    }
    return str;
}

// parsings
function parseEmail(input) {
    const regex = /^([a-z0-9]+(?:[\_\.\-][a-z0-9]+)*)(\+[a-z0-9\_\.\-]+)?@((?:[a-z0-9\-]+\.)+[a-z]{2,})$/i;
    const match = String(input).toLowerCase().match(regex);
    if (!match) return null;

    let [email, uname, plus, domain] = match;
    if (domain === "gmail.com" || domain === "googlemail.com") email = uname.replace(/\./g, "") + "@" + domain;
    return { email, uname, plus, domain };
}
