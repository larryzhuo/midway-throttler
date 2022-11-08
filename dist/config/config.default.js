"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttler = void 0;
const traffic_throttler_1 = require("traffic-throttler");
exports.throttler = {
    ttl: 10,
    limit: 3,
    storage: {
        type: traffic_throttler_1.StorageTypeEnum.memory
    }
};
//# sourceMappingURL=config.default.js.map