"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipThrottle = void 0;
const core_1 = require("@midwayjs/core");
const constant_1 = require("../constant");
function SkipThrottle(skip = true) {
    return (target, propertyKey, descriptor) => {
        if (propertyKey) {
            (0, core_1.savePropertyMetadata)(constant_1.THROTTLER_SKIP, skip, target, propertyKey);
        }
        else {
            (0, core_1.saveClassMetadata)(constant_1.THROTTLER_SKIP, skip, target);
        }
    };
}
exports.SkipThrottle = SkipThrottle;
//# sourceMappingURL=skip-throttle.decorator.js.map