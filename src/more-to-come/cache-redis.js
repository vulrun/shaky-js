// storing data and fetching it in a blastic way
const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient({
    host: "redis-18185.c276.us-east-1-2.ec2.cloud.redislabs.com",
    port: "18185",
});
client.auth("38MDoFDPfUR14CCBBhz7ghFYxdeixRDV");

function isNull(data) {
    return data === null;
}
function isObject(data) {
    return toString.call(data) === "[object Object]";
}
function isArray(data) {
    return Array.isArray(data);
}
function isJson(data) {
    try {
        JSON.parse(data);
        return true;
    } catch (error) {
        return false;
    }
}
function _stringify(value) {
    return isArray(value) || (isObject(value) && !isNull(value)) ? JSON.stringify(value) : String(value);
}

const cache = {
    del: promisify(client.del).bind(client),
    get: (key) => {
        return new Promise((resolve, reject) => {
            client.get(key, function (err, val) {
                if (err) reject(err);
                else resolve(isJson(val) ? JSON.parse(val) : val);
                return;
            });
        });
    },
    set: (key, val) => {
        return new Promise((resolve, reject) => {
            client.set(key, _stringify(val), function (err, res) {
                if (err) reject(err);
                else resolve(_stringify(val));
                return;
            });
        });
    },
};

// exports
global.cache = cache;
module.exports = cache;
