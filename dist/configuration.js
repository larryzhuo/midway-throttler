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
exports.ThrottlerConfiguration = void 0;
const DefaultConfig = require("./config/config.default");
const decorator_1 = require("@midwayjs/decorator");
const throttler_service_1 = require("./service/throttler.service");
const throttler_guard_1 = require("./guard/throttler.guard");
//入口启动文件
let ThrottlerConfiguration = class ThrottlerConfiguration {
    async onReady(container) {
        this.logger.info(`throttler onReady`);
        await container.getAsync(throttler_service_1.ThrottlerFactoryService);
        //import guard
        await container.getAsync(throttler_guard_1.ThrottlerGuard);
    }
    async onStop(container) {
        const factory = await container.getAsync(throttler_service_1.ThrottlerFactoryService);
        if (factory) {
            await factory.stop();
        }
        this.logger.info(`throttler stop`);
    }
};
__decorate([
    (0, decorator_1.Logger)('coreLogger'),
    __metadata("design:type", Object)
], ThrottlerConfiguration.prototype, "logger", void 0);
ThrottlerConfiguration = __decorate([
    (0, decorator_1.Configuration)({
        namespace: 'traffic-throttler',
        importConfigs: [
            {
                default: DefaultConfig,
            },
        ],
    })
], ThrottlerConfiguration);
exports.ThrottlerConfiguration = ThrottlerConfiguration;
//# sourceMappingURL=configuration.js.map