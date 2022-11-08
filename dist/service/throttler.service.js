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
exports.ThrottlerFactoryService = void 0;
const core_1 = require("@midwayjs/core");
const decorator_1 = require("@midwayjs/decorator");
/**
 * nacos 配置中心client
 */
let ThrottlerFactoryService = class ThrottlerFactoryService extends core_1.ServiceFactory {
    getName() {
        return 'ThrottlerFactoryService';
    }
    async init() {
        await this.initClients(this.throttlerConfig); //initClients循环调用createClient将生成的client存储到map中，ServiceFactory中实现
    }
    async createClient(config) {
        this.logger.info(`createClient调用, %s`, config);
        if (!config) {
            throw new Error('config 空');
        }
        if (!config.logger) {
            config.logger = console;
        }
        return;
    }
    async destroyClient(client) {
        if (client) {
            await client.destory();
        }
    }
};
__decorate([
    (0, decorator_1.Logger)('coreLogger'),
    __metadata("design:type", Object)
], ThrottlerFactoryService.prototype, "logger", void 0);
__decorate([
    (0, decorator_1.Config)('throttler'),
    __metadata("design:type", Object)
], ThrottlerFactoryService.prototype, "throttlerConfig", void 0);
__decorate([
    (0, decorator_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThrottlerFactoryService.prototype, "init", null);
ThrottlerFactoryService = __decorate([
    (0, decorator_1.Provide)(),
    (0, decorator_1.Scope)(decorator_1.ScopeEnum.Singleton)
], ThrottlerFactoryService);
exports.ThrottlerFactoryService = ThrottlerFactoryService;
//# sourceMappingURL=throttler.service.js.map