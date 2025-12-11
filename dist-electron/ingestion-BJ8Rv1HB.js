import { P as PQueueMod, p as pRetry, s as snakeCase, a as styles, z as zodToJsonSchema, b as anyType, Z as ZodString, o as objectType, c as stringType } from "./chunk-VL2OQCWN-Cb9Eowls.js";
import { g as getDefaultExportFromCjs } from "./_commonjsHelpers-CUmg6egw.js";
import require$$0 from "node:crypto";
import { queryOne, execute, query } from "./pg-C--6FeAb.js";
import { insertVectors, deleteVectorsByMessageId, getTaskCenterVector } from "./vector-BPcG6pNR.js";
import { addMessageTags, getRelatedMessages } from "./graph-DlPa-fCr.js";
class Document {
  constructor(fields) {
    Object.defineProperty(this, "pageContent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.pageContent = fields.pageContent !== void 0 ? fields.pageContent.toString() : "";
    this.metadata = fields.metadata ?? {};
    this.id = fields.id;
  }
}
var dist = {};
var max = {};
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max;
  hasRequiredMax = 1;
  Object.defineProperty(max, "__esModule", {
    value: true
  });
  max.default = void 0;
  max.default = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  return max;
}
var nil = {};
var hasRequiredNil;
function requireNil() {
  if (hasRequiredNil) return nil;
  hasRequiredNil = 1;
  Object.defineProperty(nil, "__esModule", {
    value: true
  });
  nil.default = void 0;
  nil.default = "00000000-0000-0000-0000-000000000000";
  return nil;
}
var parse = {};
var validate$2 = {};
var regex = {};
var hasRequiredRegex;
function requireRegex() {
  if (hasRequiredRegex) return regex;
  hasRequiredRegex = 1;
  Object.defineProperty(regex, "__esModule", {
    value: true
  });
  regex.default = void 0;
  regex.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  return regex;
}
var hasRequiredValidate;
function requireValidate() {
  if (hasRequiredValidate) return validate$2;
  hasRequiredValidate = 1;
  Object.defineProperty(validate$2, "__esModule", {
    value: true
  });
  validate$2.default = void 0;
  var _regex = _interopRequireDefault(/* @__PURE__ */ requireRegex());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function validate2(uuid2) {
    return typeof uuid2 === "string" && _regex.default.test(uuid2);
  }
  validate$2.default = validate2;
  return validate$2;
}
var hasRequiredParse$1;
function requireParse$1() {
  if (hasRequiredParse$1) return parse;
  hasRequiredParse$1 = 1;
  Object.defineProperty(parse, "__esModule", {
    value: true
  });
  parse.default = void 0;
  var _validate = _interopRequireDefault(/* @__PURE__ */ requireValidate());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function parse$1(uuid2) {
    if (!(0, _validate.default)(uuid2)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr2 = new Uint8Array(16);
    arr2[0] = (v = parseInt(uuid2.slice(0, 8), 16)) >>> 24;
    arr2[1] = v >>> 16 & 255;
    arr2[2] = v >>> 8 & 255;
    arr2[3] = v & 255;
    arr2[4] = (v = parseInt(uuid2.slice(9, 13), 16)) >>> 8;
    arr2[5] = v & 255;
    arr2[6] = (v = parseInt(uuid2.slice(14, 18), 16)) >>> 8;
    arr2[7] = v & 255;
    arr2[8] = (v = parseInt(uuid2.slice(19, 23), 16)) >>> 8;
    arr2[9] = v & 255;
    arr2[10] = (v = parseInt(uuid2.slice(24, 36), 16)) / 1099511627776 & 255;
    arr2[11] = v / 4294967296 & 255;
    arr2[12] = v >>> 24 & 255;
    arr2[13] = v >>> 16 & 255;
    arr2[14] = v >>> 8 & 255;
    arr2[15] = v & 255;
    return arr2;
  }
  parse.default = parse$1;
  return parse;
}
var stringify$1 = {};
var hasRequiredStringify;
function requireStringify() {
  if (hasRequiredStringify) return stringify$1;
  hasRequiredStringify = 1;
  Object.defineProperty(stringify$1, "__esModule", {
    value: true
  });
  stringify$1.default = void 0;
  stringify$1.unsafeStringify = unsafeStringify;
  var _validate = _interopRequireDefault(/* @__PURE__ */ requireValidate());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr2, offset = 0) {
    return (byteToHex[arr2[offset + 0]] + byteToHex[arr2[offset + 1]] + byteToHex[arr2[offset + 2]] + byteToHex[arr2[offset + 3]] + "-" + byteToHex[arr2[offset + 4]] + byteToHex[arr2[offset + 5]] + "-" + byteToHex[arr2[offset + 6]] + byteToHex[arr2[offset + 7]] + "-" + byteToHex[arr2[offset + 8]] + byteToHex[arr2[offset + 9]] + "-" + byteToHex[arr2[offset + 10]] + byteToHex[arr2[offset + 11]] + byteToHex[arr2[offset + 12]] + byteToHex[arr2[offset + 13]] + byteToHex[arr2[offset + 14]] + byteToHex[arr2[offset + 15]]).toLowerCase();
  }
  function stringify2(arr2, offset = 0) {
    const uuid2 = unsafeStringify(arr2, offset);
    if (!(0, _validate.default)(uuid2)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid2;
  }
  stringify$1.default = stringify2;
  return stringify$1;
}
var v1 = {};
var rng = {};
var hasRequiredRng;
function requireRng() {
  if (hasRequiredRng) return rng;
  hasRequiredRng = 1;
  Object.defineProperty(rng, "__esModule", {
    value: true
  });
  rng.default = rng$1;
  var _nodeCrypto = _interopRequireDefault(require$$0);
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  const rnds8Pool = new Uint8Array(256);
  let poolPtr = rnds8Pool.length;
  function rng$1() {
    if (poolPtr > rnds8Pool.length - 16) {
      _nodeCrypto.default.randomFillSync(rnds8Pool);
      poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  }
  return rng;
}
var hasRequiredV1;
function requireV1() {
  if (hasRequiredV1) return v1;
  hasRequiredV1 = 1;
  Object.defineProperty(v1, "__esModule", {
    value: true
  });
  v1.default = void 0;
  var _rng = _interopRequireDefault(/* @__PURE__ */ requireRng());
  var _stringify = /* @__PURE__ */ requireStringify();
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  let _nodeId;
  let _clockseq;
  let _lastMSecs = 0;
  let _lastNSecs = 0;
  function v1$1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node;
    let clockseq = options.clockseq;
    if (!options._v6) {
      if (!node) {
        node = _nodeId;
      }
      if (clockseq == null) {
        clockseq = _clockseq;
      }
    }
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || _rng.default)();
      if (node == null) {
        node = [seedBytes[0], seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        if (!_nodeId && !options._v6) {
          node[0] |= 1;
          _nodeId = node;
        }
      }
      if (clockseq == null) {
        clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        if (_clockseq === void 0 && !options._v6) {
          _clockseq = clockseq;
        }
      }
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === void 0) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 122192928e5;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || (0, _stringify.unsafeStringify)(b);
  }
  v1.default = v1$1;
  return v1;
}
var v1ToV6 = {};
var hasRequiredV1ToV6;
function requireV1ToV6() {
  if (hasRequiredV1ToV6) return v1ToV6;
  hasRequiredV1ToV6 = 1;
  Object.defineProperty(v1ToV6, "__esModule", {
    value: true
  });
  v1ToV6.default = v1ToV6$1;
  var _parse = _interopRequireDefault(/* @__PURE__ */ requireParse$1());
  var _stringify = /* @__PURE__ */ requireStringify();
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function v1ToV6$1(uuid2) {
    const v1Bytes = typeof uuid2 === "string" ? (0, _parse.default)(uuid2) : uuid2;
    const v6Bytes = _v1ToV6(v1Bytes);
    return typeof uuid2 === "string" ? (0, _stringify.unsafeStringify)(v6Bytes) : v6Bytes;
  }
  function _v1ToV6(v1Bytes, randomize = false) {
    return Uint8Array.of((v1Bytes[6] & 15) << 4 | v1Bytes[7] >> 4 & 15, (v1Bytes[7] & 15) << 4 | (v1Bytes[4] & 240) >> 4, (v1Bytes[4] & 15) << 4 | (v1Bytes[5] & 240) >> 4, (v1Bytes[5] & 15) << 4 | (v1Bytes[0] & 240) >> 4, (v1Bytes[0] & 15) << 4 | (v1Bytes[1] & 240) >> 4, (v1Bytes[1] & 15) << 4 | (v1Bytes[2] & 240) >> 4, 96 | v1Bytes[2] & 15, v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
  }
  return v1ToV6;
}
var v3 = {};
var v35 = {};
var hasRequiredV35;
function requireV35() {
  if (hasRequiredV35) return v35;
  hasRequiredV35 = 1;
  Object.defineProperty(v35, "__esModule", {
    value: true
  });
  v35.URL = v35.DNS = void 0;
  v35.default = v35$1;
  var _stringify = /* @__PURE__ */ requireStringify();
  var _parse = _interopRequireDefault(/* @__PURE__ */ requireParse$1());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }
  const DNS = v35.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  const URL2 = v35.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  function v35$1(name, version2, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      var _namespace;
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (typeof namespace === "string") {
        namespace = (0, _parse.default)(namespace);
      }
      if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes = new Uint8Array(16 + value.length);
      bytes.set(namespace);
      bytes.set(value, namespace.length);
      bytes = hashfunc(bytes);
      bytes[6] = bytes[6] & 15 | version2;
      bytes[8] = bytes[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = bytes[i];
        }
        return buf;
      }
      return (0, _stringify.unsafeStringify)(bytes);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL2;
    return generateUUID;
  }
  return v35;
}
var md5 = {};
var hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5;
  hasRequiredMd5 = 1;
  Object.defineProperty(md5, "__esModule", {
    value: true
  });
  md5.default = void 0;
  var _nodeCrypto = _interopRequireDefault(require$$0);
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function md5$1(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return _nodeCrypto.default.createHash("md5").update(bytes).digest();
  }
  md5.default = md5$1;
  return md5;
}
var hasRequiredV3;
function requireV3() {
  if (hasRequiredV3) return v3;
  hasRequiredV3 = 1;
  Object.defineProperty(v3, "__esModule", {
    value: true
  });
  v3.default = void 0;
  var _v = _interopRequireDefault(/* @__PURE__ */ requireV35());
  var _md = _interopRequireDefault(/* @__PURE__ */ requireMd5());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  const v3$1 = (0, _v.default)("v3", 48, _md.default);
  v3.default = v3$1;
  return v3;
}
var v4$1 = {};
var native = {};
var hasRequiredNative;
function requireNative() {
  if (hasRequiredNative) return native;
  hasRequiredNative = 1;
  Object.defineProperty(native, "__esModule", {
    value: true
  });
  native.default = void 0;
  var _nodeCrypto = _interopRequireDefault(require$$0);
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  native.default = {
    randomUUID: _nodeCrypto.default.randomUUID
  };
  return native;
}
var hasRequiredV4;
function requireV4() {
  if (hasRequiredV4) return v4$1;
  hasRequiredV4 = 1;
  Object.defineProperty(v4$1, "__esModule", {
    value: true
  });
  v4$1.default = void 0;
  var _native = _interopRequireDefault(/* @__PURE__ */ requireNative());
  var _rng = _interopRequireDefault(/* @__PURE__ */ requireRng());
  var _stringify = /* @__PURE__ */ requireStringify();
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function v42(options, buf, offset) {
    if (_native.default.randomUUID && !buf && !options) {
      return _native.default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || _rng.default)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return (0, _stringify.unsafeStringify)(rnds);
  }
  v4$1.default = v42;
  return v4$1;
}
var v5 = {};
var sha1 = {};
var hasRequiredSha1;
function requireSha1() {
  if (hasRequiredSha1) return sha1;
  hasRequiredSha1 = 1;
  Object.defineProperty(sha1, "__esModule", {
    value: true
  });
  sha1.default = void 0;
  var _nodeCrypto = _interopRequireDefault(require$$0);
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function sha1$1(bytes) {
    if (Array.isArray(bytes)) {
      bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
      bytes = Buffer.from(bytes, "utf8");
    }
    return _nodeCrypto.default.createHash("sha1").update(bytes).digest();
  }
  sha1.default = sha1$1;
  return sha1;
}
var hasRequiredV5;
function requireV5() {
  if (hasRequiredV5) return v5;
  hasRequiredV5 = 1;
  Object.defineProperty(v5, "__esModule", {
    value: true
  });
  v5.default = void 0;
  var _v = _interopRequireDefault(/* @__PURE__ */ requireV35());
  var _sha = _interopRequireDefault(/* @__PURE__ */ requireSha1());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  const v5$1 = (0, _v.default)("v5", 80, _sha.default);
  v5.default = v5$1;
  return v5;
}
var v6 = {};
var hasRequiredV6;
function requireV6() {
  if (hasRequiredV6) return v6;
  hasRequiredV6 = 1;
  Object.defineProperty(v6, "__esModule", {
    value: true
  });
  v6.default = v6$1;
  var _stringify = /* @__PURE__ */ requireStringify();
  var _v = _interopRequireDefault(/* @__PURE__ */ requireV1());
  var _v1ToV = _interopRequireDefault(/* @__PURE__ */ requireV1ToV6());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function v6$1(options = {}, buf, offset = 0) {
    let bytes = (0, _v.default)({
      ...options,
      _v6: true
    }, new Uint8Array(16));
    bytes = (0, _v1ToV.default)(bytes);
    if (buf) {
      for (let i = 0; i < 16; i++) {
        buf[offset + i] = bytes[i];
      }
      return buf;
    }
    return (0, _stringify.unsafeStringify)(bytes);
  }
  return v6;
}
var v6ToV1 = {};
var hasRequiredV6ToV1;
function requireV6ToV1() {
  if (hasRequiredV6ToV1) return v6ToV1;
  hasRequiredV6ToV1 = 1;
  Object.defineProperty(v6ToV1, "__esModule", {
    value: true
  });
  v6ToV1.default = v6ToV1$1;
  var _parse = _interopRequireDefault(/* @__PURE__ */ requireParse$1());
  var _stringify = /* @__PURE__ */ requireStringify();
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function v6ToV1$1(uuid2) {
    const v6Bytes = typeof uuid2 === "string" ? (0, _parse.default)(uuid2) : uuid2;
    const v1Bytes = _v6ToV1(v6Bytes);
    return typeof uuid2 === "string" ? (0, _stringify.unsafeStringify)(v1Bytes) : v1Bytes;
  }
  function _v6ToV1(v6Bytes) {
    return Uint8Array.of((v6Bytes[3] & 15) << 4 | v6Bytes[4] >> 4 & 15, (v6Bytes[4] & 15) << 4 | (v6Bytes[5] & 240) >> 4, (v6Bytes[5] & 15) << 4 | v6Bytes[6] & 15, v6Bytes[7], (v6Bytes[1] & 15) << 4 | (v6Bytes[2] & 240) >> 4, (v6Bytes[2] & 15) << 4 | (v6Bytes[3] & 240) >> 4, 16 | (v6Bytes[0] & 240) >> 4, (v6Bytes[0] & 15) << 4 | (v6Bytes[1] & 240) >> 4, v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
  }
  return v6ToV1;
}
var v7 = {};
var hasRequiredV7;
function requireV7() {
  if (hasRequiredV7) return v7;
  hasRequiredV7 = 1;
  Object.defineProperty(v7, "__esModule", {
    value: true
  });
  v7.default = void 0;
  var _rng = _interopRequireDefault(/* @__PURE__ */ requireRng());
  var _stringify = /* @__PURE__ */ requireStringify();
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  let _seqLow = null;
  let _seqHigh = null;
  let _msecs = 0;
  function v7$1(options, buf, offset) {
    options = options || {};
    let i = buf && offset || 0;
    const b = buf || new Uint8Array(16);
    const rnds = options.random || (options.rng || _rng.default)();
    const msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let seq = options.seq !== void 0 ? options.seq : null;
    let seqHigh = _seqHigh;
    let seqLow = _seqLow;
    if (msecs > _msecs && options.msecs === void 0) {
      _msecs = msecs;
      if (seq !== null) {
        seqHigh = null;
        seqLow = null;
      }
    }
    if (seq !== null) {
      if (seq > 2147483647) {
        seq = 2147483647;
      }
      seqHigh = seq >>> 19 & 4095;
      seqLow = seq & 524287;
    }
    if (seqHigh === null || seqLow === null) {
      seqHigh = rnds[6] & 127;
      seqHigh = seqHigh << 8 | rnds[7];
      seqLow = rnds[8] & 63;
      seqLow = seqLow << 8 | rnds[9];
      seqLow = seqLow << 5 | rnds[10] >>> 3;
    }
    if (msecs + 1e4 > _msecs && seq === null) {
      if (++seqLow > 524287) {
        seqLow = 0;
        if (++seqHigh > 4095) {
          seqHigh = 0;
          _msecs++;
        }
      }
    } else {
      _msecs = msecs;
    }
    _seqHigh = seqHigh;
    _seqLow = seqLow;
    b[i++] = _msecs / 1099511627776 & 255;
    b[i++] = _msecs / 4294967296 & 255;
    b[i++] = _msecs / 16777216 & 255;
    b[i++] = _msecs / 65536 & 255;
    b[i++] = _msecs / 256 & 255;
    b[i++] = _msecs & 255;
    b[i++] = seqHigh >>> 4 & 15 | 112;
    b[i++] = seqHigh & 255;
    b[i++] = seqLow >>> 13 & 63 | 128;
    b[i++] = seqLow >>> 5 & 255;
    b[i++] = seqLow << 3 & 255 | rnds[10] & 7;
    b[i++] = rnds[11];
    b[i++] = rnds[12];
    b[i++] = rnds[13];
    b[i++] = rnds[14];
    b[i++] = rnds[15];
    return buf || (0, _stringify.unsafeStringify)(b);
  }
  v7.default = v7$1;
  return v7;
}
var version = {};
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version;
  hasRequiredVersion = 1;
  Object.defineProperty(version, "__esModule", {
    value: true
  });
  version.default = void 0;
  var _validate = _interopRequireDefault(/* @__PURE__ */ requireValidate());
  function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function version$1(uuid2) {
    if (!(0, _validate.default)(uuid2)) {
      throw TypeError("Invalid UUID");
    }
    return parseInt(uuid2.slice(14, 15), 16);
  }
  version.default = version$1;
  return version;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", {
      value: true
    });
    Object.defineProperty(exports$1, "MAX", {
      enumerable: true,
      get: function() {
        return _max.default;
      }
    });
    Object.defineProperty(exports$1, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports$1, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    Object.defineProperty(exports$1, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports$1, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports$1, "v1ToV6", {
      enumerable: true,
      get: function() {
        return _v1ToV.default;
      }
    });
    Object.defineProperty(exports$1, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports$1, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports$1, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports$1, "v6", {
      enumerable: true,
      get: function() {
        return _v5.default;
      }
    });
    Object.defineProperty(exports$1, "v6ToV1", {
      enumerable: true,
      get: function() {
        return _v6ToV.default;
      }
    });
    Object.defineProperty(exports$1, "v7", {
      enumerable: true,
      get: function() {
        return _v6.default;
      }
    });
    Object.defineProperty(exports$1, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports$1, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    var _max = _interopRequireDefault(/* @__PURE__ */ requireMax());
    var _nil = _interopRequireDefault(/* @__PURE__ */ requireNil());
    var _parse = _interopRequireDefault(/* @__PURE__ */ requireParse$1());
    var _stringify = _interopRequireDefault(/* @__PURE__ */ requireStringify());
    var _v = _interopRequireDefault(/* @__PURE__ */ requireV1());
    var _v1ToV = _interopRequireDefault(/* @__PURE__ */ requireV1ToV6());
    var _v2 = _interopRequireDefault(/* @__PURE__ */ requireV3());
    var _v3 = _interopRequireDefault(/* @__PURE__ */ requireV4());
    var _v4 = _interopRequireDefault(/* @__PURE__ */ requireV5());
    var _v5 = _interopRequireDefault(/* @__PURE__ */ requireV6());
    var _v6ToV = _interopRequireDefault(/* @__PURE__ */ requireV6ToV1());
    var _v6 = _interopRequireDefault(/* @__PURE__ */ requireV7());
    var _validate = _interopRequireDefault(/* @__PURE__ */ requireValidate());
    var _version = _interopRequireDefault(/* @__PURE__ */ requireVersion());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
  })(dist);
  return dist;
}
var distExports = /* @__PURE__ */ requireDist();
const uuid = /* @__PURE__ */ getDefaultExportFromCjs(distExports);
uuid.v1;
uuid.v1ToV6;
uuid.v3;
const v4 = uuid.v4;
uuid.v5;
uuid.v6;
uuid.v6ToV1;
uuid.v7;
uuid.NIL;
uuid.MAX;
uuid.version;
const validate$1 = uuid.validate;
uuid.stringify;
uuid.parse;
const DEFAULT_FETCH_IMPLEMENTATION = (...args) => fetch(...args);
const LANGSMITH_FETCH_IMPLEMENTATION_KEY = Symbol.for("ls:fetch_implementation");
const _getFetchImplementation = () => {
  return globalThis[LANGSMITH_FETCH_IMPLEMENTATION_KEY] ?? DEFAULT_FETCH_IMPLEMENTATION;
};
const STATUS_NO_RETRY$1 = [
  400,
  // Bad Request
  401,
  // Unauthorized
  403,
  // Forbidden
  404,
  // Not Found
  405,
  // Method Not Allowed
  406,
  // Not Acceptable
  407,
  // Proxy Authentication Required
  408
  // Request Timeout
];
const STATUS_IGNORE = [
  409
  // Conflict
];
let AsyncCaller$1 = class AsyncCaller {
  constructor(params) {
    Object.defineProperty(this, "maxConcurrency", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxRetries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "queue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "onFailedResponseHook", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxConcurrency = params.maxConcurrency ?? Infinity;
    this.maxRetries = params.maxRetries ?? 6;
    if ("default" in PQueueMod) {
      this.queue = new PQueueMod.default({
        concurrency: this.maxConcurrency
      });
    } else {
      this.queue = new PQueueMod({ concurrency: this.maxConcurrency });
    }
    this.onFailedResponseHook = params == null ? void 0 : params.onFailedResponseHook;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call(callable, ...args) {
    const onFailedResponseHook = this.onFailedResponseHook;
    return this.queue.add(() => pRetry(() => callable(...args).catch((error) => {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error);
      }
    }), {
      async onFailedAttempt(error) {
        if (error.message.startsWith("Cancel") || error.message.startsWith("TimeoutError") || error.message.startsWith("AbortError")) {
          throw error;
        }
        if ((error == null ? void 0 : error.code) === "ECONNABORTED") {
          throw error;
        }
        const response = error == null ? void 0 : error.response;
        const status = response == null ? void 0 : response.status;
        if (status) {
          if (STATUS_NO_RETRY$1.includes(+status)) {
            throw error;
          } else if (STATUS_IGNORE.includes(+status)) {
            return;
          }
          if (onFailedResponseHook) {
            await onFailedResponseHook(response);
          }
        }
      },
      // If needed we can change some of the defaults here,
      // but they're quite sensible.
      retries: this.maxRetries,
      randomize: true
    }), { throwOnTimeout: true });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callWithOptions(options, callable, ...args) {
    if (options.signal) {
      return Promise.race([
        this.call(callable, ...args),
        new Promise((_, reject) => {
          var _a;
          (_a = options.signal) == null ? void 0 : _a.addEventListener("abort", () => {
            reject(new Error("AbortError"));
          });
        })
      ]);
    }
    return this.call(callable, ...args);
  }
  fetch(...args) {
    return this.call(() => _getFetchImplementation()(...args).then((res) => res.ok ? res : Promise.reject(res)));
  }
};
function isLangChainMessage(message) {
  return typeof (message == null ? void 0 : message._getType) === "function";
}
function convertLangChainMessageToExample(message) {
  const converted = {
    type: message._getType(),
    data: { content: message.content }
  };
  if ((message == null ? void 0 : message.additional_kwargs) && Object.keys(message.additional_kwargs).length > 0) {
    converted.data.additional_kwargs = { ...message.additional_kwargs };
  }
  return converted;
}
function assertUuid(str, which) {
  if (!validate$1(str)) {
    const msg = which !== void 0 ? `Invalid UUID for ${which}: ${str}` : `Invalid UUID: ${str}`;
    throw new Error(msg);
  }
  return str;
}
const warnedMessages = {};
function warnOnce(message) {
  if (!warnedMessages[message]) {
    console.warn(message);
    warnedMessages[message] = true;
  }
}
var re = { exports: {} };
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const SEMVER_SPEC_VERSION = "2.0.0";
  const MAX_LENGTH = 256;
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991;
  const MAX_SAFE_COMPONENT_LENGTH = 16;
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  constants = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
  return constants;
}
var debug_1;
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug_1;
  hasRequiredDebug = 1;
  const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
  };
  debug_1 = debug;
  return debug_1;
}
var hasRequiredRe;
function requireRe() {
  if (hasRequiredRe) return re.exports;
  hasRequiredRe = 1;
  (function(module, exports$1) {
    const {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = requireConstants();
    const debug = requireDebug();
    exports$1 = module.exports = {};
    const re2 = exports$1.re = [];
    const safeRe = exports$1.safeRe = [];
    const src = exports$1.src = [];
    const safeSrc = exports$1.safeSrc = [];
    const t = exports$1.t = {};
    let R = 0;
    const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    const safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    const makeSafeRegex = (value) => {
      for (const [token, max2] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max2}}`).split(`${token}+`).join(`${token}{1,${max2}}`);
      }
      return value;
    };
    const createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports$1.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports$1.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports$1.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(re, re.exports);
  return re.exports;
}
var parseOptions_1;
var hasRequiredParseOptions;
function requireParseOptions() {
  if (hasRequiredParseOptions) return parseOptions_1;
  hasRequiredParseOptions = 1;
  const looseOption = Object.freeze({ loose: true });
  const emptyOpts = Object.freeze({});
  const parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  parseOptions_1 = parseOptions;
  return parseOptions_1;
}
var identifiers;
var hasRequiredIdentifiers;
function requireIdentifiers() {
  if (hasRequiredIdentifiers) return identifiers;
  hasRequiredIdentifiers = 1;
  const numeric = /^[0-9]+$/;
  const compareIdentifiers = (a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };
  const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
  identifiers = {
    compareIdentifiers,
    rcompareIdentifiers
  };
  return identifiers;
}
var semver$1;
var hasRequiredSemver$1;
function requireSemver$1() {
  if (hasRequiredSemver$1) return semver$1;
  hasRequiredSemver$1 = 1;
  const debug = requireDebug();
  const { MAX_LENGTH, MAX_SAFE_INTEGER } = requireConstants();
  const { safeRe: re2, t } = requireRe();
  const parseOptions = requireParseOptions();
  const { compareIdentifiers } = requireIdentifiers();
  class SemVer {
    constructor(version2, options) {
      options = parseOptions(options);
      if (version2 instanceof SemVer) {
        if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
          return version2;
        } else {
          version2 = version2.version;
        }
      } else if (typeof version2 !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
      }
      if (version2.length > MAX_LENGTH) {
        throw new TypeError(
          `version is longer than ${MAX_LENGTH} characters`
        );
      }
      debug("SemVer", version2, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m = version2.trim().match(options.loose ? re2[t.LOOSE] : re2[t.FULL]);
      if (!m) {
        throw new TypeError(`Invalid Version: ${version2}`);
      }
      this.raw = version2;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.major < other.major) {
        return -1;
      }
      if (this.major > other.major) {
        return 1;
      }
      if (this.minor < other.minor) {
        return -1;
      }
      if (this.minor > other.minor) {
        return 1;
      }
      if (this.patch < other.patch) {
        return -1;
      }
      if (this.patch > other.patch) {
        return 1;
      }
      return 0;
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug("prerelease compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        debug("build compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (identifier) {
          const match = `-${identifier}`.match(this.options.loose ? re2[t.PRERELEASELOOSE] : re2[t.PRERELEASE]);
          if (!match || match[1] !== identifier) {
            throw new Error(`invalid identifier: ${identifier}`);
          }
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  semver$1 = SemVer;
  return semver$1;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  const SemVer = requireSemver$1();
  const parse2 = (version2, options, throwErrors = false) => {
    if (version2 instanceof SemVer) {
      return version2;
    }
    try {
      return new SemVer(version2, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  parse_1 = parse2;
  return parse_1;
}
var valid_1;
var hasRequiredValid$1;
function requireValid$1() {
  if (hasRequiredValid$1) return valid_1;
  hasRequiredValid$1 = 1;
  const parse2 = requireParse();
  const valid2 = (version2, options) => {
    const v = parse2(version2, options);
    return v ? v.version : null;
  };
  valid_1 = valid2;
  return valid_1;
}
var clean_1;
var hasRequiredClean;
function requireClean() {
  if (hasRequiredClean) return clean_1;
  hasRequiredClean = 1;
  const parse2 = requireParse();
  const clean = (version2, options) => {
    const s = parse2(version2.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  };
  clean_1 = clean;
  return clean_1;
}
var inc_1;
var hasRequiredInc;
function requireInc() {
  if (hasRequiredInc) return inc_1;
  hasRequiredInc = 1;
  const SemVer = requireSemver$1();
  const inc = (version2, release, options, identifier, identifierBase) => {
    if (typeof options === "string") {
      identifierBase = identifier;
      identifier = options;
      options = void 0;
    }
    try {
      return new SemVer(
        version2 instanceof SemVer ? version2.version : version2,
        options
      ).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  inc_1 = inc;
  return inc_1;
}
var diff_1;
var hasRequiredDiff;
function requireDiff() {
  if (hasRequiredDiff) return diff_1;
  hasRequiredDiff = 1;
  const parse2 = requireParse();
  const diff = (version1, version2) => {
    const v12 = parse2(version1, null, true);
    const v2 = parse2(version2, null, true);
    const comparison = v12.compare(v2);
    if (comparison === 0) {
      return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v12 : v2;
    const lowVersion = v1Higher ? v2 : v12;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor) {
        return "major";
      }
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch) {
          return "minor";
        }
        return "patch";
      }
    }
    const prefix = highHasPre ? "pre" : "";
    if (v12.major !== v2.major) {
      return prefix + "major";
    }
    if (v12.minor !== v2.minor) {
      return prefix + "minor";
    }
    if (v12.patch !== v2.patch) {
      return prefix + "patch";
    }
    return "prerelease";
  };
  diff_1 = diff;
  return diff_1;
}
var major_1;
var hasRequiredMajor;
function requireMajor() {
  if (hasRequiredMajor) return major_1;
  hasRequiredMajor = 1;
  const SemVer = requireSemver$1();
  const major = (a, loose) => new SemVer(a, loose).major;
  major_1 = major;
  return major_1;
}
var minor_1;
var hasRequiredMinor;
function requireMinor() {
  if (hasRequiredMinor) return minor_1;
  hasRequiredMinor = 1;
  const SemVer = requireSemver$1();
  const minor = (a, loose) => new SemVer(a, loose).minor;
  minor_1 = minor;
  return minor_1;
}
var patch_1;
var hasRequiredPatch;
function requirePatch() {
  if (hasRequiredPatch) return patch_1;
  hasRequiredPatch = 1;
  const SemVer = requireSemver$1();
  const patch = (a, loose) => new SemVer(a, loose).patch;
  patch_1 = patch;
  return patch_1;
}
var prerelease_1;
var hasRequiredPrerelease;
function requirePrerelease() {
  if (hasRequiredPrerelease) return prerelease_1;
  hasRequiredPrerelease = 1;
  const parse2 = requireParse();
  const prerelease = (version2, options) => {
    const parsed = parse2(version2, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  prerelease_1 = prerelease;
  return prerelease_1;
}
var compare_1;
var hasRequiredCompare;
function requireCompare() {
  if (hasRequiredCompare) return compare_1;
  hasRequiredCompare = 1;
  const SemVer = requireSemver$1();
  const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
  compare_1 = compare;
  return compare_1;
}
var rcompare_1;
var hasRequiredRcompare;
function requireRcompare() {
  if (hasRequiredRcompare) return rcompare_1;
  hasRequiredRcompare = 1;
  const compare = requireCompare();
  const rcompare = (a, b, loose) => compare(b, a, loose);
  rcompare_1 = rcompare;
  return rcompare_1;
}
var compareLoose_1;
var hasRequiredCompareLoose;
function requireCompareLoose() {
  if (hasRequiredCompareLoose) return compareLoose_1;
  hasRequiredCompareLoose = 1;
  const compare = requireCompare();
  const compareLoose = (a, b) => compare(a, b, true);
  compareLoose_1 = compareLoose;
  return compareLoose_1;
}
var compareBuild_1;
var hasRequiredCompareBuild;
function requireCompareBuild() {
  if (hasRequiredCompareBuild) return compareBuild_1;
  hasRequiredCompareBuild = 1;
  const SemVer = requireSemver$1();
  const compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  compareBuild_1 = compareBuild;
  return compareBuild_1;
}
var sort_1;
var hasRequiredSort;
function requireSort() {
  if (hasRequiredSort) return sort_1;
  hasRequiredSort = 1;
  const compareBuild = requireCompareBuild();
  const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  sort_1 = sort;
  return sort_1;
}
var rsort_1;
var hasRequiredRsort;
function requireRsort() {
  if (hasRequiredRsort) return rsort_1;
  hasRequiredRsort = 1;
  const compareBuild = requireCompareBuild();
  const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  rsort_1 = rsort;
  return rsort_1;
}
var gt_1;
var hasRequiredGt;
function requireGt() {
  if (hasRequiredGt) return gt_1;
  hasRequiredGt = 1;
  const compare = requireCompare();
  const gt = (a, b, loose) => compare(a, b, loose) > 0;
  gt_1 = gt;
  return gt_1;
}
var lt_1;
var hasRequiredLt;
function requireLt() {
  if (hasRequiredLt) return lt_1;
  hasRequiredLt = 1;
  const compare = requireCompare();
  const lt = (a, b, loose) => compare(a, b, loose) < 0;
  lt_1 = lt;
  return lt_1;
}
var eq_1;
var hasRequiredEq;
function requireEq() {
  if (hasRequiredEq) return eq_1;
  hasRequiredEq = 1;
  const compare = requireCompare();
  const eq = (a, b, loose) => compare(a, b, loose) === 0;
  eq_1 = eq;
  return eq_1;
}
var neq_1;
var hasRequiredNeq;
function requireNeq() {
  if (hasRequiredNeq) return neq_1;
  hasRequiredNeq = 1;
  const compare = requireCompare();
  const neq = (a, b, loose) => compare(a, b, loose) !== 0;
  neq_1 = neq;
  return neq_1;
}
var gte_1;
var hasRequiredGte;
function requireGte() {
  if (hasRequiredGte) return gte_1;
  hasRequiredGte = 1;
  const compare = requireCompare();
  const gte = (a, b, loose) => compare(a, b, loose) >= 0;
  gte_1 = gte;
  return gte_1;
}
var lte_1;
var hasRequiredLte;
function requireLte() {
  if (hasRequiredLte) return lte_1;
  hasRequiredLte = 1;
  const compare = requireCompare();
  const lte = (a, b, loose) => compare(a, b, loose) <= 0;
  lte_1 = lte;
  return lte_1;
}
var cmp_1;
var hasRequiredCmp;
function requireCmp() {
  if (hasRequiredCmp) return cmp_1;
  hasRequiredCmp = 1;
  const eq = requireEq();
  const neq = requireNeq();
  const gt = requireGt();
  const gte = requireGte();
  const lt = requireLt();
  const lte = requireLte();
  const cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a === b;
      case "!==":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError(`Invalid operator: ${op}`);
    }
  };
  cmp_1 = cmp;
  return cmp_1;
}
var coerce_1;
var hasRequiredCoerce;
function requireCoerce() {
  if (hasRequiredCoerce) return coerce_1;
  hasRequiredCoerce = 1;
  const SemVer = requireSemver$1();
  const parse2 = requireParse();
  const { safeRe: re2, t } = requireRe();
  const coerce = (version2, options) => {
    if (version2 instanceof SemVer) {
      return version2;
    }
    if (typeof version2 === "number") {
      version2 = String(version2);
    }
    if (typeof version2 !== "string") {
      return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
      match = version2.match(options.includePrerelease ? re2[t.COERCEFULL] : re2[t.COERCE]);
    } else {
      const coerceRtlRegex = options.includePrerelease ? re2[t.COERCERTLFULL] : re2[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
      return null;
    }
    const major = match[2];
    const minor = match[3] || "0";
    const patch = match[4] || "0";
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
    return parse2(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  coerce_1 = coerce;
  return coerce_1;
}
var lrucache;
var hasRequiredLrucache;
function requireLrucache() {
  if (hasRequiredLrucache) return lrucache;
  hasRequiredLrucache = 1;
  class LRUCache {
    constructor() {
      this.max = 1e3;
      this.map = /* @__PURE__ */ new Map();
    }
    get(key) {
      const value = this.map.get(key);
      if (value === void 0) {
        return void 0;
      } else {
        this.map.delete(key);
        this.map.set(key, value);
        return value;
      }
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      const deleted = this.delete(key);
      if (!deleted && value !== void 0) {
        if (this.map.size >= this.max) {
          const firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  lrucache = LRUCache;
  return lrucache;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range {
    constructor(range2, options) {
      options = parseOptions(options);
      if (range2 instanceof Range) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t.HYPHENRANGELOOSE] : re2[t.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug("hyphen replace", range2);
      range2 = range2.replace(re2[t.COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range2);
      range2 = range2.replace(re2[t.TILDETRIM], tildeTrimReplace);
      debug("tilde trim", range2);
      range2 = range2.replace(re2[t.CARETTRIM], caretTrimReplace);
      debug("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t.COMPARATORLOOSE]);
        });
      }
      debug("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version2) {
      if (!version2) {
        return false;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version2, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range;
  const LRU = requireLrucache();
  const cache = new LRU();
  const parseOptions = requireParseOptions();
  const Comparator = requireComparator();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const {
    safeRe: re2,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = requireRe();
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = requireConstants();
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    comp = comp.replace(re2[t.BUILD], "");
    debug("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug("caret", comp);
    comp = replaceTildes(comp, options);
    debug("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug("xrange", comp);
    comp = replaceStars(comp, options);
    debug("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t.TILDELOOSE] : re2[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("tilde", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug("caret", comp, options);
    const r = options.loose ? re2[t.CARETLOOSE] : re2[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("caret", comp, _, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t.XRANGELOOSE] : re2[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug("replaceStars", comp, options);
    return comp.trim().replace(re2[t.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from = `>=${from}`;
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from} ${to}`.trim();
  };
  const testSet = (set, version2, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version2)) {
        return false;
      }
    }
    if (version2.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug(set[i].semver);
        if (set[i].semver === Comparator.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY = Symbol("SemVer ANY");
  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      options = parseOptions(options);
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t.COMPARATORLOOSE] : re2[t.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version2) {
      debug("Comparator.test", version2, this.options.loose);
      if (this.semver === ANY || version2 === ANY) {
        return true;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version2, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator;
  const parseOptions = requireParseOptions();
  const { safeRe: re2, t } = requireRe();
  const cmp = requireCmp();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const Range = requireRange();
  return comparator;
}
var satisfies_1;
var hasRequiredSatisfies;
function requireSatisfies() {
  if (hasRequiredSatisfies) return satisfies_1;
  hasRequiredSatisfies = 1;
  const Range = requireRange();
  const satisfies = (version2, range2, options) => {
    try {
      range2 = new Range(range2, options);
    } catch (er) {
      return false;
    }
    return range2.test(version2);
  };
  satisfies_1 = satisfies;
  return satisfies_1;
}
var toComparators_1;
var hasRequiredToComparators;
function requireToComparators() {
  if (hasRequiredToComparators) return toComparators_1;
  hasRequiredToComparators = 1;
  const Range = requireRange();
  const toComparators = (range2, options) => new Range(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
  toComparators_1 = toComparators;
  return toComparators_1;
}
var maxSatisfying_1;
var hasRequiredMaxSatisfying;
function requireMaxSatisfying() {
  if (hasRequiredMaxSatisfying) return maxSatisfying_1;
  hasRequiredMaxSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const maxSatisfying = (versions, range2, options) => {
    let max2 = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max2 || maxSV.compare(v) === -1) {
          max2 = v;
          maxSV = new SemVer(max2, options);
        }
      }
    });
    return max2;
  };
  maxSatisfying_1 = maxSatisfying;
  return maxSatisfying_1;
}
var minSatisfying_1;
var hasRequiredMinSatisfying;
function requireMinSatisfying() {
  if (hasRequiredMinSatisfying) return minSatisfying_1;
  hasRequiredMinSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const minSatisfying = (versions, range2, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  };
  minSatisfying_1 = minSatisfying;
  return minSatisfying_1;
}
var minVersion_1;
var hasRequiredMinVersion;
function requireMinVersion() {
  if (hasRequiredMinVersion) return minVersion_1;
  hasRequiredMinVersion = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const gt = requireGt();
  const minVersion = (range2, loose) => {
    range2 = new Range(range2, loose);
    let minver = new SemVer("0.0.0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = null;
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let setMin = null;
      comparators.forEach((comparator2) => {
        const compver = new SemVer(comparator2.semver.version);
        switch (comparator2.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          /* fallthrough */
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${comparator2.operator}`);
        }
      });
      if (setMin && (!minver || gt(minver, setMin))) {
        minver = setMin;
      }
    }
    if (minver && range2.test(minver)) {
      return minver;
    }
    return null;
  };
  minVersion_1 = minVersion;
  return minVersion_1;
}
var valid;
var hasRequiredValid;
function requireValid() {
  if (hasRequiredValid) return valid;
  hasRequiredValid = 1;
  const Range = requireRange();
  const validRange = (range2, options) => {
    try {
      return new Range(range2, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  valid = validRange;
  return valid;
}
var outside_1;
var hasRequiredOutside;
function requireOutside() {
  if (hasRequiredOutside) return outside_1;
  hasRequiredOutside = 1;
  const SemVer = requireSemver$1();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const gt = requireGt();
  const lt = requireLt();
  const lte = requireLte();
  const gte = requireGte();
  const outside = (version2, range2, hilo, options) => {
    version2 = new SemVer(version2, options);
    range2 = new Range(range2, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version2, range2, options)) {
      return false;
    }
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator2) => {
        if (comparator2.semver === ANY) {
          comparator2 = new Comparator(">=0.0.0");
        }
        high = high || comparator2;
        low = low || comparator2;
        if (gtfn(comparator2.semver, high.semver, options)) {
          high = comparator2;
        } else if (ltfn(comparator2.semver, low.semver, options)) {
          low = comparator2;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
        return false;
      }
    }
    return true;
  };
  outside_1 = outside;
  return outside_1;
}
var gtr_1;
var hasRequiredGtr;
function requireGtr() {
  if (hasRequiredGtr) return gtr_1;
  hasRequiredGtr = 1;
  const outside = requireOutside();
  const gtr = (version2, range2, options) => outside(version2, range2, ">", options);
  gtr_1 = gtr;
  return gtr_1;
}
var ltr_1;
var hasRequiredLtr;
function requireLtr() {
  if (hasRequiredLtr) return ltr_1;
  hasRequiredLtr = 1;
  const outside = requireOutside();
  const ltr = (version2, range2, options) => outside(version2, range2, "<", options);
  ltr_1 = ltr;
  return ltr_1;
}
var intersects_1;
var hasRequiredIntersects;
function requireIntersects() {
  if (hasRequiredIntersects) return intersects_1;
  hasRequiredIntersects = 1;
  const Range = requireRange();
  const intersects = (r1, r2, options) => {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
  };
  intersects_1 = intersects;
  return intersects_1;
}
var simplify;
var hasRequiredSimplify;
function requireSimplify() {
  if (hasRequiredSimplify) return simplify;
  hasRequiredSimplify = 1;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  simplify = (versions, range2, options) => {
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b) => compare(a, b, options));
    for (const version2 of v) {
      const included = satisfies(version2, range2, options);
      if (included) {
        prev = version2;
        if (!first) {
          first = version2;
        }
      } else {
        if (prev) {
          set.push([first, prev]);
        }
        prev = null;
        first = null;
      }
    }
    if (first) {
      set.push([first, null]);
    }
    const ranges = [];
    for (const [min, max2] of set) {
      if (min === max2) {
        ranges.push(min);
      } else if (!max2 && min === v[0]) {
        ranges.push("*");
      } else if (!max2) {
        ranges.push(`>=${min}`);
      } else if (min === v[0]) {
        ranges.push(`<=${max2}`);
      } else {
        ranges.push(`${min} - ${max2}`);
      }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range2.raw === "string" ? range2.raw : String(range2);
    return simplified.length < original.length ? simplified : range2;
  };
  return simplify;
}
var subset_1;
var hasRequiredSubset;
function requireSubset() {
  if (hasRequiredSubset) return subset_1;
  hasRequiredSubset = 1;
  const Range = requireRange();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  const subset = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options);
        sawNonNull = sawNonNull || isSub !== null;
        if (isSub) {
          continue OUTER;
        }
      }
      if (sawNonNull) {
        return false;
      }
    }
    return true;
  };
  const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
  const minimumVersion = [new Comparator(">=0.0.0")];
  const simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true;
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true;
      } else {
        dom = minimumVersion;
      }
    }
    const eqSet = /* @__PURE__ */ new Set();
    let gt, lt;
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=") {
        gt = higherGT(gt, c, options);
      } else if (c.operator === "<" || c.operator === "<=") {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }
    if (eqSet.size > 1) {
      return null;
    }
    let gtltComp;
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null;
      } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
        return null;
      }
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) {
        return null;
      }
      if (lt && !satisfies(eq, String(lt), options)) {
        return null;
      }
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) {
          return false;
        }
      }
      return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false;
          }
        } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
          return false;
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false;
          }
        } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
          return false;
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false;
      }
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false;
    }
    if (needDomGTPre || needDomLTPre) {
      return false;
    }
    return true;
  };
  const higherGT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
  };
  const lowerLT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
  };
  subset_1 = subset;
  return subset_1;
}
var semver;
var hasRequiredSemver;
function requireSemver() {
  if (hasRequiredSemver) return semver;
  hasRequiredSemver = 1;
  const internalRe = requireRe();
  const constants2 = requireConstants();
  const SemVer = requireSemver$1();
  const identifiers2 = requireIdentifiers();
  const parse2 = requireParse();
  const valid2 = requireValid$1();
  const clean = requireClean();
  const inc = requireInc();
  const diff = requireDiff();
  const major = requireMajor();
  const minor = requireMinor();
  const patch = requirePatch();
  const prerelease = requirePrerelease();
  const compare = requireCompare();
  const rcompare = requireRcompare();
  const compareLoose = requireCompareLoose();
  const compareBuild = requireCompareBuild();
  const sort = requireSort();
  const rsort = requireRsort();
  const gt = requireGt();
  const lt = requireLt();
  const eq = requireEq();
  const neq = requireNeq();
  const gte = requireGte();
  const lte = requireLte();
  const cmp = requireCmp();
  const coerce = requireCoerce();
  const Comparator = requireComparator();
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const toComparators = requireToComparators();
  const maxSatisfying = requireMaxSatisfying();
  const minSatisfying = requireMinSatisfying();
  const minVersion = requireMinVersion();
  const validRange = requireValid();
  const outside = requireOutside();
  const gtr = requireGtr();
  const ltr = requireLtr();
  const intersects = requireIntersects();
  const simplifyRange = requireSimplify();
  const subset = requireSubset();
  semver = {
    parse: parse2,
    valid: valid2,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants2.RELEASE_TYPES,
    compareIdentifiers: identifiers2.compareIdentifiers,
    rcompareIdentifiers: identifiers2.rcompareIdentifiers
  };
  return semver;
}
var semverExports = requireSemver();
function isVersionGreaterOrEqual(current_version, target_version) {
  const current = semverExports.parse(current_version);
  const target = semverExports.parse(target_version);
  if (!current || !target) {
    throw new Error("Invalid version format.");
  }
  return current.compare(target) >= 0;
}
function parsePromptIdentifier(identifier) {
  if (!identifier || identifier.split("/").length > 2 || identifier.startsWith("/") || identifier.endsWith("/") || identifier.split(":").length > 2) {
    throw new Error(`Invalid identifier format: ${identifier}`);
  }
  const [ownerNamePart, commitPart] = identifier.split(":");
  const commit = commitPart || "latest";
  if (ownerNamePart.includes("/")) {
    const [owner, name] = ownerNamePart.split("/", 2);
    if (!owner || !name) {
      throw new Error(`Invalid identifier format: ${identifier}`);
    }
    return [owner, name, commit];
  } else {
    if (!ownerNamePart) {
      throw new Error(`Invalid identifier format: ${identifier}`);
    }
    return ["-", ownerNamePart, commit];
  }
}
class LangSmithConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "LangSmithConflictError";
  }
}
async function raiseForStatus(response, context, consume) {
  let errorBody;
  if (response.ok) {
    if (consume) {
      errorBody = await response.text();
    }
    return;
  }
  errorBody = await response.text();
  const fullMessage = `Failed to ${context}. Received status [${response.status}]: ${response.statusText}. Server response: ${errorBody}`;
  if (response.status === 409) {
    throw new LangSmithConflictError(fullMessage);
  }
  throw new Error(fullMessage);
}
var LIMIT_REPLACE_NODE = "[...]";
var CIRCULAR_REPLACE_NODE = { result: "[Circular]" };
var arr = [];
var replacerStack = [];
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function stringify(obj, replacer, spacer, options) {
  var _a;
  try {
    return JSON.stringify(obj, replacer, spacer);
  } catch (e) {
    if (!((_a = e.message) == null ? void 0 : _a.includes("Converting circular structure to JSON"))) {
      console.warn("[WARNING]: LangSmith received unserializable value.");
      return "[Unserializable]";
    }
    console.warn("[WARNING]: LangSmith received circular JSON. This will decrease tracer performance.");
    if (typeof options === "undefined") {
      options = defaultOptions();
    }
    decirc(obj, "", 0, [], void 0, 0, options);
    var res;
    try {
      if (replacerStack.length === 0) {
        res = JSON.stringify(obj, replacer, spacer);
      } else {
        res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
      }
    } catch (_) {
      return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
    } finally {
      while (arr.length !== 0) {
        var part = arr.pop();
        if (part.length === 4) {
          Object.defineProperty(part[0], part[1], part[3]);
        } else {
          part[0][part[1]] = part[2];
        }
      }
    }
    return res;
  }
}
function setReplace(replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== void 0) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}
function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
    return v;
  };
  return function(key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}
function mergeRuntimeEnvIntoRunCreate(run) {
  const runtimeEnv = getRuntimeEnvironment$1();
  const envVars = getLangChainEnvVarsMetadata();
  const extra = run.extra ?? {};
  const metadata = extra.metadata;
  run.extra = {
    ...extra,
    runtime: {
      ...runtimeEnv,
      ...extra == null ? void 0 : extra.runtime
    },
    metadata: {
      ...envVars,
      ...envVars.revision_id || run.revision_id ? { revision_id: run.revision_id ?? envVars.revision_id } : {},
      ...metadata
    }
  };
  return run;
}
const getTracingSamplingRate = () => {
  const samplingRateStr = getLangSmithEnvironmentVariable("TRACING_SAMPLING_RATE");
  if (samplingRateStr === void 0) {
    return void 0;
  }
  const samplingRate = parseFloat(samplingRateStr);
  if (samplingRate < 0 || samplingRate > 1) {
    throw new Error(`LANGSMITH_TRACING_SAMPLING_RATE must be between 0 and 1 if set. Got: ${samplingRate}`);
  }
  return samplingRate;
};
const isLocalhost = (url) => {
  const strippedUrl = url.replace("http://", "").replace("https://", "");
  const hostname = strippedUrl.split("/")[0].split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};
async function toArray(iterable) {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
function trimQuotes(str) {
  if (str === void 0) {
    return void 0;
  }
  return str.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}
const handle429 = async (response) => {
  if ((response == null ? void 0 : response.status) === 429) {
    const retryAfter = parseInt(response.headers.get("retry-after") ?? "30", 10) * 1e3;
    if (retryAfter > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryAfter));
      return true;
    }
  }
  return false;
};
class Queue {
  constructor() {
    Object.defineProperty(this, "items", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "sizeBytes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
  }
  peek() {
    return this.items[0];
  }
  push(item) {
    let itemPromiseResolve;
    const itemPromise = new Promise((resolve) => {
      itemPromiseResolve = resolve;
    });
    const size = stringify(item.item).length;
    this.items.push({
      action: item.action,
      payload: item.item,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      itemPromiseResolve,
      itemPromise,
      size
    });
    this.sizeBytes += size;
    return itemPromise;
  }
  pop(upToSizeBytes) {
    var _a;
    if (upToSizeBytes < 1) {
      throw new Error("Number of bytes to pop off may not be less than 1.");
    }
    const popped = [];
    let poppedSizeBytes = 0;
    while (poppedSizeBytes + (((_a = this.peek()) == null ? void 0 : _a.size) ?? 0) < upToSizeBytes && this.items.length > 0) {
      const item = this.items.shift();
      if (item) {
        popped.push(item);
        poppedSizeBytes += item.size;
        this.sizeBytes -= item.size;
      }
    }
    if (popped.length === 0 && this.items.length > 0) {
      const item = this.items.shift();
      popped.push(item);
      poppedSizeBytes += item.size;
      this.sizeBytes -= item.size;
    }
    return [
      popped.map((it) => ({ action: it.action, item: it.payload })),
      () => popped.forEach((it) => it.itemPromiseResolve())
    ];
  }
}
const DEFAULT_BATCH_SIZE_LIMIT_BYTES = 20971520;
const SERVER_INFO_REQUEST_TIMEOUT = 1e3;
class Client {
  constructor(config = {}) {
    var _a;
    Object.defineProperty(this, "apiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "apiUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "webUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "caller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "batchIngestCaller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timeout_ms", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_tenantId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
    Object.defineProperty(this, "hideInputs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "hideOutputs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tracingSampleRate", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "filteredPostUuids", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /* @__PURE__ */ new Set()
    });
    Object.defineProperty(this, "autoBatchTracing", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "autoBatchQueue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Queue()
    });
    Object.defineProperty(this, "autoBatchTimeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "autoBatchInitialDelayMs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 250
    });
    Object.defineProperty(this, "autoBatchAggregationDelayMs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 50
    });
    Object.defineProperty(this, "batchSizeBytesLimit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fetchOptions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "settings", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "blockOnRootRunFinalization", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "_serverInfo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_getServerInfoPromise", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    const defaultConfig = Client.getDefaultClientConfig();
    this.tracingSampleRate = getTracingSamplingRate();
    this.apiUrl = trimQuotes(config.apiUrl ?? defaultConfig.apiUrl) ?? "";
    if (this.apiUrl.endsWith("/")) {
      this.apiUrl = this.apiUrl.slice(0, -1);
    }
    this.apiKey = trimQuotes(config.apiKey ?? defaultConfig.apiKey);
    this.webUrl = trimQuotes(config.webUrl ?? defaultConfig.webUrl);
    if ((_a = this.webUrl) == null ? void 0 : _a.endsWith("/")) {
      this.webUrl = this.webUrl.slice(0, -1);
    }
    this.timeout_ms = config.timeout_ms ?? 12e3;
    this.caller = new AsyncCaller$1(config.callerOptions ?? {});
    this.batchIngestCaller = new AsyncCaller$1({
      ...config.callerOptions ?? {},
      onFailedResponseHook: handle429
    });
    this.hideInputs = config.hideInputs ?? config.anonymizer ?? defaultConfig.hideInputs;
    this.hideOutputs = config.hideOutputs ?? config.anonymizer ?? defaultConfig.hideOutputs;
    this.autoBatchTracing = config.autoBatchTracing ?? this.autoBatchTracing;
    this.blockOnRootRunFinalization = config.blockOnRootRunFinalization ?? this.blockOnRootRunFinalization;
    this.batchSizeBytesLimit = config.batchSizeBytesLimit;
    this.fetchOptions = config.fetchOptions || {};
  }
  static getDefaultClientConfig() {
    const apiKey = getLangSmithEnvironmentVariable("API_KEY");
    const apiUrl = getLangSmithEnvironmentVariable("ENDPOINT") ?? "https://api.smith.langchain.com";
    const hideInputs = getLangSmithEnvironmentVariable("HIDE_INPUTS") === "true";
    const hideOutputs = getLangSmithEnvironmentVariable("HIDE_OUTPUTS") === "true";
    return {
      apiUrl,
      apiKey,
      webUrl: void 0,
      hideInputs,
      hideOutputs
    };
  }
  getHostUrl() {
    if (this.webUrl) {
      return this.webUrl;
    } else if (isLocalhost(this.apiUrl)) {
      this.webUrl = "http://localhost:3000";
      return this.webUrl;
    } else if (this.apiUrl.includes("/api") && !this.apiUrl.split(".", 1)[0].endsWith("api")) {
      this.webUrl = this.apiUrl.replace("/api", "");
      return this.webUrl;
    } else if (this.apiUrl.split(".", 1)[0].includes("dev")) {
      this.webUrl = "https://dev.smith.langchain.com";
      return this.webUrl;
    } else if (this.apiUrl.split(".", 1)[0].includes("eu")) {
      this.webUrl = "https://eu.smith.langchain.com";
      return this.webUrl;
    } else {
      this.webUrl = "https://smith.langchain.com";
      return this.webUrl;
    }
  }
  get headers() {
    const headers = {
      "User-Agent": `langsmith-js/${__version__}`
    };
    if (this.apiKey) {
      headers["x-api-key"] = `${this.apiKey}`;
    }
    return headers;
  }
  processInputs(inputs) {
    if (this.hideInputs === false) {
      return inputs;
    }
    if (this.hideInputs === true) {
      return {};
    }
    if (typeof this.hideInputs === "function") {
      return this.hideInputs(inputs);
    }
    return inputs;
  }
  processOutputs(outputs) {
    if (this.hideOutputs === false) {
      return outputs;
    }
    if (this.hideOutputs === true) {
      return {};
    }
    if (typeof this.hideOutputs === "function") {
      return this.hideOutputs(outputs);
    }
    return outputs;
  }
  prepareRunCreateOrUpdateInputs(run) {
    const runParams = { ...run };
    if (runParams.inputs !== void 0) {
      runParams.inputs = this.processInputs(runParams.inputs);
    }
    if (runParams.outputs !== void 0) {
      runParams.outputs = this.processOutputs(runParams.outputs);
    }
    return runParams;
  }
  async _getResponse(path, queryParams) {
    const paramsString = (queryParams == null ? void 0 : queryParams.toString()) ?? "";
    const url = `${this.apiUrl}${path}?${paramsString}`;
    const response = await this.caller.call(_getFetchImplementation(), url, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `Failed to fetch ${path}`);
    return response;
  }
  async _get(path, queryParams) {
    const response = await this._getResponse(path, queryParams);
    return response.json();
  }
  async *_getPaginated(path, queryParams = new URLSearchParams(), transform) {
    let offset = Number(queryParams.get("offset")) || 0;
    const limit = Number(queryParams.get("limit")) || 100;
    while (true) {
      queryParams.set("offset", String(offset));
      queryParams.set("limit", String(limit));
      const url = `${this.apiUrl}${path}?${queryParams}`;
      const response = await this.caller.call(_getFetchImplementation(), url, {
        method: "GET",
        headers: this.headers,
        signal: AbortSignal.timeout(this.timeout_ms),
        ...this.fetchOptions
      });
      await raiseForStatus(response, `Failed to fetch ${path}`);
      const items = transform ? transform(await response.json()) : await response.json();
      if (items.length === 0) {
        break;
      }
      yield items;
      if (items.length < limit) {
        break;
      }
      offset += items.length;
    }
  }
  async *_getCursorPaginatedList(path, body = null, requestMethod = "POST", dataKey = "runs") {
    const bodyParams = body ? { ...body } : {};
    while (true) {
      const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}`, {
        method: requestMethod,
        headers: { ...this.headers, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(this.timeout_ms),
        ...this.fetchOptions,
        body: JSON.stringify(bodyParams)
      });
      const responseBody = await response.json();
      if (!responseBody) {
        break;
      }
      if (!responseBody[dataKey]) {
        break;
      }
      yield responseBody[dataKey];
      const cursors = responseBody.cursors;
      if (!cursors) {
        break;
      }
      if (!cursors.next) {
        break;
      }
      bodyParams.cursor = cursors.next;
    }
  }
  _filterForSampling(runs, patch = false) {
    if (this.tracingSampleRate === void 0) {
      return runs;
    }
    if (patch) {
      const sampled = [];
      for (const run of runs) {
        if (!this.filteredPostUuids.has(run.id)) {
          sampled.push(run);
        } else {
          this.filteredPostUuids.delete(run.id);
        }
      }
      return sampled;
    } else {
      const sampled = [];
      for (const run of runs) {
        if (run.id !== run.trace_id && !this.filteredPostUuids.has(run.trace_id) || Math.random() < this.tracingSampleRate) {
          sampled.push(run);
        } else {
          this.filteredPostUuids.add(run.id);
        }
      }
      return sampled;
    }
  }
  async _getBatchSizeLimitBytes() {
    var _a;
    const serverInfo = await this._ensureServerInfo();
    return this.batchSizeBytesLimit ?? ((_a = serverInfo.batch_ingest_config) == null ? void 0 : _a.size_limit_bytes) ?? DEFAULT_BATCH_SIZE_LIMIT_BYTES;
  }
  async drainAutoBatchQueue() {
    var _a;
    while (this.autoBatchQueue.items.length >= 0) {
      const [batch, done] = this.autoBatchQueue.pop(await this._getBatchSizeLimitBytes());
      if (!batch.length) {
        done();
        return;
      }
      try {
        const ingestParams = {
          runCreates: batch.filter((item) => item.action === "create").map((item) => item.item),
          runUpdates: batch.filter((item) => item.action === "update").map((item) => item.item)
        };
        const serverInfo = await this._ensureServerInfo();
        if ((_a = serverInfo == null ? void 0 : serverInfo.batch_ingest_config) == null ? void 0 : _a.use_multipart_endpoint) {
          await this.multipartIngestRuns(ingestParams);
        } else {
          await this.batchIngestRuns(ingestParams);
        }
      } finally {
        done();
      }
    }
  }
  async processRunOperation(item, immediatelyTriggerBatch) {
    const oldTimeout = this.autoBatchTimeout;
    clearTimeout(this.autoBatchTimeout);
    this.autoBatchTimeout = void 0;
    if (item.action === "create") {
      item.item = mergeRuntimeEnvIntoRunCreate(item.item);
    }
    const itemPromise = this.autoBatchQueue.push(item);
    const sizeLimitBytes = await this._getBatchSizeLimitBytes();
    if (immediatelyTriggerBatch || this.autoBatchQueue.sizeBytes > sizeLimitBytes) {
      await this.drainAutoBatchQueue().catch(console.error);
    }
    if (this.autoBatchQueue.items.length > 0) {
      this.autoBatchTimeout = setTimeout(() => {
        this.autoBatchTimeout = void 0;
        void this.drainAutoBatchQueue().catch(console.error);
      }, oldTimeout ? this.autoBatchAggregationDelayMs : this.autoBatchInitialDelayMs);
    }
    return itemPromise;
  }
  async _getServerInfo() {
    const response = await _getFetchImplementation()(`${this.apiUrl}/info`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(SERVER_INFO_REQUEST_TIMEOUT),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "get server info");
    return response.json();
  }
  async _ensureServerInfo() {
    if (this._getServerInfoPromise === void 0) {
      this._getServerInfoPromise = (async () => {
        if (this._serverInfo === void 0) {
          try {
            this._serverInfo = await this._getServerInfo();
          } catch (e) {
            console.warn(`[WARNING]: LangSmith failed to fetch info on supported operations. Falling back to single calls and default limits.`);
          }
        }
        return this._serverInfo ?? {};
      })();
    }
    return this._getServerInfoPromise.then((serverInfo) => {
      if (this._serverInfo === void 0) {
        this._getServerInfoPromise = void 0;
      }
      return serverInfo;
    });
  }
  async _getSettings() {
    if (!this.settings) {
      this.settings = this._get("/settings");
    }
    return await this.settings;
  }
  async createRun(run) {
    if (!this._filterForSampling([run]).length) {
      return;
    }
    const headers = { ...this.headers, "Content-Type": "application/json" };
    const session_name = run.project_name;
    delete run.project_name;
    const runCreate = this.prepareRunCreateOrUpdateInputs({
      session_name,
      ...run,
      start_time: run.start_time ?? Date.now()
    });
    if (this.autoBatchTracing && runCreate.trace_id !== void 0 && runCreate.dotted_order !== void 0) {
      void this.processRunOperation({
        action: "create",
        item: runCreate
      }).catch(console.error);
      return;
    }
    const mergedRunCreateParam = mergeRuntimeEnvIntoRunCreate(runCreate);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs`, {
      method: "POST",
      headers,
      body: stringify(mergedRunCreateParam),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create run", true);
  }
  /**
   * Batch ingest/upsert multiple runs in the Langsmith system.
   * @param runs
   */
  async batchIngestRuns({ runCreates, runUpdates }) {
    if (runCreates === void 0 && runUpdates === void 0) {
      return;
    }
    let preparedCreateParams = (runCreates == null ? void 0 : runCreates.map((create) => this.prepareRunCreateOrUpdateInputs(create))) ?? [];
    let preparedUpdateParams = (runUpdates == null ? void 0 : runUpdates.map((update) => this.prepareRunCreateOrUpdateInputs(update))) ?? [];
    if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
      const createById = preparedCreateParams.reduce((params, run) => {
        if (!run.id) {
          return params;
        }
        params[run.id] = run;
        return params;
      }, {});
      const standaloneUpdates = [];
      for (const updateParam of preparedUpdateParams) {
        if (updateParam.id !== void 0 && createById[updateParam.id]) {
          createById[updateParam.id] = {
            ...createById[updateParam.id],
            ...updateParam
          };
        } else {
          standaloneUpdates.push(updateParam);
        }
      }
      preparedCreateParams = Object.values(createById);
      preparedUpdateParams = standaloneUpdates;
    }
    const rawBatch = {
      post: this._filterForSampling(preparedCreateParams),
      patch: this._filterForSampling(preparedUpdateParams, true)
    };
    if (!rawBatch.post.length && !rawBatch.patch.length) {
      return;
    }
    const serverInfo = await this._ensureServerInfo();
    if (serverInfo.version === void 0) {
      this.autoBatchTracing = false;
      for (const preparedCreateParam of rawBatch.post) {
        await this.createRun(preparedCreateParam);
      }
      for (const preparedUpdateParam of rawBatch.patch) {
        if (preparedUpdateParam.id !== void 0) {
          await this.updateRun(preparedUpdateParam.id, preparedUpdateParam);
        }
      }
      return;
    }
    const batchChunks = {
      post: [],
      patch: []
    };
    for (const k of ["post", "patch"]) {
      const key = k;
      const batchItems = rawBatch[key].reverse();
      let batchItem = batchItems.pop();
      while (batchItem !== void 0) {
        batchChunks[key].push(batchItem);
        batchItem = batchItems.pop();
      }
    }
    if (batchChunks.post.length > 0 || batchChunks.patch.length > 0) {
      await this._postBatchIngestRuns(stringify(batchChunks));
    }
  }
  async _postBatchIngestRuns(body) {
    const headers = {
      ...this.headers,
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const response = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/batch`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "batch create run", true);
  }
  /**
   * Batch ingest/upsert multiple runs in the Langsmith system.
   * @param runs
   */
  async multipartIngestRuns({ runCreates, runUpdates }) {
    if (runCreates === void 0 && runUpdates === void 0) {
      return;
    }
    const allAttachments = {};
    let preparedCreateParams = [];
    for (const create of runCreates ?? []) {
      const preparedCreate = this.prepareRunCreateOrUpdateInputs(create);
      if (preparedCreate.id !== void 0 && preparedCreate.attachments !== void 0) {
        allAttachments[preparedCreate.id] = preparedCreate.attachments;
      }
      delete preparedCreate.attachments;
      preparedCreateParams.push(preparedCreate);
    }
    let preparedUpdateParams = [];
    for (const update of runUpdates ?? []) {
      preparedUpdateParams.push(this.prepareRunCreateOrUpdateInputs(update));
    }
    const invalidRunCreate = preparedCreateParams.find((runCreate) => {
      return runCreate.trace_id === void 0 || runCreate.dotted_order === void 0;
    });
    if (invalidRunCreate !== void 0) {
      throw new Error(`Multipart ingest requires "trace_id" and "dotted_order" to be set when creating a run`);
    }
    const invalidRunUpdate = preparedUpdateParams.find((runUpdate) => {
      return runUpdate.trace_id === void 0 || runUpdate.dotted_order === void 0;
    });
    if (invalidRunUpdate !== void 0) {
      throw new Error(`Multipart ingest requires "trace_id" and "dotted_order" to be set when updating a run`);
    }
    if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
      const createById = preparedCreateParams.reduce((params, run) => {
        if (!run.id) {
          return params;
        }
        params[run.id] = run;
        return params;
      }, {});
      const standaloneUpdates = [];
      for (const updateParam of preparedUpdateParams) {
        if (updateParam.id !== void 0 && createById[updateParam.id]) {
          createById[updateParam.id] = {
            ...createById[updateParam.id],
            ...updateParam
          };
        } else {
          standaloneUpdates.push(updateParam);
        }
      }
      preparedCreateParams = Object.values(createById);
      preparedUpdateParams = standaloneUpdates;
    }
    if (preparedCreateParams.length === 0 && preparedUpdateParams.length === 0) {
      return;
    }
    const accumulatedContext = [];
    const accumulatedParts = [];
    for (const [method, payloads] of [
      ["post", preparedCreateParams],
      ["patch", preparedUpdateParams]
    ]) {
      for (const originalPayload of payloads) {
        const { inputs, outputs, events, ...payload } = originalPayload;
        const fields = { inputs, outputs, events };
        const stringifiedPayload = stringify(payload);
        accumulatedParts.push({
          name: `${method}.${payload.id}`,
          payload: new Blob([stringifiedPayload], {
            type: `application/json; length=${stringifiedPayload.length}`
            // encoding=gzip
          })
        });
        for (const [key, value] of Object.entries(fields)) {
          if (value === void 0) {
            continue;
          }
          const stringifiedValue = stringify(value);
          accumulatedParts.push({
            name: `${method}.${payload.id}.${key}`,
            payload: new Blob([stringifiedValue], {
              type: `application/json; length=${stringifiedValue.length}`
            })
          });
        }
        if (payload.id !== void 0) {
          const attachments = allAttachments[payload.id];
          if (attachments) {
            delete allAttachments[payload.id];
            for (const [name, [contentType, content]] of Object.entries(attachments)) {
              accumulatedParts.push({
                name: `attachment.${payload.id}.${name}`,
                payload: new Blob([content], {
                  type: `${contentType}; length=${content.length}`
                })
              });
            }
          }
        }
        accumulatedContext.push(`trace=${payload.trace_id},id=${payload.id}`);
      }
    }
    await this._sendMultipartRequest(accumulatedParts, accumulatedContext.join("; "));
  }
  async _sendMultipartRequest(parts, context) {
    try {
      const formData = new FormData();
      for (const part of parts) {
        formData.append(part.name, part.payload);
      }
      await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/multipart`, {
        method: "POST",
        headers: {
          ...this.headers
        },
        body: formData,
        signal: AbortSignal.timeout(this.timeout_ms),
        ...this.fetchOptions
      });
    } catch (e) {
      let errorMessage = "Failed to multipart ingest runs";
      if (e instanceof Error) {
        errorMessage += `: ${e.stack || e.message}`;
      } else {
        errorMessage += `: ${String(e)}`;
      }
      console.warn(`${errorMessage.trim()}

Context: ${context}`);
    }
  }
  async updateRun(runId, run) {
    assertUuid(runId);
    if (run.inputs) {
      run.inputs = this.processInputs(run.inputs);
    }
    if (run.outputs) {
      run.outputs = this.processOutputs(run.outputs);
    }
    const data = { ...run, id: runId };
    if (!this._filterForSampling([data], true).length) {
      return;
    }
    if (this.autoBatchTracing && data.trace_id !== void 0 && data.dotted_order !== void 0) {
      if (run.end_time !== void 0 && data.parent_run_id === void 0 && this.blockOnRootRunFinalization) {
        await this.processRunOperation({ action: "update", item: data }, true);
        return;
      } else {
        void this.processRunOperation({ action: "update", item: data }).catch(console.error);
      }
      return;
    }
    const headers = { ...this.headers, "Content-Type": "application/json" };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}`, {
      method: "PATCH",
      headers,
      body: stringify(run),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update run", true);
  }
  async readRun(runId, { loadChildRuns } = { loadChildRuns: false }) {
    assertUuid(runId);
    let run = await this._get(`/runs/${runId}`);
    if (loadChildRuns && run.child_run_ids) {
      run = await this._loadChildRuns(run);
    }
    return run;
  }
  async getRunUrl({ runId, run, projectOpts }) {
    if (run !== void 0) {
      let sessionId;
      if (run.session_id) {
        sessionId = run.session_id;
      } else if (projectOpts == null ? void 0 : projectOpts.projectName) {
        sessionId = (await this.readProject({ projectName: projectOpts == null ? void 0 : projectOpts.projectName })).id;
      } else if (projectOpts == null ? void 0 : projectOpts.projectId) {
        sessionId = projectOpts == null ? void 0 : projectOpts.projectId;
      } else {
        const project = await this.readProject({
          projectName: getLangSmithEnvironmentVariable("PROJECT") || "default"
        });
        sessionId = project.id;
      }
      const tenantId = await this._getTenantId();
      return `${this.getHostUrl()}/o/${tenantId}/projects/p/${sessionId}/r/${run.id}?poll=true`;
    } else if (runId !== void 0) {
      const run_ = await this.readRun(runId);
      if (!run_.app_path) {
        throw new Error(`Run ${runId} has no app_path`);
      }
      const baseUrl = this.getHostUrl();
      return `${baseUrl}${run_.app_path}`;
    } else {
      throw new Error("Must provide either runId or run");
    }
  }
  async _loadChildRuns(run) {
    const childRuns = await toArray(this.listRuns({ id: run.child_run_ids }));
    const treemap = {};
    const runs = {};
    childRuns.sort((a, b) => ((a == null ? void 0 : a.dotted_order) ?? "").localeCompare((b == null ? void 0 : b.dotted_order) ?? ""));
    for (const childRun of childRuns) {
      if (childRun.parent_run_id === null || childRun.parent_run_id === void 0) {
        throw new Error(`Child run ${childRun.id} has no parent`);
      }
      if (!(childRun.parent_run_id in treemap)) {
        treemap[childRun.parent_run_id] = [];
      }
      treemap[childRun.parent_run_id].push(childRun);
      runs[childRun.id] = childRun;
    }
    run.child_runs = treemap[run.id] || [];
    for (const runId in treemap) {
      if (runId !== run.id) {
        runs[runId].child_runs = treemap[runId];
      }
    }
    return run;
  }
  /**
   * List runs from the LangSmith server.
   * @param projectId - The ID of the project to filter by.
   * @param projectName - The name of the project to filter by.
   * @param parentRunId - The ID of the parent run to filter by.
   * @param traceId - The ID of the trace to filter by.
   * @param referenceExampleId - The ID of the reference example to filter by.
   * @param startTime - The start time to filter by.
   * @param isRoot - Indicates whether to only return root runs.
   * @param runType - The run type to filter by.
   * @param error - Indicates whether to filter by error runs.
   * @param id - The ID of the run to filter by.
   * @param query - The query string to filter by.
   * @param filter - The filter string to apply to the run spans.
   * @param traceFilter - The filter string to apply on the root run of the trace.
   * @param limit - The maximum number of runs to retrieve.
   * @returns {AsyncIterable<Run>} - The runs.
   *
   * @example
   * // List all runs in a project
   * const projectRuns = client.listRuns({ projectName: "<your_project>" });
   *
   * @example
   * // List LLM and Chat runs in the last 24 hours
   * const todaysLLMRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
   *   run_type: "llm",
   * });
   *
   * @example
   * // List traces in a project
   * const rootRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   execution_order: 1,
   * });
   *
   * @example
   * // List runs without errors
   * const correctRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   error: false,
   * });
   *
   * @example
   * // List runs by run ID
   * const runIds = [
   *   "a36092d2-4ad5-4fb4-9c0d-0dba9a2ed836",
   *   "9398e6be-964f-4aa4-8ae9-ad78cd4b7074",
   * ];
   * const selectedRuns = client.listRuns({ run_ids: runIds });
   *
   * @example
   * // List all "chain" type runs that took more than 10 seconds and had `total_tokens` greater than 5000
   * const chainRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   filter: 'and(eq(run_type, "chain"), gt(latency, 10), gt(total_tokens, 5000))',
   * });
   *
   * @example
   * // List all runs called "extractor" whose root of the trace was assigned feedback "user_score" score of 1
   * const goodExtractorRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   filter: 'eq(name, "extractor")',
   *   traceFilter: 'and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
   * });
   *
   * @example
   * // List all runs that started after a specific timestamp and either have "error" not equal to null or a "Correctness" feedback score equal to 0
   * const complexRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   filter: 'and(gt(start_time, "2023-07-15T12:34:56Z"), or(neq(error, null), and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))',
   * });
   *
   * @example
   * // List all runs where `tags` include "experimental" or "beta" and `latency` is greater than 2 seconds
   * const taggedRuns = client.listRuns({
   *   projectName: "<your_project>",
   *   filter: 'and(or(has(tags, "experimental"), has(tags, "beta")), gt(latency, 2))',
   * });
   */
  async *listRuns(props) {
    const { projectId, projectName, parentRunId, traceId, referenceExampleId, startTime, executionOrder, isRoot, runType, error, id, query: query2, filter, traceFilter, treeFilter, limit, select } = props;
    let projectIds = [];
    if (projectId) {
      projectIds = Array.isArray(projectId) ? projectId : [projectId];
    }
    if (projectName) {
      const projectNames = Array.isArray(projectName) ? projectName : [projectName];
      const projectIds_ = await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)));
      projectIds.push(...projectIds_);
    }
    const default_select = [
      "app_path",
      "child_run_ids",
      "completion_cost",
      "completion_tokens",
      "dotted_order",
      "end_time",
      "error",
      "events",
      "extra",
      "feedback_stats",
      "first_token_time",
      "id",
      "inputs",
      "name",
      "outputs",
      "parent_run_id",
      "parent_run_ids",
      "prompt_cost",
      "prompt_tokens",
      "reference_example_id",
      "run_type",
      "session_id",
      "start_time",
      "status",
      "tags",
      "total_cost",
      "total_tokens",
      "trace_id"
    ];
    const body = {
      session: projectIds.length ? projectIds : null,
      run_type: runType,
      reference_example: referenceExampleId,
      query: query2,
      filter,
      trace_filter: traceFilter,
      tree_filter: treeFilter,
      execution_order: executionOrder,
      parent_run: parentRunId,
      start_time: startTime ? startTime.toISOString() : null,
      error,
      id,
      limit,
      trace: traceId,
      select: select ? select : default_select,
      is_root: isRoot
    };
    let runsYielded = 0;
    for await (const runs of this._getCursorPaginatedList("/runs/query", body)) {
      if (limit) {
        if (runsYielded >= limit) {
          break;
        }
        if (runs.length + runsYielded > limit) {
          const newRuns = runs.slice(0, limit - runsYielded);
          yield* newRuns;
          break;
        }
        runsYielded += runs.length;
        yield* runs;
      } else {
        yield* runs;
      }
    }
  }
  async getRunStats({ id, trace, parentRun, runType, projectNames, projectIds, referenceExampleIds, startTime, endTime, error, query: query2, filter, traceFilter, treeFilter, isRoot, dataSourceType }) {
    let projectIds_ = projectIds || [];
    if (projectNames) {
      projectIds_ = [
        ...projectIds || [],
        ...await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)))
      ];
    }
    const payload = {
      id,
      trace,
      parent_run: parentRun,
      run_type: runType,
      session: projectIds_,
      reference_example: referenceExampleIds,
      start_time: startTime,
      end_time: endTime,
      error,
      query: query2,
      filter,
      trace_filter: traceFilter,
      tree_filter: treeFilter,
      is_root: isRoot,
      data_source_type: dataSourceType
    };
    const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== void 0));
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/stats`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(filteredPayload),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const result = await response.json();
    return result;
  }
  async shareRun(runId, { shareId } = {}) {
    const data = {
      run_id: runId,
      share_token: shareId || v4()
    };
    assertUuid(runId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const result = await response.json();
    if (result === null || !("share_token" in result)) {
      throw new Error("Invalid response from server");
    }
    return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
  }
  async unshareRun(runId) {
    assertUuid(runId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "unshare run", true);
  }
  async readRunSharedLink(runId) {
    assertUuid(runId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const result = await response.json();
    if (result === null || !("share_token" in result)) {
      return void 0;
    }
    return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
  }
  async listSharedRuns(shareToken, { runIds } = {}) {
    const queryParams = new URLSearchParams({
      share_token: shareToken
    });
    if (runIds !== void 0) {
      for (const runId of runIds) {
        queryParams.append("id", runId);
      }
    }
    assertUuid(shareToken);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/runs${queryParams}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const runs = await response.json();
    return runs;
  }
  async readDatasetSharedSchema(datasetId, datasetName) {
    if (!datasetId && !datasetName) {
      throw new Error("Either datasetId or datasetName must be given");
    }
    if (!datasetId) {
      const dataset = await this.readDataset({ datasetName });
      datasetId = dataset.id;
    }
    assertUuid(datasetId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const shareSchema = await response.json();
    shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
    return shareSchema;
  }
  async shareDataset(datasetId, datasetName) {
    if (!datasetId && !datasetName) {
      throw new Error("Either datasetId or datasetName must be given");
    }
    if (!datasetId) {
      const dataset = await this.readDataset({ datasetName });
      datasetId = dataset.id;
    }
    const data = {
      dataset_id: datasetId
    };
    assertUuid(datasetId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const shareSchema = await response.json();
    shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
    return shareSchema;
  }
  async unshareDataset(datasetId) {
    assertUuid(datasetId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "unshare dataset", true);
  }
  async readSharedDataset(shareToken) {
    assertUuid(shareToken);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/datasets`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const dataset = await response.json();
    return dataset;
  }
  /**
   * Get shared examples.
   *
   * @param {string} shareToken The share token to get examples for. A share token is the UUID (or LangSmith URL, including UUID) generated when explicitly marking an example as public.
   * @param {Object} [options] Additional options for listing the examples.
   * @param {string[] | undefined} [options.exampleIds] A list of example IDs to filter by.
   * @returns {Promise<Example[]>} The shared examples.
   */
  async listSharedExamples(shareToken, options) {
    const params = {};
    if (options == null ? void 0 : options.exampleIds) {
      params.id = options.exampleIds;
    }
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, v));
      } else {
        urlParams.append(key, value);
      }
    });
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/examples?${urlParams.toString()}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const result = await response.json();
    if (!response.ok) {
      if ("detail" in result) {
        throw new Error(`Failed to list shared examples.
Status: ${response.status}
Message: ${result.detail.join("\n")}`);
      }
      throw new Error(`Failed to list shared examples: ${response.status} ${response.statusText}`);
    }
    return result.map((example) => ({
      ...example,
      _hostUrl: this.getHostUrl()
    }));
  }
  async createProject({ projectName, description = null, metadata = null, upsert = false, projectExtra = null, referenceDatasetId = null }) {
    const upsert_ = upsert ? `?upsert=true` : "";
    const endpoint = `${this.apiUrl}/sessions${upsert_}`;
    const extra = projectExtra || {};
    if (metadata) {
      extra["metadata"] = metadata;
    }
    const body = {
      name: projectName,
      extra,
      description
    };
    if (referenceDatasetId !== null) {
      body["reference_dataset_id"] = referenceDatasetId;
    }
    const response = await this.caller.call(_getFetchImplementation(), endpoint, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create project");
    const result = await response.json();
    return result;
  }
  async updateProject(projectId, { name = null, description = null, metadata = null, projectExtra = null, endTime = null }) {
    const endpoint = `${this.apiUrl}/sessions/${projectId}`;
    let extra = projectExtra;
    if (metadata) {
      extra = { ...extra || {}, metadata };
    }
    const body = {
      name,
      extra,
      description,
      end_time: endTime ? new Date(endTime).toISOString() : null
    };
    const response = await this.caller.call(_getFetchImplementation(), endpoint, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update project");
    const result = await response.json();
    return result;
  }
  async hasProject({ projectId, projectName }) {
    let path = "/sessions";
    const params = new URLSearchParams();
    if (projectId !== void 0 && projectName !== void 0) {
      throw new Error("Must provide either projectName or projectId, not both");
    } else if (projectId !== void 0) {
      assertUuid(projectId);
      path += `/${projectId}`;
    } else if (projectName !== void 0) {
      params.append("name", projectName);
    } else {
      throw new Error("Must provide projectName or projectId");
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}?${params}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    try {
      const result = await response.json();
      if (!response.ok) {
        return false;
      }
      if (Array.isArray(result)) {
        return result.length > 0;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  async readProject({ projectId, projectName, includeStats }) {
    let path = "/sessions";
    const params = new URLSearchParams();
    if (projectId !== void 0 && projectName !== void 0) {
      throw new Error("Must provide either projectName or projectId, not both");
    } else if (projectId !== void 0) {
      assertUuid(projectId);
      path += `/${projectId}`;
    } else if (projectName !== void 0) {
      params.append("name", projectName);
    } else {
      throw new Error("Must provide projectName or projectId");
    }
    if (includeStats !== void 0) {
      params.append("include_stats", includeStats.toString());
    }
    const response = await this._get(path, params);
    let result;
    if (Array.isArray(response)) {
      if (response.length === 0) {
        throw new Error(`Project[id=${projectId}, name=${projectName}] not found`);
      }
      result = response[0];
    } else {
      result = response;
    }
    return result;
  }
  async getProjectUrl({ projectId, projectName }) {
    if (projectId === void 0 && projectName === void 0) {
      throw new Error("Must provide either projectName or projectId");
    }
    const project = await this.readProject({ projectId, projectName });
    const tenantId = await this._getTenantId();
    return `${this.getHostUrl()}/o/${tenantId}/projects/p/${project.id}`;
  }
  async getDatasetUrl({ datasetId, datasetName }) {
    if (datasetId === void 0 && datasetName === void 0) {
      throw new Error("Must provide either datasetName or datasetId");
    }
    const dataset = await this.readDataset({ datasetId, datasetName });
    const tenantId = await this._getTenantId();
    return `${this.getHostUrl()}/o/${tenantId}/datasets/${dataset.id}`;
  }
  async _getTenantId() {
    if (this._tenantId !== null) {
      return this._tenantId;
    }
    const queryParams = new URLSearchParams({ limit: "1" });
    for await (const projects of this._getPaginated("/sessions", queryParams)) {
      this._tenantId = projects[0].tenant_id;
      return projects[0].tenant_id;
    }
    throw new Error("No projects found to resolve tenant.");
  }
  async *listProjects({ projectIds, name, nameContains, referenceDatasetId, referenceDatasetName, referenceFree, metadata } = {}) {
    const params = new URLSearchParams();
    if (projectIds !== void 0) {
      for (const projectId of projectIds) {
        params.append("id", projectId);
      }
    }
    if (name !== void 0) {
      params.append("name", name);
    }
    if (nameContains !== void 0) {
      params.append("name_contains", nameContains);
    }
    if (referenceDatasetId !== void 0) {
      params.append("reference_dataset", referenceDatasetId);
    } else if (referenceDatasetName !== void 0) {
      const dataset = await this.readDataset({
        datasetName: referenceDatasetName
      });
      params.append("reference_dataset", dataset.id);
    }
    if (referenceFree !== void 0) {
      params.append("reference_free", referenceFree.toString());
    }
    if (metadata !== void 0) {
      params.append("metadata", JSON.stringify(metadata));
    }
    for await (const projects of this._getPaginated("/sessions", params)) {
      yield* projects;
    }
  }
  async deleteProject({ projectId, projectName }) {
    let projectId_;
    if (projectId === void 0 && projectName === void 0) {
      throw new Error("Must provide projectName or projectId");
    } else if (projectId !== void 0 && projectName !== void 0) {
      throw new Error("Must provide either projectName or projectId, not both");
    } else if (projectId === void 0) {
      projectId_ = (await this.readProject({ projectName })).id;
    } else {
      projectId_ = projectId;
    }
    assertUuid(projectId_);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/sessions/${projectId_}`, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `delete session ${projectId_} (${projectName})`, true);
  }
  async uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, dataType, name }) {
    const url = `${this.apiUrl}/datasets/upload`;
    const formData = new FormData();
    formData.append("file", csvFile, fileName);
    inputKeys.forEach((key) => {
      formData.append("input_keys", key);
    });
    outputKeys.forEach((key) => {
      formData.append("output_keys", key);
    });
    if (description) {
      formData.append("description", description);
    }
    if (dataType) {
      formData.append("data_type", dataType);
    }
    if (name) {
      formData.append("name", name);
    }
    const response = await this.caller.call(_getFetchImplementation(), url, {
      method: "POST",
      headers: this.headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "upload CSV");
    const result = await response.json();
    return result;
  }
  async createDataset(name, { description, dataType, inputsSchema, outputsSchema, metadata } = {}) {
    const body = {
      name,
      description,
      extra: metadata ? { metadata } : void 0
    };
    if (dataType) {
      body.data_type = dataType;
    }
    if (inputsSchema) {
      body.inputs_schema_definition = inputsSchema;
    }
    if (outputsSchema) {
      body.outputs_schema_definition = outputsSchema;
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create dataset");
    const result = await response.json();
    return result;
  }
  async readDataset({ datasetId, datasetName }) {
    let path = "/datasets";
    const params = new URLSearchParams({ limit: "1" });
    if (datasetId !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId !== void 0) {
      assertUuid(datasetId);
      path += `/${datasetId}`;
    } else if (datasetName !== void 0) {
      params.append("name", datasetName);
    } else {
      throw new Error("Must provide datasetName or datasetId");
    }
    const response = await this._get(path, params);
    let result;
    if (Array.isArray(response)) {
      if (response.length === 0) {
        throw new Error(`Dataset[id=${datasetId}, name=${datasetName}] not found`);
      }
      result = response[0];
    } else {
      result = response;
    }
    return result;
  }
  async hasDataset({ datasetId, datasetName }) {
    try {
      await this.readDataset({ datasetId, datasetName });
      return true;
    } catch (e) {
      if (
        // eslint-disable-next-line no-instanceof/no-instanceof
        e instanceof Error && e.message.toLocaleLowerCase().includes("not found")
      ) {
        return false;
      }
      throw e;
    }
  }
  async diffDatasetVersions({ datasetId, datasetName, fromVersion, toVersion }) {
    let datasetId_ = datasetId;
    if (datasetId_ === void 0 && datasetName === void 0) {
      throw new Error("Must provide either datasetName or datasetId");
    } else if (datasetId_ !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId_ === void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    }
    const urlParams = new URLSearchParams({
      from_version: typeof fromVersion === "string" ? fromVersion : fromVersion.toISOString(),
      to_version: typeof toVersion === "string" ? toVersion : toVersion.toISOString()
    });
    const response = await this._get(`/datasets/${datasetId_}/versions/diff`, urlParams);
    return response;
  }
  async readDatasetOpenaiFinetuning({ datasetId, datasetName }) {
    const path = "/datasets";
    if (datasetId !== void 0) ;
    else if (datasetName !== void 0) {
      datasetId = (await this.readDataset({ datasetName })).id;
    } else {
      throw new Error("Must provide datasetName or datasetId");
    }
    const response = await this._getResponse(`${path}/${datasetId}/openai_ft`);
    const datasetText = await response.text();
    const dataset = datasetText.trim().split("\n").map((line) => JSON.parse(line));
    return dataset;
  }
  async *listDatasets({ limit = 100, offset = 0, datasetIds, datasetName, datasetNameContains, metadata } = {}) {
    const path = "/datasets";
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    if (datasetIds !== void 0) {
      for (const id_ of datasetIds) {
        params.append("id", id_);
      }
    }
    if (datasetName !== void 0) {
      params.append("name", datasetName);
    }
    if (datasetNameContains !== void 0) {
      params.append("name_contains", datasetNameContains);
    }
    if (metadata !== void 0) {
      params.append("metadata", JSON.stringify(metadata));
    }
    for await (const datasets of this._getPaginated(path, params)) {
      yield* datasets;
    }
  }
  /**
   * Update a dataset
   * @param props The dataset details to update
   * @returns The updated dataset
   */
  async updateDataset(props) {
    const { datasetId, datasetName, ...update } = props;
    if (!datasetId && !datasetName) {
      throw new Error("Must provide either datasetName or datasetId");
    }
    const _datasetId = datasetId ?? (await this.readDataset({ datasetName })).id;
    assertUuid(_datasetId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${_datasetId}`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(update),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update dataset");
    return await response.json();
  }
  async deleteDataset({ datasetId, datasetName }) {
    let path = "/datasets";
    let datasetId_ = datasetId;
    if (datasetId !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetName !== void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    }
    if (datasetId_ !== void 0) {
      assertUuid(datasetId_);
      path += `/${datasetId_}`;
    } else {
      throw new Error("Must provide datasetName or datasetId");
    }
    const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `delete ${path}`);
    await response.json();
  }
  async indexDataset({ datasetId, datasetName, tag }) {
    let datasetId_ = datasetId;
    if (!datasetId_ && !datasetName) {
      throw new Error("Must provide either datasetName or datasetId");
    } else if (datasetId_ && datasetName) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (!datasetId_) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    }
    assertUuid(datasetId_);
    const data = {
      tag
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/index`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "index dataset");
    await response.json();
  }
  /**
   * Lets you run a similarity search query on a dataset.
   *
   * Requires the dataset to be indexed. Please see the `indexDataset` method to set up indexing.
   *
   * @param inputs      The input on which to run the similarity search. Must have the
   *                    same schema as the dataset.
   *
   * @param datasetId   The dataset to search for similar examples.
   *
   * @param limit       The maximum number of examples to return. Will return the top `limit` most
   *                    similar examples in order of most similar to least similar. If no similar
   *                    examples are found, random examples will be returned.
   *
   * @param filter      A filter string to apply to the search. Only examples will be returned that
   *                    match the filter string. Some examples of filters
   *
   *                    - eq(metadata.mykey, "value")
   *                    - and(neq(metadata.my.nested.key, "value"), neq(metadata.mykey, "value"))
   *                    - or(eq(metadata.mykey, "value"), eq(metadata.mykey, "othervalue"))
   *
   * @returns           A list of similar examples.
   *
   *
   * @example
   * dataset_id = "123e4567-e89b-12d3-a456-426614174000"
   * inputs = {"text": "How many people live in Berlin?"}
   * limit = 5
   * examples = await client.similarExamples(inputs, dataset_id, limit)
   */
  async similarExamples(inputs, datasetId, limit, { filter } = {}) {
    const data = {
      limit,
      inputs
    };
    if (filter !== void 0) {
      data["filter"] = filter;
    }
    assertUuid(datasetId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/search`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "fetch similar examples");
    const result = await response.json();
    return result["examples"];
  }
  async createExample(inputs, outputs, { datasetId, datasetName, createdAt, exampleId, metadata, split, sourceRunId }) {
    let datasetId_ = datasetId;
    if (datasetId_ === void 0 && datasetName === void 0) {
      throw new Error("Must provide either datasetName or datasetId");
    } else if (datasetId_ !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId_ === void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    }
    const createdAt_ = createdAt || /* @__PURE__ */ new Date();
    const data = {
      dataset_id: datasetId_,
      inputs,
      outputs,
      created_at: createdAt_ == null ? void 0 : createdAt_.toISOString(),
      id: exampleId,
      metadata,
      split,
      source_run_id: sourceRunId
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create example");
    const result = await response.json();
    return result;
  }
  async createExamples(props) {
    const { inputs, outputs, metadata, sourceRunIds, exampleIds, datasetId, datasetName } = props;
    let datasetId_ = datasetId;
    if (datasetId_ === void 0 && datasetName === void 0) {
      throw new Error("Must provide either datasetName or datasetId");
    } else if (datasetId_ !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId_ === void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    }
    const formattedExamples = inputs.map((input, idx) => {
      return {
        dataset_id: datasetId_,
        inputs: input,
        outputs: outputs ? outputs[idx] : void 0,
        metadata: metadata ? metadata[idx] : void 0,
        split: props.splits ? props.splits[idx] : void 0,
        id: exampleIds ? exampleIds[idx] : void 0,
        source_run_id: sourceRunIds ? sourceRunIds[idx] : void 0
      };
    });
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(formattedExamples),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create examples");
    const result = await response.json();
    return result;
  }
  async createLLMExample(input, generation, options) {
    return this.createExample({ input }, { output: generation }, options);
  }
  async createChatExample(input, generations, options) {
    const finalInput = input.map((message) => {
      if (isLangChainMessage(message)) {
        return convertLangChainMessageToExample(message);
      }
      return message;
    });
    const finalOutput = isLangChainMessage(generations) ? convertLangChainMessageToExample(generations) : generations;
    return this.createExample({ input: finalInput }, { output: finalOutput }, options);
  }
  async readExample(exampleId) {
    assertUuid(exampleId);
    const path = `/examples/${exampleId}`;
    return await this._get(path);
  }
  async *listExamples({ datasetId, datasetName, exampleIds, asOf, splits, inlineS3Urls, metadata, limit, offset, filter } = {}) {
    let datasetId_;
    if (datasetId !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId !== void 0) {
      datasetId_ = datasetId;
    } else if (datasetName !== void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    } else {
      throw new Error("Must provide a datasetName or datasetId");
    }
    const params = new URLSearchParams({ dataset: datasetId_ });
    const dataset_version = asOf ? typeof asOf === "string" ? asOf : asOf == null ? void 0 : asOf.toISOString() : void 0;
    if (dataset_version) {
      params.append("as_of", dataset_version);
    }
    const inlineS3Urls_ = inlineS3Urls ?? true;
    params.append("inline_s3_urls", inlineS3Urls_.toString());
    if (exampleIds !== void 0) {
      for (const id_ of exampleIds) {
        params.append("id", id_);
      }
    }
    if (splits !== void 0) {
      for (const split of splits) {
        params.append("splits", split);
      }
    }
    if (metadata !== void 0) {
      const serializedMetadata = JSON.stringify(metadata);
      params.append("metadata", serializedMetadata);
    }
    if (limit !== void 0) {
      params.append("limit", limit.toString());
    }
    if (offset !== void 0) {
      params.append("offset", offset.toString());
    }
    if (filter !== void 0) {
      params.append("filter", filter);
    }
    let i = 0;
    for await (const examples of this._getPaginated("/examples", params)) {
      for (const example of examples) {
        yield example;
        i++;
      }
      if (limit !== void 0 && i >= limit) {
        break;
      }
    }
  }
  async deleteExample(exampleId) {
    assertUuid(exampleId);
    const path = `/examples/${exampleId}`;
    const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `delete ${path}`);
    await response.json();
  }
  async updateExample(exampleId, update) {
    assertUuid(exampleId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/${exampleId}`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(update),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update example");
    const result = await response.json();
    return result;
  }
  async updateExamples(update) {
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(update),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update examples");
    const result = await response.json();
    return result;
  }
  async listDatasetSplits({ datasetId, datasetName, asOf }) {
    let datasetId_;
    if (datasetId === void 0 && datasetName === void 0) {
      throw new Error("Must provide dataset name or ID");
    } else if (datasetId !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId === void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    } else {
      datasetId_ = datasetId;
    }
    assertUuid(datasetId_);
    const params = new URLSearchParams();
    const dataset_version = asOf ? typeof asOf === "string" ? asOf : asOf == null ? void 0 : asOf.toISOString() : void 0;
    if (dataset_version) {
      params.append("as_of", dataset_version);
    }
    const response = await this._get(`/datasets/${datasetId_}/splits`, params);
    return response;
  }
  async updateDatasetSplits({ datasetId, datasetName, splitName, exampleIds, remove = false }) {
    let datasetId_;
    if (datasetId === void 0 && datasetName === void 0) {
      throw new Error("Must provide dataset name or ID");
    } else if (datasetId !== void 0 && datasetName !== void 0) {
      throw new Error("Must provide either datasetName or datasetId, not both");
    } else if (datasetId === void 0) {
      const dataset = await this.readDataset({ datasetName });
      datasetId_ = dataset.id;
    } else {
      datasetId_ = datasetId;
    }
    assertUuid(datasetId_);
    const data = {
      split_name: splitName,
      examples: exampleIds.map((id) => {
        assertUuid(id);
        return id;
      }),
      remove
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/splits`, {
      method: "PUT",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update dataset splits", true);
  }
  /**
   * @deprecated This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.
   */
  async evaluateRun(run, evaluator, { sourceInfo, loadChildRuns, referenceExample } = { loadChildRuns: false }) {
    warnOnce("This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.");
    let run_;
    if (typeof run === "string") {
      run_ = await this.readRun(run, { loadChildRuns });
    } else if (typeof run === "object" && "id" in run) {
      run_ = run;
    } else {
      throw new Error(`Invalid run type: ${typeof run}`);
    }
    if (run_.reference_example_id !== null && run_.reference_example_id !== void 0) {
      referenceExample = await this.readExample(run_.reference_example_id);
    }
    const feedbackResult = await evaluator.evaluateRun(run_, referenceExample);
    const [_, feedbacks] = await this._logEvaluationFeedback(feedbackResult, run_, sourceInfo);
    return feedbacks[0];
  }
  async createFeedback(runId, key, { score, value, correction, comment, sourceInfo, feedbackSourceType = "api", sourceRunId, feedbackId, feedbackConfig, projectId, comparativeExperimentId }) {
    var _a;
    if (!runId && !projectId) {
      throw new Error("One of runId or projectId must be provided");
    }
    if (runId && projectId) {
      throw new Error("Only one of runId or projectId can be provided");
    }
    const feedback_source = {
      type: feedbackSourceType ?? "api",
      metadata: sourceInfo ?? {}
    };
    if (sourceRunId !== void 0 && (feedback_source == null ? void 0 : feedback_source.metadata) !== void 0 && !feedback_source.metadata["__run"]) {
      feedback_source.metadata["__run"] = { run_id: sourceRunId };
    }
    if ((feedback_source == null ? void 0 : feedback_source.metadata) !== void 0 && ((_a = feedback_source.metadata["__run"]) == null ? void 0 : _a.run_id) !== void 0) {
      assertUuid(feedback_source.metadata["__run"].run_id);
    }
    const feedback = {
      id: feedbackId ?? v4(),
      run_id: runId,
      key,
      score,
      value,
      correction,
      comment,
      feedback_source,
      comparative_experiment_id: comparativeExperimentId,
      feedbackConfig,
      session_id: projectId
    };
    const url = `${this.apiUrl}/feedback`;
    const response = await this.caller.call(_getFetchImplementation(), url, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create feedback", true);
    return feedback;
  }
  async updateFeedback(feedbackId, { score, value, correction, comment }) {
    const feedbackUpdate = {};
    if (score !== void 0 && score !== null) {
      feedbackUpdate["score"] = score;
    }
    if (value !== void 0 && value !== null) {
      feedbackUpdate["value"] = value;
    }
    if (correction !== void 0 && correction !== null) {
      feedbackUpdate["correction"] = correction;
    }
    if (comment !== void 0 && comment !== null) {
      feedbackUpdate["comment"] = comment;
    }
    assertUuid(feedbackId);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/${feedbackId}`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(feedbackUpdate),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update feedback", true);
  }
  async readFeedback(feedbackId) {
    assertUuid(feedbackId);
    const path = `/feedback/${feedbackId}`;
    const response = await this._get(path);
    return response;
  }
  async deleteFeedback(feedbackId) {
    assertUuid(feedbackId);
    const path = `/feedback/${feedbackId}`;
    const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `delete ${path}`);
    await response.json();
  }
  async *listFeedback({ runIds, feedbackKeys, feedbackSourceTypes } = {}) {
    const queryParams = new URLSearchParams();
    if (runIds) {
      queryParams.append("run", runIds.join(","));
    }
    if (feedbackKeys) {
      for (const key of feedbackKeys) {
        queryParams.append("key", key);
      }
    }
    if (feedbackSourceTypes) {
      for (const type of feedbackSourceTypes) {
        queryParams.append("source", type);
      }
    }
    for await (const feedbacks of this._getPaginated("/feedback", queryParams)) {
      yield* feedbacks;
    }
  }
  /**
   * Creates a presigned feedback token and URL.
   *
   * The token can be used to authorize feedback metrics without
   * needing an API key. This is useful for giving browser-based
   * applications the ability to submit feedback without needing
   * to expose an API key.
   *
   * @param runId - The ID of the run.
   * @param feedbackKey - The feedback key.
   * @param options - Additional options for the token.
   * @param options.expiration - The expiration time for the token.
   *
   * @returns A promise that resolves to a FeedbackIngestToken.
   */
  async createPresignedFeedbackToken(runId, feedbackKey, { expiration, feedbackConfig } = {}) {
    const body = {
      run_id: runId,
      feedback_key: feedbackKey,
      feedback_config: feedbackConfig
    };
    if (expiration) {
      if (typeof expiration === "string") {
        body["expires_at"] = expiration;
      } else if ((expiration == null ? void 0 : expiration.hours) || (expiration == null ? void 0 : expiration.minutes) || (expiration == null ? void 0 : expiration.days)) {
        body["expires_in"] = expiration;
      }
    } else {
      body["expires_in"] = {
        hours: 3
      };
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/tokens`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const result = await response.json();
    return result;
  }
  async createComparativeExperiment({ name, experimentIds, referenceDatasetId, createdAt, description, metadata, id }) {
    var _a;
    if (experimentIds.length === 0) {
      throw new Error("At least one experiment is required");
    }
    if (!referenceDatasetId) {
      referenceDatasetId = (await this.readProject({
        projectId: experimentIds[0]
      })).reference_dataset_id;
    }
    if (!referenceDatasetId == null) {
      throw new Error("A reference dataset is required");
    }
    const body = {
      id,
      name,
      experiment_ids: experimentIds,
      reference_dataset_id: referenceDatasetId,
      description,
      created_at: (_a = createdAt ?? /* @__PURE__ */ new Date()) == null ? void 0 : _a.toISOString(),
      extra: {}
    };
    if (metadata)
      body.extra["metadata"] = metadata;
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/comparative`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    return await response.json();
  }
  /**
   * Retrieves a list of presigned feedback tokens for a given run ID.
   * @param runId The ID of the run.
   * @returns An async iterable of FeedbackIngestToken objects.
   */
  async *listPresignedFeedbackTokens(runId) {
    assertUuid(runId);
    const params = new URLSearchParams({ run_id: runId });
    for await (const tokens of this._getPaginated("/feedback/tokens", params)) {
      yield* tokens;
    }
  }
  _selectEvalResults(results) {
    let results_;
    if ("results" in results) {
      results_ = results.results;
    } else {
      results_ = [results];
    }
    return results_;
  }
  async _logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
    const evalResults = this._selectEvalResults(evaluatorResponse);
    const feedbacks = [];
    for (const res of evalResults) {
      let sourceInfo_ = sourceInfo || {};
      if (res.evaluatorInfo) {
        sourceInfo_ = { ...res.evaluatorInfo, ...sourceInfo_ };
      }
      let runId_ = null;
      if (res.targetRunId) {
        runId_ = res.targetRunId;
      } else if (run) {
        runId_ = run.id;
      }
      feedbacks.push(await this.createFeedback(runId_, res.key, {
        score: res.score,
        value: res.value,
        comment: res.comment,
        correction: res.correction,
        sourceInfo: sourceInfo_,
        sourceRunId: res.sourceRunId,
        feedbackConfig: res.feedbackConfig,
        feedbackSourceType: "model"
      }));
    }
    return [evalResults, feedbacks];
  }
  async logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
    const [results] = await this._logEvaluationFeedback(evaluatorResponse, run, sourceInfo);
    return results;
  }
  /**
   * API for managing annotation queues
   */
  /**
   * List the annotation queues on the LangSmith API.
   * @param options - The options for listing annotation queues
   * @param options.queueIds - The IDs of the queues to filter by
   * @param options.name - The name of the queue to filter by
   * @param options.nameContains - The substring that the queue name should contain
   * @param options.limit - The maximum number of queues to return
   * @returns An iterator of AnnotationQueue objects
   */
  async *listAnnotationQueues(options = {}) {
    const { queueIds, name, nameContains, limit } = options;
    const params = new URLSearchParams();
    if (queueIds) {
      queueIds.forEach((id, i) => {
        assertUuid(id, `queueIds[${i}]`);
        params.append("ids", id);
      });
    }
    if (name)
      params.append("name", name);
    if (nameContains)
      params.append("name_contains", nameContains);
    params.append("limit", (limit !== void 0 ? Math.min(limit, 100) : 100).toString());
    let count = 0;
    for await (const queues of this._getPaginated("/annotation-queues", params)) {
      yield* queues;
      count++;
      if (limit !== void 0 && count >= limit)
        break;
    }
  }
  /**
   * Create an annotation queue on the LangSmith API.
   * @param options - The options for creating an annotation queue
   * @param options.name - The name of the annotation queue
   * @param options.description - The description of the annotation queue
   * @param options.queueId - The ID of the annotation queue
   * @returns The created AnnotationQueue object
   */
  async createAnnotationQueue(options) {
    const { name, description, queueId } = options;
    const body = {
      name,
      description,
      id: queueId || v4()
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== void 0))),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create annotation queue");
    const data = await response.json();
    return data;
  }
  /**
   * Read an annotation queue with the specified queue ID.
   * @param queueId - The ID of the annotation queue to read
   * @returns The AnnotationQueue object
   */
  async readAnnotationQueue(queueId) {
    const queueIteratorResult = await this.listAnnotationQueues({
      queueIds: [queueId]
    }).next();
    if (queueIteratorResult.done) {
      throw new Error(`Annotation queue with ID ${queueId} not found`);
    }
    return queueIteratorResult.value;
  }
  /**
   * Update an annotation queue with the specified queue ID.
   * @param queueId - The ID of the annotation queue to update
   * @param options - The options for updating the annotation queue
   * @param options.name - The new name for the annotation queue
   * @param options.description - The new description for the annotation queue
   */
  async updateAnnotationQueue(queueId, options) {
    const { name, description } = options;
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
      method: "PATCH",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update annotation queue");
  }
  /**
   * Delete an annotation queue with the specified queue ID.
   * @param queueId - The ID of the annotation queue to delete
   */
  async deleteAnnotationQueue(queueId) {
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
      method: "DELETE",
      headers: { ...this.headers, Accept: "application/json" },
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "delete annotation queue");
  }
  /**
   * Add runs to an annotation queue with the specified queue ID.
   * @param queueId - The ID of the annotation queue
   * @param runIds - The IDs of the runs to be added to the annotation queue
   */
  async addRunsToAnnotationQueue(queueId, runIds) {
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(runIds.map((id, i) => assertUuid(id, `runIds[${i}]`).toString())),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "add runs to annotation queue");
  }
  /**
   * Get a run from an annotation queue at the specified index.
   * @param queueId - The ID of the annotation queue
   * @param index - The index of the run to retrieve
   * @returns A Promise that resolves to a RunWithAnnotationQueueInfo object
   * @throws {Error} If the run is not found at the given index or for other API-related errors
   */
  async getRunFromAnnotationQueue(queueId, index) {
    const baseUrl = `/annotation-queues/${assertUuid(queueId, "queueId")}/run`;
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${baseUrl}/${index}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "get run from annotation queue");
    return await response.json();
  }
  async _currentTenantIsOwner(owner) {
    const settings = await this._getSettings();
    return owner == "-" || settings.tenant_handle === owner;
  }
  async _ownerConflictError(action, owner) {
    const settings = await this._getSettings();
    return new Error(`Cannot ${action} for another tenant.

      Current tenant: ${settings.tenant_handle}

      Requested tenant: ${owner}`);
  }
  async _getLatestCommitHash(promptOwnerAndName) {
    const res = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${promptOwnerAndName}/?limit=${1}&offset=${0}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    const json = await res.json();
    if (!res.ok) {
      const detail = typeof json.detail === "string" ? json.detail : JSON.stringify(json.detail);
      const error = new Error(`Error ${res.status}: ${res.statusText}
${detail}`);
      error.statusCode = res.status;
      throw error;
    }
    if (json.commits.length === 0) {
      return void 0;
    }
    return json.commits[0].commit_hash;
  }
  async _likeOrUnlikePrompt(promptIdentifier, like) {
    const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/likes/${owner}/${promptName}`, {
      method: "POST",
      body: JSON.stringify({ like }),
      headers: { ...this.headers, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, `${like ? "like" : "unlike"} prompt`);
    return await response.json();
  }
  async _getPromptUrl(promptIdentifier) {
    const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
    if (!await this._currentTenantIsOwner(owner)) {
      if (commitHash !== "latest") {
        return `${this.getHostUrl()}/hub/${owner}/${promptName}/${commitHash.substring(0, 8)}`;
      } else {
        return `${this.getHostUrl()}/hub/${owner}/${promptName}`;
      }
    } else {
      const settings = await this._getSettings();
      if (commitHash !== "latest") {
        return `${this.getHostUrl()}/prompts/${promptName}/${commitHash.substring(0, 8)}?organizationId=${settings.id}`;
      } else {
        return `${this.getHostUrl()}/prompts/${promptName}?organizationId=${settings.id}`;
      }
    }
  }
  async promptExists(promptIdentifier) {
    const prompt = await this.getPrompt(promptIdentifier);
    return !!prompt;
  }
  async likePrompt(promptIdentifier) {
    return this._likeOrUnlikePrompt(promptIdentifier, true);
  }
  async unlikePrompt(promptIdentifier) {
    return this._likeOrUnlikePrompt(promptIdentifier, false);
  }
  async *listCommits(promptOwnerAndName) {
    for await (const commits of this._getPaginated(`/commits/${promptOwnerAndName}/`, new URLSearchParams(), (res) => res.commits)) {
      yield* commits;
    }
  }
  async *listPrompts(options) {
    const params = new URLSearchParams();
    params.append("sort_field", (options == null ? void 0 : options.sortField) ?? "updated_at");
    params.append("sort_direction", "desc");
    params.append("is_archived", (!!(options == null ? void 0 : options.isArchived)).toString());
    if ((options == null ? void 0 : options.isPublic) !== void 0) {
      params.append("is_public", options.isPublic.toString());
    }
    if (options == null ? void 0 : options.query) {
      params.append("query", options.query);
    }
    for await (const prompts of this._getPaginated("/repos", params, (res) => res.repos)) {
      yield* prompts;
    }
  }
  async getPrompt(promptIdentifier) {
    const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    if (response.status === 404) {
      return null;
    }
    await raiseForStatus(response, "get prompt");
    const result = await response.json();
    if (result.repo) {
      return result.repo;
    } else {
      return null;
    }
  }
  async createPrompt(promptIdentifier, options) {
    const settings = await this._getSettings();
    if ((options == null ? void 0 : options.isPublic) && !settings.tenant_handle) {
      throw new Error(`Cannot create a public prompt without first

        creating a LangChain Hub handle. 
        You can add a handle by creating a public prompt at:

        https://smith.langchain.com/prompts`);
    }
    const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
    if (!await this._currentTenantIsOwner(owner)) {
      throw await this._ownerConflictError("create a prompt", owner);
    }
    const data = {
      repo_handle: promptName,
      ...(options == null ? void 0 : options.description) && { description: options.description },
      ...(options == null ? void 0 : options.readme) && { readme: options.readme },
      ...(options == null ? void 0 : options.tags) && { tags: options.tags },
      is_public: !!(options == null ? void 0 : options.isPublic)
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create prompt");
    const { repo } = await response.json();
    return repo;
  }
  async createCommit(promptIdentifier, object, options) {
    if (!await this.promptExists(promptIdentifier)) {
      throw new Error("Prompt does not exist, you must create it first.");
    }
    const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
    const resolvedParentCommitHash = (options == null ? void 0 : options.parentCommitHash) === "latest" || !(options == null ? void 0 : options.parentCommitHash) ? await this._getLatestCommitHash(`${owner}/${promptName}`) : options == null ? void 0 : options.parentCommitHash;
    const payload = {
      manifest: JSON.parse(JSON.stringify(object)),
      parent_commit: resolvedParentCommitHash
    };
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "create commit");
    const result = await response.json();
    return this._getPromptUrl(`${owner}/${promptName}${result.commit_hash ? `:${result.commit_hash}` : ""}`);
  }
  async updatePrompt(promptIdentifier, options) {
    if (!await this.promptExists(promptIdentifier)) {
      throw new Error("Prompt does not exist, you must create it first.");
    }
    const [owner, promptName] = parsePromptIdentifier(promptIdentifier);
    if (!await this._currentTenantIsOwner(owner)) {
      throw await this._ownerConflictError("update a prompt", owner);
    }
    const payload = {};
    if ((options == null ? void 0 : options.description) !== void 0)
      payload.description = options.description;
    if ((options == null ? void 0 : options.readme) !== void 0)
      payload.readme = options.readme;
    if ((options == null ? void 0 : options.tags) !== void 0)
      payload.tags = options.tags;
    if ((options == null ? void 0 : options.isPublic) !== void 0)
      payload.is_public = options.isPublic;
    if ((options == null ? void 0 : options.isArchived) !== void 0)
      payload.is_archived = options.isArchived;
    if (Object.keys(payload).length === 0) {
      throw new Error("No valid update options provided");
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "update prompt");
    return response.json();
  }
  async deletePrompt(promptIdentifier) {
    if (!await this.promptExists(promptIdentifier)) {
      throw new Error("Prompt does not exist, you must create it first.");
    }
    const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
    if (!await this._currentTenantIsOwner(owner)) {
      throw await this._ownerConflictError("delete a prompt", owner);
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
      method: "DELETE",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    return await response.json();
  }
  async pullPromptCommit(promptIdentifier, options) {
    const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
    const serverInfo = await this._getServerInfo();
    const useOptimization = isVersionGreaterOrEqual(serverInfo.version, "0.5.23");
    let passedCommitHash = commitHash;
    if (!useOptimization && commitHash === "latest") {
      const latestCommitHash = await this._getLatestCommitHash(`${owner}/${promptName}`);
      if (!latestCommitHash) {
        throw new Error("No commits found");
      } else {
        passedCommitHash = latestCommitHash;
      }
    }
    const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}/${passedCommitHash}${(options == null ? void 0 : options.includeModel) ? "?include_model=true" : ""}`, {
      method: "GET",
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout_ms),
      ...this.fetchOptions
    });
    await raiseForStatus(response, "pull prompt commit");
    const result = await response.json();
    return {
      owner,
      repo: promptName,
      commit_hash: result.commit_hash,
      manifest: result.manifest,
      examples: result.examples
    };
  }
  /**
   * This method should not be used directly, use `import { pull } from "langchain/hub"` instead.
   * Using this method directly returns the JSON string of the prompt rather than a LangChain object.
   * @private
   */
  async _pullPrompt(promptIdentifier, options) {
    const promptObject = await this.pullPromptCommit(promptIdentifier, {
      includeModel: options == null ? void 0 : options.includeModel
    });
    const prompt = JSON.stringify(promptObject.manifest);
    return prompt;
  }
  async pushPrompt(promptIdentifier, options) {
    if (await this.promptExists(promptIdentifier)) {
      if (options && Object.keys(options).some((key) => key !== "object")) {
        await this.updatePrompt(promptIdentifier, {
          description: options == null ? void 0 : options.description,
          readme: options == null ? void 0 : options.readme,
          tags: options == null ? void 0 : options.tags,
          isPublic: options == null ? void 0 : options.isPublic
        });
      }
    } else {
      await this.createPrompt(promptIdentifier, {
        description: options == null ? void 0 : options.description,
        readme: options == null ? void 0 : options.readme,
        tags: options == null ? void 0 : options.tags,
        isPublic: options == null ? void 0 : options.isPublic
      });
    }
    if (!(options == null ? void 0 : options.object)) {
      return await this._getPromptUrl(promptIdentifier);
    }
    const url = await this.createCommit(promptIdentifier, options == null ? void 0 : options.object, {
      parentCommitHash: options == null ? void 0 : options.parentCommitHash
    });
    return url;
  }
  /**
     * Clone a public dataset to your own langsmith tenant.
     * This operation is idempotent. If you already have a dataset with the given name,
     * this function will do nothing.
  
     * @param {string} tokenOrUrl The token of the public dataset to clone.
     * @param {Object} [options] Additional options for cloning the dataset.
     * @param {string} [options.sourceApiUrl] The URL of the langsmith server where the data is hosted. Defaults to the API URL of your current client.
     * @param {string} [options.datasetName] The name of the dataset to create in your tenant. Defaults to the name of the public dataset.
     * @returns {Promise<void>}
     */
  async clonePublicDataset(tokenOrUrl, options = {}) {
    const { sourceApiUrl = this.apiUrl, datasetName } = options;
    const [parsedApiUrl, tokenUuid] = this.parseTokenOrUrl(tokenOrUrl, sourceApiUrl);
    const sourceClient = new Client({
      apiUrl: parsedApiUrl,
      // Placeholder API key not needed anymore in most cases, but
      // some private deployments may have API key-based rate limiting
      // that would cause this to fail if we provide no value.
      apiKey: "placeholder"
    });
    const ds = await sourceClient.readSharedDataset(tokenUuid);
    const finalDatasetName = datasetName || ds.name;
    try {
      if (await this.hasDataset({ datasetId: finalDatasetName })) {
        console.log(`Dataset ${finalDatasetName} already exists in your tenant. Skipping.`);
        return;
      }
    } catch (_) {
    }
    const examples = await sourceClient.listSharedExamples(tokenUuid);
    const dataset = await this.createDataset(finalDatasetName, {
      description: ds.description,
      dataType: ds.data_type || "kv",
      inputsSchema: ds.inputs_schema_definition ?? void 0,
      outputsSchema: ds.outputs_schema_definition ?? void 0
    });
    try {
      await this.createExamples({
        inputs: examples.map((e) => e.inputs),
        outputs: examples.flatMap((e) => e.outputs ? [e.outputs] : []),
        datasetId: dataset.id
      });
    } catch (e) {
      console.error(`An error occurred while creating dataset ${finalDatasetName}. You should delete it manually.`);
      throw e;
    }
  }
  parseTokenOrUrl(urlOrToken, apiUrl, numParts = 2, kind = "dataset") {
    try {
      assertUuid(urlOrToken);
      return [apiUrl, urlOrToken];
    } catch (_) {
    }
    try {
      const parsedUrl = new URL(urlOrToken);
      const pathParts = parsedUrl.pathname.split("/").filter((part) => part !== "");
      if (pathParts.length >= numParts) {
        const tokenUuid = pathParts[pathParts.length - numParts];
        return [apiUrl, tokenUuid];
      } else {
        throw new Error(`Invalid public ${kind} URL: ${urlOrToken}`);
      }
    } catch (error) {
      throw new Error(`Invalid public ${kind} URL or token: ${urlOrToken}`);
    }
  }
  /**
   * Awaits all pending trace batches. Useful for environments where
   * you need to be sure that all tracing requests finish before execution ends,
   * such as serverless environments.
   *
   * @example
   * ```
   * import { Client } from "langsmith";
   *
   * const client = new Client();
   *
   * try {
   *   // Tracing happens here
   *   ...
   * } finally {
   *   await client.awaitPendingTraceBatches();
   * }
   * ```
   *
   * @returns A promise that resolves once all currently pending traces have sent.
   */
  awaitPendingTraceBatches() {
    return Promise.all(this.autoBatchQueue.items.map(({ itemPromise }) => itemPromise));
  }
}
const __version__ = "0.1.68";
let globalEnv;
const isBrowser$1 = () => typeof window !== "undefined" && typeof window.document !== "undefined";
const isWebWorker$1 = () => typeof globalThis === "object" && globalThis.constructor && globalThis.constructor.name === "DedicatedWorkerGlobalScope";
const isJsDom$1 = () => typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
const isDeno$1 = () => typeof Deno !== "undefined";
const isNode$1 = () => typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined" && !isDeno$1();
const getEnv$1 = () => {
  if (globalEnv) {
    return globalEnv;
  }
  if (isBrowser$1()) {
    globalEnv = "browser";
  } else if (isNode$1()) {
    globalEnv = "node";
  } else if (isWebWorker$1()) {
    globalEnv = "webworker";
  } else if (isJsDom$1()) {
    globalEnv = "jsdom";
  } else if (isDeno$1()) {
    globalEnv = "deno";
  } else {
    globalEnv = "other";
  }
  return globalEnv;
};
let runtimeEnvironment$1;
function getRuntimeEnvironment$1() {
  if (runtimeEnvironment$1 === void 0) {
    const env = getEnv$1();
    const releaseEnv = getShas();
    runtimeEnvironment$1 = {
      library: "langsmith",
      runtime: env,
      sdk: "langsmith-js",
      sdk_version: __version__,
      ...releaseEnv
    };
  }
  return runtimeEnvironment$1;
}
function getLangChainEnvVarsMetadata() {
  const allEnvVars = getEnvironmentVariables() || {};
  const envVars = {};
  const excluded = [
    "LANGCHAIN_API_KEY",
    "LANGCHAIN_ENDPOINT",
    "LANGCHAIN_TRACING_V2",
    "LANGCHAIN_PROJECT",
    "LANGCHAIN_SESSION"
  ];
  for (const [key, value] of Object.entries(allEnvVars)) {
    if (key.startsWith("LANGCHAIN_") && typeof value === "string" && !excluded.includes(key) && !key.toLowerCase().includes("key") && !key.toLowerCase().includes("secret") && !key.toLowerCase().includes("token")) {
      if (key === "LANGCHAIN_REVISION_ID") {
        envVars["revision_id"] = value;
      } else {
        envVars[key] = value;
      }
    }
  }
  return envVars;
}
function getEnvironmentVariables() {
  try {
    if (typeof process !== "undefined" && process.env) {
      return Object.entries(process.env).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {});
    }
    return void 0;
  } catch (e) {
    return void 0;
  }
}
function getEnvironmentVariable$1(name) {
  var _a;
  try {
    return typeof process !== "undefined" ? (
      // eslint-disable-next-line no-process-env
      (_a = process.env) == null ? void 0 : _a[name]
    ) : void 0;
  } catch (e) {
    return void 0;
  }
}
function getLangSmithEnvironmentVariable(name) {
  return getEnvironmentVariable$1(`LANGSMITH_${name}`) || getEnvironmentVariable$1(`LANGCHAIN_${name}`);
}
let cachedCommitSHAs;
function getShas() {
  if (cachedCommitSHAs !== void 0) {
    return cachedCommitSHAs;
  }
  const common_release_envs = [
    "VERCEL_GIT_COMMIT_SHA",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",
    "COMMIT_REF",
    "RENDER_GIT_COMMIT",
    "CI_COMMIT_SHA",
    "CIRCLE_SHA1",
    "CF_PAGES_COMMIT_SHA",
    "REACT_APP_GIT_SHA",
    "SOURCE_VERSION",
    "GITHUB_SHA",
    "TRAVIS_COMMIT",
    "GIT_COMMIT",
    "BUILD_VCS_NUMBER",
    "bamboo_planRepository_revision",
    "Build.SourceVersion",
    "BITBUCKET_COMMIT",
    "DRONE_COMMIT_SHA",
    "SEMAPHORE_GIT_SHA",
    "BUILDKITE_COMMIT"
  ];
  const shas = {};
  for (const env of common_release_envs) {
    const envVar = getEnvironmentVariable$1(env);
    if (envVar !== void 0) {
      shas[env] = envVar;
    }
  }
  cachedCommitSHAs = shas;
  return shas;
}
const isTracingEnabled$1 = (tracingEnabled) => {
  const envVars = ["TRACING_V2", "TRACING"];
  return !!envVars.find((envVar) => getLangSmithEnvironmentVariable(envVar) === "true");
};
const _LC_CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");
function stripNonAlphanumeric$1(input) {
  return input.replace(/[-:.]/g, "");
}
function convertToDottedOrderFormat$1(epoch, runId, executionOrder = 1) {
  const paddedOrder = executionOrder.toFixed(0).slice(0, 3).padStart(3, "0");
  return stripNonAlphanumeric$1(`${new Date(epoch).toISOString().slice(0, -1)}${paddedOrder}Z`) + runId;
}
class Baggage {
  constructor(metadata, tags) {
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.metadata = metadata;
    this.tags = tags;
  }
  static fromHeader(value) {
    const items = value.split(",");
    let metadata = {};
    let tags = [];
    for (const item of items) {
      const [key, uriValue] = item.split("=");
      const value2 = decodeURIComponent(uriValue);
      if (key === "langsmith-metadata") {
        metadata = JSON.parse(value2);
      } else if (key === "langsmith-tags") {
        tags = value2.split(",");
      }
    }
    return new Baggage(metadata, tags);
  }
  toHeader() {
    const items = [];
    if (this.metadata && Object.keys(this.metadata).length > 0) {
      items.push(`langsmith-metadata=${encodeURIComponent(JSON.stringify(this.metadata))}`);
    }
    if (this.tags && this.tags.length > 0) {
      items.push(`langsmith-tags=${encodeURIComponent(this.tags.join(","))}`);
    }
    return items.join(",");
  }
}
class RunTree {
  constructor(originalConfig) {
    var _a;
    Object.defineProperty(this, "id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "run_type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "project_name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "parent_run", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "child_runs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "start_time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "end_time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "extra", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "error", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serialized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inputs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "outputs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "reference_example_id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "events", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "trace_id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dotted_order", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tracingEnabled", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "execution_order", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "child_execution_order", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    if (isRunTree(originalConfig)) {
      Object.assign(this, { ...originalConfig });
      return;
    }
    const defaultConfig = RunTree.getDefaultConfig();
    const { metadata, ...config } = originalConfig;
    const client = config.client ?? RunTree.getSharedClient();
    const dedupedMetadata = {
      ...metadata,
      ...(_a = config == null ? void 0 : config.extra) == null ? void 0 : _a.metadata
    };
    config.extra = { ...config.extra, metadata: dedupedMetadata };
    Object.assign(this, { ...defaultConfig, ...config, client });
    if (!this.trace_id) {
      if (this.parent_run) {
        this.trace_id = this.parent_run.trace_id ?? this.id;
      } else {
        this.trace_id = this.id;
      }
    }
    this.execution_order ?? (this.execution_order = 1);
    this.child_execution_order ?? (this.child_execution_order = 1);
    if (!this.dotted_order) {
      const currentDottedOrder = convertToDottedOrderFormat$1(this.start_time, this.id, this.execution_order);
      if (this.parent_run) {
        this.dotted_order = this.parent_run.dotted_order + "." + currentDottedOrder;
      } else {
        this.dotted_order = currentDottedOrder;
      }
    }
  }
  static getDefaultConfig() {
    return {
      id: v4(),
      run_type: "chain",
      project_name: getEnvironmentVariable$1("LANGCHAIN_PROJECT") ?? getEnvironmentVariable$1("LANGCHAIN_SESSION") ?? // TODO: Deprecate
      "default",
      child_runs: [],
      api_url: getEnvironmentVariable$1("LANGCHAIN_ENDPOINT") ?? "http://localhost:1984",
      api_key: getEnvironmentVariable$1("LANGCHAIN_API_KEY"),
      caller_options: {},
      start_time: Date.now(),
      serialized: {},
      inputs: {},
      extra: {}
    };
  }
  static getSharedClient() {
    if (!RunTree.sharedClient) {
      RunTree.sharedClient = new Client();
    }
    return RunTree.sharedClient;
  }
  createChild(config) {
    var _a, _b, _c, _d, _e, _f;
    const child_execution_order = this.child_execution_order + 1;
    const child = new RunTree({
      ...config,
      parent_run: this,
      project_name: this.project_name,
      client: this.client,
      tracingEnabled: this.tracingEnabled,
      execution_order: child_execution_order,
      child_execution_order
    });
    if (_LC_CONTEXT_VARIABLES_KEY in this) {
      child[_LC_CONTEXT_VARIABLES_KEY] = this[_LC_CONTEXT_VARIABLES_KEY];
    }
    const LC_CHILD = Symbol.for("lc:child_config");
    const presentConfig = ((_a = config.extra) == null ? void 0 : _a[LC_CHILD]) ?? this.extra[LC_CHILD];
    if (isRunnableConfigLike(presentConfig)) {
      const newConfig = { ...presentConfig };
      const callbacks = isCallbackManagerLike(newConfig.callbacks) ? (_c = (_b = newConfig.callbacks).copy) == null ? void 0 : _c.call(_b) : void 0;
      if (callbacks) {
        Object.assign(callbacks, { _parentRunId: child.id });
        (_f = (_e = (_d = callbacks.handlers) == null ? void 0 : _d.find(isLangChainTracerLike)) == null ? void 0 : _e.updateFromRunTree) == null ? void 0 : _f.call(_e, child);
        newConfig.callbacks = callbacks;
      }
      child.extra[LC_CHILD] = newConfig;
    }
    const visited = /* @__PURE__ */ new Set();
    let current = this;
    while (current != null && !visited.has(current.id)) {
      visited.add(current.id);
      current.child_execution_order = Math.max(current.child_execution_order, child_execution_order);
      current = current.parent_run;
    }
    this.child_runs.push(child);
    return child;
  }
  async end(outputs, error, endTime = Date.now(), metadata) {
    this.outputs = this.outputs ?? outputs;
    this.error = this.error ?? error;
    this.end_time = this.end_time ?? endTime;
    if (metadata && Object.keys(metadata).length > 0) {
      this.extra = this.extra ? { ...this.extra, metadata: { ...this.extra.metadata, ...metadata } } : { metadata };
    }
  }
  _convertToCreate(run, runtimeEnv, excludeChildRuns = true) {
    var _a;
    const runExtra = run.extra ?? {};
    if (!runExtra.runtime) {
      runExtra.runtime = {};
    }
    if (runtimeEnv) {
      for (const [k, v] of Object.entries(runtimeEnv)) {
        if (!runExtra.runtime[k]) {
          runExtra.runtime[k] = v;
        }
      }
    }
    let child_runs;
    let parent_run_id;
    if (!excludeChildRuns) {
      child_runs = run.child_runs.map((child_run) => this._convertToCreate(child_run, runtimeEnv, excludeChildRuns));
      parent_run_id = void 0;
    } else {
      parent_run_id = (_a = run.parent_run) == null ? void 0 : _a.id;
      child_runs = [];
    }
    const persistedRun = {
      id: run.id,
      name: run.name,
      start_time: run.start_time,
      end_time: run.end_time,
      run_type: run.run_type,
      reference_example_id: run.reference_example_id,
      extra: runExtra,
      serialized: run.serialized,
      error: run.error,
      inputs: run.inputs,
      outputs: run.outputs,
      session_name: run.project_name,
      child_runs,
      parent_run_id,
      trace_id: run.trace_id,
      dotted_order: run.dotted_order,
      tags: run.tags
    };
    return persistedRun;
  }
  async postRun(excludeChildRuns = true) {
    try {
      const runtimeEnv = getRuntimeEnvironment$1();
      const runCreate = await this._convertToCreate(this, runtimeEnv, true);
      await this.client.createRun(runCreate);
      if (!excludeChildRuns) {
        warnOnce("Posting with excludeChildRuns=false is deprecated and will be removed in a future version.");
        for (const childRun of this.child_runs) {
          await childRun.postRun(false);
        }
      }
    } catch (error) {
      console.error(`Error in postRun for run ${this.id}:`, error);
    }
  }
  async patchRun() {
    var _a;
    try {
      const runUpdate = {
        end_time: this.end_time,
        error: this.error,
        inputs: this.inputs,
        outputs: this.outputs,
        parent_run_id: (_a = this.parent_run) == null ? void 0 : _a.id,
        reference_example_id: this.reference_example_id,
        extra: this.extra,
        events: this.events,
        dotted_order: this.dotted_order,
        trace_id: this.trace_id,
        tags: this.tags
      };
      await this.client.updateRun(this.id, runUpdate);
    } catch (error) {
      console.error(`Error in patchRun for run ${this.id}`, error);
    }
  }
  toJSON() {
    return this._convertToCreate(this, void 0, false);
  }
  static fromRunnableConfig(parentConfig, props) {
    var _a, _b, _c, _d;
    const callbackManager = parentConfig == null ? void 0 : parentConfig.callbacks;
    let parentRun;
    let projectName;
    let client;
    let tracingEnabled = isTracingEnabled$1();
    if (callbackManager) {
      const parentRunId = ((_a = callbackManager == null ? void 0 : callbackManager.getParentRunId) == null ? void 0 : _a.call(callbackManager)) ?? "";
      const langChainTracer = (_b = callbackManager == null ? void 0 : callbackManager.handlers) == null ? void 0 : _b.find((handler) => (handler == null ? void 0 : handler.name) == "langchain_tracer");
      parentRun = (_c = langChainTracer == null ? void 0 : langChainTracer.getRun) == null ? void 0 : _c.call(langChainTracer, parentRunId);
      projectName = langChainTracer == null ? void 0 : langChainTracer.projectName;
      client = langChainTracer == null ? void 0 : langChainTracer.client;
      tracingEnabled = tracingEnabled || !!langChainTracer;
    }
    if (!parentRun) {
      return new RunTree({
        ...props,
        client,
        tracingEnabled,
        project_name: projectName
      });
    }
    const parentRunTree = new RunTree({
      name: parentRun.name,
      id: parentRun.id,
      trace_id: parentRun.trace_id,
      dotted_order: parentRun.dotted_order,
      client,
      tracingEnabled,
      project_name: projectName,
      tags: [
        ...new Set(((parentRun == null ? void 0 : parentRun.tags) ?? []).concat((parentConfig == null ? void 0 : parentConfig.tags) ?? []))
      ],
      extra: {
        metadata: {
          ...(_d = parentRun == null ? void 0 : parentRun.extra) == null ? void 0 : _d.metadata,
          ...parentConfig == null ? void 0 : parentConfig.metadata
        }
      }
    });
    return parentRunTree.createChild(props);
  }
  static fromDottedOrder(dottedOrder) {
    return this.fromHeaders({ "langsmith-trace": dottedOrder });
  }
  static fromHeaders(headers, inheritArgs) {
    var _a;
    const rawHeaders = "get" in headers && typeof headers.get === "function" ? {
      "langsmith-trace": headers.get("langsmith-trace"),
      baggage: headers.get("baggage")
    } : headers;
    const headerTrace = rawHeaders["langsmith-trace"];
    if (!headerTrace || typeof headerTrace !== "string")
      return void 0;
    const parentDottedOrder = headerTrace.trim();
    const parsedDottedOrder = parentDottedOrder.split(".").map((part) => {
      const [strTime, uuid2] = part.split("Z");
      return { strTime, time: Date.parse(strTime + "Z"), uuid: uuid2 };
    });
    const traceId = parsedDottedOrder[0].uuid;
    const config = {
      ...inheritArgs,
      name: (inheritArgs == null ? void 0 : inheritArgs["name"]) ?? "parent",
      run_type: (inheritArgs == null ? void 0 : inheritArgs["run_type"]) ?? "chain",
      start_time: (inheritArgs == null ? void 0 : inheritArgs["start_time"]) ?? Date.now(),
      id: (_a = parsedDottedOrder.at(-1)) == null ? void 0 : _a.uuid,
      trace_id: traceId,
      dotted_order: parentDottedOrder
    };
    if (rawHeaders["baggage"] && typeof rawHeaders["baggage"] === "string") {
      const baggage = Baggage.fromHeader(rawHeaders["baggage"]);
      config.metadata = baggage.metadata;
      config.tags = baggage.tags;
    }
    return new RunTree(config);
  }
  toHeaders(headers) {
    var _a;
    const result = {
      "langsmith-trace": this.dotted_order,
      baggage: new Baggage((_a = this.extra) == null ? void 0 : _a.metadata, this.tags).toHeader()
    };
    if (headers) {
      for (const [key, value] of Object.entries(result)) {
        headers.set(key, value);
      }
    }
    return result;
  }
}
Object.defineProperty(RunTree, "sharedClient", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: null
});
function isRunTree(x) {
  return x !== void 0 && typeof x.createChild === "function" && typeof x.postRun === "function";
}
function isLangChainTracerLike(x) {
  return typeof x === "object" && x != null && typeof x.name === "string" && x.name === "langchain_tracer";
}
function containsLangChainTracerLike(x) {
  return Array.isArray(x) && x.some((callback) => isLangChainTracerLike(callback));
}
function isCallbackManagerLike(x) {
  return typeof x === "object" && x != null && Array.isArray(x.handlers);
}
function isRunnableConfigLike(x) {
  var _a;
  return x !== void 0 && typeof x.callbacks === "object" && // Callback manager with a langchain tracer
  (containsLangChainTracerLike((_a = x.callbacks) == null ? void 0 : _a.handlers) || // Or it's an array with a LangChainTracerLike object within it
  containsLangChainTracerLike(x.callbacks));
}
let MockAsyncLocalStorage$1 = class MockAsyncLocalStorage {
  getStore() {
    return void 0;
  }
  run(_, callback) {
    return callback();
  }
};
const TRACING_ALS_KEY$1 = Symbol.for("ls:tracing_async_local_storage");
const mockAsyncLocalStorage$1 = new MockAsyncLocalStorage$1();
let AsyncLocalStorageProvider$1 = class AsyncLocalStorageProvider {
  getInstance() {
    return globalThis[TRACING_ALS_KEY$1] ?? mockAsyncLocalStorage$1;
  }
  initializeGlobalInstance(instance) {
    if (globalThis[TRACING_ALS_KEY$1] === void 0) {
      globalThis[TRACING_ALS_KEY$1] = instance;
    }
  }
};
const AsyncLocalStorageProviderSingleton$1 = new AsyncLocalStorageProvider$1();
const getCurrentRunTree = () => {
  const runTree = AsyncLocalStorageProviderSingleton$1.getInstance().getStore();
  if (!isRunTree(runTree)) {
    throw new Error([
      "Could not get the current run tree.",
      "",
      "Please make sure you are calling this method within a traceable function or the tracing is enabled."
    ].join("\n"));
  }
  return runTree;
};
function isTraceableFunction(x) {
  return typeof x === "function" && "langsmith:traceable" in x;
}
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key) {
  return _hasOwnProperty.call(obj, key);
}
function _objectKeys(obj) {
  if (Array.isArray(obj)) {
    const keys2 = new Array(obj.length);
    for (let k = 0; k < keys2.length; k++) {
      keys2[k] = "" + k;
    }
    return keys2;
  }
  if (Object.keys) {
    return Object.keys(obj);
  }
  let keys = [];
  for (let i in obj) {
    if (hasOwnProperty(obj, i)) {
      keys.push(i);
    }
  }
  return keys;
}
function _deepClone(obj) {
  switch (typeof obj) {
    case "object":
      return JSON.parse(JSON.stringify(obj));
    //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null;
    //this is how JSON.stringify behaves for array items
    default:
      return obj;
  }
}
function isInteger(str) {
  let i = 0;
  const len = str.length;
  let charCode;
  while (i < len) {
    charCode = str.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      i++;
      continue;
    }
    return false;
  }
  return true;
}
function unescapePathComponent(path) {
  return path.replace(/~1/g, "/").replace(/~0/g, "~");
}
function hasUndefined(obj) {
  if (obj === void 0) {
    return true;
  }
  if (obj) {
    if (Array.isArray(obj)) {
      for (let i2 = 0, len = obj.length; i2 < len; i2++) {
        if (hasUndefined(obj[i2])) {
          return true;
        }
      }
    } else if (typeof obj === "object") {
      const objKeys = _objectKeys(obj);
      const objKeysLength = objKeys.length;
      for (var i = 0; i < objKeysLength; i++) {
        if (hasUndefined(obj[objKeys[i]])) {
          return true;
        }
      }
    }
  }
  return false;
}
function patchErrorMessageFormatter(message, args) {
  const messageParts = [message];
  for (const key in args) {
    const value = typeof args[key] === "object" ? JSON.stringify(args[key], null, 2) : args[key];
    if (typeof value !== "undefined") {
      messageParts.push(`${key}: ${value}`);
    }
  }
  return messageParts.join("\n");
}
class PatchError extends Error {
  constructor(message, name, index, operation, tree) {
    super(patchErrorMessageFormatter(message, { name, index, operation, tree }));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: name
    });
    Object.defineProperty(this, "index", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: index
    });
    Object.defineProperty(this, "operation", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: operation
    });
    Object.defineProperty(this, "tree", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: tree
    });
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = patchErrorMessageFormatter(message, {
      name,
      index,
      operation,
      tree
    });
  }
}
const JsonPatchError = PatchError;
const objOps = {
  add: function(obj, key, document) {
    obj[key] = this.value;
    return { newDocument: document };
  },
  remove: function(obj, key, document) {
    var removed = obj[key];
    delete obj[key];
    return { newDocument: document, removed };
  },
  replace: function(obj, key, document) {
    var removed = obj[key];
    obj[key] = this.value;
    return { newDocument: document, removed };
  },
  move: function(obj, key, document) {
    let removed = getValueByPointer(document, this.path);
    if (removed) {
      removed = _deepClone(removed);
    }
    const originalValue = applyOperation(document, {
      op: "remove",
      path: this.from
    }).removed;
    applyOperation(document, {
      op: "add",
      path: this.path,
      value: originalValue
    });
    return { newDocument: document, removed };
  },
  copy: function(obj, key, document) {
    const valueToCopy = getValueByPointer(document, this.from);
    applyOperation(document, {
      op: "add",
      path: this.path,
      value: _deepClone(valueToCopy)
    });
    return { newDocument: document };
  },
  test: function(obj, key, document) {
    return { newDocument: document, test: _areEquals(obj[key], this.value) };
  },
  _get: function(obj, key, document) {
    this.value = obj[key];
    return { newDocument: document };
  }
};
var arrOps = {
  add: function(arr2, i, document) {
    if (isInteger(i)) {
      arr2.splice(i, 0, this.value);
    } else {
      arr2[i] = this.value;
    }
    return { newDocument: document, index: i };
  },
  remove: function(arr2, i, document) {
    var removedList = arr2.splice(i, 1);
    return { newDocument: document, removed: removedList[0] };
  },
  replace: function(arr2, i, document) {
    var removed = arr2[i];
    arr2[i] = this.value;
    return { newDocument: document, removed };
  },
  move: objOps.move,
  copy: objOps.copy,
  test: objOps.test,
  _get: objOps._get
};
function getValueByPointer(document, pointer) {
  if (pointer == "") {
    return document;
  }
  var getOriginalDestination = { op: "_get", path: pointer };
  applyOperation(document, getOriginalDestination);
  return getOriginalDestination.value;
}
function applyOperation(document, operation, validateOperation = false, mutateDocument = true, banPrototypeModifications = true, index = 0) {
  if (validateOperation) {
    if (typeof validateOperation == "function") {
      validateOperation(operation, 0, document, operation.path);
    } else {
      validator(operation, 0);
    }
  }
  if (operation.path === "") {
    let returnValue = { newDocument: document };
    if (operation.op === "add") {
      returnValue.newDocument = operation.value;
      return returnValue;
    } else if (operation.op === "replace") {
      returnValue.newDocument = operation.value;
      returnValue.removed = document;
      return returnValue;
    } else if (operation.op === "move" || operation.op === "copy") {
      returnValue.newDocument = getValueByPointer(document, operation.from);
      if (operation.op === "move") {
        returnValue.removed = document;
      }
      return returnValue;
    } else if (operation.op === "test") {
      returnValue.test = _areEquals(document, operation.value);
      if (returnValue.test === false) {
        throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
      }
      returnValue.newDocument = document;
      return returnValue;
    } else if (operation.op === "remove") {
      returnValue.removed = document;
      returnValue.newDocument = null;
      return returnValue;
    } else if (operation.op === "_get") {
      operation.value = document;
      return returnValue;
    } else {
      if (validateOperation) {
        throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document);
      } else {
        return returnValue;
      }
    }
  } else {
    if (!mutateDocument) {
      document = _deepClone(document);
    }
    const path = operation.path || "";
    const keys = path.split("/");
    let obj = document;
    let t = 1;
    let len = keys.length;
    let existingPathFragment = void 0;
    let key;
    let validateFunction;
    if (typeof validateOperation == "function") {
      validateFunction = validateOperation;
    } else {
      validateFunction = validator;
    }
    while (true) {
      key = keys[t];
      if (key && key.indexOf("~") != -1) {
        key = unescapePathComponent(key);
      }
      if (banPrototypeModifications && (key == "__proto__" || key == "prototype" && t > 0 && keys[t - 1] == "constructor")) {
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      }
      if (validateOperation) {
        if (existingPathFragment === void 0) {
          if (obj[key] === void 0) {
            existingPathFragment = keys.slice(0, t).join("/");
          } else if (t == len - 1) {
            existingPathFragment = operation.path;
          }
          if (existingPathFragment !== void 0) {
            validateFunction(operation, 0, document, existingPathFragment);
          }
        }
      }
      t++;
      if (Array.isArray(obj)) {
        if (key === "-") {
          key = obj.length;
        } else {
          if (validateOperation && !isInteger(key)) {
            throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", index, operation, document);
          } else if (isInteger(key)) {
            key = ~~key;
          }
        }
        if (t >= len) {
          if (validateOperation && operation.op === "add" && key > obj.length) {
            throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", index, operation, document);
          }
          const returnValue = arrOps[operation.op].call(operation, obj, key, document);
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
          }
          return returnValue;
        }
      } else {
        if (t >= len) {
          const returnValue = objOps[operation.op].call(operation, obj, key, document);
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
          }
          return returnValue;
        }
      }
      obj = obj[key];
      if (validateOperation && t < len && (!obj || typeof obj !== "object")) {
        throw new JsonPatchError("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", index, operation, document);
      }
    }
  }
}
function applyPatch(document, patch, validateOperation, mutateDocument = true, banPrototypeModifications = true) {
  if (validateOperation) {
    if (!Array.isArray(patch)) {
      throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    }
  }
  if (!mutateDocument) {
    document = _deepClone(document);
  }
  const results = new Array(patch.length);
  for (let i = 0, length = patch.length; i < length; i++) {
    results[i] = applyOperation(document, patch[i], validateOperation, true, banPrototypeModifications, i);
    document = results[i].newDocument;
  }
  results.newDocument = document;
  return results;
}
function validator(operation, index, document, existingPathFragment) {
  if (typeof operation !== "object" || operation === null || Array.isArray(operation)) {
    throw new JsonPatchError("Operation is not an object", "OPERATION_NOT_AN_OBJECT", index, operation, document);
  } else if (!objOps[operation.op]) {
    throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document);
  } else if (typeof operation.path !== "string") {
    throw new JsonPatchError("Operation `path` property is not a string", "OPERATION_PATH_INVALID", index, operation, document);
  } else if (operation.path.indexOf("/") !== 0 && operation.path.length > 0) {
    throw new JsonPatchError('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", index, operation, document);
  } else if ((operation.op === "move" || operation.op === "copy") && typeof operation.from !== "string") {
    throw new JsonPatchError("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", index, operation, document);
  } else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && operation.value === void 0) {
    throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", index, operation, document);
  } else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && hasUndefined(operation.value)) {
    throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", index, operation, document);
  } else if (document) {
    if (operation.op == "add") {
      var pathLen = operation.path.split("/").length;
      var existingPathLen = existingPathFragment.split("/").length;
      if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
        throw new JsonPatchError("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", index, operation, document);
      }
    } else if (operation.op === "replace" || operation.op === "remove" || operation.op === "_get") {
      if (operation.path !== existingPathFragment) {
        throw new JsonPatchError("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", index, operation, document);
      }
    } else if (operation.op === "move" || operation.op === "copy") {
      var existingValue = {
        op: "_get",
        path: operation.from,
        value: void 0
      };
      var error = validate([existingValue], document);
      if (error && error.name === "OPERATION_PATH_UNRESOLVABLE") {
        throw new JsonPatchError("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", index, operation, document);
      }
    }
  }
}
function validate(sequence, document, externalValidator) {
  try {
    if (!Array.isArray(sequence)) {
      throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    }
    if (document) {
      applyPatch(_deepClone(document), _deepClone(sequence), externalValidator || true);
    } else {
      externalValidator = externalValidator || validator;
      for (var i = 0; i < sequence.length; i++) {
        externalValidator(sequence[i], i, document, void 0);
      }
    }
  } catch (e) {
    if (e instanceof JsonPatchError) {
      return e;
    } else {
      throw e;
    }
  }
}
function _areEquals(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
    if (arrA && arrB) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!_areEquals(a[i], b[i]))
          return false;
      return true;
    }
    if (arrA != arrB)
      return false;
    var keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!b.hasOwnProperty(keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      key = keys[i];
      if (!_areEquals(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
}
function keyToJson(key, map) {
  return (map == null ? void 0 : map[key]) || snakeCase(key);
}
function mapKeys(fields, mapper, map) {
  const mapped = {};
  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      mapped[mapper(key, map)] = fields[key];
    }
  }
  return mapped;
}
function shallowCopy(obj) {
  return Array.isArray(obj) ? [...obj] : { ...obj };
}
function replaceSecrets(root, secretsMap) {
  const result = shallowCopy(root);
  for (const [path, secretId] of Object.entries(secretsMap)) {
    const [last, ...partsReverse] = path.split(".").reverse();
    let current = result;
    for (const part of partsReverse.reverse()) {
      if (current[part] === void 0) {
        break;
      }
      current[part] = shallowCopy(current[part]);
      current = current[part];
    }
    if (current[last] !== void 0) {
      current[last] = {
        lc: 1,
        type: "secret",
        id: [secretId]
      };
    }
  }
  return result;
}
function get_lc_unique_name(serializableClass) {
  const parentClass = Object.getPrototypeOf(serializableClass);
  const lcNameIsSubclassed = typeof serializableClass.lc_name === "function" && (typeof parentClass.lc_name !== "function" || serializableClass.lc_name() !== parentClass.lc_name());
  if (lcNameIsSubclassed) {
    return serializableClass.lc_name();
  } else {
    return serializableClass.name;
  }
}
class Serializable {
  /**
   * The name of the serializable. Override to provide an alias or
   * to preserve the serialized module name in minified environments.
   *
   * Implemented as a static method to support loading logic.
   */
  static lc_name() {
    return this.name;
  }
  /**
   * The final serialized identifier for the module.
   */
  get lc_id() {
    return [
      ...this.lc_namespace,
      get_lc_unique_name(this.constructor)
    ];
  }
  /**
   * A map of secrets, which will be omitted from serialization.
   * Keys are paths to the secret in constructor args, e.g. "foo.bar.baz".
   * Values are the secret ids, which will be used when deserializing.
   */
  get lc_secrets() {
    return void 0;
  }
  /**
   * A map of additional attributes to merge with constructor args.
   * Keys are the attribute names, e.g. "foo".
   * Values are the attribute values, which will be serialized.
   * These attributes need to be accepted by the constructor as arguments.
   */
  get lc_attributes() {
    return void 0;
  }
  /**
   * A map of aliases for constructor args.
   * Keys are the attribute names, e.g. "foo".
   * Values are the alias that will replace the key in serialization.
   * This is used to eg. make argument names match Python.
   */
  get lc_aliases() {
    return void 0;
  }
  constructor(kwargs, ..._args) {
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lc_kwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.lc_kwargs = kwargs || {};
  }
  toJSON() {
    if (!this.lc_serializable) {
      return this.toJSONNotImplemented();
    }
    if (
      // eslint-disable-next-line no-instanceof/no-instanceof
      this.lc_kwargs instanceof Serializable || typeof this.lc_kwargs !== "object" || Array.isArray(this.lc_kwargs)
    ) {
      return this.toJSONNotImplemented();
    }
    const aliases = {};
    const secrets = {};
    const kwargs = Object.keys(this.lc_kwargs).reduce((acc, key) => {
      acc[key] = key in this ? this[key] : this.lc_kwargs[key];
      return acc;
    }, {});
    for (let current = Object.getPrototypeOf(this); current; current = Object.getPrototypeOf(current)) {
      Object.assign(aliases, Reflect.get(current, "lc_aliases", this));
      Object.assign(secrets, Reflect.get(current, "lc_secrets", this));
      Object.assign(kwargs, Reflect.get(current, "lc_attributes", this));
    }
    Object.keys(secrets).forEach((keyPath) => {
      let read = this;
      let write = kwargs;
      const [last, ...partsReverse] = keyPath.split(".").reverse();
      for (const key of partsReverse.reverse()) {
        if (!(key in read) || read[key] === void 0)
          return;
        if (!(key in write) || write[key] === void 0) {
          if (typeof read[key] === "object" && read[key] != null) {
            write[key] = {};
          } else if (Array.isArray(read[key])) {
            write[key] = [];
          }
        }
        read = read[key];
        write = write[key];
      }
      if (last in read && read[last] !== void 0) {
        write[last] = write[last] || read[last];
      }
    });
    return {
      lc: 1,
      type: "constructor",
      id: this.lc_id,
      kwargs: mapKeys(Object.keys(secrets).length ? replaceSecrets(kwargs, secrets) : kwargs, keyToJson, aliases)
    };
  }
  toJSONNotImplemented() {
    return {
      lc: 1,
      type: "not_implemented",
      id: this.lc_id
    };
  }
}
const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
const isWebWorker = () => typeof globalThis === "object" && globalThis.constructor && globalThis.constructor.name === "DedicatedWorkerGlobalScope";
const isJsDom = () => typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
const isDeno = () => typeof Deno !== "undefined";
const isNode = () => typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined" && !isDeno();
const getEnv = () => {
  let env;
  if (isBrowser()) {
    env = "browser";
  } else if (isNode()) {
    env = "node";
  } else if (isWebWorker()) {
    env = "webworker";
  } else if (isJsDom()) {
    env = "jsdom";
  } else if (isDeno()) {
    env = "deno";
  } else {
    env = "other";
  }
  return env;
};
let runtimeEnvironment;
async function getRuntimeEnvironment() {
  if (runtimeEnvironment === void 0) {
    const env = getEnv();
    runtimeEnvironment = {
      library: "langchain-js",
      runtime: env
    };
  }
  return runtimeEnvironment;
}
function getEnvironmentVariable(name) {
  var _a;
  try {
    return typeof process !== "undefined" ? (
      // eslint-disable-next-line no-process-env
      (_a = process.env) == null ? void 0 : _a[name]
    ) : void 0;
  } catch (e) {
    return void 0;
  }
}
class BaseCallbackHandlerMethodsClass {
}
class BaseCallbackHandler extends BaseCallbackHandlerMethodsClass {
  get lc_namespace() {
    return ["langchain_core", "callbacks", this.name];
  }
  get lc_secrets() {
    return void 0;
  }
  get lc_attributes() {
    return void 0;
  }
  get lc_aliases() {
    return void 0;
  }
  /**
   * The name of the serializable. Override to provide an alias or
   * to preserve the serialized module name in minified environments.
   *
   * Implemented as a static method to support loading logic.
   */
  static lc_name() {
    return this.name;
  }
  /**
   * The final serialized identifier for the module.
   */
  get lc_id() {
    return [
      ...this.lc_namespace,
      get_lc_unique_name(this.constructor)
    ];
  }
  constructor(input) {
    super();
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lc_kwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "ignoreLLM", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "ignoreChain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "ignoreAgent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "ignoreRetriever", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "ignoreCustomEvent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "raiseError", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "awaitHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: getEnvironmentVariable("LANGCHAIN_CALLBACKS_BACKGROUND") !== "true"
    });
    this.lc_kwargs = input || {};
    if (input) {
      this.ignoreLLM = input.ignoreLLM ?? this.ignoreLLM;
      this.ignoreChain = input.ignoreChain ?? this.ignoreChain;
      this.ignoreAgent = input.ignoreAgent ?? this.ignoreAgent;
      this.ignoreRetriever = input.ignoreRetriever ?? this.ignoreRetriever;
      this.ignoreCustomEvent = input.ignoreCustomEvent ?? this.ignoreCustomEvent;
      this.raiseError = input.raiseError ?? this.raiseError;
      this.awaitHandlers = this.raiseError || (input._awaitHandler ?? this.awaitHandlers);
    }
  }
  copy() {
    return new this.constructor(this);
  }
  toJSON() {
    return Serializable.prototype.toJSON.call(this);
  }
  toJSONNotImplemented() {
    return Serializable.prototype.toJSONNotImplemented.call(this);
  }
  static fromMethods(methods) {
    class Handler extends BaseCallbackHandler {
      constructor() {
        super();
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: v4()
        });
        Object.assign(this, methods);
      }
    }
    return new Handler();
  }
}
function _coerceToDict$1(value, defaultKey) {
  return value && !Array.isArray(value) && typeof value === "object" ? value : { [defaultKey]: value };
}
function stripNonAlphanumeric(input) {
  return input.replace(/[-:.]/g, "");
}
function convertToDottedOrderFormat(epoch, runId, executionOrder) {
  const paddedOrder = executionOrder.toFixed(0).slice(0, 3).padStart(3, "0");
  return stripNonAlphanumeric(`${new Date(epoch).toISOString().slice(0, -1)}${paddedOrder}Z`) + runId;
}
function isBaseTracer(x) {
  return typeof x._addRunToRunMap === "function";
}
class BaseTracer extends BaseCallbackHandler {
  constructor(_fields) {
    super(...arguments);
    Object.defineProperty(this, "runMap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /* @__PURE__ */ new Map()
    });
  }
  copy() {
    return this;
  }
  stringifyError(error) {
    if (error instanceof Error) {
      return error.message + ((error == null ? void 0 : error.stack) ? `

${error.stack}` : "");
    }
    if (typeof error === "string") {
      return error;
    }
    return `${error}`;
  }
  _addChildRun(parentRun, childRun) {
    parentRun.child_runs.push(childRun);
  }
  _addRunToRunMap(run) {
    const currentDottedOrder = convertToDottedOrderFormat(run.start_time, run.id, run.execution_order);
    const storedRun = { ...run };
    if (storedRun.parent_run_id !== void 0) {
      const parentRun = this.runMap.get(storedRun.parent_run_id);
      if (parentRun) {
        this._addChildRun(parentRun, storedRun);
        parentRun.child_execution_order = Math.max(parentRun.child_execution_order, storedRun.child_execution_order);
        storedRun.trace_id = parentRun.trace_id;
        if (parentRun.dotted_order !== void 0) {
          storedRun.dotted_order = [
            parentRun.dotted_order,
            currentDottedOrder
          ].join(".");
        }
      }
    } else {
      storedRun.trace_id = storedRun.id;
      storedRun.dotted_order = currentDottedOrder;
    }
    this.runMap.set(storedRun.id, storedRun);
    return storedRun;
  }
  async _endTrace(run) {
    var _a;
    const parentRun = run.parent_run_id !== void 0 && this.runMap.get(run.parent_run_id);
    if (parentRun) {
      parentRun.child_execution_order = Math.max(parentRun.child_execution_order, run.child_execution_order);
    } else {
      await this.persistRun(run);
    }
    this.runMap.delete(run.id);
    await ((_a = this.onRunUpdate) == null ? void 0 : _a.call(this, run));
  }
  _getExecutionOrder(parentRunId) {
    const parentRun = parentRunId !== void 0 && this.runMap.get(parentRunId);
    if (!parentRun) {
      return 1;
    }
    return parentRun.child_execution_order + 1;
  }
  /**
   * Create and add a run to the run map for LLM start events.
   * This must sometimes be done synchronously to avoid race conditions
   * when callbacks are backgrounded, so we expose it as a separate method here.
   */
  _createRunForLLMStart(llm2, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
    const execution_order = this._getExecutionOrder(parentRunId);
    const start_time = Date.now();
    const finalExtraParams = metadata ? { ...extraParams, metadata } : extraParams;
    const run = {
      id: runId,
      name: name ?? llm2.id[llm2.id.length - 1],
      parent_run_id: parentRunId,
      start_time,
      serialized: llm2,
      events: [
        {
          name: "start",
          time: new Date(start_time).toISOString()
        }
      ],
      inputs: { prompts },
      execution_order,
      child_runs: [],
      child_execution_order: execution_order,
      run_type: "llm",
      extra: finalExtraParams ?? {},
      tags: tags || []
    };
    return this._addRunToRunMap(run);
  }
  async handleLLMStart(llm2, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
    var _a, _b;
    const run = this.runMap.get(runId) ?? this._createRunForLLMStart(llm2, prompts, runId, parentRunId, extraParams, tags, metadata, name);
    await ((_a = this.onRunCreate) == null ? void 0 : _a.call(this, run));
    await ((_b = this.onLLMStart) == null ? void 0 : _b.call(this, run));
    return run;
  }
  /**
   * Create and add a run to the run map for chat model start events.
   * This must sometimes be done synchronously to avoid race conditions
   * when callbacks are backgrounded, so we expose it as a separate method here.
   */
  _createRunForChatModelStart(llm2, messages, runId, parentRunId, extraParams, tags, metadata, name) {
    const execution_order = this._getExecutionOrder(parentRunId);
    const start_time = Date.now();
    const finalExtraParams = metadata ? { ...extraParams, metadata } : extraParams;
    const run = {
      id: runId,
      name: name ?? llm2.id[llm2.id.length - 1],
      parent_run_id: parentRunId,
      start_time,
      serialized: llm2,
      events: [
        {
          name: "start",
          time: new Date(start_time).toISOString()
        }
      ],
      inputs: { messages },
      execution_order,
      child_runs: [],
      child_execution_order: execution_order,
      run_type: "llm",
      extra: finalExtraParams ?? {},
      tags: tags || []
    };
    return this._addRunToRunMap(run);
  }
  async handleChatModelStart(llm2, messages, runId, parentRunId, extraParams, tags, metadata, name) {
    var _a, _b;
    const run = this.runMap.get(runId) ?? this._createRunForChatModelStart(llm2, messages, runId, parentRunId, extraParams, tags, metadata, name);
    await ((_a = this.onRunCreate) == null ? void 0 : _a.call(this, run));
    await ((_b = this.onLLMStart) == null ? void 0 : _b.call(this, run));
    return run;
  }
  async handleLLMEnd(output, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "llm") {
      throw new Error("No LLM run to end.");
    }
    run.end_time = Date.now();
    run.outputs = output;
    run.events.push({
      name: "end",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onLLMEnd) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleLLMError(error, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "llm") {
      throw new Error("No LLM run to end.");
    }
    run.end_time = Date.now();
    run.error = this.stringifyError(error);
    run.events.push({
      name: "error",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onLLMError) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  /**
   * Create and add a run to the run map for chain start events.
   * This must sometimes be done synchronously to avoid race conditions
   * when callbacks are backgrounded, so we expose it as a separate method here.
   */
  _createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name) {
    const execution_order = this._getExecutionOrder(parentRunId);
    const start_time = Date.now();
    const run = {
      id: runId,
      name: name ?? chain.id[chain.id.length - 1],
      parent_run_id: parentRunId,
      start_time,
      serialized: chain,
      events: [
        {
          name: "start",
          time: new Date(start_time).toISOString()
        }
      ],
      inputs,
      execution_order,
      child_execution_order: execution_order,
      run_type: runType ?? "chain",
      child_runs: [],
      extra: metadata ? { metadata } : {},
      tags: tags || []
    };
    return this._addRunToRunMap(run);
  }
  async handleChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name) {
    var _a, _b;
    const run = this.runMap.get(runId) ?? this._createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name);
    await ((_a = this.onRunCreate) == null ? void 0 : _a.call(this, run));
    await ((_b = this.onChainStart) == null ? void 0 : _b.call(this, run));
    return run;
  }
  async handleChainEnd(outputs, runId, _parentRunId, _tags, kwargs) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run) {
      throw new Error("No chain run to end.");
    }
    run.end_time = Date.now();
    run.outputs = _coerceToDict$1(outputs, "output");
    run.events.push({
      name: "end",
      time: new Date(run.end_time).toISOString()
    });
    if ((kwargs == null ? void 0 : kwargs.inputs) !== void 0) {
      run.inputs = _coerceToDict$1(kwargs.inputs, "input");
    }
    await ((_a = this.onChainEnd) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleChainError(error, runId, _parentRunId, _tags, kwargs) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run) {
      throw new Error("No chain run to end.");
    }
    run.end_time = Date.now();
    run.error = this.stringifyError(error);
    run.events.push({
      name: "error",
      time: new Date(run.end_time).toISOString()
    });
    if ((kwargs == null ? void 0 : kwargs.inputs) !== void 0) {
      run.inputs = _coerceToDict$1(kwargs.inputs, "input");
    }
    await ((_a = this.onChainError) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  /**
   * Create and add a run to the run map for tool start events.
   * This must sometimes be done synchronously to avoid race conditions
   * when callbacks are backgrounded, so we expose it as a separate method here.
   */
  _createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
    const execution_order = this._getExecutionOrder(parentRunId);
    const start_time = Date.now();
    const run = {
      id: runId,
      name: name ?? tool.id[tool.id.length - 1],
      parent_run_id: parentRunId,
      start_time,
      serialized: tool,
      events: [
        {
          name: "start",
          time: new Date(start_time).toISOString()
        }
      ],
      inputs: { input },
      execution_order,
      child_execution_order: execution_order,
      run_type: "tool",
      child_runs: [],
      extra: metadata ? { metadata } : {},
      tags: tags || []
    };
    return this._addRunToRunMap(run);
  }
  async handleToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
    var _a, _b;
    const run = this.runMap.get(runId) ?? this._createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name);
    await ((_a = this.onRunCreate) == null ? void 0 : _a.call(this, run));
    await ((_b = this.onToolStart) == null ? void 0 : _b.call(this, run));
    return run;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleToolEnd(output, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "tool") {
      throw new Error("No tool run to end");
    }
    run.end_time = Date.now();
    run.outputs = { output };
    run.events.push({
      name: "end",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onToolEnd) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleToolError(error, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "tool") {
      throw new Error("No tool run to end");
    }
    run.end_time = Date.now();
    run.error = this.stringifyError(error);
    run.events.push({
      name: "error",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onToolError) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleAgentAction(action, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "chain") {
      return;
    }
    const agentRun = run;
    agentRun.actions = agentRun.actions || [];
    agentRun.actions.push(action);
    agentRun.events.push({
      name: "agent_action",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      kwargs: { action }
    });
    await ((_a = this.onAgentAction) == null ? void 0 : _a.call(this, run));
  }
  async handleAgentEnd(action, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "chain") {
      return;
    }
    run.events.push({
      name: "agent_end",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      kwargs: { action }
    });
    await ((_a = this.onAgentEnd) == null ? void 0 : _a.call(this, run));
  }
  /**
   * Create and add a run to the run map for retriever start events.
   * This must sometimes be done synchronously to avoid race conditions
   * when callbacks are backgrounded, so we expose it as a separate method here.
   */
  _createRunForRetrieverStart(retriever, query2, runId, parentRunId, tags, metadata, name) {
    const execution_order = this._getExecutionOrder(parentRunId);
    const start_time = Date.now();
    const run = {
      id: runId,
      name: name ?? retriever.id[retriever.id.length - 1],
      parent_run_id: parentRunId,
      start_time,
      serialized: retriever,
      events: [
        {
          name: "start",
          time: new Date(start_time).toISOString()
        }
      ],
      inputs: { query: query2 },
      execution_order,
      child_execution_order: execution_order,
      run_type: "retriever",
      child_runs: [],
      extra: metadata ? { metadata } : {},
      tags: tags || []
    };
    return this._addRunToRunMap(run);
  }
  async handleRetrieverStart(retriever, query2, runId, parentRunId, tags, metadata, name) {
    var _a, _b;
    const run = this.runMap.get(runId) ?? this._createRunForRetrieverStart(retriever, query2, runId, parentRunId, tags, metadata, name);
    await ((_a = this.onRunCreate) == null ? void 0 : _a.call(this, run));
    await ((_b = this.onRetrieverStart) == null ? void 0 : _b.call(this, run));
    return run;
  }
  async handleRetrieverEnd(documents, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "retriever") {
      throw new Error("No retriever run to end");
    }
    run.end_time = Date.now();
    run.outputs = { documents };
    run.events.push({
      name: "end",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onRetrieverEnd) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleRetrieverError(error, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "retriever") {
      throw new Error("No retriever run to end");
    }
    run.end_time = Date.now();
    run.error = this.stringifyError(error);
    run.events.push({
      name: "error",
      time: new Date(run.end_time).toISOString()
    });
    await ((_a = this.onRetrieverError) == null ? void 0 : _a.call(this, run));
    await this._endTrace(run);
    return run;
  }
  async handleText(text, runId) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "chain") {
      return;
    }
    run.events.push({
      name: "text",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      kwargs: { text }
    });
    await ((_a = this.onText) == null ? void 0 : _a.call(this, run));
  }
  async handleLLMNewToken(token, idx, runId, _parentRunId, _tags, fields) {
    var _a;
    const run = this.runMap.get(runId);
    if (!run || (run == null ? void 0 : run.run_type) !== "llm") {
      throw new Error(`Invalid "runId" provided to "handleLLMNewToken" callback.`);
    }
    run.events.push({
      name: "new_token",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      kwargs: { token, idx, chunk: fields == null ? void 0 : fields.chunk }
    });
    await ((_a = this.onLLMNewToken) == null ? void 0 : _a.call(this, run, token, { chunk: fields == null ? void 0 : fields.chunk }));
    return run;
  }
}
function wrap(style, text) {
  return `${style.open}${text}${style.close}`;
}
function tryJsonStringify(obj, fallback) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (err) {
    return fallback;
  }
}
function formatKVMapItem(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value === null || value === void 0) {
    return value;
  }
  return tryJsonStringify(value, value.toString());
}
function elapsed(run) {
  if (!run.end_time)
    return "";
  const elapsed2 = run.end_time - run.start_time;
  if (elapsed2 < 1e3) {
    return `${elapsed2}ms`;
  }
  return `${(elapsed2 / 1e3).toFixed(2)}s`;
}
const { color } = styles;
class ConsoleCallbackHandler extends BaseTracer {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "console_callback_handler"
    });
  }
  /**
   * Method used to persist the run. In this case, it simply returns a
   * resolved promise as there's no persistence logic.
   * @param _run The run to persist.
   * @returns A resolved promise.
   */
  persistRun(_run) {
    return Promise.resolve();
  }
  // utility methods
  /**
   * Method used to get all the parent runs of a given run.
   * @param run The run whose parents are to be retrieved.
   * @returns An array of parent runs.
   */
  getParents(run) {
    const parents = [];
    let currentRun = run;
    while (currentRun.parent_run_id) {
      const parent = this.runMap.get(currentRun.parent_run_id);
      if (parent) {
        parents.push(parent);
        currentRun = parent;
      } else {
        break;
      }
    }
    return parents;
  }
  /**
   * Method used to get a string representation of the run's lineage, which
   * is used in logging.
   * @param run The run whose lineage is to be retrieved.
   * @returns A string representation of the run's lineage.
   */
  getBreadcrumbs(run) {
    const parents = this.getParents(run).reverse();
    const string = [...parents, run].map((parent, i, arr2) => {
      const name = `${parent.execution_order}:${parent.run_type}:${parent.name}`;
      return i === arr2.length - 1 ? wrap(styles.bold, name) : name;
    }).join(" > ");
    return wrap(color.grey, string);
  }
  // logging methods
  /**
   * Method used to log the start of a chain run.
   * @param run The chain run that has started.
   * @returns void
   */
  onChainStart(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.green, "[chain/start]")} [${crumbs}] Entering Chain run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
  }
  /**
   * Method used to log the end of a chain run.
   * @param run The chain run that has ended.
   * @returns void
   */
  onChainEnd(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.cyan, "[chain/end]")} [${crumbs}] [${elapsed(run)}] Exiting Chain run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
  }
  /**
   * Method used to log any errors of a chain run.
   * @param run The chain run that has errored.
   * @returns void
   */
  onChainError(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.red, "[chain/error]")} [${crumbs}] [${elapsed(run)}] Chain run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
  }
  /**
   * Method used to log the start of an LLM run.
   * @param run The LLM run that has started.
   * @returns void
   */
  onLLMStart(run) {
    const crumbs = this.getBreadcrumbs(run);
    const inputs = "prompts" in run.inputs ? { prompts: run.inputs.prompts.map((p) => p.trim()) } : run.inputs;
    console.log(`${wrap(color.green, "[llm/start]")} [${crumbs}] Entering LLM run with input: ${tryJsonStringify(inputs, "[inputs]")}`);
  }
  /**
   * Method used to log the end of an LLM run.
   * @param run The LLM run that has ended.
   * @returns void
   */
  onLLMEnd(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.cyan, "[llm/end]")} [${crumbs}] [${elapsed(run)}] Exiting LLM run with output: ${tryJsonStringify(run.outputs, "[response]")}`);
  }
  /**
   * Method used to log any errors of an LLM run.
   * @param run The LLM run that has errored.
   * @returns void
   */
  onLLMError(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.red, "[llm/error]")} [${crumbs}] [${elapsed(run)}] LLM run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
  }
  /**
   * Method used to log the start of a tool run.
   * @param run The tool run that has started.
   * @returns void
   */
  onToolStart(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.green, "[tool/start]")} [${crumbs}] Entering Tool run with input: "${formatKVMapItem(run.inputs.input)}"`);
  }
  /**
   * Method used to log the end of a tool run.
   * @param run The tool run that has ended.
   * @returns void
   */
  onToolEnd(run) {
    var _a;
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.cyan, "[tool/end]")} [${crumbs}] [${elapsed(run)}] Exiting Tool run with output: "${formatKVMapItem((_a = run.outputs) == null ? void 0 : _a.output)}"`);
  }
  /**
   * Method used to log any errors of a tool run.
   * @param run The tool run that has errored.
   * @returns void
   */
  onToolError(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.red, "[tool/error]")} [${crumbs}] [${elapsed(run)}] Tool run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
  }
  /**
   * Method used to log the start of a retriever run.
   * @param run The retriever run that has started.
   * @returns void
   */
  onRetrieverStart(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.green, "[retriever/start]")} [${crumbs}] Entering Retriever run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
  }
  /**
   * Method used to log the end of a retriever run.
   * @param run The retriever run that has ended.
   * @returns void
   */
  onRetrieverEnd(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.cyan, "[retriever/end]")} [${crumbs}] [${elapsed(run)}] Exiting Retriever run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
  }
  /**
   * Method used to log any errors of a retriever run.
   * @param run The retriever run that has errored.
   * @returns void
   */
  onRetrieverError(run) {
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.red, "[retriever/error]")} [${crumbs}] [${elapsed(run)}] Retriever run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
  }
  /**
   * Method used to log the action selected by the agent.
   * @param run The run in which the agent action occurred.
   * @returns void
   */
  onAgentAction(run) {
    const agentRun = run;
    const crumbs = this.getBreadcrumbs(run);
    console.log(`${wrap(color.blue, "[agent/action]")} [${crumbs}] Agent selected action: ${tryJsonStringify(agentRun.actions[agentRun.actions.length - 1], "[action]")}`);
  }
}
function _isToolCall(toolCall) {
  return !!(toolCall && typeof toolCall === "object" && "type" in toolCall && toolCall.type === "tool_call");
}
class ToolInputParsingException extends Error {
  constructor(message, output) {
    super(message);
    Object.defineProperty(this, "output", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.output = output;
  }
}
function parsePartialJson(s) {
  if (typeof s === "undefined") {
    return null;
  }
  try {
    return JSON.parse(s);
  } catch (error) {
  }
  let new_s = "";
  const stack = [];
  let isInsideString = false;
  let escaped = false;
  for (let char of s) {
    if (isInsideString) {
      if (char === '"' && !escaped) {
        isInsideString = false;
      } else if (char === "\n" && !escaped) {
        char = "\\n";
      } else if (char === "\\") {
        escaped = !escaped;
      } else {
        escaped = false;
      }
    } else {
      if (char === '"') {
        isInsideString = true;
        escaped = false;
      } else if (char === "{") {
        stack.push("}");
      } else if (char === "[") {
        stack.push("]");
      } else if (char === "}" || char === "]") {
        if (stack && stack[stack.length - 1] === char) {
          stack.pop();
        } else {
          return null;
        }
      }
    }
    new_s += char;
  }
  if (isInsideString) {
    new_s += '"';
  }
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    new_s += stack[i];
  }
  try {
    return JSON.parse(new_s);
  } catch (error) {
    return null;
  }
}
function mergeContent(firstContent, secondContent) {
  if (typeof firstContent === "string") {
    if (typeof secondContent === "string") {
      return firstContent + secondContent;
    } else {
      return [{ type: "text", text: firstContent }, ...secondContent];
    }
  } else if (Array.isArray(secondContent)) {
    return _mergeLists(firstContent, secondContent) ?? [
      ...firstContent,
      ...secondContent
    ];
  } else {
    return [...firstContent, { type: "text", text: secondContent }];
  }
}
function stringifyWithDepthLimit(obj, depthLimit) {
  function helper(obj2, currentDepth) {
    if (typeof obj2 !== "object" || obj2 === null || obj2 === void 0) {
      return obj2;
    }
    if (currentDepth >= depthLimit) {
      if (Array.isArray(obj2)) {
        return "[Array]";
      }
      return "[Object]";
    }
    if (Array.isArray(obj2)) {
      return obj2.map((item) => helper(item, currentDepth + 1));
    }
    const result = {};
    for (const key of Object.keys(obj2)) {
      result[key] = helper(obj2[key], currentDepth + 1);
    }
    return result;
  }
  return JSON.stringify(helper(obj, 0), null, 2);
}
class BaseMessage extends Serializable {
  get lc_aliases() {
    return {
      additional_kwargs: "additional_kwargs",
      response_metadata: "response_metadata"
    };
  }
  /**
   * @deprecated
   * Use {@link BaseMessage.content} instead.
   */
  get text() {
    return typeof this.content === "string" ? this.content : "";
  }
  constructor(fields, kwargs) {
    if (typeof fields === "string") {
      fields = {
        content: fields,
        additional_kwargs: kwargs,
        response_metadata: {}
      };
    }
    if (!fields.additional_kwargs) {
      fields.additional_kwargs = {};
    }
    if (!fields.response_metadata) {
      fields.response_metadata = {};
    }
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "messages"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "content", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "additional_kwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "response_metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "id", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = fields.name;
    this.content = fields.content;
    this.additional_kwargs = fields.additional_kwargs;
    this.response_metadata = fields.response_metadata;
    this.id = fields.id;
  }
  toDict() {
    return {
      type: this._getType(),
      data: this.toJSON().kwargs
    };
  }
  static lc_name() {
    return "BaseMessage";
  }
  // Can't be protected for silly reasons
  get _printableFields() {
    return {
      id: this.id,
      content: this.content,
      name: this.name,
      additional_kwargs: this.additional_kwargs,
      response_metadata: this.response_metadata
    };
  }
  // this private method is used to update the ID for the runtime
  // value as well as in lc_kwargs for serialisation
  _updateId(value) {
    this.id = value;
    this.lc_kwargs.id = value;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.lc_name();
  }
  // Override the default behavior of console.log
  [Symbol.for("nodejs.util.inspect.custom")](depth) {
    if (depth === null) {
      return this;
    }
    const printable = stringifyWithDepthLimit(this._printableFields, Math.max(4, depth));
    return `${this.constructor.lc_name()} ${printable}`;
  }
}
function _mergeDicts(left, right) {
  const merged = { ...left };
  for (const [key, value] of Object.entries(right)) {
    if (merged[key] == null) {
      merged[key] = value;
    } else if (value == null) {
      continue;
    } else if (typeof merged[key] !== typeof value || Array.isArray(merged[key]) !== Array.isArray(value)) {
      throw new Error(`field[${key}] already exists in the message chunk, but with a different type.`);
    } else if (typeof merged[key] === "string") {
      if (key === "type") {
        continue;
      }
      merged[key] += value;
    } else if (typeof merged[key] === "object" && !Array.isArray(merged[key])) {
      merged[key] = _mergeDicts(merged[key], value);
    } else if (Array.isArray(merged[key])) {
      merged[key] = _mergeLists(merged[key], value);
    } else if (merged[key] === value) {
      continue;
    } else {
      console.warn(`field[${key}] already exists in this message chunk and value has unsupported type.`);
    }
  }
  return merged;
}
function _mergeLists(left, right) {
  if (left === void 0 && right === void 0) {
    return void 0;
  } else if (left === void 0 || right === void 0) {
    return left || right;
  } else {
    const merged = [...left];
    for (const item of right) {
      if (typeof item === "object" && "index" in item && typeof item.index === "number") {
        const toMerge = merged.findIndex((leftItem) => leftItem.index === item.index);
        if (toMerge !== -1) {
          merged[toMerge] = _mergeDicts(merged[toMerge], item);
        } else {
          merged.push(item);
        }
      } else if (typeof item === "object" && "text" in item && item.text === "") {
        continue;
      } else {
        merged.push(item);
      }
    }
    return merged;
  }
}
class BaseMessageChunk extends BaseMessage {
}
class AIMessageChunk extends BaseMessageChunk {
  constructor(fields) {
    let initParams;
    if (typeof fields === "string") {
      initParams = {
        content: fields,
        tool_calls: [],
        invalid_tool_calls: [],
        tool_call_chunks: []
      };
    } else if (fields.tool_call_chunks === void 0) {
      initParams = {
        ...fields,
        tool_calls: fields.tool_calls ?? [],
        invalid_tool_calls: [],
        tool_call_chunks: []
      };
    } else {
      const toolCalls = [];
      const invalidToolCalls = [];
      for (const toolCallChunk of fields.tool_call_chunks) {
        let parsedArgs = {};
        try {
          parsedArgs = parsePartialJson(toolCallChunk.args || "{}");
          if (parsedArgs === null || typeof parsedArgs !== "object" || Array.isArray(parsedArgs)) {
            throw new Error("Malformed tool call chunk args.");
          }
          toolCalls.push({
            name: toolCallChunk.name ?? "",
            args: parsedArgs,
            id: toolCallChunk.id,
            type: "tool_call"
          });
        } catch (e) {
          invalidToolCalls.push({
            name: toolCallChunk.name,
            args: toolCallChunk.args,
            id: toolCallChunk.id,
            error: "Malformed args.",
            type: "invalid_tool_call"
          });
        }
      }
      initParams = {
        ...fields,
        tool_calls: toolCalls,
        invalid_tool_calls: invalidToolCalls
      };
    }
    super(initParams);
    Object.defineProperty(this, "tool_calls", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "invalid_tool_calls", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "tool_call_chunks", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "usage_metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.tool_call_chunks = initParams.tool_call_chunks ?? this.tool_call_chunks;
    this.tool_calls = initParams.tool_calls ?? this.tool_calls;
    this.invalid_tool_calls = initParams.invalid_tool_calls ?? this.invalid_tool_calls;
    this.usage_metadata = initParams.usage_metadata;
  }
  get lc_aliases() {
    return {
      ...super.lc_aliases,
      tool_calls: "tool_calls",
      invalid_tool_calls: "invalid_tool_calls",
      tool_call_chunks: "tool_call_chunks"
    };
  }
  static lc_name() {
    return "AIMessageChunk";
  }
  _getType() {
    return "ai";
  }
  get _printableFields() {
    return {
      ...super._printableFields,
      tool_calls: this.tool_calls,
      tool_call_chunks: this.tool_call_chunks,
      invalid_tool_calls: this.invalid_tool_calls,
      usage_metadata: this.usage_metadata
    };
  }
  concat(chunk) {
    const combinedFields = {
      content: mergeContent(this.content, chunk.content),
      additional_kwargs: _mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
      response_metadata: _mergeDicts(this.response_metadata, chunk.response_metadata),
      tool_call_chunks: [],
      id: this.id ?? chunk.id
    };
    if (this.tool_call_chunks !== void 0 || chunk.tool_call_chunks !== void 0) {
      const rawToolCalls = _mergeLists(this.tool_call_chunks, chunk.tool_call_chunks);
      if (rawToolCalls !== void 0 && rawToolCalls.length > 0) {
        combinedFields.tool_call_chunks = rawToolCalls;
      }
    }
    if (this.usage_metadata !== void 0 || chunk.usage_metadata !== void 0) {
      const left = this.usage_metadata ?? {
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: 0
      };
      const right = chunk.usage_metadata ?? {
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: 0
      };
      const usage_metadata = {
        input_tokens: left.input_tokens + right.input_tokens,
        output_tokens: left.output_tokens + right.output_tokens,
        total_tokens: left.total_tokens + right.total_tokens
      };
      combinedFields.usage_metadata = usage_metadata;
    }
    return new AIMessageChunk(combinedFields);
  }
}
function getBufferString(messages, humanPrefix = "Human", aiPrefix = "AI") {
  const string_messages = [];
  for (const m of messages) {
    let role;
    if (m._getType() === "human") {
      role = humanPrefix;
    } else if (m._getType() === "ai") {
      role = aiPrefix;
    } else if (m._getType() === "system") {
      role = "System";
    } else if (m._getType() === "function") {
      role = "Function";
    } else if (m._getType() === "tool") {
      role = "Tool";
    } else if (m._getType() === "generic") {
      role = m.role;
    } else {
      throw new Error(`Got unsupported message type: ${m._getType()}`);
    }
    const nameStr = m.name ? `${m.name}, ` : "";
    const readableContent = typeof m.content === "string" ? m.content : JSON.stringify(m.content, null, 2);
    string_messages.push(`${role}: ${nameStr}${readableContent}`);
  }
  return string_messages.join("\n");
}
class LangChainTracer extends BaseTracer {
  constructor(fields = {}) {
    super(fields);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "langchain_tracer"
    });
    Object.defineProperty(this, "projectName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "exampleId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    const { exampleId, projectName, client } = fields;
    this.projectName = projectName ?? getEnvironmentVariable("LANGCHAIN_PROJECT") ?? getEnvironmentVariable("LANGCHAIN_SESSION");
    this.exampleId = exampleId;
    this.client = client ?? new Client({});
    const traceableTree = LangChainTracer.getTraceableRunTree();
    if (traceableTree) {
      this.updateFromRunTree(traceableTree);
    }
  }
  async _convertToCreate(run, example_id = void 0) {
    return {
      ...run,
      extra: {
        ...run.extra,
        runtime: await getRuntimeEnvironment()
      },
      child_runs: void 0,
      session_name: this.projectName,
      reference_example_id: run.parent_run_id ? void 0 : example_id
    };
  }
  async persistRun(_run) {
  }
  async onRunCreate(run) {
    const persistedRun = await this._convertToCreate(run, this.exampleId);
    await this.client.createRun(persistedRun);
  }
  async onRunUpdate(run) {
    const runUpdate = {
      end_time: run.end_time,
      error: run.error,
      outputs: run.outputs,
      events: run.events,
      inputs: run.inputs,
      trace_id: run.trace_id,
      dotted_order: run.dotted_order,
      parent_run_id: run.parent_run_id
    };
    await this.client.updateRun(run.id, runUpdate);
  }
  getRun(id) {
    return this.runMap.get(id);
  }
  updateFromRunTree(runTree) {
    let rootRun = runTree;
    const visited = /* @__PURE__ */ new Set();
    while (rootRun.parent_run) {
      if (visited.has(rootRun.id))
        break;
      visited.add(rootRun.id);
      if (!rootRun.parent_run)
        break;
      rootRun = rootRun.parent_run;
    }
    visited.clear();
    const queue2 = [rootRun];
    while (queue2.length > 0) {
      const current = queue2.shift();
      if (!current || visited.has(current.id))
        continue;
      visited.add(current.id);
      this.runMap.set(current.id, current);
      if (current.child_runs) {
        queue2.push(...current.child_runs);
      }
    }
    this.client = runTree.client ?? this.client;
    this.projectName = runTree.project_name ?? this.projectName;
    this.exampleId = runTree.reference_example_id ?? this.exampleId;
  }
  convertToRunTree(id) {
    const runTreeMap = {};
    const runTreeList = [];
    for (const [id2, run] of this.runMap) {
      const runTree = new RunTree({
        ...run,
        child_runs: [],
        parent_run: void 0,
        // inherited properties
        client: this.client,
        project_name: this.projectName,
        reference_example_id: this.exampleId,
        tracingEnabled: true
      });
      runTreeMap[id2] = runTree;
      runTreeList.push([id2, run.dotted_order]);
    }
    runTreeList.sort((a, b) => {
      if (!a[1] || !b[1])
        return 0;
      return a[1].localeCompare(b[1]);
    });
    for (const [id2] of runTreeList) {
      const run = this.runMap.get(id2);
      const runTree = runTreeMap[id2];
      if (!run || !runTree)
        continue;
      if (run.parent_run_id) {
        const parentRunTree = runTreeMap[run.parent_run_id];
        if (parentRunTree) {
          parentRunTree.child_runs.push(runTree);
          runTree.parent_run = parentRunTree;
        }
      }
    }
    return runTreeMap[id];
  }
  static getTraceableRunTree() {
    try {
      return getCurrentRunTree();
    } catch {
      return void 0;
    }
  }
}
let queue;
function createQueue() {
  const PQueue = "default" in PQueueMod ? PQueueMod.default : PQueueMod;
  return new PQueue({
    autoStart: true,
    concurrency: 1
  });
}
async function consumeCallback(promiseFn, wait) {
  if (wait === true) {
    await promiseFn();
  } else {
    if (typeof queue === "undefined") {
      queue = createQueue();
    }
    void queue.add(promiseFn);
  }
}
const isTracingEnabled = (tracingEnabled) => {
  const envVars = [
    "LANGSMITH_TRACING_V2",
    "LANGCHAIN_TRACING_V2",
    "LANGSMITH_TRACING",
    "LANGCHAIN_TRACING"
  ];
  return !!envVars.find((envVar) => getEnvironmentVariable(envVar) === "true");
};
class BaseCallbackManager {
  setHandler(handler) {
    return this.setHandlers([handler]);
  }
}
class BaseRunManager {
  constructor(runId, handlers, inheritableHandlers, tags, inheritableTags, metadata, inheritableMetadata, _parentRunId) {
    Object.defineProperty(this, "runId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: runId
    });
    Object.defineProperty(this, "handlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: handlers
    });
    Object.defineProperty(this, "inheritableHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: inheritableHandlers
    });
    Object.defineProperty(this, "tags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: tags
    });
    Object.defineProperty(this, "inheritableTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: inheritableTags
    });
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: metadata
    });
    Object.defineProperty(this, "inheritableMetadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: inheritableMetadata
    });
    Object.defineProperty(this, "_parentRunId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: _parentRunId
    });
  }
  get parentRunId() {
    return this._parentRunId;
  }
  async handleText(text) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      try {
        await ((_a = handler.handleText) == null ? void 0 : _a.call(handler, text, this.runId, this._parentRunId, this.tags));
      } catch (err) {
        const logFunction = handler.raiseError ? console.error : console.warn;
        logFunction(`Error in handler ${handler.constructor.name}, handleText: ${err}`);
        if (handler.raiseError) {
          throw err;
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleCustomEvent(eventName, data, _runId, _tags, _metadata) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      try {
        await ((_a = handler.handleCustomEvent) == null ? void 0 : _a.call(handler, eventName, data, this.runId, this.tags, this.metadata));
      } catch (err) {
        const logFunction = handler.raiseError ? console.error : console.warn;
        logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
        if (handler.raiseError) {
          throw err;
        }
      }
    }, handler.awaitHandlers)));
  }
}
class CallbackManagerForRetrieverRun extends BaseRunManager {
  getChild(tag) {
    const manager = new CallbackManager(this.runId);
    manager.setHandlers(this.inheritableHandlers);
    manager.addTags(this.inheritableTags);
    manager.addMetadata(this.inheritableMetadata);
    if (tag) {
      manager.addTags([tag], false);
    }
    return manager;
  }
  async handleRetrieverEnd(documents) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreRetriever) {
        try {
          await ((_a = handler.handleRetrieverEnd) == null ? void 0 : _a.call(handler, documents, this.runId, this._parentRunId, this.tags));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleRetriever`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleRetrieverError(err) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreRetriever) {
        try {
          await ((_a = handler.handleRetrieverError) == null ? void 0 : _a.call(handler, err, this.runId, this._parentRunId, this.tags));
        } catch (error) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverError: ${error}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
}
class CallbackManagerForLLMRun extends BaseRunManager {
  async handleLLMNewToken(token, idx, _runId, _parentRunId, _tags, fields) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreLLM) {
        try {
          await ((_a = handler.handleLLMNewToken) == null ? void 0 : _a.call(handler, token, idx ?? { prompt: 0, completion: 0 }, this.runId, this._parentRunId, this.tags, fields));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleLLMNewToken: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleLLMError(err) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreLLM) {
        try {
          await ((_a = handler.handleLLMError) == null ? void 0 : _a.call(handler, err, this.runId, this._parentRunId, this.tags));
        } catch (err2) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleLLMError: ${err2}`);
          if (handler.raiseError) {
            throw err2;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleLLMEnd(output) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreLLM) {
        try {
          await ((_a = handler.handleLLMEnd) == null ? void 0 : _a.call(handler, output, this.runId, this._parentRunId, this.tags));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleLLMEnd: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
}
class CallbackManagerForChainRun extends BaseRunManager {
  getChild(tag) {
    const manager = new CallbackManager(this.runId);
    manager.setHandlers(this.inheritableHandlers);
    manager.addTags(this.inheritableTags);
    manager.addMetadata(this.inheritableMetadata);
    if (tag) {
      manager.addTags([tag], false);
    }
    return manager;
  }
  async handleChainError(err, _runId, _parentRunId, _tags, kwargs) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreChain) {
        try {
          await ((_a = handler.handleChainError) == null ? void 0 : _a.call(handler, err, this.runId, this._parentRunId, this.tags, kwargs));
        } catch (err2) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleChainError: ${err2}`);
          if (handler.raiseError) {
            throw err2;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleChainEnd(output, _runId, _parentRunId, _tags, kwargs) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreChain) {
        try {
          await ((_a = handler.handleChainEnd) == null ? void 0 : _a.call(handler, output, this.runId, this._parentRunId, this.tags, kwargs));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleChainEnd: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleAgentAction(action) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreAgent) {
        try {
          await ((_a = handler.handleAgentAction) == null ? void 0 : _a.call(handler, action, this.runId, this._parentRunId, this.tags));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleAgentAction: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  async handleAgentEnd(action) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreAgent) {
        try {
          await ((_a = handler.handleAgentEnd) == null ? void 0 : _a.call(handler, action, this.runId, this._parentRunId, this.tags));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleAgentEnd: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
}
class CallbackManagerForToolRun extends BaseRunManager {
  getChild(tag) {
    const manager = new CallbackManager(this.runId);
    manager.setHandlers(this.inheritableHandlers);
    manager.addTags(this.inheritableTags);
    manager.addMetadata(this.inheritableMetadata);
    if (tag) {
      manager.addTags([tag], false);
    }
    return manager;
  }
  async handleToolError(err) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreAgent) {
        try {
          await ((_a = handler.handleToolError) == null ? void 0 : _a.call(handler, err, this.runId, this._parentRunId, this.tags));
        } catch (err2) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleToolError: ${err2}`);
          if (handler.raiseError) {
            throw err2;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleToolEnd(output) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreAgent) {
        try {
          await ((_a = handler.handleToolEnd) == null ? void 0 : _a.call(handler, output, this.runId, this._parentRunId, this.tags));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleToolEnd: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
}
class CallbackManager extends BaseCallbackManager {
  constructor(parentRunId, options) {
    super();
    Object.defineProperty(this, "handlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "inheritableHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "tags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "inheritableTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "inheritableMetadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "callback_manager"
    });
    Object.defineProperty(this, "_parentRunId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.handlers = (options == null ? void 0 : options.handlers) ?? this.handlers;
    this.inheritableHandlers = (options == null ? void 0 : options.inheritableHandlers) ?? this.inheritableHandlers;
    this.tags = (options == null ? void 0 : options.tags) ?? this.tags;
    this.inheritableTags = (options == null ? void 0 : options.inheritableTags) ?? this.inheritableTags;
    this.metadata = (options == null ? void 0 : options.metadata) ?? this.metadata;
    this.inheritableMetadata = (options == null ? void 0 : options.inheritableMetadata) ?? this.inheritableMetadata;
    this._parentRunId = parentRunId;
  }
  /**
   * Gets the parent run ID, if any.
   *
   * @returns The parent run ID.
   */
  getParentRunId() {
    return this._parentRunId;
  }
  async handleLLMStart(llm2, prompts, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
    return Promise.all(prompts.map(async (prompt, idx) => {
      const runId_ = idx === 0 && runId ? runId : v4();
      await Promise.all(this.handlers.map((handler) => {
        if (handler.ignoreLLM) {
          return;
        }
        if (isBaseTracer(handler)) {
          handler._createRunForLLMStart(llm2, [prompt], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
        }
        return consumeCallback(async () => {
          var _a;
          try {
            await ((_a = handler.handleLLMStart) == null ? void 0 : _a.call(handler, llm2, [prompt], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName));
          } catch (err) {
            const logFunction = handler.raiseError ? console.error : console.warn;
            logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
            if (handler.raiseError) {
              throw err;
            }
          }
        }, handler.awaitHandlers);
      }));
      return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
    }));
  }
  async handleChatModelStart(llm2, messages, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
    return Promise.all(messages.map(async (messageGroup, idx) => {
      const runId_ = idx === 0 && runId ? runId : v4();
      await Promise.all(this.handlers.map((handler) => {
        if (handler.ignoreLLM) {
          return;
        }
        if (isBaseTracer(handler)) {
          handler._createRunForChatModelStart(llm2, [messageGroup], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
        }
        return consumeCallback(async () => {
          var _a, _b;
          try {
            if (handler.handleChatModelStart) {
              await ((_a = handler.handleChatModelStart) == null ? void 0 : _a.call(handler, llm2, [messageGroup], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName));
            } else if (handler.handleLLMStart) {
              const messageString = getBufferString(messageGroup);
              await ((_b = handler.handleLLMStart) == null ? void 0 : _b.call(handler, llm2, [messageString], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName));
            }
          } catch (err) {
            const logFunction = handler.raiseError ? console.error : console.warn;
            logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
            if (handler.raiseError) {
              throw err;
            }
          }
        }, handler.awaitHandlers);
      }));
      return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
    }));
  }
  async handleChainStart(chain, inputs, runId = v4(), runType = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
    await Promise.all(this.handlers.map((handler) => {
      if (handler.ignoreChain) {
        return;
      }
      if (isBaseTracer(handler)) {
        handler._createRunForChainStart(chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName);
      }
      return consumeCallback(async () => {
        var _a;
        try {
          await ((_a = handler.handleChainStart) == null ? void 0 : _a.call(handler, chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleChainStart: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }, handler.awaitHandlers);
    }));
    return new CallbackManagerForChainRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
  }
  async handleToolStart(tool, input, runId = v4(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
    await Promise.all(this.handlers.map((handler) => {
      if (handler.ignoreAgent) {
        return;
      }
      if (isBaseTracer(handler)) {
        handler._createRunForToolStart(tool, input, runId, this._parentRunId, this.tags, this.metadata, runName);
      }
      return consumeCallback(async () => {
        var _a;
        try {
          await ((_a = handler.handleToolStart) == null ? void 0 : _a.call(handler, tool, input, runId, this._parentRunId, this.tags, this.metadata, runName));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleToolStart: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }, handler.awaitHandlers);
    }));
    return new CallbackManagerForToolRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
  }
  async handleRetrieverStart(retriever, query2, runId = v4(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
    await Promise.all(this.handlers.map((handler) => {
      if (handler.ignoreRetriever) {
        return;
      }
      if (isBaseTracer(handler)) {
        handler._createRunForRetrieverStart(retriever, query2, runId, this._parentRunId, this.tags, this.metadata, runName);
      }
      return consumeCallback(async () => {
        var _a;
        try {
          await ((_a = handler.handleRetrieverStart) == null ? void 0 : _a.call(handler, retriever, query2, runId, this._parentRunId, this.tags, this.metadata, runName));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverStart: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }, handler.awaitHandlers);
    }));
    return new CallbackManagerForRetrieverRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
  }
  async handleCustomEvent(eventName, data, runId, _tags, _metadata) {
    await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
      var _a;
      if (!handler.ignoreCustomEvent) {
        try {
          await ((_a = handler.handleCustomEvent) == null ? void 0 : _a.call(handler, eventName, data, runId, this.tags, this.metadata));
        } catch (err) {
          const logFunction = handler.raiseError ? console.error : console.warn;
          logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
          if (handler.raiseError) {
            throw err;
          }
        }
      }
    }, handler.awaitHandlers)));
  }
  addHandler(handler, inherit = true) {
    this.handlers.push(handler);
    if (inherit) {
      this.inheritableHandlers.push(handler);
    }
  }
  removeHandler(handler) {
    this.handlers = this.handlers.filter((_handler) => _handler !== handler);
    this.inheritableHandlers = this.inheritableHandlers.filter((_handler) => _handler !== handler);
  }
  setHandlers(handlers, inherit = true) {
    this.handlers = [];
    this.inheritableHandlers = [];
    for (const handler of handlers) {
      this.addHandler(handler, inherit);
    }
  }
  addTags(tags, inherit = true) {
    this.removeTags(tags);
    this.tags.push(...tags);
    if (inherit) {
      this.inheritableTags.push(...tags);
    }
  }
  removeTags(tags) {
    this.tags = this.tags.filter((tag) => !tags.includes(tag));
    this.inheritableTags = this.inheritableTags.filter((tag) => !tags.includes(tag));
  }
  addMetadata(metadata, inherit = true) {
    this.metadata = { ...this.metadata, ...metadata };
    if (inherit) {
      this.inheritableMetadata = { ...this.inheritableMetadata, ...metadata };
    }
  }
  removeMetadata(metadata) {
    for (const key of Object.keys(metadata)) {
      delete this.metadata[key];
      delete this.inheritableMetadata[key];
    }
  }
  copy(additionalHandlers = [], inherit = true) {
    const manager = new CallbackManager(this._parentRunId);
    for (const handler of this.handlers) {
      const inheritable = this.inheritableHandlers.includes(handler);
      manager.addHandler(handler, inheritable);
    }
    for (const tag of this.tags) {
      const inheritable = this.inheritableTags.includes(tag);
      manager.addTags([tag], inheritable);
    }
    for (const key of Object.keys(this.metadata)) {
      const inheritable = Object.keys(this.inheritableMetadata).includes(key);
      manager.addMetadata({ [key]: this.metadata[key] }, inheritable);
    }
    for (const handler of additionalHandlers) {
      if (
        // Prevent multiple copies of console_callback_handler
        manager.handlers.filter((h) => h.name === "console_callback_handler").some((h) => h.name === handler.name)
      ) {
        continue;
      }
      manager.addHandler(handler, inherit);
    }
    return manager;
  }
  static fromHandlers(handlers) {
    class Handler extends BaseCallbackHandler {
      constructor() {
        super();
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: v4()
        });
        Object.assign(this, handlers);
      }
    }
    const manager = new this();
    manager.addHandler(new Handler());
    return manager;
  }
  static async configure(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
    return this._configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options);
  }
  // TODO: Deprecate async method in favor of this one.
  static _configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
    var _a, _b;
    let callbackManager;
    if (inheritableHandlers || localHandlers) {
      if (Array.isArray(inheritableHandlers) || !inheritableHandlers) {
        callbackManager = new CallbackManager();
        callbackManager.setHandlers((inheritableHandlers == null ? void 0 : inheritableHandlers.map(ensureHandler)) ?? [], true);
      } else {
        callbackManager = inheritableHandlers;
      }
      callbackManager = callbackManager.copy(Array.isArray(localHandlers) ? localHandlers.map(ensureHandler) : localHandlers == null ? void 0 : localHandlers.handlers, false);
    }
    const verboseEnabled = getEnvironmentVariable("LANGCHAIN_VERBOSE") === "true" || (options == null ? void 0 : options.verbose);
    const tracingV2Enabled = ((_a = LangChainTracer.getTraceableRunTree()) == null ? void 0 : _a.tracingEnabled) || isTracingEnabled();
    const tracingEnabled = tracingV2Enabled || (getEnvironmentVariable("LANGCHAIN_TRACING") ?? false);
    if (verboseEnabled || tracingEnabled) {
      if (!callbackManager) {
        callbackManager = new CallbackManager();
      }
      if (verboseEnabled && !callbackManager.handlers.some((handler) => handler.name === ConsoleCallbackHandler.prototype.name)) {
        const consoleHandler = new ConsoleCallbackHandler();
        callbackManager.addHandler(consoleHandler, true);
      }
      if (tracingEnabled && !callbackManager.handlers.some((handler) => handler.name === "langchain_tracer")) {
        if (tracingV2Enabled) {
          const tracerV2 = new LangChainTracer();
          callbackManager.addHandler(tracerV2, true);
          callbackManager._parentRunId = ((_b = LangChainTracer.getTraceableRunTree()) == null ? void 0 : _b.id) ?? callbackManager._parentRunId;
        }
      }
    }
    if (inheritableTags || localTags) {
      if (callbackManager) {
        callbackManager.addTags(inheritableTags ?? []);
        callbackManager.addTags(localTags ?? [], false);
      }
    }
    if (inheritableMetadata || localMetadata) {
      if (callbackManager) {
        callbackManager.addMetadata(inheritableMetadata ?? {});
        callbackManager.addMetadata(localMetadata ?? {}, false);
      }
    }
    return callbackManager;
  }
}
function ensureHandler(handler) {
  if ("name" in handler) {
    return handler;
  }
  return BaseCallbackHandler.fromMethods(handler);
}
class MockAsyncLocalStorage2 {
  getStore() {
    return void 0;
  }
  run(_store, callback) {
    return callback();
  }
}
const mockAsyncLocalStorage = new MockAsyncLocalStorage2();
const TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
const LC_CHILD_KEY = Symbol.for("lc:child_config");
class AsyncLocalStorageProvider2 {
  getInstance() {
    return globalThis[TRACING_ALS_KEY] ?? mockAsyncLocalStorage;
  }
  getRunnableConfig() {
    var _a, _b;
    const storage = this.getInstance();
    return (_b = (_a = storage.getStore()) == null ? void 0 : _a.extra) == null ? void 0 : _b[LC_CHILD_KEY];
  }
  runWithConfig(config, callback, avoidCreatingRootRunTree) {
    var _a;
    const callbackManager = CallbackManager._configureSync(config == null ? void 0 : config.callbacks, void 0, config == null ? void 0 : config.tags, void 0, config == null ? void 0 : config.metadata);
    const storage = this.getInstance();
    const parentRunId = callbackManager == null ? void 0 : callbackManager.getParentRunId();
    const langChainTracer = (_a = callbackManager == null ? void 0 : callbackManager.handlers) == null ? void 0 : _a.find((handler) => (handler == null ? void 0 : handler.name) === "langchain_tracer");
    let runTree;
    if (langChainTracer && parentRunId) {
      runTree = langChainTracer.convertToRunTree(parentRunId);
    } else if (!avoidCreatingRootRunTree) {
      runTree = new RunTree({
        name: "<runnable_lambda>",
        tracingEnabled: false
      });
    }
    if (runTree) {
      runTree.extra = { ...runTree.extra, [LC_CHILD_KEY]: config };
    }
    return storage.run(runTree, callback);
  }
  initializeGlobalInstance(instance) {
    if (globalThis[TRACING_ALS_KEY] === void 0) {
      globalThis[TRACING_ALS_KEY] = instance;
    }
  }
}
const AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider2();
async function raceWithSignal(promise, signal) {
  if (signal === void 0) {
    return promise;
  }
  let listener;
  return Promise.race([
    promise.catch((err) => {
      if (!(signal == null ? void 0 : signal.aborted)) {
        throw err;
      } else {
        return void 0;
      }
    }),
    new Promise((_, reject) => {
      listener = () => {
        reject(new Error("Aborted"));
      };
      signal.addEventListener("abort", listener);
      if (signal.aborted) {
        reject(new Error("Aborted"));
      }
    })
  ]).finally(() => signal.removeEventListener("abort", listener));
}
class IterableReadableStream extends ReadableStream {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "reader", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  ensureReader() {
    if (!this.reader) {
      this.reader = this.getReader();
    }
  }
  async next() {
    this.ensureReader();
    try {
      const result = await this.reader.read();
      if (result.done) {
        this.reader.releaseLock();
        return {
          done: true,
          value: void 0
        };
      } else {
        return {
          done: false,
          value: result.value
        };
      }
    } catch (e) {
      this.reader.releaseLock();
      throw e;
    }
  }
  async return() {
    this.ensureReader();
    if (this.locked) {
      const cancelPromise = this.reader.cancel();
      this.reader.releaseLock();
      await cancelPromise;
    }
    return { done: true, value: void 0 };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async throw(e) {
    this.ensureReader();
    if (this.locked) {
      const cancelPromise = this.reader.cancel();
      this.reader.releaseLock();
      await cancelPromise;
    }
    throw e;
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Not present in Node 18 types, required in latest Node 22
  async [Symbol.asyncDispose]() {
    await this.return();
  }
  static fromReadableStream(stream) {
    const reader = stream.getReader();
    return new IterableReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
      },
      cancel() {
        reader.releaseLock();
      }
    });
  }
  static fromAsyncGenerator(generator) {
    return new IterableReadableStream({
      async pull(controller) {
        const { value, done } = await generator.next();
        if (done) {
          controller.close();
        }
        controller.enqueue(value);
      },
      async cancel(reason) {
        await generator.return(reason);
      }
    });
  }
}
function atee(iter, length = 2) {
  const buffers = Array.from({ length }, () => []);
  return buffers.map(async function* makeIter(buffer) {
    while (true) {
      if (buffer.length === 0) {
        const result = await iter.next();
        for (const buffer2 of buffers) {
          buffer2.push(result);
        }
      } else if (buffer[0].done) {
        return;
      } else {
        yield buffer.shift().value;
      }
    }
  });
}
function concat(first, second) {
  if (Array.isArray(first) && Array.isArray(second)) {
    return first.concat(second);
  } else if (typeof first === "string" && typeof second === "string") {
    return first + second;
  } else if (typeof first === "number" && typeof second === "number") {
    return first + second;
  } else if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "concat" in first && // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof first.concat === "function"
  ) {
    return first.concat(second);
  } else if (typeof first === "object" && typeof second === "object") {
    const chunk = { ...first };
    for (const [key, value] of Object.entries(second)) {
      if (key in chunk && !Array.isArray(chunk[key])) {
        chunk[key] = concat(chunk[key], value);
      } else {
        chunk[key] = value;
      }
    }
    return chunk;
  } else {
    throw new Error(`Cannot concat ${typeof first} and ${typeof second}`);
  }
}
class AsyncGeneratorWithSetup {
  constructor(params) {
    var _a;
    Object.defineProperty(this, "generator", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "setup", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "config", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "signal", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "firstResult", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "firstResultUsed", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.generator = params.generator;
    this.config = params.config;
    this.signal = params.signal ?? ((_a = this.config) == null ? void 0 : _a.signal);
    this.setup = new Promise((resolve, reject) => {
      void AsyncLocalStorageProviderSingleton.runWithConfig(params.config, async () => {
        this.firstResult = params.generator.next();
        if (params.startSetup) {
          this.firstResult.then(params.startSetup).then(resolve, reject);
        } else {
          this.firstResult.then((_result) => resolve(void 0), reject);
        }
      }, true);
    });
  }
  async next(...args) {
    var _a;
    (_a = this.signal) == null ? void 0 : _a.throwIfAborted();
    if (!this.firstResultUsed) {
      this.firstResultUsed = true;
      return this.firstResult;
    }
    return AsyncLocalStorageProviderSingleton.runWithConfig(this.config, this.signal ? async () => {
      return raceWithSignal(this.generator.next(...args), this.signal);
    } : async () => {
      return this.generator.next(...args);
    }, true);
  }
  async return(value) {
    return this.generator.return(value);
  }
  async throw(e) {
    return this.generator.throw(e);
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Not present in Node 18 types, required in latest Node 22
  async [Symbol.asyncDispose]() {
    await this.return();
  }
}
async function pipeGeneratorWithSetup(to, generator, startSetup, signal, ...args) {
  const gen = new AsyncGeneratorWithSetup({
    generator,
    startSetup,
    signal
  });
  const setup = await gen.setup;
  return { output: to(gen, setup, ...args), setup };
}
class RunLogPatch {
  constructor(fields) {
    Object.defineProperty(this, "ops", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.ops = fields.ops ?? [];
  }
  concat(other) {
    const ops = this.ops.concat(other.ops);
    const states = applyPatch({}, ops);
    return new RunLog({
      ops,
      state: states[states.length - 1].newDocument
    });
  }
}
class RunLog extends RunLogPatch {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "state", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.state = fields.state;
  }
  concat(other) {
    const ops = this.ops.concat(other.ops);
    const states = applyPatch(this.state, other.ops);
    return new RunLog({ ops, state: states[states.length - 1].newDocument });
  }
  static fromRunLogPatch(patch) {
    const states = applyPatch({}, patch.ops);
    return new RunLog({
      ops: patch.ops,
      state: states[states.length - 1].newDocument
    });
  }
}
const isLogStreamHandler = (handler) => handler.name === "log_stream_tracer";
async function _getStandardizedInputs(run, schemaFormat) {
  if (schemaFormat === "original") {
    throw new Error("Do not assign inputs with original schema drop the key for now. When inputs are added to streamLog they should be added with standardized schema for streaming events.");
  }
  const { inputs } = run;
  if (["retriever", "llm", "prompt"].includes(run.run_type)) {
    return inputs;
  }
  if (Object.keys(inputs).length === 1 && (inputs == null ? void 0 : inputs.input) === "") {
    return void 0;
  }
  return inputs.input;
}
async function _getStandardizedOutputs(run, schemaFormat) {
  const { outputs } = run;
  if (schemaFormat === "original") {
    return outputs;
  }
  if (["retriever", "llm", "prompt"].includes(run.run_type)) {
    return outputs;
  }
  if (outputs !== void 0 && Object.keys(outputs).length === 1 && (outputs == null ? void 0 : outputs.output) !== void 0) {
    return outputs.output;
  }
  return outputs;
}
function isChatGenerationChunk(x) {
  return x !== void 0 && x.message !== void 0;
}
class LogStreamCallbackHandler extends BaseTracer {
  constructor(fields) {
    super({ _awaitHandler: true, ...fields });
    Object.defineProperty(this, "autoClose", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "includeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_schemaFormat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "original"
    });
    Object.defineProperty(this, "rootId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "keyMapByRunId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "counterMapByRunName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "transformStream", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "writer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "receiveStream", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "log_stream_tracer"
    });
    this.autoClose = (fields == null ? void 0 : fields.autoClose) ?? true;
    this.includeNames = fields == null ? void 0 : fields.includeNames;
    this.includeTypes = fields == null ? void 0 : fields.includeTypes;
    this.includeTags = fields == null ? void 0 : fields.includeTags;
    this.excludeNames = fields == null ? void 0 : fields.excludeNames;
    this.excludeTypes = fields == null ? void 0 : fields.excludeTypes;
    this.excludeTags = fields == null ? void 0 : fields.excludeTags;
    this._schemaFormat = (fields == null ? void 0 : fields._schemaFormat) ?? this._schemaFormat;
    this.transformStream = new TransformStream();
    this.writer = this.transformStream.writable.getWriter();
    this.receiveStream = IterableReadableStream.fromReadableStream(this.transformStream.readable);
  }
  [Symbol.asyncIterator]() {
    return this.receiveStream;
  }
  async persistRun(_run) {
  }
  _includeRun(run) {
    if (run.id === this.rootId) {
      return false;
    }
    const runTags = run.tags ?? [];
    let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
    if (this.includeNames !== void 0) {
      include = include || this.includeNames.includes(run.name);
    }
    if (this.includeTypes !== void 0) {
      include = include || this.includeTypes.includes(run.run_type);
    }
    if (this.includeTags !== void 0) {
      include = include || runTags.find((tag) => {
        var _a;
        return (_a = this.includeTags) == null ? void 0 : _a.includes(tag);
      }) !== void 0;
    }
    if (this.excludeNames !== void 0) {
      include = include && !this.excludeNames.includes(run.name);
    }
    if (this.excludeTypes !== void 0) {
      include = include && !this.excludeTypes.includes(run.run_type);
    }
    if (this.excludeTags !== void 0) {
      include = include && runTags.every((tag) => {
        var _a;
        return !((_a = this.excludeTags) == null ? void 0 : _a.includes(tag));
      });
    }
    return include;
  }
  async *tapOutputIterable(runId, output) {
    for await (const chunk of output) {
      if (runId !== this.rootId) {
        const key = this.keyMapByRunId[runId];
        if (key) {
          await this.writer.write(new RunLogPatch({
            ops: [
              {
                op: "add",
                path: `/logs/${key}/streamed_output/-`,
                value: chunk
              }
            ]
          }));
        }
      }
      yield chunk;
    }
  }
  async onRunCreate(run) {
    var _a;
    if (this.rootId === void 0) {
      this.rootId = run.id;
      await this.writer.write(new RunLogPatch({
        ops: [
          {
            op: "replace",
            path: "",
            value: {
              id: run.id,
              name: run.name,
              type: run.run_type,
              streamed_output: [],
              final_output: void 0,
              logs: {}
            }
          }
        ]
      }));
    }
    if (!this._includeRun(run)) {
      return;
    }
    if (this.counterMapByRunName[run.name] === void 0) {
      this.counterMapByRunName[run.name] = 0;
    }
    this.counterMapByRunName[run.name] += 1;
    const count = this.counterMapByRunName[run.name];
    this.keyMapByRunId[run.id] = count === 1 ? run.name : `${run.name}:${count}`;
    const logEntry = {
      id: run.id,
      name: run.name,
      type: run.run_type,
      tags: run.tags ?? [],
      metadata: ((_a = run.extra) == null ? void 0 : _a.metadata) ?? {},
      start_time: new Date(run.start_time).toISOString(),
      streamed_output: [],
      streamed_output_str: [],
      final_output: void 0,
      end_time: void 0
    };
    if (this._schemaFormat === "streaming_events") {
      logEntry.inputs = await _getStandardizedInputs(run, this._schemaFormat);
    }
    await this.writer.write(new RunLogPatch({
      ops: [
        {
          op: "add",
          path: `/logs/${this.keyMapByRunId[run.id]}`,
          value: logEntry
        }
      ]
    }));
  }
  async onRunUpdate(run) {
    try {
      const runName = this.keyMapByRunId[run.id];
      if (runName === void 0) {
        return;
      }
      const ops = [];
      if (this._schemaFormat === "streaming_events") {
        ops.push({
          op: "replace",
          path: `/logs/${runName}/inputs`,
          value: await _getStandardizedInputs(run, this._schemaFormat)
        });
      }
      ops.push({
        op: "add",
        path: `/logs/${runName}/final_output`,
        value: await _getStandardizedOutputs(run, this._schemaFormat)
      });
      if (run.end_time !== void 0) {
        ops.push({
          op: "add",
          path: `/logs/${runName}/end_time`,
          value: new Date(run.end_time).toISOString()
        });
      }
      const patch = new RunLogPatch({ ops });
      await this.writer.write(patch);
    } finally {
      if (run.id === this.rootId) {
        const patch = new RunLogPatch({
          ops: [
            {
              op: "replace",
              path: "/final_output",
              value: await _getStandardizedOutputs(run, this._schemaFormat)
            }
          ]
        });
        await this.writer.write(patch);
        if (this.autoClose) {
          await this.writer.close();
        }
      }
    }
  }
  async onLLMNewToken(run, token, kwargs) {
    const runName = this.keyMapByRunId[run.id];
    if (runName === void 0) {
      return;
    }
    const isChatModel = run.inputs.messages !== void 0;
    let streamedOutputValue;
    if (isChatModel) {
      if (isChatGenerationChunk(kwargs == null ? void 0 : kwargs.chunk)) {
        streamedOutputValue = kwargs == null ? void 0 : kwargs.chunk;
      } else {
        streamedOutputValue = new AIMessageChunk({
          id: `run-${run.id}`,
          content: token
        });
      }
    } else {
      streamedOutputValue = token;
    }
    const patch = new RunLogPatch({
      ops: [
        {
          op: "add",
          path: `/logs/${runName}/streamed_output_str/-`,
          value: token
        },
        {
          op: "add",
          path: `/logs/${runName}/streamed_output/-`,
          value: streamedOutputValue
        }
      ]
    });
    await this.writer.write(patch);
  }
}
class GenerationChunk {
  constructor(fields) {
    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "generationInfo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.text = fields.text;
    this.generationInfo = fields.generationInfo;
  }
  concat(chunk) {
    return new GenerationChunk({
      text: this.text + chunk.text,
      generationInfo: {
        ...this.generationInfo,
        ...chunk.generationInfo
      }
    });
  }
}
function assignName({ name, serialized }) {
  if (name !== void 0) {
    return name;
  }
  if ((serialized == null ? void 0 : serialized.name) !== void 0) {
    return serialized.name;
  } else if ((serialized == null ? void 0 : serialized.id) !== void 0 && Array.isArray(serialized == null ? void 0 : serialized.id)) {
    return serialized.id[serialized.id.length - 1];
  }
  return "Unnamed";
}
const isStreamEventsHandler = (handler) => handler.name === "event_stream_tracer";
class EventStreamCallbackHandler extends BaseTracer {
  constructor(fields) {
    super({ _awaitHandler: true, ...fields });
    Object.defineProperty(this, "autoClose", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "includeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "runInfoMap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /* @__PURE__ */ new Map()
    });
    Object.defineProperty(this, "tappedPromises", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /* @__PURE__ */ new Map()
    });
    Object.defineProperty(this, "transformStream", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "writer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "receiveStream", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "event_stream_tracer"
    });
    this.autoClose = (fields == null ? void 0 : fields.autoClose) ?? true;
    this.includeNames = fields == null ? void 0 : fields.includeNames;
    this.includeTypes = fields == null ? void 0 : fields.includeTypes;
    this.includeTags = fields == null ? void 0 : fields.includeTags;
    this.excludeNames = fields == null ? void 0 : fields.excludeNames;
    this.excludeTypes = fields == null ? void 0 : fields.excludeTypes;
    this.excludeTags = fields == null ? void 0 : fields.excludeTags;
    this.transformStream = new TransformStream();
    this.writer = this.transformStream.writable.getWriter();
    this.receiveStream = IterableReadableStream.fromReadableStream(this.transformStream.readable);
  }
  [Symbol.asyncIterator]() {
    return this.receiveStream;
  }
  async persistRun(_run) {
  }
  _includeRun(run) {
    const runTags = run.tags ?? [];
    let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
    if (this.includeNames !== void 0) {
      include = include || this.includeNames.includes(run.name);
    }
    if (this.includeTypes !== void 0) {
      include = include || this.includeTypes.includes(run.runType);
    }
    if (this.includeTags !== void 0) {
      include = include || runTags.find((tag) => {
        var _a;
        return (_a = this.includeTags) == null ? void 0 : _a.includes(tag);
      }) !== void 0;
    }
    if (this.excludeNames !== void 0) {
      include = include && !this.excludeNames.includes(run.name);
    }
    if (this.excludeTypes !== void 0) {
      include = include && !this.excludeTypes.includes(run.runType);
    }
    if (this.excludeTags !== void 0) {
      include = include && runTags.every((tag) => {
        var _a;
        return !((_a = this.excludeTags) == null ? void 0 : _a.includes(tag));
      });
    }
    return include;
  }
  async *tapOutputIterable(runId, outputStream) {
    const firstChunk = await outputStream.next();
    if (firstChunk.done) {
      return;
    }
    const runInfo = this.runInfoMap.get(runId);
    if (runInfo === void 0) {
      yield firstChunk.value;
      return;
    }
    function _formatOutputChunk(eventType, data) {
      if (eventType === "llm" && typeof data === "string") {
        return new GenerationChunk({ text: data });
      }
      return data;
    }
    let tappedPromise = this.tappedPromises.get(runId);
    if (tappedPromise === void 0) {
      let tappedPromiseResolver;
      tappedPromise = new Promise((resolve) => {
        tappedPromiseResolver = resolve;
      });
      this.tappedPromises.set(runId, tappedPromise);
      try {
        const event = {
          event: `on_${runInfo.runType}_stream`,
          run_id: runId,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata,
          data: {}
        };
        await this.send({
          ...event,
          data: {
            chunk: _formatOutputChunk(runInfo.runType, firstChunk.value)
          }
        }, runInfo);
        yield firstChunk.value;
        for await (const chunk of outputStream) {
          if (runInfo.runType !== "tool" && runInfo.runType !== "retriever") {
            await this.send({
              ...event,
              data: {
                chunk: _formatOutputChunk(runInfo.runType, chunk)
              }
            }, runInfo);
          }
          yield chunk;
        }
      } finally {
        tappedPromiseResolver();
      }
    } else {
      yield firstChunk.value;
      for await (const chunk of outputStream) {
        yield chunk;
      }
    }
  }
  async send(payload, run) {
    if (this._includeRun(run)) {
      await this.writer.write(payload);
    }
  }
  async sendEndEvent(payload, run) {
    const tappedPromise = this.tappedPromises.get(payload.run_id);
    if (tappedPromise !== void 0) {
      void tappedPromise.then(() => {
        void this.send(payload, run);
      });
    } else {
      await this.send(payload, run);
    }
  }
  async onLLMStart(run) {
    var _a, _b;
    const runName = assignName(run);
    const runType = run.inputs.messages !== void 0 ? "chat_model" : "llm";
    const runInfo = {
      tags: run.tags ?? [],
      metadata: ((_a = run.extra) == null ? void 0 : _a.metadata) ?? {},
      name: runName,
      runType,
      inputs: run.inputs
    };
    this.runInfoMap.set(run.id, runInfo);
    const eventName = `on_${runType}_start`;
    await this.send({
      event: eventName,
      data: {
        input: run.inputs
      },
      name: runName,
      tags: run.tags ?? [],
      run_id: run.id,
      metadata: ((_b = run.extra) == null ? void 0 : _b.metadata) ?? {}
    }, runInfo);
  }
  async onLLMNewToken(run, token, kwargs) {
    const runInfo = this.runInfoMap.get(run.id);
    let chunk;
    let eventName;
    if (runInfo === void 0) {
      throw new Error(`onLLMNewToken: Run ID ${run.id} not found in run map.`);
    }
    if (this.runInfoMap.size === 1) {
      return;
    }
    if (runInfo.runType === "chat_model") {
      eventName = "on_chat_model_stream";
      if ((kwargs == null ? void 0 : kwargs.chunk) === void 0) {
        chunk = new AIMessageChunk({ content: token, id: `run-${run.id}` });
      } else {
        chunk = kwargs.chunk.message;
      }
    } else if (runInfo.runType === "llm") {
      eventName = "on_llm_stream";
      if ((kwargs == null ? void 0 : kwargs.chunk) === void 0) {
        chunk = new GenerationChunk({ text: token });
      } else {
        chunk = kwargs.chunk;
      }
    } else {
      throw new Error(`Unexpected run type ${runInfo.runType}`);
    }
    await this.send({
      event: eventName,
      data: {
        chunk
      },
      run_id: run.id,
      name: runInfo.name,
      tags: runInfo.tags,
      metadata: runInfo.metadata
    }, runInfo);
  }
  async onLLMEnd(run) {
    var _a, _b, _c;
    const runInfo = this.runInfoMap.get(run.id);
    this.runInfoMap.delete(run.id);
    let eventName;
    if (runInfo === void 0) {
      throw new Error(`onLLMEnd: Run ID ${run.id} not found in run map.`);
    }
    const generations = (_a = run.outputs) == null ? void 0 : _a.generations;
    let output;
    if (runInfo.runType === "chat_model") {
      for (const generation of generations ?? []) {
        if (output !== void 0) {
          break;
        }
        output = (_b = generation[0]) == null ? void 0 : _b.message;
      }
      eventName = "on_chat_model_end";
    } else if (runInfo.runType === "llm") {
      output = {
        generations: generations == null ? void 0 : generations.map((generation) => {
          return generation.map((chunk) => {
            return {
              text: chunk.text,
              generationInfo: chunk.generationInfo
            };
          });
        }),
        llmOutput: ((_c = run.outputs) == null ? void 0 : _c.llmOutput) ?? {}
      };
      eventName = "on_llm_end";
    } else {
      throw new Error(`onLLMEnd: Unexpected run type: ${runInfo.runType}`);
    }
    await this.sendEndEvent({
      event: eventName,
      data: {
        output,
        input: runInfo.inputs
      },
      run_id: run.id,
      name: runInfo.name,
      tags: runInfo.tags,
      metadata: runInfo.metadata
    }, runInfo);
  }
  async onChainStart(run) {
    var _a, _b;
    const runName = assignName(run);
    const runType = run.run_type ?? "chain";
    const runInfo = {
      tags: run.tags ?? [],
      metadata: ((_a = run.extra) == null ? void 0 : _a.metadata) ?? {},
      name: runName,
      runType: run.run_type
    };
    let eventData = {};
    if (run.inputs.input === "" && Object.keys(run.inputs).length === 1) {
      eventData = {};
      runInfo.inputs = {};
    } else if (run.inputs.input !== void 0) {
      eventData.input = run.inputs.input;
      runInfo.inputs = run.inputs.input;
    } else {
      eventData.input = run.inputs;
      runInfo.inputs = run.inputs;
    }
    this.runInfoMap.set(run.id, runInfo);
    await this.send({
      event: `on_${runType}_start`,
      data: eventData,
      name: runName,
      tags: run.tags ?? [],
      run_id: run.id,
      metadata: ((_b = run.extra) == null ? void 0 : _b.metadata) ?? {}
    }, runInfo);
  }
  async onChainEnd(run) {
    var _a;
    const runInfo = this.runInfoMap.get(run.id);
    this.runInfoMap.delete(run.id);
    if (runInfo === void 0) {
      throw new Error(`onChainEnd: Run ID ${run.id} not found in run map.`);
    }
    const eventName = `on_${run.run_type}_end`;
    const inputs = run.inputs ?? runInfo.inputs ?? {};
    const outputs = ((_a = run.outputs) == null ? void 0 : _a.output) ?? run.outputs;
    const data = {
      output: outputs,
      input: inputs
    };
    if (inputs.input && Object.keys(inputs).length === 1) {
      data.input = inputs.input;
      runInfo.inputs = inputs.input;
    }
    await this.sendEndEvent({
      event: eventName,
      data,
      run_id: run.id,
      name: runInfo.name,
      tags: runInfo.tags,
      metadata: runInfo.metadata ?? {}
    }, runInfo);
  }
  async onToolStart(run) {
    var _a, _b;
    const runName = assignName(run);
    const runInfo = {
      tags: run.tags ?? [],
      metadata: ((_a = run.extra) == null ? void 0 : _a.metadata) ?? {},
      name: runName,
      runType: "tool",
      inputs: run.inputs ?? {}
    };
    this.runInfoMap.set(run.id, runInfo);
    await this.send({
      event: "on_tool_start",
      data: {
        input: run.inputs ?? {}
      },
      name: runName,
      run_id: run.id,
      tags: run.tags ?? [],
      metadata: ((_b = run.extra) == null ? void 0 : _b.metadata) ?? {}
    }, runInfo);
  }
  async onToolEnd(run) {
    var _a;
    const runInfo = this.runInfoMap.get(run.id);
    this.runInfoMap.delete(run.id);
    if (runInfo === void 0) {
      throw new Error(`onToolEnd: Run ID ${run.id} not found in run map.`);
    }
    if (runInfo.inputs === void 0) {
      throw new Error(`onToolEnd: Run ID ${run.id} is a tool call, and is expected to have traced inputs.`);
    }
    const output = ((_a = run.outputs) == null ? void 0 : _a.output) === void 0 ? run.outputs : run.outputs.output;
    await this.sendEndEvent({
      event: "on_tool_end",
      data: {
        output,
        input: runInfo.inputs
      },
      run_id: run.id,
      name: runInfo.name,
      tags: runInfo.tags,
      metadata: runInfo.metadata
    }, runInfo);
  }
  async onRetrieverStart(run) {
    var _a, _b;
    const runName = assignName(run);
    const runType = "retriever";
    const runInfo = {
      tags: run.tags ?? [],
      metadata: ((_a = run.extra) == null ? void 0 : _a.metadata) ?? {},
      name: runName,
      runType,
      inputs: {
        query: run.inputs.query
      }
    };
    this.runInfoMap.set(run.id, runInfo);
    await this.send({
      event: "on_retriever_start",
      data: {
        input: {
          query: run.inputs.query
        }
      },
      name: runName,
      tags: run.tags ?? [],
      run_id: run.id,
      metadata: ((_b = run.extra) == null ? void 0 : _b.metadata) ?? {}
    }, runInfo);
  }
  async onRetrieverEnd(run) {
    var _a;
    const runInfo = this.runInfoMap.get(run.id);
    this.runInfoMap.delete(run.id);
    if (runInfo === void 0) {
      throw new Error(`onRetrieverEnd: Run ID ${run.id} not found in run map.`);
    }
    await this.sendEndEvent({
      event: "on_retriever_end",
      data: {
        output: ((_a = run.outputs) == null ? void 0 : _a.documents) ?? run.outputs,
        input: runInfo.inputs
      },
      run_id: run.id,
      name: runInfo.name,
      tags: runInfo.tags,
      metadata: runInfo.metadata
    }, runInfo);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleCustomEvent(eventName, data, runId) {
    const runInfo = this.runInfoMap.get(runId);
    if (runInfo === void 0) {
      throw new Error(`handleCustomEvent: Run ID ${runId} not found in run map.`);
    }
    await this.send({
      event: "on_custom_event",
      run_id: runId,
      name: eventName,
      tags: runInfo.tags,
      metadata: runInfo.metadata,
      data
    }, runInfo);
  }
  async finish() {
    const pendingPromises = [...this.tappedPromises.values()];
    void Promise.all(pendingPromises).finally(() => {
      void this.writer.close();
    });
  }
}
const DEFAULT_RECURSION_LIMIT = 25;
async function getCallbackManagerForConfig(config) {
  return CallbackManager._configureSync(config == null ? void 0 : config.callbacks, void 0, config == null ? void 0 : config.tags, void 0, config == null ? void 0 : config.metadata);
}
function mergeConfigs(...configs) {
  const copy = {};
  for (const options of configs.filter((c) => !!c)) {
    for (const key of Object.keys(options)) {
      if (key === "metadata") {
        copy[key] = { ...copy[key], ...options[key] };
      } else if (key === "tags") {
        const baseKeys = copy[key] ?? [];
        copy[key] = [...new Set(baseKeys.concat(options[key] ?? []))];
      } else if (key === "configurable") {
        copy[key] = { ...copy[key], ...options[key] };
      } else if (key === "timeout") {
        if (copy.timeout === void 0) {
          copy.timeout = options.timeout;
        } else if (options.timeout !== void 0) {
          copy.timeout = Math.min(copy.timeout, options.timeout);
        }
      } else if (key === "signal") {
        if (copy.signal === void 0) {
          copy.signal = options.signal;
        } else if (options.signal !== void 0) {
          if ("any" in AbortSignal) {
            copy.signal = AbortSignal.any([
              copy.signal,
              options.signal
            ]);
          } else {
            copy.signal = options.signal;
          }
        }
      } else if (key === "callbacks") {
        const baseCallbacks = copy.callbacks;
        const providedCallbacks = options.callbacks;
        if (Array.isArray(providedCallbacks)) {
          if (!baseCallbacks) {
            copy.callbacks = providedCallbacks;
          } else if (Array.isArray(baseCallbacks)) {
            copy.callbacks = baseCallbacks.concat(providedCallbacks);
          } else {
            const manager = baseCallbacks.copy();
            for (const callback of providedCallbacks) {
              manager.addHandler(ensureHandler(callback), true);
            }
            copy.callbacks = manager;
          }
        } else if (providedCallbacks) {
          if (!baseCallbacks) {
            copy.callbacks = providedCallbacks;
          } else if (Array.isArray(baseCallbacks)) {
            const manager = providedCallbacks.copy();
            for (const callback of baseCallbacks) {
              manager.addHandler(ensureHandler(callback), true);
            }
            copy.callbacks = manager;
          } else {
            copy.callbacks = new CallbackManager(providedCallbacks._parentRunId, {
              handlers: baseCallbacks.handlers.concat(providedCallbacks.handlers),
              inheritableHandlers: baseCallbacks.inheritableHandlers.concat(providedCallbacks.inheritableHandlers),
              tags: Array.from(new Set(baseCallbacks.tags.concat(providedCallbacks.tags))),
              inheritableTags: Array.from(new Set(baseCallbacks.inheritableTags.concat(providedCallbacks.inheritableTags))),
              metadata: {
                ...baseCallbacks.metadata,
                ...providedCallbacks.metadata
              }
            });
          }
        }
      } else {
        const typedKey = key;
        copy[typedKey] = options[typedKey] ?? copy[typedKey];
      }
    }
  }
  return copy;
}
const PRIMITIVES = /* @__PURE__ */ new Set(["string", "number", "boolean"]);
function ensureConfig(config) {
  var _a;
  const implicitConfig = AsyncLocalStorageProviderSingleton.getRunnableConfig();
  let empty = {
    tags: [],
    metadata: {},
    recursionLimit: 25,
    runId: void 0
  };
  if (implicitConfig) {
    const { runId, runName, ...rest } = implicitConfig;
    empty = Object.entries(rest).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentConfig, [key, value]) => {
        if (value !== void 0) {
          currentConfig[key] = value;
        }
        return currentConfig;
      },
      empty
    );
  }
  if (config) {
    empty = Object.entries(config).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentConfig, [key, value]) => {
        if (value !== void 0) {
          currentConfig[key] = value;
        }
        return currentConfig;
      },
      empty
    );
  }
  if (empty == null ? void 0 : empty.configurable) {
    for (const key of Object.keys(empty.configurable)) {
      if (PRIMITIVES.has(typeof empty.configurable[key]) && !((_a = empty.metadata) == null ? void 0 : _a[key])) {
        if (!empty.metadata) {
          empty.metadata = {};
        }
        empty.metadata[key] = empty.configurable[key];
      }
    }
  }
  if (empty.timeout !== void 0) {
    if (empty.timeout <= 0) {
      throw new Error("Timeout must be a positive number");
    }
    const timeoutSignal = AbortSignal.timeout(empty.timeout);
    if (empty.signal !== void 0) {
      if ("any" in AbortSignal) {
        empty.signal = AbortSignal.any([empty.signal, timeoutSignal]);
      }
    } else {
      empty.signal = timeoutSignal;
    }
    delete empty.timeout;
  }
  return empty;
}
function patchConfig(config = {}, { callbacks, maxConcurrency, recursionLimit, runName, configurable, runId } = {}) {
  const newConfig = ensureConfig(config);
  if (callbacks !== void 0) {
    delete newConfig.runName;
    newConfig.callbacks = callbacks;
  }
  if (recursionLimit !== void 0) {
    newConfig.recursionLimit = recursionLimit;
  }
  if (maxConcurrency !== void 0) {
    newConfig.maxConcurrency = maxConcurrency;
  }
  if (runName !== void 0) {
    newConfig.runName = runName;
  }
  if (configurable !== void 0) {
    newConfig.configurable = { ...newConfig.configurable, ...configurable };
  }
  if (runId !== void 0) {
    delete newConfig.runId;
  }
  return newConfig;
}
const STATUS_NO_RETRY = [
  400,
  401,
  402,
  403,
  404,
  405,
  406,
  407,
  409
  // Conflict
];
const defaultFailedAttemptHandler = (error) => {
  var _a, _b;
  if (error.message.startsWith("Cancel") || error.message.startsWith("AbortError") || error.name === "AbortError") {
    throw error;
  }
  if ((error == null ? void 0 : error.code) === "ECONNABORTED") {
    throw error;
  }
  const status = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.status) ?? (error == null ? void 0 : error.status)
  );
  if (status && STATUS_NO_RETRY.includes(+status)) {
    throw error;
  }
  if (((_b = error == null ? void 0 : error.error) == null ? void 0 : _b.code) === "insufficient_quota") {
    const err = new Error(error == null ? void 0 : error.message);
    err.name = "InsufficientQuotaError";
    throw err;
  }
};
class AsyncCaller2 {
  constructor(params) {
    Object.defineProperty(this, "maxConcurrency", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxRetries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "onFailedAttempt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "queue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxConcurrency = params.maxConcurrency ?? Infinity;
    this.maxRetries = params.maxRetries ?? 6;
    this.onFailedAttempt = params.onFailedAttempt ?? defaultFailedAttemptHandler;
    const PQueue = "default" in PQueueMod ? PQueueMod.default : PQueueMod;
    this.queue = new PQueue({ concurrency: this.maxConcurrency });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call(callable, ...args) {
    return this.queue.add(() => pRetry(() => callable(...args).catch((error) => {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(error);
      }
    }), {
      onFailedAttempt: this.onFailedAttempt,
      retries: this.maxRetries,
      randomize: true
      // If needed we can change some of the defaults here,
      // but they're quite sensible.
    }), { throwOnTimeout: true });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callWithOptions(options, callable, ...args) {
    if (options.signal) {
      return Promise.race([
        this.call(callable, ...args),
        new Promise((_, reject) => {
          var _a;
          (_a = options.signal) == null ? void 0 : _a.addEventListener("abort", () => {
            reject(new Error("AbortError"));
          });
        })
      ]);
    }
    return this.call(callable, ...args);
  }
  fetch(...args) {
    return this.call(() => fetch(...args).then((res) => res.ok ? res : Promise.reject(res)));
  }
}
class RootListenersTracer extends BaseTracer {
  constructor({ config, onStart, onEnd, onError }) {
    super({ _awaitHandler: true });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "RootListenersTracer"
    });
    Object.defineProperty(this, "rootId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "config", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "argOnStart", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "argOnEnd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "argOnError", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.config = config;
    this.argOnStart = onStart;
    this.argOnEnd = onEnd;
    this.argOnError = onError;
  }
  /**
   * This is a legacy method only called once for an entire run tree
   * therefore not useful here
   * @param {Run} _ Not used
   */
  persistRun(_) {
    return Promise.resolve();
  }
  async onRunCreate(run) {
    if (this.rootId) {
      return;
    }
    this.rootId = run.id;
    if (this.argOnStart) {
      if (this.argOnStart.length === 1) {
        await this.argOnStart(run);
      } else if (this.argOnStart.length === 2) {
        await this.argOnStart(run, this.config);
      }
    }
  }
  async onRunUpdate(run) {
    if (run.id !== this.rootId) {
      return;
    }
    if (!run.error) {
      if (this.argOnEnd) {
        if (this.argOnEnd.length === 1) {
          await this.argOnEnd(run);
        } else if (this.argOnEnd.length === 2) {
          await this.argOnEnd(run, this.config);
        }
      }
    } else if (this.argOnError) {
      if (this.argOnError.length === 1) {
        await this.argOnError(run);
      } else if (this.argOnError.length === 2) {
        await this.argOnError(run, this.config);
      }
    }
  }
}
function isRunnableInterface(thing) {
  return thing ? thing.lc_runnable : false;
}
class _RootEventFilter {
  constructor(fields) {
    Object.defineProperty(this, "includeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "includeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeNames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTypes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeTags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.includeNames = fields.includeNames;
    this.includeTypes = fields.includeTypes;
    this.includeTags = fields.includeTags;
    this.excludeNames = fields.excludeNames;
    this.excludeTypes = fields.excludeTypes;
    this.excludeTags = fields.excludeTags;
  }
  includeEvent(event, rootType) {
    let include = this.includeNames === void 0 && this.includeTypes === void 0 && this.includeTags === void 0;
    const eventTags = event.tags ?? [];
    if (this.includeNames !== void 0) {
      include = include || this.includeNames.includes(event.name);
    }
    if (this.includeTypes !== void 0) {
      include = include || this.includeTypes.includes(rootType);
    }
    if (this.includeTags !== void 0) {
      include = include || eventTags.some((tag) => {
        var _a;
        return (_a = this.includeTags) == null ? void 0 : _a.includes(tag);
      });
    }
    if (this.excludeNames !== void 0) {
      include = include && !this.excludeNames.includes(event.name);
    }
    if (this.excludeTypes !== void 0) {
      include = include && !this.excludeTypes.includes(rootType);
    }
    if (this.excludeTags !== void 0) {
      include = include && eventTags.every((tag) => {
        var _a;
        return !((_a = this.excludeTags) == null ? void 0 : _a.includes(tag));
      });
    }
    return include;
  }
}
function _escapeNodeLabel(nodeLabel) {
  return nodeLabel.replace(/[^a-zA-Z-_0-9]/g, "_");
}
function _adjustMermaidEdge(edge, nodes) {
  const sourceNodeLabel = nodes[edge.source] ?? edge.source;
  const targetNodeLabel = nodes[edge.target] ?? edge.target;
  return [sourceNodeLabel, targetNodeLabel];
}
function _generateMermaidGraphStyles(nodeColors) {
  let styles2 = "";
  for (const [className, color2] of Object.entries(nodeColors)) {
    styles2 += `	classDef ${className}class fill:${color2};
`;
  }
  return styles2;
}
function drawMermaid(nodes, edges, config) {
  const { firstNodeLabel, lastNodeLabel, nodeColors, withStyles = true, curveStyle = "linear", wrapLabelNWords = 9 } = config ?? {};
  let mermaidGraph = withStyles ? `%%{init: {'flowchart': {'curve': '${curveStyle}'}}}%%
graph TD;
` : "graph TD;\n";
  if (withStyles) {
    const defaultClassLabel = "default";
    const formatDict = {
      [defaultClassLabel]: "{0}([{1}]):::otherclass"
    };
    if (firstNodeLabel !== void 0) {
      formatDict[firstNodeLabel] = "{0}[{0}]:::startclass";
    }
    if (lastNodeLabel !== void 0) {
      formatDict[lastNodeLabel] = "{0}[{0}]:::endclass";
    }
    for (const node of Object.values(nodes)) {
      const nodeLabel = formatDict[node] ?? formatDict[defaultClassLabel];
      const escapedNodeLabel = _escapeNodeLabel(node);
      const nodeParts = node.split(":");
      const nodeSplit = nodeParts[nodeParts.length - 1];
      mermaidGraph += `	${nodeLabel.replace(/\{0\}/g, escapedNodeLabel).replace(/\{1\}/g, nodeSplit)};
`;
    }
  }
  let subgraph = "";
  for (const edge of edges) {
    const sourcePrefix = edge.source.includes(":") ? edge.source.split(":")[0] : void 0;
    const targetPrefix = edge.target.includes(":") ? edge.target.split(":")[0] : void 0;
    if (subgraph !== "" && (subgraph !== sourcePrefix || subgraph !== targetPrefix)) {
      mermaidGraph += "	end\n";
      subgraph = "";
    }
    if (subgraph === "" && sourcePrefix !== void 0 && sourcePrefix === targetPrefix) {
      mermaidGraph = `	subgraph ${sourcePrefix}
`;
      subgraph = sourcePrefix;
    }
    const [source, target] = _adjustMermaidEdge(edge, nodes);
    let edgeLabel = "";
    if (edge.data !== void 0) {
      let edgeData = edge.data;
      const words = edgeData.split(" ");
      if (words.length > wrapLabelNWords) {
        edgeData = words.reduce((acc, word, i) => {
          if (i % wrapLabelNWords === 0)
            acc.push("");
          acc[acc.length - 1] += ` ${word}`;
          return acc;
        }, []).join("<br>");
      }
      if (edge.conditional) {
        edgeLabel = ` -. ${edgeData} .-> `;
      } else {
        edgeLabel = ` -- ${edgeData} --> `;
      }
    } else {
      if (edge.conditional) {
        edgeLabel = ` -.-> `;
      } else {
        edgeLabel = ` --> `;
      }
    }
    mermaidGraph += `	${_escapeNodeLabel(source)}${edgeLabel}${_escapeNodeLabel(target)};
`;
  }
  if (subgraph !== "") {
    mermaidGraph += "end\n";
  }
  if (withStyles && nodeColors !== void 0) {
    mermaidGraph += _generateMermaidGraphStyles(nodeColors);
  }
  return mermaidGraph;
}
async function drawMermaidPng(mermaidSyntax, config) {
  let { backgroundColor = "white" } = config ?? {};
  const mermaidSyntaxEncoded = btoa(mermaidSyntax);
  if (backgroundColor !== void 0) {
    const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (!hexColorPattern.test(backgroundColor)) {
      backgroundColor = `!${backgroundColor}`;
    }
  }
  const imageUrl = `https://mermaid.ink/img/${mermaidSyntaxEncoded}?bgColor=${backgroundColor}`;
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error([
      `Failed to render the graph using the Mermaid.INK API.`,
      `Status code: ${res.status}`,
      `Status text: ${res.statusText}`
    ].join("\n"));
  }
  const content = await res.blob();
  return content;
}
const MAX_DATA_DISPLAY_NAME_LENGTH = 42;
function nodeDataStr(node) {
  if (!validate$1(node.id)) {
    return node.id;
  } else if (isRunnableInterface(node.data)) {
    try {
      let data = node.data.getName();
      data = data.startsWith("Runnable") ? data.slice("Runnable".length) : data;
      if (data.length > MAX_DATA_DISPLAY_NAME_LENGTH) {
        data = `${data.substring(0, MAX_DATA_DISPLAY_NAME_LENGTH)}...`;
      }
      return data;
    } catch (error) {
      return node.data.getName();
    }
  } else {
    return node.data.name ?? "UnknownSchema";
  }
}
function nodeDataJson(node) {
  if (isRunnableInterface(node.data)) {
    return {
      type: "runnable",
      data: {
        id: node.data.lc_id,
        name: node.data.getName()
      }
    };
  } else {
    return {
      type: "schema",
      data: { ...zodToJsonSchema(node.data.schema), title: node.data.name }
    };
  }
}
class Graph {
  constructor() {
    Object.defineProperty(this, "nodes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "edges", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
  }
  // Convert the graph to a JSON-serializable format.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON() {
    const stableNodeIds = {};
    Object.values(this.nodes).forEach((node, i) => {
      stableNodeIds[node.id] = validate$1(node.id) ? i : node.id;
    });
    return {
      nodes: Object.values(this.nodes).map((node) => ({
        id: stableNodeIds[node.id],
        ...nodeDataJson(node)
      })),
      edges: this.edges.map((edge) => {
        const item = {
          source: stableNodeIds[edge.source],
          target: stableNodeIds[edge.target]
        };
        if (typeof edge.data !== "undefined") {
          item.data = edge.data;
        }
        if (typeof edge.conditional !== "undefined") {
          item.conditional = edge.conditional;
        }
        return item;
      })
    };
  }
  addNode(data, id) {
    if (id !== void 0 && this.nodes[id] !== void 0) {
      throw new Error(`Node with id ${id} already exists`);
    }
    const nodeId = id || v4();
    const node = { id: nodeId, data };
    this.nodes[nodeId] = node;
    return node;
  }
  removeNode(node) {
    delete this.nodes[node.id];
    this.edges = this.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id);
  }
  addEdge(source, target, data, conditional) {
    if (this.nodes[source.id] === void 0) {
      throw new Error(`Source node ${source.id} not in graph`);
    }
    if (this.nodes[target.id] === void 0) {
      throw new Error(`Target node ${target.id} not in graph`);
    }
    const edge = {
      source: source.id,
      target: target.id,
      data,
      conditional
    };
    this.edges.push(edge);
    return edge;
  }
  firstNode() {
    const targets = new Set(this.edges.map((edge) => edge.target));
    const found = [];
    Object.values(this.nodes).forEach((node) => {
      if (!targets.has(node.id)) {
        found.push(node);
      }
    });
    return found[0];
  }
  lastNode() {
    const sources = new Set(this.edges.map((edge) => edge.source));
    const found = [];
    Object.values(this.nodes).forEach((node) => {
      if (!sources.has(node.id)) {
        found.push(node);
      }
    });
    return found[0];
  }
  /**
   * Add all nodes and edges from another graph.
   * Note this doesn't check for duplicates, nor does it connect the graphs.
   */
  extend(graph, prefix = "") {
    let finalPrefix = prefix;
    const nodeIds = Object.values(graph.nodes).map((node) => node.id);
    if (nodeIds.every(validate$1)) {
      finalPrefix = "";
    }
    const prefixed = (id) => {
      return finalPrefix ? `${finalPrefix}:${id}` : id;
    };
    Object.entries(graph.nodes).forEach(([key, value]) => {
      this.nodes[prefixed(key)] = { ...value, id: prefixed(key) };
    });
    const newEdges = graph.edges.map((edge) => {
      return {
        ...edge,
        source: prefixed(edge.source),
        target: prefixed(edge.target)
      };
    });
    this.edges = [...this.edges, ...newEdges];
    const first = graph.firstNode();
    const last = graph.lastNode();
    return [
      first ? { id: prefixed(first.id), data: first.data } : void 0,
      last ? { id: prefixed(last.id), data: last.data } : void 0
    ];
  }
  trimFirstNode() {
    const firstNode = this.firstNode();
    if (firstNode) {
      const outgoingEdges = this.edges.filter((edge) => edge.source === firstNode.id);
      if (Object.keys(this.nodes).length === 1 || outgoingEdges.length === 1) {
        this.removeNode(firstNode);
      }
    }
  }
  trimLastNode() {
    const lastNode = this.lastNode();
    if (lastNode) {
      const incomingEdges = this.edges.filter((edge) => edge.target === lastNode.id);
      if (Object.keys(this.nodes).length === 1 || incomingEdges.length === 1) {
        this.removeNode(lastNode);
      }
    }
  }
  drawMermaid(params) {
    const { withStyles, curveStyle, nodeColors = { start: "#ffdfba", end: "#baffc9", other: "#fad7de" }, wrapLabelNWords } = params ?? {};
    const nodes = {};
    for (const node of Object.values(this.nodes)) {
      nodes[node.id] = nodeDataStr(node);
    }
    const firstNode = this.firstNode();
    const firstNodeLabel = firstNode ? nodeDataStr(firstNode) : void 0;
    const lastNode = this.lastNode();
    const lastNodeLabel = lastNode ? nodeDataStr(lastNode) : void 0;
    return drawMermaid(nodes, this.edges, {
      firstNodeLabel,
      lastNodeLabel,
      withStyles,
      curveStyle,
      nodeColors,
      wrapLabelNWords
    });
  }
  async drawMermaidPng(params) {
    const mermaidSyntax = this.drawMermaid(params);
    return drawMermaidPng(mermaidSyntax, {
      backgroundColor: params == null ? void 0 : params.backgroundColor
    });
  }
}
function convertToHttpEventStream(stream) {
  const encoder = new TextEncoder();
  const finalStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(`event: data
data: ${JSON.stringify(chunk)}

`));
      }
      controller.enqueue(encoder.encode("event: end\n\n"));
      controller.close();
    }
  });
  return IterableReadableStream.fromReadableStream(finalStream);
}
function isIterableIterator(thing) {
  return typeof thing === "object" && thing !== null && typeof thing[Symbol.iterator] === "function" && // avoid detecting array/set as iterator
  typeof thing.next === "function";
}
const isIterator = (x) => x != null && typeof x === "object" && "next" in x && typeof x.next === "function";
function isAsyncIterable(thing) {
  return typeof thing === "object" && thing !== null && typeof thing[Symbol.asyncIterator] === "function";
}
function* consumeIteratorInContext(context, iter) {
  while (true) {
    const { value, done } = AsyncLocalStorageProviderSingleton.runWithConfig(context, iter.next.bind(iter), true);
    if (done) {
      break;
    } else {
      yield value;
    }
  }
}
async function* consumeAsyncIterableInContext(context, iter) {
  const iterator = iter[Symbol.asyncIterator]();
  while (true) {
    const { value, done } = await AsyncLocalStorageProviderSingleton.runWithConfig(context, iterator.next.bind(iter), true);
    if (done) {
      break;
    } else {
      yield value;
    }
  }
}
function _coerceToDict(value, defaultKey) {
  return value && !Array.isArray(value) && // eslint-disable-next-line no-instanceof/no-instanceof
  !(value instanceof Date) && typeof value === "object" ? value : { [defaultKey]: value };
}
class Runnable extends Serializable {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "lc_runnable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  getName(suffix) {
    const name = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.name ?? this.constructor.lc_name() ?? this.constructor.name
    );
    return suffix ? `${name}${suffix}` : name;
  }
  /**
   * Bind arguments to a Runnable, returning a new Runnable.
   * @param kwargs
   * @returns A new RunnableBinding that, when invoked, will apply the bound args.
   */
  bind(kwargs) {
    return new RunnableBinding({ bound: this, kwargs, config: {} });
  }
  /**
   * Return a new Runnable that maps a list of inputs to a list of outputs,
   * by calling invoke() with each input.
   */
  map() {
    return new RunnableEach({ bound: this });
  }
  /**
   * Add retry logic to an existing runnable.
   * @param kwargs
   * @returns A new RunnableRetry that, when invoked, will retry according to the parameters.
   */
  withRetry(fields) {
    return new RunnableRetry({
      bound: this,
      kwargs: {},
      config: {},
      maxAttemptNumber: fields == null ? void 0 : fields.stopAfterAttempt,
      ...fields
    });
  }
  /**
   * Bind config to a Runnable, returning a new Runnable.
   * @param config New configuration parameters to attach to the new runnable.
   * @returns A new RunnableBinding with a config matching what's passed.
   */
  withConfig(config) {
    return new RunnableBinding({
      bound: this,
      config,
      kwargs: {}
    });
  }
  /**
   * Create a new runnable from the current one that will try invoking
   * other passed fallback runnables if the initial invocation fails.
   * @param fields.fallbacks Other runnables to call if the runnable errors.
   * @returns A new RunnableWithFallbacks.
   */
  withFallbacks(fields) {
    const fallbacks = Array.isArray(fields) ? fields : fields.fallbacks;
    return new RunnableWithFallbacks({
      runnable: this,
      fallbacks
    });
  }
  _getOptionsList(options, length = 0) {
    if (Array.isArray(options) && options.length !== length) {
      throw new Error(`Passed "options" must be an array with the same length as the inputs, but got ${options.length} options for ${length} inputs`);
    }
    if (Array.isArray(options)) {
      return options.map(ensureConfig);
    }
    if (length > 1 && !Array.isArray(options) && options.runId) {
      console.warn("Provided runId will be used only for the first element of the batch.");
      const subsequent = Object.fromEntries(Object.entries(options).filter(([key]) => key !== "runId"));
      return Array.from({ length }, (_, i) => ensureConfig(i === 0 ? options : subsequent));
    }
    return Array.from({ length }, () => ensureConfig(options));
  }
  async batch(inputs, options, batchOptions) {
    var _a;
    const configList = this._getOptionsList(options ?? {}, inputs.length);
    const maxConcurrency = ((_a = configList[0]) == null ? void 0 : _a.maxConcurrency) ?? (batchOptions == null ? void 0 : batchOptions.maxConcurrency);
    const caller = new AsyncCaller2({
      maxConcurrency,
      onFailedAttempt: (e) => {
        throw e;
      }
    });
    const batchCalls = inputs.map((input, i) => caller.call(async () => {
      try {
        const result = await this.invoke(input, configList[i]);
        return result;
      } catch (e) {
        if (batchOptions == null ? void 0 : batchOptions.returnExceptions) {
          return e;
        }
        throw e;
      }
    }));
    return Promise.all(batchCalls);
  }
  /**
   * Default streaming implementation.
   * Subclasses should override this method if they support streaming output.
   * @param input
   * @param options
   */
  async *_streamIterator(input, options) {
    yield this.invoke(input, options);
  }
  /**
   * Stream output in chunks.
   * @param input
   * @param options
   * @returns A readable stream that is also an iterable.
   */
  async stream(input, options) {
    const config = ensureConfig(options);
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: this._streamIterator(input, config),
      config
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
  _separateRunnableConfigFromCallOptions(options) {
    let runnableConfig;
    if (options === void 0) {
      runnableConfig = ensureConfig(options);
    } else {
      runnableConfig = ensureConfig({
        callbacks: options.callbacks,
        tags: options.tags,
        metadata: options.metadata,
        runName: options.runName,
        configurable: options.configurable,
        recursionLimit: options.recursionLimit,
        maxConcurrency: options.maxConcurrency,
        runId: options.runId,
        timeout: options.timeout,
        signal: options.signal
      });
    }
    const callOptions = { ...options };
    delete callOptions.callbacks;
    delete callOptions.tags;
    delete callOptions.metadata;
    delete callOptions.runName;
    delete callOptions.configurable;
    delete callOptions.recursionLimit;
    delete callOptions.maxConcurrency;
    delete callOptions.runId;
    delete callOptions.timeout;
    delete callOptions.signal;
    return [runnableConfig, callOptions];
  }
  async _callWithConfig(func, input, options) {
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(config);
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), config.runId, config == null ? void 0 : config.runType, void 0, void 0, (config == null ? void 0 : config.runName) ?? this.getName()));
    delete config.runId;
    let output;
    try {
      const promise = func.call(this, input, config, runManager);
      output = await raceWithSignal(promise, options == null ? void 0 : options.signal);
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(output, "output")));
    return output;
  }
  /**
   * Internal method that handles batching and configuration for a runnable
   * It takes a function, input values, and optional configuration, and
   * returns a promise that resolves to the output values.
   * @param func The function to be executed for each input value.
   * @param input The input values to be processed.
   * @param config Optional configuration for the function execution.
   * @returns A promise that resolves to the output values.
   */
  async _batchWithConfig(func, inputs, options, batchOptions) {
    var _a;
    const optionsList = this._getOptionsList(options ?? {}, inputs.length);
    const callbackManagers = await Promise.all(optionsList.map(getCallbackManagerForConfig));
    const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
      const handleStartRes = await (callbackManager == null ? void 0 : callbackManager.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), optionsList[i].runId, optionsList[i].runType, void 0, void 0, optionsList[i].runName ?? this.getName()));
      delete optionsList[i].runId;
      return handleStartRes;
    }));
    let outputs;
    try {
      const promise = func.call(this, inputs, optionsList, runManagers, batchOptions);
      outputs = await raceWithSignal(promise, (_a = optionsList == null ? void 0 : optionsList[0]) == null ? void 0 : _a.signal);
    } catch (e) {
      await Promise.all(runManagers.map((runManager) => runManager == null ? void 0 : runManager.handleChainError(e)));
      throw e;
    }
    await Promise.all(runManagers.map((runManager) => runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(outputs, "output"))));
    return outputs;
  }
  /**
   * Helper method to transform an Iterator of Input values into an Iterator of
   * Output values, with callbacks.
   * Use this to implement `stream()` or `transform()` in Runnable subclasses.
   */
  async *_transformStreamWithConfig(inputGenerator, transformer, options) {
    let finalInput;
    let finalInputSupported = true;
    let finalOutput;
    let finalOutputSupported = true;
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(config);
    async function* wrapInputForTracing() {
      for await (const chunk of inputGenerator) {
        if (finalInputSupported) {
          if (finalInput === void 0) {
            finalInput = chunk;
          } else {
            try {
              finalInput = concat(finalInput, chunk);
            } catch {
              finalInput = void 0;
              finalInputSupported = false;
            }
          }
        }
        yield chunk;
      }
    }
    let runManager;
    try {
      const pipe = await pipeGeneratorWithSetup(transformer.bind(this), wrapInputForTracing(), async () => callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), { input: "" }, config.runId, config.runType, void 0, void 0, config.runName ?? this.getName()), options == null ? void 0 : options.signal, config);
      delete config.runId;
      runManager = pipe.setup;
      const streamEventsHandler = runManager == null ? void 0 : runManager.handlers.find(isStreamEventsHandler);
      let iterator = pipe.output;
      if (streamEventsHandler !== void 0 && runManager !== void 0) {
        iterator = streamEventsHandler.tapOutputIterable(runManager.runId, iterator);
      }
      const streamLogHandler = runManager == null ? void 0 : runManager.handlers.find(isLogStreamHandler);
      if (streamLogHandler !== void 0 && runManager !== void 0) {
        iterator = streamLogHandler.tapOutputIterable(runManager.runId, iterator);
      }
      for await (const chunk of iterator) {
        yield chunk;
        if (finalOutputSupported) {
          if (finalOutput === void 0) {
            finalOutput = chunk;
          } else {
            try {
              finalOutput = concat(finalOutput, chunk);
            } catch {
              finalOutput = void 0;
              finalOutputSupported = false;
            }
          }
        }
      }
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e, void 0, void 0, void 0, {
        inputs: _coerceToDict(finalInput, "input")
      }));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(finalOutput ?? {}, void 0, void 0, void 0, { inputs: _coerceToDict(finalInput, "input") }));
  }
  getGraph(_) {
    const graph = new Graph();
    const inputNode = graph.addNode({
      name: `${this.getName()}Input`,
      schema: anyType()
    });
    const runnableNode = graph.addNode(this);
    const outputNode = graph.addNode({
      name: `${this.getName()}Output`,
      schema: anyType()
    });
    graph.addEdge(inputNode, runnableNode);
    graph.addEdge(runnableNode, outputNode);
    return graph;
  }
  /**
   * Create a new runnable sequence that runs each individual runnable in series,
   * piping the output of one runnable into another runnable or runnable-like.
   * @param coerceable A runnable, function, or object whose values are functions or runnables.
   * @returns A new runnable sequence.
   */
  pipe(coerceable) {
    return new RunnableSequence({
      first: this,
      last: _coerceToRunnable(coerceable)
    });
  }
  /**
   * Pick keys from the dict output of this runnable. Returns a new runnable.
   */
  pick(keys) {
    return this.pipe(new RunnablePick(keys));
  }
  /**
   * Assigns new fields to the dict output of this runnable. Returns a new runnable.
   */
  assign(mapping) {
    return this.pipe(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      new RunnableAssign(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        new RunnableMap({ steps: mapping })
      )
    );
  }
  /**
   * Default implementation of transform, which buffers input and then calls stream.
   * Subclasses should override this method if they can start producing output while
   * input is still being generated.
   * @param generator
   * @param options
   */
  async *transform(generator, options) {
    let finalChunk;
    for await (const chunk of generator) {
      if (finalChunk === void 0) {
        finalChunk = chunk;
      } else {
        finalChunk = concat(finalChunk, chunk);
      }
    }
    yield* this._streamIterator(finalChunk, ensureConfig(options));
  }
  /**
   * Stream all output from a runnable, as reported to the callback system.
   * This includes all inner runs of LLMs, Retrievers, Tools, etc.
   * Output is streamed as Log objects, which include a list of
   * jsonpatch ops that describe how the state of the run has changed in each
   * step, and the final state of the run.
   * The jsonpatch ops can be applied in order to construct state.
   * @param input
   * @param options
   * @param streamOptions
   */
  async *streamLog(input, options, streamOptions) {
    const logStreamCallbackHandler = new LogStreamCallbackHandler({
      ...streamOptions,
      autoClose: false,
      _schemaFormat: "original"
    });
    const config = ensureConfig(options);
    yield* this._streamLog(input, logStreamCallbackHandler, config);
  }
  async *_streamLog(input, logStreamCallbackHandler, config) {
    const { callbacks } = config;
    if (callbacks === void 0) {
      config.callbacks = [logStreamCallbackHandler];
    } else if (Array.isArray(callbacks)) {
      config.callbacks = callbacks.concat([logStreamCallbackHandler]);
    } else {
      const copiedCallbacks = callbacks.copy();
      copiedCallbacks.addHandler(logStreamCallbackHandler, true);
      config.callbacks = copiedCallbacks;
    }
    const runnableStreamPromise = this.stream(input, config);
    async function consumeRunnableStream() {
      try {
        const runnableStream = await runnableStreamPromise;
        for await (const chunk of runnableStream) {
          const patch = new RunLogPatch({
            ops: [
              {
                op: "add",
                path: "/streamed_output/-",
                value: chunk
              }
            ]
          });
          await logStreamCallbackHandler.writer.write(patch);
        }
      } finally {
        await logStreamCallbackHandler.writer.close();
      }
    }
    const runnableStreamConsumePromise = consumeRunnableStream();
    try {
      for await (const log of logStreamCallbackHandler) {
        yield log;
      }
    } finally {
      await runnableStreamConsumePromise;
    }
  }
  streamEvents(input, options, streamOptions) {
    let stream;
    if (options.version === "v1") {
      stream = this._streamEventsV1(input, options, streamOptions);
    } else if (options.version === "v2") {
      stream = this._streamEventsV2(input, options, streamOptions);
    } else {
      throw new Error(`Only versions "v1" and "v2" of the schema are currently supported.`);
    }
    if (options.encoding === "text/event-stream") {
      return convertToHttpEventStream(stream);
    } else {
      return IterableReadableStream.fromAsyncGenerator(stream);
    }
  }
  async *_streamEventsV2(input, options, streamOptions) {
    var _a;
    const eventStreamer = new EventStreamCallbackHandler({
      ...streamOptions,
      autoClose: false
    });
    const config = ensureConfig(options);
    const runId = config.runId ?? v4();
    config.runId = runId;
    const callbacks = config.callbacks;
    if (callbacks === void 0) {
      config.callbacks = [eventStreamer];
    } else if (Array.isArray(callbacks)) {
      config.callbacks = callbacks.concat(eventStreamer);
    } else {
      const copiedCallbacks = callbacks.copy();
      copiedCallbacks.addHandler(eventStreamer, true);
      config.callbacks = copiedCallbacks;
    }
    const outerThis = this;
    async function consumeRunnableStream() {
      try {
        const runnableStream = await outerThis.stream(input, config);
        const tappedStream = eventStreamer.tapOutputIterable(runId, runnableStream);
        for await (const _ of tappedStream) {
        }
      } finally {
        await eventStreamer.finish();
      }
    }
    const runnableStreamConsumePromise = consumeRunnableStream();
    let firstEventSent = false;
    let firstEventRunId;
    try {
      for await (const event of eventStreamer) {
        if (!firstEventSent) {
          event.data.input = input;
          firstEventSent = true;
          firstEventRunId = event.run_id;
          yield event;
          continue;
        }
        if (event.run_id === firstEventRunId && event.event.endsWith("_end")) {
          if ((_a = event.data) == null ? void 0 : _a.input) {
            delete event.data.input;
          }
        }
        yield event;
      }
    } finally {
      await runnableStreamConsumePromise;
    }
  }
  async *_streamEventsV1(input, options, streamOptions) {
    let runLog;
    let hasEncounteredStartEvent = false;
    const config = ensureConfig(options);
    const rootTags = config.tags ?? [];
    const rootMetadata = config.metadata ?? {};
    const rootName = config.runName ?? this.getName();
    const logStreamCallbackHandler = new LogStreamCallbackHandler({
      ...streamOptions,
      autoClose: false,
      _schemaFormat: "streaming_events"
    });
    const rootEventFilter = new _RootEventFilter({
      ...streamOptions
    });
    const logStream = this._streamLog(input, logStreamCallbackHandler, config);
    for await (const log of logStream) {
      if (!runLog) {
        runLog = RunLog.fromRunLogPatch(log);
      } else {
        runLog = runLog.concat(log);
      }
      if (runLog.state === void 0) {
        throw new Error(`Internal error: "streamEvents" state is missing. Please open a bug report.`);
      }
      if (!hasEncounteredStartEvent) {
        hasEncounteredStartEvent = true;
        const state3 = { ...runLog.state };
        const event = {
          run_id: state3.id,
          event: `on_${state3.type}_start`,
          name: rootName,
          tags: rootTags,
          metadata: rootMetadata,
          data: {
            input
          }
        };
        if (rootEventFilter.includeEvent(event, state3.type)) {
          yield event;
        }
      }
      const paths = log.ops.filter((op) => op.path.startsWith("/logs/")).map((op) => op.path.split("/")[2]);
      const dedupedPaths = [...new Set(paths)];
      for (const path of dedupedPaths) {
        let eventType;
        let data = {};
        const logEntry = runLog.state.logs[path];
        if (logEntry.end_time === void 0) {
          if (logEntry.streamed_output.length > 0) {
            eventType = "stream";
          } else {
            eventType = "start";
          }
        } else {
          eventType = "end";
        }
        if (eventType === "start") {
          if (logEntry.inputs !== void 0) {
            data.input = logEntry.inputs;
          }
        } else if (eventType === "end") {
          if (logEntry.inputs !== void 0) {
            data.input = logEntry.inputs;
          }
          data.output = logEntry.final_output;
        } else if (eventType === "stream") {
          const chunkCount = logEntry.streamed_output.length;
          if (chunkCount !== 1) {
            throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${logEntry.name}"`);
          }
          data = { chunk: logEntry.streamed_output[0] };
          logEntry.streamed_output = [];
        }
        yield {
          event: `on_${logEntry.type}_${eventType}`,
          name: logEntry.name,
          run_id: logEntry.id,
          tags: logEntry.tags,
          metadata: logEntry.metadata,
          data
        };
      }
      const { state: state2 } = runLog;
      if (state2.streamed_output.length > 0) {
        const chunkCount = state2.streamed_output.length;
        if (chunkCount !== 1) {
          throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${state2.name}"`);
        }
        const data = { chunk: state2.streamed_output[0] };
        state2.streamed_output = [];
        const event = {
          event: `on_${state2.type}_stream`,
          run_id: state2.id,
          tags: rootTags,
          metadata: rootMetadata,
          name: rootName,
          data
        };
        if (rootEventFilter.includeEvent(event, state2.type)) {
          yield event;
        }
      }
    }
    const state = runLog == null ? void 0 : runLog.state;
    if (state !== void 0) {
      const event = {
        event: `on_${state.type}_end`,
        name: rootName,
        run_id: state.id,
        tags: rootTags,
        metadata: rootMetadata,
        data: {
          output: state.final_output
        }
      };
      if (rootEventFilter.includeEvent(event, state.type))
        yield event;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isRunnable(thing) {
    return isRunnableInterface(thing);
  }
  /**
   * Bind lifecycle listeners to a Runnable, returning a new Runnable.
   * The Run object contains information about the run, including its id,
   * type, input, output, error, startTime, endTime, and any tags or metadata
   * added to the run.
   *
   * @param {Object} params - The object containing the callback functions.
   * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
   * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
   * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
   */
  withListeners({ onStart, onEnd, onError }) {
    return new RunnableBinding({
      bound: this,
      config: {},
      configFactories: [
        (config) => ({
          callbacks: [
            new RootListenersTracer({
              config,
              onStart,
              onEnd,
              onError
            })
          ]
        })
      ]
    });
  }
  /**
   * Convert a runnable to a tool. Return a new instance of `RunnableToolLike`
   * which contains the runnable, name, description and schema.
   *
   * @template {T extends RunInput = RunInput} RunInput - The input type of the runnable. Should be the same as the `RunInput` type of the runnable.
   *
   * @param fields
   * @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
   * @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
   * @param {z.ZodType<T>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
   * @returns {RunnableToolLike<z.ZodType<T>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
   */
  asTool(fields) {
    return convertRunnableToTool(this, fields);
  }
}
class RunnableBinding extends Runnable {
  static lc_name() {
    return "RunnableBinding";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "bound", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "config", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "kwargs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "configFactories", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.bound = fields.bound;
    this.kwargs = fields.kwargs;
    this.config = fields.config;
    this.configFactories = fields.configFactories;
  }
  getName(suffix) {
    return this.bound.getName(suffix);
  }
  async _mergeConfig(...options) {
    const config = mergeConfigs(this.config, ...options);
    return mergeConfigs(config, ...this.configFactories ? await Promise.all(this.configFactories.map(async (configFactory) => await configFactory(config))) : []);
  }
  bind(kwargs) {
    return new this.constructor({
      bound: this.bound,
      kwargs: { ...this.kwargs, ...kwargs },
      config: this.config
    });
  }
  withConfig(config) {
    return new this.constructor({
      bound: this.bound,
      kwargs: this.kwargs,
      config: { ...this.config, ...config }
    });
  }
  withRetry(fields) {
    return new this.constructor({
      bound: this.bound.withRetry(fields),
      kwargs: this.kwargs,
      config: this.config
    });
  }
  async invoke(input, options) {
    return this.bound.invoke(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
  }
  async batch(inputs, options, batchOptions) {
    const mergedOptions = Array.isArray(options) ? await Promise.all(options.map(async (individualOption) => this._mergeConfig(ensureConfig(individualOption), this.kwargs))) : await this._mergeConfig(ensureConfig(options), this.kwargs);
    return this.bound.batch(inputs, mergedOptions, batchOptions);
  }
  async *_streamIterator(input, options) {
    yield* this.bound._streamIterator(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
  }
  async stream(input, options) {
    return this.bound.stream(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
  }
  async *transform(generator, options) {
    yield* this.bound.transform(generator, await this._mergeConfig(ensureConfig(options), this.kwargs));
  }
  streamEvents(input, options, streamOptions) {
    const outerThis = this;
    const generator = async function* () {
      yield* outerThis.bound.streamEvents(input, {
        ...await outerThis._mergeConfig(ensureConfig(options), outerThis.kwargs),
        version: options.version
      }, streamOptions);
    };
    return IterableReadableStream.fromAsyncGenerator(generator());
  }
  static isRunnableBinding(thing) {
    return thing.bound && Runnable.isRunnable(thing.bound);
  }
  /**
   * Bind lifecycle listeners to a Runnable, returning a new Runnable.
   * The Run object contains information about the run, including its id,
   * type, input, output, error, startTime, endTime, and any tags or metadata
   * added to the run.
   *
   * @param {Object} params - The object containing the callback functions.
   * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
   * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
   * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
   */
  withListeners({ onStart, onEnd, onError }) {
    return new RunnableBinding({
      bound: this.bound,
      kwargs: this.kwargs,
      config: this.config,
      configFactories: [
        (config) => ({
          callbacks: [
            new RootListenersTracer({
              config,
              onStart,
              onEnd,
              onError
            })
          ]
        })
      ]
    });
  }
}
class RunnableEach extends Runnable {
  static lc_name() {
    return "RunnableEach";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "bound", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.bound = fields.bound;
  }
  /**
   * Binds the runnable with the specified arguments.
   * @param kwargs The arguments to bind the runnable with.
   * @returns A new instance of the `RunnableEach` class that is bound with the specified arguments.
   */
  bind(kwargs) {
    return new RunnableEach({
      bound: this.bound.bind(kwargs)
    });
  }
  /**
   * Invokes the runnable with the specified input and configuration.
   * @param input The input to invoke the runnable with.
   * @param config The configuration to invoke the runnable with.
   * @returns A promise that resolves to the output of the runnable.
   */
  async invoke(inputs, config) {
    return this._callWithConfig(this._invoke, inputs, config);
  }
  /**
   * A helper method that is used to invoke the runnable with the specified input and configuration.
   * @param input The input to invoke the runnable with.
   * @param config The configuration to invoke the runnable with.
   * @returns A promise that resolves to the output of the runnable.
   */
  async _invoke(inputs, config, runManager) {
    return this.bound.batch(inputs, patchConfig(config, { callbacks: runManager == null ? void 0 : runManager.getChild() }));
  }
  /**
   * Bind lifecycle listeners to a Runnable, returning a new Runnable.
   * The Run object contains information about the run, including its id,
   * type, input, output, error, startTime, endTime, and any tags or metadata
   * added to the run.
   *
   * @param {Object} params - The object containing the callback functions.
   * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
   * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
   * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
   */
  withListeners({ onStart, onEnd, onError }) {
    return new RunnableEach({
      bound: this.bound.withListeners({ onStart, onEnd, onError })
    });
  }
}
class RunnableRetry extends RunnableBinding {
  static lc_name() {
    return "RunnableRetry";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "maxAttemptNumber", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "onFailedAttempt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
      }
    });
    this.maxAttemptNumber = fields.maxAttemptNumber ?? this.maxAttemptNumber;
    this.onFailedAttempt = fields.onFailedAttempt ?? this.onFailedAttempt;
  }
  _patchConfigForRetry(attempt, config, runManager) {
    const tag = attempt > 1 ? `retry:attempt:${attempt}` : void 0;
    return patchConfig(config, { callbacks: runManager == null ? void 0 : runManager.getChild(tag) });
  }
  async _invoke(input, config, runManager) {
    return pRetry((attemptNumber) => super.invoke(input, this._patchConfigForRetry(attemptNumber, config, runManager)), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFailedAttempt: (error) => this.onFailedAttempt(error, input),
      retries: Math.max(this.maxAttemptNumber - 1, 0),
      randomize: true
    });
  }
  /**
   * Method that invokes the runnable with the specified input, run manager,
   * and config. It handles the retry logic by catching any errors and
   * recursively invoking itself with the updated config for the next retry
   * attempt.
   * @param input The input for the runnable.
   * @param runManager The run manager for the runnable.
   * @param config The config for the runnable.
   * @returns A promise that resolves to the output of the runnable.
   */
  async invoke(input, config) {
    return this._callWithConfig(this._invoke, input, config);
  }
  async _batch(inputs, configs, runManagers, batchOptions) {
    const resultsMap = {};
    try {
      await pRetry(async (attemptNumber) => {
        const remainingIndexes = inputs.map((_, i) => i).filter((i) => resultsMap[i.toString()] === void 0 || // eslint-disable-next-line no-instanceof/no-instanceof
        resultsMap[i.toString()] instanceof Error);
        const remainingInputs = remainingIndexes.map((i) => inputs[i]);
        const patchedConfigs = remainingIndexes.map((i) => this._patchConfigForRetry(attemptNumber, configs == null ? void 0 : configs[i], runManagers == null ? void 0 : runManagers[i]));
        const results = await super.batch(remainingInputs, patchedConfigs, {
          ...batchOptions,
          returnExceptions: true
        });
        let firstException;
        for (let i = 0; i < results.length; i += 1) {
          const result = results[i];
          const resultMapIndex = remainingIndexes[i];
          if (result instanceof Error) {
            if (firstException === void 0) {
              firstException = result;
              firstException.input = remainingInputs[i];
            }
          }
          resultsMap[resultMapIndex.toString()] = result;
        }
        if (firstException) {
          throw firstException;
        }
        return results;
      }, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFailedAttempt: (error) => this.onFailedAttempt(error, error.input),
        retries: Math.max(this.maxAttemptNumber - 1, 0),
        randomize: true
      });
    } catch (e) {
      if ((batchOptions == null ? void 0 : batchOptions.returnExceptions) !== true) {
        throw e;
      }
    }
    return Object.keys(resultsMap).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map((key) => resultsMap[parseInt(key, 10)]);
  }
  async batch(inputs, options, batchOptions) {
    return this._batchWithConfig(this._batch.bind(this), inputs, options, batchOptions);
  }
}
class RunnableSequence extends Runnable {
  static lc_name() {
    return "RunnableSequence";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "first", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "middle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "last", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    this.first = fields.first;
    this.middle = fields.middle ?? this.middle;
    this.last = fields.last;
    this.name = fields.name;
  }
  get steps() {
    return [this.first, ...this.middle, this.last];
  }
  async invoke(input, options) {
    var _a;
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(config);
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), config.runId, void 0, void 0, void 0, config == null ? void 0 : config.runName));
    delete config.runId;
    let nextStepInput = input;
    let finalOutput;
    try {
      const initialSteps = [this.first, ...this.middle];
      for (let i = 0; i < initialSteps.length; i += 1) {
        const step = initialSteps[i];
        const promise = step.invoke(nextStepInput, patchConfig(config, {
          callbacks: runManager == null ? void 0 : runManager.getChild(`seq:step:${i + 1}`)
        }));
        nextStepInput = await raceWithSignal(promise, options == null ? void 0 : options.signal);
      }
      if ((_a = options == null ? void 0 : options.signal) == null ? void 0 : _a.aborted) {
        throw new Error("Aborted");
      }
      finalOutput = await this.last.invoke(nextStepInput, patchConfig(config, {
        callbacks: runManager == null ? void 0 : runManager.getChild(`seq:step:${this.steps.length}`)
      }));
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(finalOutput, "output")));
    return finalOutput;
  }
  async batch(inputs, options, batchOptions) {
    var _a;
    const configList = this._getOptionsList(options ?? {}, inputs.length);
    const callbackManagers = await Promise.all(configList.map(getCallbackManagerForConfig));
    const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
      const handleStartRes = await (callbackManager == null ? void 0 : callbackManager.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName));
      delete configList[i].runId;
      return handleStartRes;
    }));
    let nextStepInputs = inputs;
    try {
      for (let i = 0; i < this.steps.length; i += 1) {
        const step = this.steps[i];
        const promise = step.batch(nextStepInputs, runManagers.map((runManager, j) => {
          const childRunManager = runManager == null ? void 0 : runManager.getChild(`seq:step:${i + 1}`);
          return patchConfig(configList[j], { callbacks: childRunManager });
        }), batchOptions);
        nextStepInputs = await raceWithSignal(promise, (_a = configList[0]) == null ? void 0 : _a.signal);
      }
    } catch (e) {
      await Promise.all(runManagers.map((runManager) => runManager == null ? void 0 : runManager.handleChainError(e)));
      throw e;
    }
    await Promise.all(runManagers.map((runManager) => runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(nextStepInputs, "output"))));
    return nextStepInputs;
  }
  async *_streamIterator(input, options) {
    var _a;
    const callbackManager_ = await getCallbackManagerForConfig(options);
    const { runId, ...otherOptions } = options ?? {};
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherOptions == null ? void 0 : otherOptions.runName));
    const steps = [this.first, ...this.middle, this.last];
    let concatSupported = true;
    let finalOutput;
    async function* inputGenerator() {
      yield input;
    }
    try {
      let finalGenerator = steps[0].transform(inputGenerator(), patchConfig(otherOptions, {
        callbacks: runManager == null ? void 0 : runManager.getChild(`seq:step:1`)
      }));
      for (let i = 1; i < steps.length; i += 1) {
        const step = steps[i];
        finalGenerator = await step.transform(finalGenerator, patchConfig(otherOptions, {
          callbacks: runManager == null ? void 0 : runManager.getChild(`seq:step:${i + 1}`)
        }));
      }
      for await (const chunk of finalGenerator) {
        (_a = options == null ? void 0 : options.signal) == null ? void 0 : _a.throwIfAborted();
        yield chunk;
        if (concatSupported) {
          if (finalOutput === void 0) {
            finalOutput = chunk;
          } else {
            try {
              finalOutput = concat(finalOutput, chunk);
            } catch (e) {
              finalOutput = void 0;
              concatSupported = false;
            }
          }
        }
      }
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(finalOutput, "output")));
  }
  getGraph(config) {
    const graph = new Graph();
    let currentLastNode = null;
    this.steps.forEach((step, index) => {
      const stepGraph = step.getGraph(config);
      if (index !== 0) {
        stepGraph.trimFirstNode();
      }
      if (index !== this.steps.length - 1) {
        stepGraph.trimLastNode();
      }
      graph.extend(stepGraph);
      const stepFirstNode = stepGraph.firstNode();
      if (!stepFirstNode) {
        throw new Error(`Runnable ${step} has no first node`);
      }
      if (currentLastNode) {
        graph.addEdge(currentLastNode, stepFirstNode);
      }
      currentLastNode = stepGraph.lastNode();
    });
    return graph;
  }
  pipe(coerceable) {
    if (RunnableSequence.isRunnableSequence(coerceable)) {
      return new RunnableSequence({
        first: this.first,
        middle: this.middle.concat([
          this.last,
          coerceable.first,
          ...coerceable.middle
        ]),
        last: coerceable.last,
        name: this.name ?? coerceable.name
      });
    } else {
      return new RunnableSequence({
        first: this.first,
        middle: [...this.middle, this.last],
        last: _coerceToRunnable(coerceable),
        name: this.name
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isRunnableSequence(thing) {
    return Array.isArray(thing.middle) && Runnable.isRunnable(thing);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from([first, ...runnables], name) {
    return new RunnableSequence({
      first: _coerceToRunnable(first),
      middle: runnables.slice(0, -1).map(_coerceToRunnable),
      last: _coerceToRunnable(runnables[runnables.length - 1]),
      name
    });
  }
}
class RunnableMap extends Runnable {
  static lc_name() {
    return "RunnableMap";
  }
  getStepsKeys() {
    return Object.keys(this.steps);
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "steps", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.steps = {};
    for (const [key, value] of Object.entries(fields.steps)) {
      this.steps[key] = _coerceToRunnable(value);
    }
  }
  static from(steps) {
    return new RunnableMap({ steps });
  }
  async invoke(input, options) {
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(config);
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), {
      input
    }, config.runId, void 0, void 0, void 0, config == null ? void 0 : config.runName));
    delete config.runId;
    const output = {};
    try {
      const promises = Object.entries(this.steps).map(async ([key, runnable]) => {
        output[key] = await runnable.invoke(input, patchConfig(config, {
          callbacks: runManager == null ? void 0 : runManager.getChild(`map:key:${key}`)
        }));
      });
      await raceWithSignal(Promise.all(promises), options == null ? void 0 : options.signal);
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(output));
    return output;
  }
  async *_transform(generator, runManager, options) {
    const steps = { ...this.steps };
    const inputCopies = atee(generator, Object.keys(steps).length);
    const tasks = new Map(Object.entries(steps).map(([key, runnable], i) => {
      const gen = runnable.transform(inputCopies[i], patchConfig(options, {
        callbacks: runManager == null ? void 0 : runManager.getChild(`map:key:${key}`)
      }));
      return [key, gen.next().then((result) => ({ key, gen, result }))];
    }));
    while (tasks.size) {
      const promise = Promise.race(tasks.values());
      const { key, result, gen } = await raceWithSignal(promise, options == null ? void 0 : options.signal);
      tasks.delete(key);
      if (!result.done) {
        yield { [key]: result.value };
        tasks.set(key, gen.next().then((result2) => ({ key, gen, result: result2 })));
      }
    }
  }
  transform(generator, options) {
    return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
  }
  async stream(input, options) {
    async function* generator() {
      yield input;
    }
    const config = ensureConfig(options);
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: this.transform(generator(), config),
      config
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
}
class RunnableTraceable extends Runnable {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "func", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    if (!isTraceableFunction(fields.func)) {
      throw new Error("RunnableTraceable requires a function that is wrapped in traceable higher-order function");
    }
    this.func = fields.func;
  }
  async invoke(input, options) {
    const [config] = this._getOptionsList(options ?? {}, 1);
    const callbacks = await getCallbackManagerForConfig(config);
    const promise = this.func(patchConfig(config, { callbacks }), input);
    return raceWithSignal(promise, config == null ? void 0 : config.signal);
  }
  async *_streamIterator(input, options) {
    var _a, _b;
    const [config] = this._getOptionsList(options ?? {}, 1);
    const result = await this.invoke(input, options);
    if (isAsyncIterable(result)) {
      for await (const item of result) {
        (_a = config == null ? void 0 : config.signal) == null ? void 0 : _a.throwIfAborted();
        yield item;
      }
      return;
    }
    if (isIterator(result)) {
      while (true) {
        (_b = config == null ? void 0 : config.signal) == null ? void 0 : _b.throwIfAborted();
        const state = result.next();
        if (state.done)
          break;
        yield state.value;
      }
      return;
    }
    yield result;
  }
  static from(func) {
    return new RunnableTraceable({ func });
  }
}
function assertNonTraceableFunction(func) {
  if (isTraceableFunction(func)) {
    throw new Error("RunnableLambda requires a function that is not wrapped in traceable higher-order function. This shouldn't happen.");
  }
}
class RunnableLambda extends Runnable {
  static lc_name() {
    return "RunnableLambda";
  }
  constructor(fields) {
    if (isTraceableFunction(fields.func)) {
      return RunnableTraceable.from(fields.func);
    }
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "func", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    assertNonTraceableFunction(fields.func);
    this.func = fields.func;
  }
  static from(func) {
    return new RunnableLambda({
      func
    });
  }
  async _invoke(input, config, runManager) {
    return new Promise((resolve, reject) => {
      const childConfig = patchConfig(config, {
        callbacks: runManager == null ? void 0 : runManager.getChild(),
        recursionLimit: ((config == null ? void 0 : config.recursionLimit) ?? DEFAULT_RECURSION_LIMIT) - 1
      });
      void AsyncLocalStorageProviderSingleton.runWithConfig(childConfig, async () => {
        var _a, _b;
        try {
          let output = await this.func(input, {
            ...childConfig,
            config: childConfig
          });
          if (output && Runnable.isRunnable(output)) {
            if ((config == null ? void 0 : config.recursionLimit) === 0) {
              throw new Error("Recursion limit reached.");
            }
            output = await output.invoke(input, {
              ...childConfig,
              recursionLimit: (childConfig.recursionLimit ?? DEFAULT_RECURSION_LIMIT) - 1
            });
          } else if (isAsyncIterable(output)) {
            let finalOutput;
            for await (const chunk of consumeAsyncIterableInContext(childConfig, output)) {
              (_a = config == null ? void 0 : config.signal) == null ? void 0 : _a.throwIfAborted();
              if (finalOutput === void 0) {
                finalOutput = chunk;
              } else {
                try {
                  finalOutput = concat(finalOutput, chunk);
                } catch (e) {
                  finalOutput = chunk;
                }
              }
            }
            output = finalOutput;
          } else if (isIterableIterator(output)) {
            let finalOutput;
            for (const chunk of consumeIteratorInContext(childConfig, output)) {
              (_b = config == null ? void 0 : config.signal) == null ? void 0 : _b.throwIfAborted();
              if (finalOutput === void 0) {
                finalOutput = chunk;
              } else {
                try {
                  finalOutput = concat(finalOutput, chunk);
                } catch (e) {
                  finalOutput = chunk;
                }
              }
            }
            output = finalOutput;
          }
          resolve(output);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  async invoke(input, options) {
    return this._callWithConfig(this._invoke, input, options);
  }
  async *_transform(generator, runManager, config) {
    var _a, _b;
    let finalChunk;
    for await (const chunk of generator) {
      if (finalChunk === void 0) {
        finalChunk = chunk;
      } else {
        try {
          finalChunk = concat(finalChunk, chunk);
        } catch (e) {
          finalChunk = chunk;
        }
      }
    }
    const childConfig = patchConfig(config, {
      callbacks: runManager == null ? void 0 : runManager.getChild(),
      recursionLimit: ((config == null ? void 0 : config.recursionLimit) ?? DEFAULT_RECURSION_LIMIT) - 1
    });
    const output = await new Promise((resolve, reject) => {
      void AsyncLocalStorageProviderSingleton.runWithConfig(childConfig, async () => {
        try {
          const res = await this.func(finalChunk, {
            ...childConfig,
            config: childConfig
          });
          resolve(res);
        } catch (e) {
          reject(e);
        }
      });
    });
    if (output && Runnable.isRunnable(output)) {
      if ((config == null ? void 0 : config.recursionLimit) === 0) {
        throw new Error("Recursion limit reached.");
      }
      const stream = await output.stream(finalChunk, childConfig);
      for await (const chunk of stream) {
        yield chunk;
      }
    } else if (isAsyncIterable(output)) {
      for await (const chunk of consumeAsyncIterableInContext(childConfig, output)) {
        (_a = config == null ? void 0 : config.signal) == null ? void 0 : _a.throwIfAborted();
        yield chunk;
      }
    } else if (isIterableIterator(output)) {
      for (const chunk of consumeIteratorInContext(childConfig, output)) {
        (_b = config == null ? void 0 : config.signal) == null ? void 0 : _b.throwIfAborted();
        yield chunk;
      }
    } else {
      yield output;
    }
  }
  transform(generator, options) {
    return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
  }
  async stream(input, options) {
    async function* generator() {
      yield input;
    }
    const config = ensureConfig(options);
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: this.transform(generator(), config),
      config
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
}
class RunnableWithFallbacks extends Runnable {
  static lc_name() {
    return "RunnableWithFallbacks";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "runnable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fallbacks", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.runnable = fields.runnable;
    this.fallbacks = fields.fallbacks;
  }
  *runnables() {
    yield this.runnable;
    for (const fallback of this.fallbacks) {
      yield fallback;
    }
  }
  async invoke(input, options) {
    var _a;
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(options);
    const { runId, ...otherConfigFields } = config;
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherConfigFields == null ? void 0 : otherConfigFields.runName));
    let firstError;
    for (const runnable of this.runnables()) {
      (_a = config == null ? void 0 : config.signal) == null ? void 0 : _a.throwIfAborted();
      try {
        const output = await runnable.invoke(input, patchConfig(otherConfigFields, { callbacks: runManager == null ? void 0 : runManager.getChild() }));
        await (runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(output, "output")));
        return output;
      } catch (e) {
        if (firstError === void 0) {
          firstError = e;
        }
      }
    }
    if (firstError === void 0) {
      throw new Error("No error stored at end of fallback.");
    }
    await (runManager == null ? void 0 : runManager.handleChainError(firstError));
    throw firstError;
  }
  async *_streamIterator(input, options) {
    var _a;
    const config = ensureConfig(options);
    const callbackManager_ = await getCallbackManagerForConfig(options);
    const { runId, ...otherConfigFields } = config;
    const runManager = await (callbackManager_ == null ? void 0 : callbackManager_.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherConfigFields == null ? void 0 : otherConfigFields.runName));
    let firstError;
    let stream;
    for (const runnable of this.runnables()) {
      (_a = config == null ? void 0 : config.signal) == null ? void 0 : _a.throwIfAborted();
      const childConfig = patchConfig(otherConfigFields, {
        callbacks: runManager == null ? void 0 : runManager.getChild()
      });
      try {
        stream = await runnable.stream(input, childConfig);
        break;
      } catch (e) {
        if (firstError === void 0) {
          firstError = e;
        }
      }
    }
    if (stream === void 0) {
      const error = firstError ?? new Error("No error stored at end of fallback.");
      await (runManager == null ? void 0 : runManager.handleChainError(error));
      throw error;
    }
    let output;
    try {
      for await (const chunk of stream) {
        yield chunk;
        try {
          output = output === void 0 ? output : concat(output, chunk);
        } catch (e) {
          output = void 0;
        }
      }
    } catch (e) {
      await (runManager == null ? void 0 : runManager.handleChainError(e));
      throw e;
    }
    await (runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(output, "output")));
  }
  async batch(inputs, options, batchOptions) {
    var _a;
    if (batchOptions == null ? void 0 : batchOptions.returnExceptions) {
      throw new Error("Not implemented.");
    }
    const configList = this._getOptionsList(options ?? {}, inputs.length);
    const callbackManagers = await Promise.all(configList.map((config) => getCallbackManagerForConfig(config)));
    const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
      const handleStartRes = await (callbackManager == null ? void 0 : callbackManager.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName));
      delete configList[i].runId;
      return handleStartRes;
    }));
    let firstError;
    for (const runnable of this.runnables()) {
      (_a = configList[0].signal) == null ? void 0 : _a.throwIfAborted();
      try {
        const outputs = await runnable.batch(inputs, runManagers.map((runManager, j) => patchConfig(configList[j], {
          callbacks: runManager == null ? void 0 : runManager.getChild()
        })), batchOptions);
        await Promise.all(runManagers.map((runManager, i) => runManager == null ? void 0 : runManager.handleChainEnd(_coerceToDict(outputs[i], "output"))));
        return outputs;
      } catch (e) {
        if (firstError === void 0) {
          firstError = e;
        }
      }
    }
    if (!firstError) {
      throw new Error("No error stored at end of fallbacks.");
    }
    await Promise.all(runManagers.map((runManager) => runManager == null ? void 0 : runManager.handleChainError(firstError)));
    throw firstError;
  }
}
function _coerceToRunnable(coerceable) {
  if (typeof coerceable === "function") {
    return new RunnableLambda({ func: coerceable });
  } else if (Runnable.isRunnable(coerceable)) {
    return coerceable;
  } else if (!Array.isArray(coerceable) && typeof coerceable === "object") {
    const runnables = {};
    for (const [key, value] of Object.entries(coerceable)) {
      runnables[key] = _coerceToRunnable(value);
    }
    return new RunnableMap({
      steps: runnables
    });
  } else {
    throw new Error(`Expected a Runnable, function or object.
Instead got an unsupported type.`);
  }
}
class RunnableAssign extends Runnable {
  static lc_name() {
    return "RunnableAssign";
  }
  constructor(fields) {
    if (fields instanceof RunnableMap) {
      fields = { mapper: fields };
    }
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "mapper", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.mapper = fields.mapper;
  }
  async invoke(input, options) {
    const mapperResult = await this.mapper.invoke(input, options);
    return {
      ...input,
      ...mapperResult
    };
  }
  async *_transform(generator, runManager, options) {
    const mapperKeys = this.mapper.getStepsKeys();
    const [forPassthrough, forMapper] = atee(generator);
    const mapperOutput = this.mapper.transform(forMapper, patchConfig(options, { callbacks: runManager == null ? void 0 : runManager.getChild() }));
    const firstMapperChunkPromise = mapperOutput.next();
    for await (const chunk of forPassthrough) {
      if (typeof chunk !== "object" || Array.isArray(chunk)) {
        throw new Error(`RunnableAssign can only be used with objects as input, got ${typeof chunk}`);
      }
      const filtered = Object.fromEntries(Object.entries(chunk).filter(([key]) => !mapperKeys.includes(key)));
      if (Object.keys(filtered).length > 0) {
        yield filtered;
      }
    }
    yield (await firstMapperChunkPromise).value;
    for await (const chunk of mapperOutput) {
      yield chunk;
    }
  }
  transform(generator, options) {
    return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
  }
  async stream(input, options) {
    async function* generator() {
      yield input;
    }
    const config = ensureConfig(options);
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: this.transform(generator(), config),
      config
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
}
class RunnablePick extends Runnable {
  static lc_name() {
    return "RunnablePick";
  }
  constructor(fields) {
    if (typeof fields === "string" || Array.isArray(fields)) {
      fields = { keys: fields };
    }
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "runnables"]
    });
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "keys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.keys = fields.keys;
  }
  async _pick(input) {
    if (typeof this.keys === "string") {
      return input[this.keys];
    } else {
      const picked = this.keys.map((key) => [key, input[key]]).filter((v) => v[1] !== void 0);
      return picked.length === 0 ? void 0 : Object.fromEntries(picked);
    }
  }
  async invoke(input, options) {
    return this._callWithConfig(this._pick.bind(this), input, options);
  }
  async *_transform(generator) {
    for await (const chunk of generator) {
      const picked = await this._pick(chunk);
      if (picked !== void 0) {
        yield picked;
      }
    }
  }
  transform(generator, options) {
    return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
  }
  async stream(input, options) {
    async function* generator() {
      yield input;
    }
    const config = ensureConfig(options);
    const wrappedGenerator = new AsyncGeneratorWithSetup({
      generator: this.transform(generator(), config),
      config
    });
    await wrappedGenerator.setup;
    return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
  }
}
class RunnableToolLike extends RunnableBinding {
  constructor(fields) {
    const sequence = RunnableSequence.from([
      RunnableLambda.from(async (input) => {
        let toolInput;
        if (_isToolCall(input)) {
          try {
            toolInput = await this.schema.parseAsync(input.args);
          } catch (e) {
            throw new ToolInputParsingException(`Received tool input did not match expected schema`, JSON.stringify(input.args));
          }
        } else {
          toolInput = input;
        }
        return toolInput;
      }).withConfig({ runName: `${fields.name}:parse_input` }),
      fields.bound
    ]).withConfig({ runName: fields.name });
    super({
      bound: sequence,
      config: fields.config ?? {}
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "description", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "schema", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = fields.name;
    this.description = fields.description;
    this.schema = fields.schema;
  }
  static lc_name() {
    return "RunnableToolLike";
  }
}
function convertRunnableToTool(runnable, fields) {
  var _a;
  const name = fields.name ?? runnable.getName();
  const description = fields.description ?? ((_a = fields.schema) == null ? void 0 : _a.description);
  if (fields.schema.constructor === ZodString) {
    return new RunnableToolLike({
      name,
      description,
      schema: objectType({
        input: stringType()
      }).transform((input) => input.input),
      bound: runnable
    });
  }
  return new RunnableToolLike({
    name,
    description,
    schema: fields.schema,
    bound: runnable
  });
}
class BaseDocumentTransformer extends Runnable {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain_core", "documents", "transformers"]
    });
  }
  /**
   * Method to invoke the document transformation. This method calls the
   * transformDocuments method with the provided input.
   * @param input The input documents to be transformed.
   * @param _options Optional configuration object to customize the behavior of callbacks.
   * @returns A Promise that resolves to the transformed documents.
   */
  invoke(input, _options) {
    return this.transformDocuments(input);
  }
}
class TextSplitter extends BaseDocumentTransformer {
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "document_transformers", "text_splitters"]
    });
    Object.defineProperty(this, "chunkSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1e3
    });
    Object.defineProperty(this, "chunkOverlap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 200
    });
    Object.defineProperty(this, "keepSeparator", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "lengthFunction", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.chunkSize = (fields == null ? void 0 : fields.chunkSize) ?? this.chunkSize;
    this.chunkOverlap = (fields == null ? void 0 : fields.chunkOverlap) ?? this.chunkOverlap;
    this.keepSeparator = (fields == null ? void 0 : fields.keepSeparator) ?? this.keepSeparator;
    this.lengthFunction = (fields == null ? void 0 : fields.lengthFunction) ?? ((text) => text.length);
    if (this.chunkOverlap >= this.chunkSize) {
      throw new Error("Cannot have chunkOverlap >= chunkSize");
    }
  }
  async transformDocuments(documents, chunkHeaderOptions = {}) {
    return this.splitDocuments(documents, chunkHeaderOptions);
  }
  splitOnSeparator(text, separator) {
    let splits;
    if (separator) {
      if (this.keepSeparator) {
        const regexEscapedSeparator = separator.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
        splits = text.split(new RegExp(`(?=${regexEscapedSeparator})`));
      } else {
        splits = text.split(separator);
      }
    } else {
      splits = text.split("");
    }
    return splits.filter((s) => s !== "");
  }
  async createDocuments(texts, metadatas = [], chunkHeaderOptions = {}) {
    const _metadatas = metadatas.length > 0 ? metadatas : [...Array(texts.length)].map(() => ({}));
    const { chunkHeader = "", chunkOverlapHeader = "(cont'd) ", appendChunkOverlapHeader = false } = chunkHeaderOptions;
    const documents = new Array();
    for (let i = 0; i < texts.length; i += 1) {
      const text = texts[i];
      let lineCounterIndex = 1;
      let prevChunk = null;
      let indexPrevChunk = -1;
      for (const chunk of await this.splitText(text)) {
        let pageContent = chunkHeader;
        const indexChunk = text.indexOf(chunk, indexPrevChunk + 1);
        if (prevChunk === null) {
          const newLinesBeforeFirstChunk = this.numberOfNewLines(text, 0, indexChunk);
          lineCounterIndex += newLinesBeforeFirstChunk;
        } else {
          const indexEndPrevChunk = indexPrevChunk + await this.lengthFunction(prevChunk);
          if (indexEndPrevChunk < indexChunk) {
            const numberOfIntermediateNewLines = this.numberOfNewLines(text, indexEndPrevChunk, indexChunk);
            lineCounterIndex += numberOfIntermediateNewLines;
          } else if (indexEndPrevChunk > indexChunk) {
            const numberOfIntermediateNewLines = this.numberOfNewLines(text, indexChunk, indexEndPrevChunk);
            lineCounterIndex -= numberOfIntermediateNewLines;
          }
          if (appendChunkOverlapHeader) {
            pageContent += chunkOverlapHeader;
          }
        }
        const newLinesCount = this.numberOfNewLines(chunk);
        const loc = _metadatas[i].loc && typeof _metadatas[i].loc === "object" ? { ..._metadatas[i].loc } : {};
        loc.lines = {
          from: lineCounterIndex,
          to: lineCounterIndex + newLinesCount
        };
        const metadataWithLinesNumber = {
          ..._metadatas[i],
          loc
        };
        pageContent += chunk;
        documents.push(new Document({
          pageContent,
          metadata: metadataWithLinesNumber
        }));
        lineCounterIndex += newLinesCount;
        prevChunk = chunk;
        indexPrevChunk = indexChunk;
      }
    }
    return documents;
  }
  numberOfNewLines(text, start, end) {
    const textSection = text.slice(start, end);
    return (textSection.match(/\n/g) || []).length;
  }
  async splitDocuments(documents, chunkHeaderOptions = {}) {
    const selectedDocuments = documents.filter((doc) => doc.pageContent !== void 0);
    const texts = selectedDocuments.map((doc) => doc.pageContent);
    const metadatas = selectedDocuments.map((doc) => doc.metadata);
    return this.createDocuments(texts, metadatas, chunkHeaderOptions);
  }
  joinDocs(docs, separator) {
    const text = docs.join(separator).trim();
    return text === "" ? null : text;
  }
  async mergeSplits(splits, separator) {
    const docs = [];
    const currentDoc = [];
    let total = 0;
    for (const d of splits) {
      const _len = await this.lengthFunction(d);
      if (total + _len + currentDoc.length * separator.length > this.chunkSize) {
        if (total > this.chunkSize) {
          console.warn(`Created a chunk of size ${total}, +
which is longer than the specified ${this.chunkSize}`);
        }
        if (currentDoc.length > 0) {
          const doc2 = this.joinDocs(currentDoc, separator);
          if (doc2 !== null) {
            docs.push(doc2);
          }
          while (total > this.chunkOverlap || total + _len + currentDoc.length * separator.length > this.chunkSize && total > 0) {
            total -= await this.lengthFunction(currentDoc[0]);
            currentDoc.shift();
          }
        }
      }
      currentDoc.push(d);
      total += _len;
    }
    const doc = this.joinDocs(currentDoc, separator);
    if (doc !== null) {
      docs.push(doc);
    }
    return docs;
  }
}
class RecursiveCharacterTextSplitter extends TextSplitter {
  static lc_name() {
    return "RecursiveCharacterTextSplitter";
  }
  constructor(fields) {
    super(fields);
    Object.defineProperty(this, "separators", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["\n\n", "\n", " ", ""]
    });
    this.separators = (fields == null ? void 0 : fields.separators) ?? this.separators;
    this.keepSeparator = (fields == null ? void 0 : fields.keepSeparator) ?? true;
  }
  async _splitText(text, separators) {
    const finalChunks = [];
    let separator = separators[separators.length - 1];
    let newSeparators;
    for (let i = 0; i < separators.length; i += 1) {
      const s = separators[i];
      if (s === "") {
        separator = s;
        break;
      }
      if (text.includes(s)) {
        separator = s;
        newSeparators = separators.slice(i + 1);
        break;
      }
    }
    const splits = this.splitOnSeparator(text, separator);
    let goodSplits = [];
    const _separator = this.keepSeparator ? "" : separator;
    for (const s of splits) {
      if (await this.lengthFunction(s) < this.chunkSize) {
        goodSplits.push(s);
      } else {
        if (goodSplits.length) {
          const mergedText = await this.mergeSplits(goodSplits, _separator);
          finalChunks.push(...mergedText);
          goodSplits = [];
        }
        if (!newSeparators) {
          finalChunks.push(s);
        } else {
          const otherInfo = await this._splitText(s, newSeparators);
          finalChunks.push(...otherInfo);
        }
      }
    }
    if (goodSplits.length) {
      const mergedText = await this.mergeSplits(goodSplits, _separator);
      finalChunks.push(...mergedText);
    }
    return finalChunks;
  }
  async splitText(text) {
    return this._splitText(text, this.separators);
  }
  static fromLanguage(language, options) {
    return new RecursiveCharacterTextSplitter({
      ...options,
      separators: RecursiveCharacterTextSplitter.getSeparatorsForLanguage(language)
    });
  }
  static getSeparatorsForLanguage(language) {
    if (language === "cpp") {
      return [
        // Split along class definitions
        "\nclass ",
        // Split along function definitions
        "\nvoid ",
        "\nint ",
        "\nfloat ",
        "\ndouble ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "go") {
      return [
        // Split along function definitions
        "\nfunc ",
        "\nvar ",
        "\nconst ",
        "\ntype ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "java") {
      return [
        // Split along class definitions
        "\nclass ",
        // Split along method definitions
        "\npublic ",
        "\nprotected ",
        "\nprivate ",
        "\nstatic ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "js") {
      return [
        // Split along function definitions
        "\nfunction ",
        "\nconst ",
        "\nlet ",
        "\nvar ",
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nswitch ",
        "\ncase ",
        "\ndefault ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "php") {
      return [
        // Split along function definitions
        "\nfunction ",
        // Split along class definitions
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nforeach ",
        "\nwhile ",
        "\ndo ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "proto") {
      return [
        // Split along message definitions
        "\nmessage ",
        // Split along service definitions
        "\nservice ",
        // Split along enum definitions
        "\nenum ",
        // Split along option definitions
        "\noption ",
        // Split along import statements
        "\nimport ",
        // Split along syntax declarations
        "\nsyntax ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "python") {
      return [
        // First, try to split along class definitions
        "\nclass ",
        "\ndef ",
        "\n	def ",
        // Now split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "rst") {
      return [
        // Split along section titles
        "\n===\n",
        "\n---\n",
        "\n***\n",
        // Split along directive markers
        "\n.. ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "ruby") {
      return [
        // Split along method definitions
        "\ndef ",
        "\nclass ",
        // Split along control flow statements
        "\nif ",
        "\nunless ",
        "\nwhile ",
        "\nfor ",
        "\ndo ",
        "\nbegin ",
        "\nrescue ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "rust") {
      return [
        // Split along function definitions
        "\nfn ",
        "\nconst ",
        "\nlet ",
        // Split along control flow statements
        "\nif ",
        "\nwhile ",
        "\nfor ",
        "\nloop ",
        "\nmatch ",
        "\nconst ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "scala") {
      return [
        // Split along class definitions
        "\nclass ",
        "\nobject ",
        // Split along method definitions
        "\ndef ",
        "\nval ",
        "\nvar ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\nmatch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "swift") {
      return [
        // Split along function definitions
        "\nfunc ",
        // Split along class definitions
        "\nclass ",
        "\nstruct ",
        "\nenum ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\ndo ",
        "\nswitch ",
        "\ncase ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "markdown") {
      return [
        // First, try to split along Markdown headings (starting with level 2)
        "\n## ",
        "\n### ",
        "\n#### ",
        "\n##### ",
        "\n###### ",
        // Note the alternative syntax for headings (below) is not handled here
        // Heading level 2
        // ---------------
        // End of code block
        "```\n\n",
        // Horizontal lines
        "\n\n***\n\n",
        "\n\n---\n\n",
        "\n\n___\n\n",
        // Note that this splitter doesn't handle horizontal lines defined
        // by *three or more* of ***, ---, or ___, but this is not handled
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "latex") {
      return [
        // First, try to split along Latex sections
        "\n\\chapter{",
        "\n\\section{",
        "\n\\subsection{",
        "\n\\subsubsection{",
        // Now split by environments
        "\n\\begin{enumerate}",
        "\n\\begin{itemize}",
        "\n\\begin{description}",
        "\n\\begin{list}",
        "\n\\begin{quote}",
        "\n\\begin{quotation}",
        "\n\\begin{verse}",
        "\n\\begin{verbatim}",
        // Now split by math environments
        "\n\\begin{align}",
        "$$",
        "$",
        // Now split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else if (language === "html") {
      return [
        // First, try to split along HTML tags
        "<body>",
        "<div>",
        "<p>",
        "<br>",
        "<li>",
        "<h1>",
        "<h2>",
        "<h3>",
        "<h4>",
        "<h5>",
        "<h6>",
        "<span>",
        "<table>",
        "<tr>",
        "<td>",
        "<th>",
        "<ul>",
        "<ol>",
        "<header>",
        "<footer>",
        "<nav>",
        // Head
        "<head>",
        "<style>",
        "<script>",
        "<meta>",
        "<title>",
        // Normal type of lines
        " ",
        ""
      ];
    } else if (language === "sol") {
      return [
        // Split along compiler informations definitions
        "\npragma ",
        "\nusing ",
        // Split along contract definitions
        "\ncontract ",
        "\ninterface ",
        "\nlibrary ",
        // Split along method definitions
        "\nconstructor ",
        "\ntype ",
        "\nfunction ",
        "\nevent ",
        "\nmodifier ",
        "\nerror ",
        "\nstruct ",
        "\nenum ",
        // Split along control flow statements
        "\nif ",
        "\nfor ",
        "\nwhile ",
        "\ndo while ",
        "\nassembly ",
        // Split by the normal type of lines
        "\n\n",
        "\n",
        " ",
        ""
      ];
    } else {
      throw new Error(`Language ${language} is not supported.`);
    }
  }
}
class IngestionService {
  /**
   * Full ingestion pipeline for a new message
   */
  static async ingestMessage(messageId, content, files = []) {
    console.log(`[Ingestion] Starting ingestion for message: ${messageId}`);
    try {
      let fullText = content;
      for (const filePath of files) {
        const fileText = await this.parseFile(filePath);
        fullText += "\n\n" + fileText;
      }
      const chunks = await this.chunkText(fullText);
      console.log(`[Ingestion] Created ${chunks.length} chunks`);
      const vectors = await embeddings.embedDocuments(chunks);
      const msg = await queryOne(
        "SELECT task_id FROM messages WHERE id = $1",
        [messageId]
      );
      const vectorRecords = chunks.map((text, idx) => ({
        id: `${messageId}-chunk-${idx}`,
        text,
        vector: vectors[idx],
        metadata: {
          message_id: messageId,
          task_id: (msg == null ? void 0 : msg.task_id) || void 0,
          source: files.length > 0 ? "file" : "text",
          chunk_index: idx
        }
      }));
      await insertVectors(vectorRecords);
      const tags = await this.extractTags(content);
      if (tags.length > 0) {
        await addMessageTags(messageId, tags);
        for (const tag of tags) {
          await execute(
            "INSERT INTO message_tags (message_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [messageId, tag]
          );
        }
      }
      console.log(`[Ingestion] Completed for message: ${messageId}`);
    } catch (error) {
      console.error(`[Ingestion] Failed for message ${messageId}:`, error);
      throw error;
    }
  }
  /**
   * Re-ingest message after update (delete old vectors, create new ones)
   */
  static async reingestMessage(messageId, newContent) {
    console.log(`[Ingestion] Re-ingesting updated message: ${messageId}`);
    await deleteVectorsByMessageId(messageId);
    await this.ingestMessage(messageId, newContent, []);
  }
  /**
   * Analyze a message and return insights
   */
  static async analyzeMessage(messageId) {
    const msg = await queryOne(
      "SELECT content FROM messages WHERE id = $1",
      [messageId]
    );
    if (!msg) throw new Error("Message not found");
    const tags = await this.extractTags(msg.content);
    const relatedIds = await getRelatedMessages(messageId);
    const summary = await this.summarize(msg.content);
    return { tags, relatedIds, summary };
  }
  /**
   * Smart inbox organization
   */
  static async suggestInboxOrganization() {
    console.log("[Ingestion] Analyzing inbox for organization suggestions...");
    const inboxMessages = await query(
      "SELECT id, content FROM messages WHERE task_id IS NULL AND is_archived = FALSE"
    );
    if (inboxMessages.length === 0) return [];
    const tasks = await query(
      "SELECT id, title FROM tasks WHERE status IN ('todo', 'in_progress')"
    );
    const suggestions = [];
    for (const msg of inboxMessages) {
      const msgEmbedding = await embeddings.embedQuery(msg.content);
      let bestMatch = { taskId: "", confidence: 0, reason: "" };
      for (const task of tasks) {
        const taskCenterVector = await getTaskCenterVector(task.id);
        if (!taskCenterVector) continue;
        const similarity = this.cosineSimilarity(msgEmbedding, taskCenterVector);
        if (similarity > bestMatch.confidence) {
          bestMatch = {
            taskId: task.id,
            confidence: similarity,
            reason: `High semantic similarity (${(similarity * 100).toFixed(1)}%) with "${task.title}"`
          };
        }
      }
      if (bestMatch.confidence > 0.85) {
        suggestions.push({
          messageId: msg.id,
          targetTaskId: bestMatch.taskId,
          confidence: bestMatch.confidence,
          reason: bestMatch.reason
        });
      }
    }
    console.log(`[Ingestion] Generated ${suggestions.length} suggestions`);
    return suggestions;
  }
  // ========== Helper Methods ==========
  /**
   * Parse file content (PDF, DOCX, etc.)
   */
  static async parseFile(filePath) {
    console.log(`[Ingestion] Parsing file: ${filePath}`);
    return `[Content from ${filePath}]`;
  }
  /**
   * Chunk text into smaller pieces
   */
  static async chunkText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50
    });
    const docs = await splitter.createDocuments([text]);
    return docs.map((doc) => doc.pageContent);
  }
  /**
   * Extract tags using LLM
   */
  static async extractTags(content) {
    try {
      const prompt = `Analyze the following text and extract 3-5 relevant tags or keywords.
Return ONLY the tags as a comma-separated list, nothing else.

Text: "${content}"

Tags:`;
      const response = await llm.invoke(prompt);
      const tags = response.split(",").map((tag) => tag.trim().toLowerCase()).filter((tag) => tag.length > 0);
      return tags.slice(0, 5);
    } catch (error) {
      console.error("[Ingestion] Tag extraction failed:", error);
      return [];
    }
  }
  /**
   * Generate summary of content
   */
  static async summarize(content) {
    try {
      const prompt = `Summarize the following text in 1-2 sentences:

"${content}"

Summary:`;
      const response = await llm.invoke(prompt);
      return response.trim();
    } catch (error) {
      console.error("[Ingestion] Summarization failed:", error);
      return "";
    }
  }
  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
export {
  IngestionService
};
