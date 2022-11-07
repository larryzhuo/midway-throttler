"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttle = exports.MODEL_KEY = void 0;
const core_1 = require("@midwayjs/core");
const constant_1 = require("../constant");
exports.MODEL_KEY = 'decorator:midway-trottler:throttle';
function setThrottlerMetadata(target, limit, ttl, propertyKey) {
    (0, core_1.savePropertyMetadata)(constant_1.THROTTLER_TTL, ttl, target, propertyKey);
    (0, core_1.savePropertyMetadata)(constant_1.THROTTLER_LIMIT, limit, target, propertyKey);
}
function Throttle(limit = 20, ttl = 60) {
    return (target, propertyKey, descriptor) => {
        if (descriptor) {
            setThrottlerMetadata(descriptor.value, limit, ttl, propertyKey);
            return descriptor;
        }
        setThrottlerMetadata(target, limit, ttl, propertyKey);
        return target;
    };
}
exports.Throttle = Throttle;
//# sourceMappingURL=throttle.decorator.js.map