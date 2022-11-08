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
const decorator_1 = require("@midwayjs/decorator");
const constant_1 = require("../constant");
const crypto = require("crypto");
const throttler_service_1 = require("../service/throttler.service");
const core_1 = require("@midwayjs/core");
const traffic_throttler_1 = require("traffic-throttler");
let ThrottlerGuard = class ThrottlerGuard {
    init() {
        console.log('guard初始化');
        //初始化 storage
        let { storage } = this.throttlerConfig;
        storage = storage || { type: traffic_throttler_1.StorageTypeEnum.memory };
        this._storage = traffic_throttler_1.StorageFactory.getStorage(storage);
    }
    /**
     * 从 class 上，或者方法上读取 meta data
     * @param key
     * @param target
     * @param propertyName
     */
    getMetadataFromClassOrMethod(key, suppilerClz, methodName) {
        //先获取 method 上，有则返回
        let methodVal = (0, decorator_1.getPropertyMetadata)(key, suppilerClz, methodName);
        if (methodVal) {
            return methodVal;
        }
        //后从 class 上取
        let classVal = (0, core_1.getClassMetadata)(key, suppilerClz);
        return classVal;
    }
    /**
     * implement canActivate
     * @param context
     * @param suppilerClz
     * @param methodName
     * @returns
     */
    async canActivate(context, suppilerClz, methodName) {
        this.logger.info(`suppilerClz=%s, methodName=%s`, suppilerClz.name, methodName);
        const isSkip = this.getMetadataFromClassOrMethod(constant_1.THROTTLER_SKIP, suppilerClz, methodName);
        if (isSkip) {
            return true;
        }
        let ttl = this.getMetadataFromClassOrMethod(constant_1.THROTTLER_TTL, suppilerClz, methodName);
        let limit = this.getMetadataFromClassOrMethod(constant_1.THROTTLER_LIMIT, suppilerClz, methodName);
        ttl = ttl || this.throttlerConfig.ttl;
        limit = limit || this.throttlerConfig.limit;
        this.logger.info(`isSkip=%s, ttl=%s, limit=%s`, isSkip, ttl, limit);
        const reqIp = context.request.ip;
        if (!reqIp) {
            throw new Error('cannot get client request ip');
        }
        const key = this.generateKey(suppilerClz, methodName, reqIp);
        this.logger.info(`generateKey=%s`, key);
        return this.handleRequest(context, limit, ttl, key);
    }
    /**
     * handle http request
     * @param context
     * @param limit
     * @param ttl
     */
    async handleRequest(ctx, limit, ttl, key) {
        let { response } = ctx;
        let ttls = await this._storage.getRecord(key);
        const nearestExpiryTime = ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0;
        let { errorMsg } = this.throttlerConfig;
        if (ttls.length >= limit) {
            response.set('Retry-After', nearestExpiryTime.toString());
            throw new Error(errorMsg || `rate is overlimit`);
        }
        await this._storage.addRecord(key, ttl);
        return true;
    }
    /**
     * generate key
     * @param suppilerClz
     * @param methodName
     * @param reqIp
     * @returns
     */
    generateKey(suppilerClz, methodName, reqIp) {
        return this.md5(`${suppilerClz.name}_${methodName}_${reqIp}`);
    }
    md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
    async destroy() {
        if (this._storage) {
            await this._storage.destory();
        }
    }
};
__decorate([
    (0, decorator_1.Logger)('coreLogger'),
    __metadata("design:type", Object)
], ThrottlerGuard.prototype, "logger", void 0);
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", throttler_service_1.ThrottlerFactoryService)
], ThrottlerGuard.prototype, "throttlerFactoryService", void 0);
__decorate([
    (0, core_1.Config)('throttler'),
    __metadata("design:type", Object)
], ThrottlerGuard.prototype, "throttlerConfig", void 0);
__decorate([
    (0, decorator_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThrottlerGuard.prototype, "init", null);
__decorate([
    (0, core_1.Destroy)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThrottlerGuard.prototype, "destroy", null);
ThrottlerGuard = __decorate([
    (0, decorator_1.Guard)()
], ThrottlerGuard);
exports.ThrottlerGuard = ThrottlerGuard;
//# sourceMappingURL=throttler.guard.js.map