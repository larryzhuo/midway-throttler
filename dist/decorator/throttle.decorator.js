"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttle = exports.MODEL_KEY = void 0;
const core_1 = require("@midwayjs/core");
const constant_1 = require("../constant");
exports.MODEL_KEY = 'decorator:midway-trottler:throttle';
function Throttle(limit = 20, ttl = 60) {
    return (target, //method时=class对象, class时=[class HomeController]
    propertyKey, //method时=方法名， class时=undefined
    descriptor //method时={ value: , writable: true, enumerable: false, configurable: true }， class时=undefined
    ) => {
        if (propertyKey) {
            (0, core_1.savePropertyMetadata)(constant_1.THROTTLER_TTL, ttl, target, propertyKey);
            (0, core_1.savePropertyMetadata)(constant_1.THROTTLER_LIMIT, limit, target, propertyKey);
        }
        else {
            (0, core_1.saveClassMetadata)(constant_1.THROTTLER_TTL, ttl, target);
            (0, core_1.saveClassMetadata)(constant_1.THROTTLER_LIMIT, limit, target);
        }
    };
}
exports.Throttle = Throttle;
//# sourceMappingURL=throttle.decorator.js.map