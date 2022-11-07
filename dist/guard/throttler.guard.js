"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottlerGuard = void 0;
const core_1 = require("@midwayjs/core");
const constant_1 = require("../constant");
const crypto = require("crypto");
const throttler_service_1 = require("../service/throttler.service");
let ThrottlerGuard = class ThrottlerGuard {
    init() {
        console.log('guard初始化');
    }
    /**
     * implement canActivate
     * @param context
     * @param suppilerClz
     * @param methodName
     * @returns
     */
    async canActivate(context, suppilerClz, methodName) {
        const isSkip = (0, core_1.getPropertyMetadata)(constant_1.THROTTLER_SKIP, suppilerClz, methodName);
        if (isSkip) {
            return true;
        }
        const ttl = (0, core_1.getPropertyMetadata)(constant_1.THROTTLER_LIMIT, suppilerClz, methodName);
        const limit = (0, core_1.getPropertyMetadata)(constant_1.THROTTLER_LIMIT, suppilerClz, methodName);
        const reqIp = context.request.ip;
        if (!reqIp) {
            throw new Error('cannot get client request ip');
        }
        const key = this.generateKey(suppilerClz, methodName, reqIp);
        return this.handleRequest(context, limit, ttl, key);
    }
    /**
     * handle http request
     * @param context
     * @param limit
     * @param ttl
     */
    async handleRequest(ctx, limit, ttl, key) {
        const rawThrottler = this.throttlerFactoryService.get();
        const ret = await rawThrottler.tryAcquire({ key });
        if (ret) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * generate key
     * @param suppilerClz
     * @param methodName
     * @param reqIp
     * @returns
     */
    generateKey(suppilerClz, methodName, reqIp) {
        return this.md5(`${suppilerClz.getName()}_${methodName}_${reqIp}`);
    }
    md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", throttler_service_1.ThrottlerFactoryService)
], ThrottlerGuard.prototype, "throttlerFactoryService", void 0);
__decorate([
    (0, core_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThrottlerGuard.prototype, "init", null);
ThrottlerGuard = __decorate([
    (0, core_1.Guard)()
], ThrottlerGuard);
exports.ThrottlerGuard = ThrottlerGuard;
//# sourceMappingURL=throttler.guard.js.map