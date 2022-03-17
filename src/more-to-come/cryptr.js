const crypto = require("crypto");

function Base64(str) {
    str = str || "";

    this.encode = function () {
        return Buffer.from(str, "utf8").toString("base64");
    };

    this.decode = function () {
        return Buffer.from(str, "base64").toString("utf8");
    };

    this.escape = function () {
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    };

    this.unescape = function () {
        str += new Array(5 - (str.length % 4)).join("=");
        return str.replace(/\-/g, "+").replace(/_/g, "/");
    };

    this.toString = function () {
        return str;
    };

    return this;
}

module.exports = function Cryptor(secret) {
    if (!secret || typeof secret !== "string") {
        throw new Error("Cryptor: secret must be a non-0-length string");
    }

    const algorithm = "aes-256-gcm";
    const ivLength = 16;
    const tagLength = 16;
    const saltLength = 64;
    const tagPosition = saltLength + ivLength;
    const encryptedPosition = tagPosition + tagLength;

    this.getKey = (secret, salt) => {
        return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha512");
    };

    this.encrypt = (value) => {
        if (!value == null) throw new Error("value must not be null or undefined");

        value = JSON.stringify(value);

        const salt = crypto.randomBytes(saltLength);
        const iv = crypto.randomBytes(ivLength);
        const key = this.getKey(secret, salt);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
        const tag = cipher.getAuthTag();

        return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
    };

    this.decrypt = (value) => {
        if (!value == null) throw new Error("value must not be null or undefined");

        const stringValue = Buffer.from(String(value), "base64");

        const salt = stringValue.slice(0, saltLength);
        const iv = stringValue.slice(saltLength, tagPosition);
        const tag = stringValue.slice(tagPosition, encryptedPosition);
        const encrypted = stringValue.slice(encryptedPosition);
        const key = this.getKey(secret, salt);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(tag);

        return decipher.update(encrypted) + decipher.final("utf8");
    };

    return this;
};
