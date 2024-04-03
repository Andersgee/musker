/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

//import { base64url } from "rfc4648";

/**
 * same as JSON but handles a couple of extra types in the following way
 *
 * ## stringify
 * - Date -> ["Date","str"]
 * - bigint -> ["BigInt","str"]
 * - Uint8Array -> ["Base64","str"]
 * - TypedArray -> ["Base64","str"] aswell
 *
 * ## parse
 * - ["Date","str"] -> Date
 * - ["BigInt","str"] -> bigint
 * - ["Base64","str"] -> Uint8Array
 */
export const JSONE = {
  stringify,
  parse,
};

function stringify(value: any, space?: string | number) {
  return JSON.stringify(replace(value), (_key, val) => replace(val), space);
}

function parse(text: string) {
  return JSON.parse(text, (_key, val) => revive(val));
}

function revive(value: any) {
  const maybeSpecialTuple = Array.isArray(value) && value.length === 2 && typeof value[1] === "string";
  if (maybeSpecialTuple && value[0] === "Date") {
    return new Date(value[1]);
  } else if (maybeSpecialTuple && value[0] === "BigInt") {
    return BigInt(value[1]);
  } else if (maybeSpecialTuple && value[0] === "Base64") {
    return uint8ArrayFromBase64url(value[1]);
  } else {
    return value;
  }
}

function replace(value: any): any {
  if (Array.isArray(value)) {
    return value.map(replace);
  } else if (value instanceof Date) {
    return ["Date", value.toISOString()];
  } else if (typeof value === "bigint") {
    return ["BigInt", value.toString()];
  } else if (value instanceof Uint8Array) {
    return ["Base64", base64urlFromUint8Array(value)];
  } else if (ArrayBuffer.isView(value)) {
    //allow other TypedArray's aswell
    return ["Base64", base64urlFromUint8Array(new Uint8Array(value.buffer))];
  } else if (value === Object(value)) {
    //see note about JSON.stringify with replacer
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replace(v)]));
  } else {
    return value;
  }
}

/**
 * simplified from [swansontec/rfc4648](https://github.com/swansontec/rfc4648.js)
 * for the special case of base64url alphabet without padding
 * eg `base64url.parse(str, { loose: true })`
 *
 * with node:Buffer, this is the equivalent of `buffer = Buffer.from(str, "base64url")`
 */
function uint8ArrayFromBase64url(string: string): Uint8Array {
  const out = new Uint8Array(((string.length * ENCODING.bits) / 8) | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (const char of string) {
    const value = ENCODING.codes[char];
    if (value === undefined) throw new SyntaxError(`Invalid character ${char}`);
    buffer = (buffer << ENCODING.bits) | value;
    bits += ENCODING.bits;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 0xff & (buffer >> bits);
    }
  }

  if (bits >= ENCODING.bits || 0xff & (buffer << (8 - bits))) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}

/**
 * simplified from [swansontec/rfc4648](https://github.com/swansontec/rfc4648.js)
 * for the special case of base64url alphabet without padding
 * eg `base64url.stringify(x, { pad: false })`
 *
 * with node:Buffer, this is the equivalent of `str = buffer.toString("base64url")`
 */
function base64urlFromUint8Array(data: Uint8Array): string {
  let out = "";
  let bits = 0;
  let buffer = 0;
  const mask = (1 << ENCODING.bits) - 1; //63
  for (const value of data) {
    buffer = (buffer << 8) | (0xff & value);
    bits += 8;
    while (bits > ENCODING.bits) {
      bits -= ENCODING.bits;
      out += ENCODING.chars[mask & (buffer >> bits)];
    }
  }

  if (bits) {
    out += ENCODING.chars[mask & (buffer << (ENCODING.bits - bits))];
  }
  return out;
}

const ENCODING: { chars: string; bits: number; codes: Record<string, number> } = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bits: 6,
  codes: {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9,
    "K": 10,
    "L": 11,
    "M": 12,
    "N": 13,
    "O": 14,
    "P": 15,
    "Q": 16,
    "R": 17,
    "S": 18,
    "T": 19,
    "U": 20,
    "V": 21,
    "W": 22,
    "X": 23,
    "Y": 24,
    "Z": 25,
    "a": 26,
    "b": 27,
    "c": 28,
    "d": 29,
    "e": 30,
    "f": 31,
    "g": 32,
    "h": 33,
    "i": 34,
    "j": 35,
    "k": 36,
    "l": 37,
    "m": 38,
    "n": 39,
    "o": 40,
    "p": 41,
    "q": 42,
    "r": 43,
    "s": 44,
    "t": 45,
    "u": 46,
    "v": 47,
    "w": 48,
    "x": 49,
    "y": 50,
    "z": 51,
    "0": 52,
    "1": 53,
    "2": 54,
    "3": 55,
    "4": 56,
    "5": 57,
    "6": 58,
    "7": 59,
    "8": 60,
    "9": 61,
    "-": 62,
    "_": 63,
  },
};

/*
note about JSON.stringify with replacer:

JSON.stringify uses the value.toJSON() if it exists before even trying
the replacer function, so replace before getting to the value itself

another option is monkey patching the toJSON, something like
Date.prototype.toJSON = function () {return ["Date", this.toISOString()];};
Buffer.prototype.toJSON = function () {return ["Base64", this.toString("base64url")];};
but thats bad practise
*/
